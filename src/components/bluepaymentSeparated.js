import React from 'react';
import {mergeClasses} from '@magento/venia-ui/lib/classify';
import {shape, string, bool, func} from 'prop-types';
import {useBluePayment} from '../talons/useBluePayment';
import defaultClasses from './bluepayment.css';
import bluepaymentOperations from './bluepayment.gql';
import BillingAddress from '@magento/venia-ui/lib/components/CheckoutPage/BillingAddress';
import {FormattedMessage} from "react-intl";

const BluePaymentSeparated = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const {resetShouldSubmit, onPaymentSuccess, code} = props;

    const {
        setPaymentMethodOnCartMutation
    } = bluepaymentOperations;

    const {
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess
    } = useBluePayment({
        setPaymentMethodOnCartMutation,
        resetShouldSubmit,
        onPaymentSuccess,
        code
    });

    return (
        <div className={classes.root}>
            <p className={classes.note}>
                <FormattedMessage
                    id={'bluepayment.note'}
                    defaultMessage={'Po złożeniu zamówienia, zostaniesz przekierowany na stronę płatności.'}
                />
            </p>

            <BillingAddress
                shouldSubmit={props.shouldSubmit}
                onBillingAddressChangedError={onBillingAddressChangedError}
                onBillingAddressChangedSuccess={onBillingAddressChangedSuccess}
            />
        </div>
    );
};

BluePaymentSeparated.propTypes = {
    classes: shape({
        root: string,
        title: string,
        mailingAddressTitle: string,
        formatAddress: string,
        note: string,
        gatewayContainer: string,
        gateway: string,
        gateway_selected: string,
        gatewayLogo: string,
        gatewayName: string
    }),
    shouldSubmit: bool.isRequired,
    onPaymentSuccess: func,
    onPaymentError: func,
    resetShouldSubmit: func.isRequired
};
BluePaymentSeparated.defaultProps = {};
export default BluePaymentSeparated;
