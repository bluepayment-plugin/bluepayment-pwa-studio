import {useCallback, useEffect, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {useCartContext} from '@magento/peregrine/lib/context/cart';

/**
 *
 * @param {*} props.operations GraphQL operations used by talons
 */
export const useBluePayment = (props = {}) => {
    const [{cartId}] = useCartContext();

    const {
        resetShouldSubmit,
        onPaymentSuccess,
        setPaymentMethodOnCartMutation,
        getCartTotals,
        code
    } = props;

    // const backUrl = window.location.origin + '/bluepayment';
    const backUrl = window.location.protocol + '//' + window.location.hostname + '/bluepayment';
    const gatewayIdFromCode = code && code.startsWith('bluepayment_') ? code.replace('bluepayment_', '') : null;
    const [gatewayId, setGatewayId] = useState(gatewayIdFromCode);

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
            gatewayId
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
    }, [setGatewayId]);

    const handleGatewayKeyPress = useCallback((gateway, event) => {
        if (event.key === 'Enter') {
            setGatewayId(gateway.gateway_id);
        }
    }, [setGatewayId]);

    return {
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess,
        setGatewayId,
        gatewayId,
        handleGatewayClick,
        handleGatewayKeyPress,
        cart: cartData ? cartData.cart : null,
        cartLoading
    };
};
