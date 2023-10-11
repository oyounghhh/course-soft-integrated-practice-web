import { post } from '@/requests'

/**
 *
 * @param {Orders} data
 * @returns {number} 1 表示创建成功
 */
export default function requestReportTemplate(data) {
    return post('/ciReport/createReportTemplate', data)
}
