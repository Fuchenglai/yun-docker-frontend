/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type {OrderItem} from './OrderItem';
import type {YunOrderVO} from './YunOrderVO';

export type Page_YunOrderVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: Array<OrderItem>;
    pages?: number;
    records?: Array<YunOrderVO>;
    searchCount?: boolean;
    size?: number;
    total?: number;
};
