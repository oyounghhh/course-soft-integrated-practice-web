import { post } from '@/requests'

/**
 * 更新具体指标项的值
 * @param {Array<CiDetailedReport>} data
 * @returns {number} 1 表示成功
 */
export default function requestUpdateCiDetailReport(data) {
    return post('/ciDetailedReport/updateCiDetailedReport', data)
}
