/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type {BaseResponse_object_} from '../models/BaseResponse_object_';
import type {BaseResponse_Page_YunOrderVO_} from '../models/BaseResponse_Page_YunOrderVO_';
import type {BaseResponse_YunOrderVO_} from '../models/BaseResponse_YunOrderVO_';
import type {PageRequest} from '../models/PageRequest';

import type {CancelablePromise} from '../core/CancelablePromise';
import {OpenAPI} from '../core/OpenAPI';
import {request as __request} from '../core/request';

export class OrderControllerService {

    /**
     * addOrder
     * @param credit credit
     * @returns BaseResponse_object_ OK
     * @throws ApiError
     */
    public static addOrderUsingGet(
credit: number,
): CancelablePromise<BaseResponse_object_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/order/create',
            query: {
                'credit': credit,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * detail
     * @param orderId orderId
     * @returns BaseResponse_YunOrderVO_ OK
     * @throws ApiError
     */
    public static detailUsingGet(
orderId: string,
): CancelablePromise<BaseResponse_YunOrderVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/order/detail',
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

    /**
     * listOrderByPage
     * @param pageRequest pageRequest
     * @returns BaseResponse_Page_YunOrderVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listOrderByPageUsingPost(
pageRequest: PageRequest,
): CancelablePromise<BaseResponse_Page_YunOrderVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/order/list/page',
            body: pageRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
