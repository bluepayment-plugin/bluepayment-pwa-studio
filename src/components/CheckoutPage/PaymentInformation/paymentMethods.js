import React from 'react';
import { shape, string, bool, func } from 'prop-types';
import { RadioGroup } from 'informed';
import { useIntl } from 'react-intl';

import { usePaymentMethods } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/usePaymentMethods';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Radio from '@magento/venia-ui/lib/components/RadioGroup/radio';
import paymentMethodOperations from '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/paymentMethods.gql';
import defaultClasses from '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/paymentMethods.css';
import payments from '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/paymentMethodCollection';

const PaymentMethods = props => {
    const {
        classes: propClasses,
        onPaymentError,
        onPaymentSuccess,
        resetShouldSubmit,
        shouldSubmit
    } = props;

    const { formatMessage } = useIntl();

    const classes = mergeClasses(defaultClasses, propClasses);

    const talonProps = usePaymentMethods({
        ...paymentMethodOperations
    });

    const {
        availablePaymentMethods,
        currentSelectedPaymentMethod,
        initialSelectedMethod,
        isLoading
    } = talonProps;

    if (isLoading) {
        return null;
    }

    const radios = availablePaymentMethods
        .map(({ code, title }) => {
            let isSelected;
            let PaymentMethodComponent;

            if (code.startsWith('bluepayment_')) {
                isSelected = currentSelectedPaymentMethod === code;
                PaymentMethodComponent = payments['bluepaymentSeparated'];
            } else {
                // If we don't have an implementation for a method type, ignore it.
                if (!Object.keys(payments).includes(code)) {
                    return;
                }
                isSelected = currentSelectedPaymentMethod === code;
                PaymentMethodComponent = payments[code];
            }

            const renderedComponent = isSelected ? (
                <PaymentMethodComponent
                    onPaymentSuccess={onPaymentSuccess}
                    onPaymentError={onPaymentError}
                    resetShouldSubmit={resetShouldSubmit}
                    shouldSubmit={shouldSubmit}
                    code={code}
                />
            ) : null;

            return (
                <div key={code} className={classes.payment_method}>
                    <Radio
                        label={title}
                        value={code}
                        classes={{
                            label: classes.radio_label
                        }}
                        checked={isSelected}
                    />
                    {renderedComponent}
                </div>
            );
        })
        .filter(paymentMethod => !!paymentMethod);

    const noPaymentMethodMessage = !radios.length ? (
        <div className={classes.payment_errors}>
            <span>
                {formatMessage({
                    id: 'checkoutPage.paymentLoadingError',
                    defaultMessage: 'There was an error loading payments.'
                })}
            </span>
            <span>
                {formatMessage({
                    id: 'checkoutPage.refreshOrTryAgainLater',
                    defaultMessage: 'Please refresh or try again later.'
                })}
            </span>
        </div>
    ) : null;

    return (
        <div className={classes.root}>
            <RadioGroup
                field="selectedPaymentMethod"
                initialValue={initialSelectedMethod}
            >
                {radios}
            </RadioGroup>
            {noPaymentMethodMessage}
        </div>
    );
};

export default PaymentMethods;

PaymentMethods.propTypes = {
    classes: shape({
        root: string,
        payment_method: string,
        radio_label: string
    }),
    onPaymentSuccess: func,
    onPaymentError: func,
    resetShouldSubmit: func,
    selectedPaymentMethod: string,
    shouldSubmit: bool
};
