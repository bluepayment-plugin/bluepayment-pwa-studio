import {useLocation} from "react-router-dom";
import mergeOperations from "@magento/peregrine/lib/util/shallowMerge";
import DEFAULT_OPERATIONS from "../../components/BluePaymentPage/bluePaymentPage.gql";
import {useQuery} from "@apollo/client";
import {useMemo} from "react";

export const useBluePaymentPage = (props = {}) => {
    // get the URL query parameters.
    const { search } = useLocation();
    const params = new URLSearchParams(search);

    const orderNumber = params.get('OrderID');
    const hash = params.get('Hash');
    const { getBluePaymentOrder } = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const {
        data: orderData,
        error: orderError,
        loading: orderLoading
    } = useQuery(getBluePaymentOrder, {
        fetchPolicy: 'no-cache',
        variables: {orderNumber, hash}
    });

    const order = useMemo(() => {
        if (orderData) {
            return orderData.bluepaymentOrder;
        }
    }, [orderData]);

    return {
        order,
        orderData,
        orderError,
        orderLoading,
        hash
    };
};
