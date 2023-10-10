import { post } from '@/requests'

/**
 * 更新多项指标项的值，也就是将总检结论归档
 * @param {*} data
 * @returns
 */
export default function requestUpdateCiReportResult(data) {
    return post('/orders/updateOrdersState', data)
}
