/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type {BaseResponse_object_} from '../models/BaseResponse_object_';
import type {BaseResponse_Page_ContainerVO_} from '../models/BaseResponse_Page_ContainerVO_';
import type {BaseResponse_string_} from '../models/BaseResponse_string_';
import type {CtrRunRequest} from '../models/CtrRunRequest';
import type {PageRequest} from '../models/PageRequest';

import type {CancelablePromise} from '../core/CancelablePromise';
import {OpenAPI} from '../core/OpenAPI';
import {request as __request} from '../core/request';

export class ContainerControllerService {

    /**
     * logCtr
     * @param containerId containerId
     * @returns any OK
     * @throws ApiError
     */
    public static logCtrUsingGet(
containerId: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/container/downloadLog',
            query: {
                'containerId': containerId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * listContainerByPage
     * @param pageRequest pageRequest
     * @returns BaseResponse_Page_ContainerVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listContainerByPageUsingPost(
pageRequest: PageRequest,
): CancelablePromise<BaseResponse_Page_ContainerVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/container/list/page',
            body: pageRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * remove
     * @param containerId containerId
     * @returns BaseResponse_string_ OK
     * @throws ApiError
     */
    public static removeUsingGet(
containerId: string,
): CancelablePromise<BaseResponse_string_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/container/remove',
            query: {
                'containerId': containerId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * restart
     * @param containerId containerId
     * @returns BaseResponse_string_ OK
     * @throws ApiError
     */
    public static restartUsingGet(
containerId: string,
): CancelablePromise<BaseResponse_string_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/container/restart',
            query: {
                'containerId': containerId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * run
     * @param ctrRunRequest ctrRunRequest
     * @returns BaseResponse_object_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static runUsingPost(
ctrRunRequest: CtrRunRequest,
): CancelablePromise<BaseResponse_object_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/container/run',
            body: ctrRunRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * startOrStop
     * @param containerId containerId
     * @returns BaseResponse_string_ OK
     * @throws ApiError
     */
    public static startOrStopUsingGet(
containerId: string,
): CancelablePromise<BaseResponse_string_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/container/startOrStop',
            query: {
                'containerId': containerId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
