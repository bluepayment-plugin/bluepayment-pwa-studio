import { gql } from '@apollo/client';

export const SET_PAYMENT_METHOD_ON_CART = gql`
    mutation setPaymentMethodOnCart($cartId: String!, $backUrl: String!) {
        setPaymentMethodOnCart(
            input: {
                cart_id: $cartId
                payment_method: {
                    code: "bluepayment"
                    bluepayment: {
                        create_payment: true,
                        back_url: $backUrl
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

export default {
    setPaymentMethodOnCartMutation: SET_PAYMENT_METHOD_ON_CART,
    getRedirectUrlQuery: GET_REDIRECT_URL
};
