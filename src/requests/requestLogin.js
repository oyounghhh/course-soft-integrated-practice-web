import { post } from '@/requests'

export default function requestLogin(data) {
    return post('/doctor/getDoctorByCodeByPass', data)
}
