import {gql} from '@apollo/client';

export const SET_PAYMENT_METHOD_ON_CART = gql`
    mutation setPaymentMethodOnCart($cartId: String!, $backUrl: String!, $gatewayId: Int, $agreementsIds: String) {
        setPaymentMethodOnCart(
            input: {
                cart_id: $cartId
                payment_method: {
                    code: "bluepayment"
                    bluepayment: {
                        create_payment: true,
                        back_url: $backUrl,
                        gateway_id: $gatewayId,
                        agreements_ids: $agreementsIds
                    }
                }
            }
        ) @connection(key: "setPaymentMethodOnCart") {
            cart {
                id
                selected_payment_method {
                    code
                    title
                }
            }
        }
    }
`;

export const GET_REDIRECT_URL = gql`
    query getRedirectUrl($orderNumber: String!) {
        redirectUrl(order_number: $orderNumber)
    }
`;

export const GET_BLUEPAYMENT_GATEWAYS = gql`
    query getBluePaymentGateways($value: Float!, $currency: CurrencyEnum!) {
        bluepaymentGateways(value: $value, currency: $currency) {
            gateway_id
            name
            logo_url
            is_separated_method
        }
    }
`;

export const GET_BLUEPAYMENT_AGREEMENTS = gql`
    query getBluePaymentAgreements($gatewayId: Int!, $currency: CurrencyEnum!, $locale: String!) {
        bluepaymentAgreements(gateway_id: $gatewayId, currency: $currency, locale: $locale) {
            regulation_id
            type
            url
            label_list {
                label_id
                label
                placement
                show_checkbox
                checkbox_required
            }
        }
    }
`;

export const GET_CART_TOTALS = gql`
    query getCartTotals($cartId: String!) {
        cart(cart_id: $cartId) {
            prices {
                grand_total {
                    value
                    currency
                }
            }
        }
    }
`;

export default {
    setPaymentMethodOnCartMutation: SET_PAYMENT_METHOD_ON_CART,
    getRedirectUrlQuery: GET_REDIRECT_URL,
    getBluePaymentGateways: GET_BLUEPAYMENT_GATEWAYS,
    getBluePaymentAgreements: GET_BLUEPAYMENT_AGREEMENTS,
    getCartTotals: GET_CART_TOTALS
};
