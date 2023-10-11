import { post } from '@/requests'

/**
 * 更新多项指标项的值，也就是将总检结论归档
 * @param {Orders} data
 * @returns {number} 1 表示归档成功
 */
export default function requestUpdateCiReportResult(data) {
    return post('/orders/updateOrdersState', data)
}
