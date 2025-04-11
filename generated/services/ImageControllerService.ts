/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_object_ } from '../models/BaseResponse_object_';
import type { BaseResponse_Page_YunImage_ } from '../models/BaseResponse_Page_YunImage_';
import type { PageRequest } from '../models/PageRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ImageControllerService {

    /**
     * listImageByPage
     * @param pageRequest pageRequest
     * @returns BaseResponse_Page_YunImage_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listImageByPageUsingPost(
pageRequest: PageRequest,
): CancelablePromise<BaseResponse_Page_YunImage_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/image/list/page',
            body: pageRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * pull
     * @param image image
     * @returns BaseResponse_object_ OK
     * @throws ApiError
     */
    public static pullUsingGet(
image: string,
): CancelablePromise<BaseResponse_object_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/image/pull',
            query: {
                'image': image,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * remove
     * @param id id
     * @returns BaseResponse_object_ OK
     * @throws ApiError
     */
    public static removeUsingGet1(
id: number,
): CancelablePromise<BaseResponse_object_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/image/remove',
            query: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
