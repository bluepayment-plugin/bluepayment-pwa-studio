import React, {useEffect} from 'react';
import {mergeClasses} from '@magento/venia-ui/lib/classify';
import {shape, string, bool, func} from 'prop-types';
import {useBluePayment} from '../talons/useBluePayment';
import defaultClasses from './bluepayment.css';
import bluepaymentOperations from './bluepayment.gql';
import BillingAddress from '@magento/venia-ui/lib/components/CheckoutPage/BillingAddress';
import {FormattedMessage} from "react-intl";
import LoadingIndicator from "@magento/venia-ui/lib/components/LoadingIndicator";

const BluePaymentSeparated = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const {resetShouldSubmit, onPaymentSuccess, code} = props;
    const gatewayIdFromCode = code && code.startsWith('bluepayment_') ? code.replace('bluepayment_', '') : null;

    const {
        setPaymentMethodOnCartMutation,
        getBluePaymentAgreements,
        getCartTotals
    } = bluepaymentOperations;

    const {
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess,
        agreementsLoading,
        agreements,
        handleCheckAgreement,
        getAgreements,
        cart
    } = useBluePayment({
        setPaymentMethodOnCartMutation,
        resetShouldSubmit,
        onPaymentSuccess,
        getBluePaymentAgreements,
        getCartTotals,
        code
    });

    useEffect(() => {
        getAgreements({variables:{
            gatewayId: gatewayIdFromCode
        }});
    }, [getAgreements, gatewayIdFromCode]);

    const agreementsBlock = agreementsLoading
        ? <LoadingIndicator/>
        : agreements && <div className={classes.agreementsContainer}>
        {agreements.map(agreement => {
            return <div
                key={agreement.regulation_id}
            >
                {agreement.label_list.map(label => {
                    if (label.show_checkbox) {
                        return <div key={label.label_id} className={classes.agreement}>
                            <input type="checkbox"
                                   id={'agreement_' + label.label_id}
                                   name={agreement.regulation_id}
                                   onChange={handleCheckAgreement}/>

                            <label
                                dangerouslySetInnerHTML={{__html: label.label}}
                                htmlFor={'agreement_' + label.label_id}/>
                        </div>
                    }

                    return <div
                        key={label.label_id}
                        className={classes.agreement}
                        dangerouslySetInnerHTML={{__html: label.label}}
                    />;
                })}
            </div>;
        })}
    </div>;

    return (
        <div className={classes.root}>
            <p className={classes.note}>
                <FormattedMessage
                    id={'bluepayment.note'}
                    defaultMessage={'Po złożeniu zamówienia, zostaniesz przekierowany na stronę płatności.'}
                />
            </p>

            {agreementsBlock}

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
