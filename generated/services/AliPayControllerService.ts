/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type {CancelablePromise} from '../core/CancelablePromise';
import {OpenAPI} from '../core/OpenAPI';
import {request as __request} from '../core/request';

export class AliPayControllerService {

    /**
     * payNotify
     * @param appId
     * @param authAppId
     * @param body
     * @param buyerId
     * @param buyerPayAmount
     * @param charset
     * @param fundBillList
     * @param gmtCreate
     * @param gmtPayment
     * @param invoiceAmount
     * @param notifyId
     * @param notifyTime
     * @param notifyType
     * @param outTradeNo
     * @param pointAmount
     * @param receiptAmount
     * @param sellerId
     * @param sign
     * @param signType
     * @param subject
     * @param totalAmount
     * @param tradeNo
     * @param tradeStatus
     * @param version
     * @returns string OK
     * @returns any Created
     * @throws ApiError
     */
    public static payNotifyUsingPost(
appId?: string,
authAppId?: string,
body?: string,
buyerId?: string,
buyerPayAmount?: string,
charset?: string,
fundBillList?: string,
gmtCreate?: string,
gmtPayment?: string,
invoiceAmount?: string,
notifyId?: string,
notifyTime?: string,
notifyType?: string,
outTradeNo?: string,
pointAmount?: string,
receiptAmount?: string,
sellerId?: string,
sign?: string,
signType?: string,
subject?: string,
totalAmount?: string,
tradeNo?: string,
tradeStatus?: string,
version?: string,
): CancelablePromise<string | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/alipay/notify',
            query: {
                'app_id': appId,
                'auth_app_id': authAppId,
                'body': body,
                'buyer_id': buyerId,
                'buyer_pay_amount': buyerPayAmount,
                'charset': charset,
                'fund_bill_list': fundBillList,
                'gmt_create': gmtCreate,
                'gmt_payment': gmtPayment,
                'invoice_amount': invoiceAmount,
                'notify_id': notifyId,
                'notify_time': notifyTime,
                'notify_type': notifyType,
                'out_trade_no': outTradeNo,
                'point_amount': pointAmount,
                'receipt_amount': receiptAmount,
                'seller_id': sellerId,
                'sign': sign,
                'sign_type': signType,
                'subject': subject,
                'total_amount': totalAmount,
                'trade_no': tradeNo,
                'trade_status': tradeStatus,
                'version': version,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * pay
     * @param orderId orderId
     * @returns string OK
     * @throws ApiError
     */
    public static payUsingGet(
orderId: string,
): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/alipay/pay',
            query: {
                'orderId': orderId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
