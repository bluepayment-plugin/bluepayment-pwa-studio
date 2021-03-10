import { gql } from '@apollo/client';

export const GET_BLUEPAYMENT_ORDER = gql`
    query getBluePaymentOrder($orderNumber: String!, $hash: String!) {
        bluepaymentOrder(order_number: $orderNumber, hash: $hash) {
            id
            number
            status
            order_date
            bluepayment_state
        }
    }
`;

export default {
    getBluePaymentOrder: GET_BLUEPAYMENT_ORDER
};
