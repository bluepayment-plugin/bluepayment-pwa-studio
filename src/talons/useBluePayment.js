import {useCallback, useEffect} from 'react';
import {useMutation} from '@apollo/client';
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
        setPaymentMethodOnCartMutation
    } = props;

    // const backUrl = window.location.origin + '/bluepayment';
    const backUrl = window.location.protocol + '//' + window.location.hostname  + '/bluepayment';

    const [
        updatePaymentMethod,
        {
            error: paymentMethodMutationError,
            called: paymentMethodMutationCalled,
            loading: paymentMethodMutationLoading
        }
    ] = useMutation(setPaymentMethodOnCartMutation, {
        skip: !cartId,
        variables: {cartId, backUrl}
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

    return {
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess
    };
};
