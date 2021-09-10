import React from 'react';
import {mergeClasses} from '@magento/venia-ui/lib/classify';
import {shape, string, bool, func} from 'prop-types';
import {useBluePayment} from '../talons/useBluePayment';
import defaultClasses from './bluepayment.css';
import bluepaymentOperations from './bluepayment.gql';
import BillingAddress from '@magento/venia-ui/lib/components/CheckoutPage/BillingAddress';
import {FormattedMessage} from "react-intl";
import {useQuery} from "@apollo/client";
import LoadingIndicator from "@magento/venia-ui/lib/components/LoadingIndicator";

const BluePayment = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const {resetShouldSubmit, onPaymentSuccess} = props;

    const {
        setPaymentMethodOnCartMutation,
        getBluePaymentGateways,
        getBluePaymentAgreements,
        getCartTotals
    } = bluepaymentOperations;

    const {
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess,
        gatewayId,
        handleGatewayClick,
        handleGatewayKeyPress,
        agreementsLoading,
        agreements,
        handleCheckAgreement,
        cart
    } = useBluePayment({
        setPaymentMethodOnCartMutation,
        resetShouldSubmit,
        onPaymentSuccess,
        getBluePaymentAgreements,
        getCartTotals
    });

    const {data: bluePaymentGatewaysData, loading: bluePaymentGatewaysLoading} = useQuery(
        getBluePaymentGateways,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first',
            variables: {
                value: cart.prices.grand_total.value,
                currency: cart.prices.grand_total.currency
            },
            skip: !cart
        }
    );

    if (bluePaymentGatewaysLoading) {
        return <LoadingIndicator></LoadingIndicator>;
    }

    const agreementsBlock = agreementsLoading
        ? <LoadingIndicator></LoadingIndicator>
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

            <div className={classes.gatewayContainer}>
                {bluePaymentGatewaysData.bluepaymentGateways.map(gateway => {
                    const isSelected = gatewayId === gateway.gateway_id;
                    const className = isSelected ? classes.gateway_selected : classes.gateway;

                    return (
                        <div
                            role="button"
                            tabIndex="0"
                            key={gateway.gateway_id}
                            className={className}
                            onClick={handleGatewayClick.bind(this, gateway)}
                            onKeyPress={handleGatewayKeyPress.bind(this, gateway)}
                        >
                            <img src={gateway.logo_url} alt={gateway.name} className={classes.gatewayLogo}/>
                            <p className={classes.gatewayName}>{gateway.name}</p>
                        </div>
                    );
                })}
            </div>

            {agreementsBlock}

            <BillingAddress
                shouldSubmit={props.shouldSubmit}
                onBillingAddressChangedError={onBillingAddressChangedError}
                onBillingAddressChangedSuccess={onBillingAddressChangedSuccess}
                resetShouldSubmit={resetShouldSubmit}
            />
        </div>
    );
};

BluePayment.propTypes = {
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
        gatewayName: string,
        agreementsContainer: string,
        agreement: string
    }),
    shouldSubmit: bool.isRequired,
    onPaymentSuccess: func,
    onPaymentError: func,
    resetShouldSubmit: func.isRequired
};
BluePayment.defaultProps = {};
export default BluePayment;
