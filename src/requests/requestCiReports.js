import { post } from '@/requests'

/**
 * 根据用户的 orderId 获取该用户的身体各项指标的结果值，包括正常的和异常的
 * @param {*} data
 * @returns
 */
export default function requestCiReports(data) {
    return post('/ciReport/listCiReport', data)
}
