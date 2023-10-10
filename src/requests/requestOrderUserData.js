import { post } from '@/requests'

/**
 * 根据 user id 获取预约用户的信息
 * @param {{orderId: string}} data
 * @returns
 */
export default function requestOrderUserData(data) {
    return post('/orders/getOrdersById', data)
}
