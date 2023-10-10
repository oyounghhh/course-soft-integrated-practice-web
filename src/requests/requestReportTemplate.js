import { post } from '@/requests'

export default function requestReportTemplate(data) {
    return post('/ciReport/createReportTemplate', data)
}
