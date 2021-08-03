import {useCallback, useEffect, useState} from 'react';
import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import {useCartContext} from '@magento/peregrine/lib/context/cart';
import {useIntl} from "react-intl";
import {fromReactIntl} from "@magento/venia-ui/lib/util/formatLocale";

/**
 * @param {*} props.operations GraphQL operations used by talons
 */
export const useBluePayment = (props = {}) => {
    const [{cartId}] = useCartContext();
    const {locale} = useIntl();

    const {
        resetShouldSubmit,
        onPaymentSuccess,
        setPaymentMethodOnCartMutation,
        getBluePaymentAgreements,
        getCartTotals,
        code
    } = props;

    // const backUrl = window.location.origin + '/bluepayment';
    const backUrl = window.location.protocol + '//' + window.location.hostname + '/bluepayment';
    const gatewayIdFromCode = code && code.startsWith('bluepayment_') ? code.replace('bluepayment_', '') : null;
    const [gatewayId, setGatewayId] = useState(gatewayIdFromCode);
    const [selectedAgreements, setSelectedAgreements] = useState(new Map());
    const handleCheckAgreement = (e) => {
        const item = e.target.name;
        const isChecked = e.target.checked;

        setSelectedAgreements(new Map(selectedAgreements.set(item, isChecked)));
    }


    const [
        updatePaymentMethod,
        {
            error: paymentMethodMutationError,
            called: paymentMethodMutationCalled,
            loading: paymentMethodMutationLoading
        }
    ] = useMutation(setPaymentMethodOnCartMutation, {
        skip: !cartId,
        variables: {
            cartId,
            backUrl,
            gatewayId,
            agreementsIds: Array.from(selectedAgreements)
                .filter(([, value]) => value === true)
                .map(([key, ]) => key).join(',')
        }
    });

    /**
     * Queries
     */
    const {
        data: cartData,
        loading: cartLoading
    } = useQuery(getCartTotals, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !cartId || !getCartTotals,
        variables: {cartId}
    });

    const [
        getAgreements,
        {loading: agreementsLoading, data: agreementsData}
    ] = useLazyQuery(getBluePaymentAgreements, {
        variables: {
            currency: cartData ? cartData.cart.prices.grand_total.currency : null,
            locale: fromReactIntl(locale)
        },
        fetchPolicy: 'no-cache',
        onCompleted: (res) => {
            const newSelectedAgreements = new Map();

            res.bluepaymentAgreements && res.bluepaymentAgreements.map(agreement => agreement.label_list.map(label =>
                !label.show_checkbox && newSelectedAgreements.set(agreement.regulation_id, true)
            ))

            setSelectedAgreements(newSelectedAgreements);
        }
    });

    const onBillingAddressChangedError = useCallback(() => {
        resetShouldSubmit();
    }, [resetShouldSubmit]);

    const onBillingAddressChangedSuccess = useCallback(() => {
        updatePaymentMethod();
    }, [updatePaymentMethod]);

    useEffect(() => {
        const paymentMethodMutationCompleted =
            paymentMethodMutationCalled && !paymentMethodMutationLoading;

        if (paymentMethodMutationCompleted && !paymentMethodMutationError) {
            onPaymentSuccess();
        }

        if (paymentMethodMutationCompleted && paymentMethodMutationError) {
            /**
             * Billing address save mutation is not successful.
             * Reset update button clicked flag.
             */
            throw new Error('Billing address mutation failed');
        }
    }, [
        paymentMethodMutationError,
        paymentMethodMutationLoading,
        paymentMethodMutationCalled,
        onPaymentSuccess
    ]);

    const handleGatewayClick = useCallback(gateway => {
        setGatewayId(gateway.gateway_id);
        getAgreements({variables:{
            gatewayId: gateway.gateway_id
        }});
    }, [setGatewayId, getAgreements]);

    const handleGatewayKeyPress = useCallback((gateway, event) => {
        if (event.key === 'Enter') {
            setGatewayId(gateway.gateway_id);
            getAgreements({variables:{
                gatewayId: gateway.gateway_id
            }});
        }
    }, [setGatewayId, getAgreements]);

    return {
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess,
        setGatewayId,
        gatewayId,
        handleGatewayClick,
        handleGatewayKeyPress,
        agreementsLoading,
        agreements: agreementsData ? agreementsData.bluepaymentAgreements : [],
        cart: cartData ? cartData.cart : null,
        cartLoading,
        selectedAgreements,
        handleCheckAgreement
    };
};
