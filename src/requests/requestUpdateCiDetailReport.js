import { post } from '@/requests'

/**
 * 更新具体指标项的值
 * @param {*} data
 * @returns
 */
export default function requestUpdateCiDetailReport(data) {
    return post('/ciDetailedReport/updateCiDetailedReport', data)
}
