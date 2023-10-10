import { post } from '@/requests'

/**
 *
 * @param {{orderId: string, smId: string}} data
 * @returns
 */
export default function requestReportTemplate(data) {
    return post('/ciReport/createReportTemplate', data)
}
