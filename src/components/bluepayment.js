import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { shape, string, bool, func } from 'prop-types';
import { useBluePayment } from '../talons/useBluePayment';
import defaultClasses from './bluepayment.css';
import bluepaymentOperations from './bluepayment.gql';
import BillingAddress from "./BillingAddress";
import {FormattedMessage} from "react-intl";

const BluePayment = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { resetShouldSubmit, onPaymentSuccess } = props;

    const { setPaymentMethodOnCartMutation } = bluepaymentOperations;

    const {
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess
    } = useBluePayment({
        setPaymentMethodOnCartMutation,
        resetShouldSubmit,
        onPaymentSuccess
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

BluePayment.propTypes = {
    classes: shape({ root: string }),
    shouldSubmit: bool.isRequired,
    onPaymentSuccess: func,
    onPaymentError: func,
    resetShouldSubmit: func.isRequired
};
BluePayment.defaultProps = {};
export default BluePayment;
