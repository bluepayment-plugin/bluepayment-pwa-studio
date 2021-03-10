import React, {useEffect} from 'react';
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from './bluePaymentPage.css';
import {useBluePaymentPage} from "@bm/bluepayment-pwa/src/talons/BluePaymentPage/useBluePaymentPage";
import LoadingIndicator from "@magento/venia-ui/lib/components/LoadingIndicator";
import {FormattedMessage} from "react-intl";
import {useToasts} from "@magento/peregrine/lib/Toasts";
import Icon from "@magento/venia-ui/lib/components/Icon";
import {AlertCircle as AlertCircleIcon} from 'react-feather';

const errorIcon = (
    <Icon
        src={AlertCircleIcon}
        attrs={{
            width: 18
        }}
    />
);
const BluePaymentPage = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { order, orderLoading, orderError } = useBluePaymentPage();

    if (orderLoading) {
        return (<LoadingIndicator></LoadingIndicator>);
    } else if (orderError) {
        return (
            <div className={classes.root}>
                { orderError.message }
            </div>
        );
    }

    let paymentStatus;
    if (order.bluepayment_state === 'SUCCESS') {
        paymentStatus = (<p className={classes.info}>
            <FormattedMessage
                id={'bluepaymentPage.success'}
                defaultMessage={'Twoje zamówienie zostało opłacone.'}
            />
            <br />
            <FormattedMessage
                id={'bluepaymentPage.successSecond'}
                defaultMessage={'Zamówienie zostało przekazane do realizacji.'}
            />
        </p>);
    } else if (order.bluepayment_state === 'FAILURE') {
        paymentStatus = (<p className={classes.info}>
            <FormattedMessage
                id={'bluepaymentPage.failure'}
                defaultMessage={'Zamówienie nie zostało opłacone.'}
            />
            <br />
            <FormattedMessage
                id={'bluepaymentPage.failureSecond'}
                defaultMessage={'Ponów płatność poprzez poniższy link, lub skontaktuj się z nami.'}
            />
        </p>);
    } else {
        paymentStatus = (<p className={classes.info}>
            <FormattedMessage
                id={'bluepaymentPage.pending'}
                defaultMessage={'Twoje zamówienie zostało przyjęte - oczekujemy na płatność.'}
            />
            <br />
            <FormattedMessage
                id={'bluepaymentPage.pendingSecond'}
                defaultMessage={'Jak tylko otrzymamy pozytywną informację - zamówienie zostanie przekazane do realizacji.'}
            />
        </p>);
    }


    return (
        <div className={classes.root}>
            <h1 className={classes.title}>
                <FormattedMessage
                    id={'bluepaymentPage.header'}
                    defaultMessage={'Zamówienie przyjęte - status zamówienia: '}
                />
                <strong>{order.status}</strong>
            </h1>

            { paymentStatus }

            <p className={classes.info}>
                <FormattedMessage
                    id={'bluepaymentPage.orderNumber'}
                    defaultMessage={'Numer zamówienia: '}
                />
                <strong>{ order.number }</strong>
            </p>
        </div>
    );
};

export default BluePaymentPage;
