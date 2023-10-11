import { post } from '@/requests'
/**
 *
 * @param {*} userId
 * @returns {Promise<Users>}
 */
function userInfo(userId) {
    return post('/users/getUsersById', { userId })
}

/**
 *
 * @param {*} htId
 * @returns {Promise<Hospital>}
 */
function hospitalInfo(htId) {
    return post('/hospital/getHospitalById', { htId })
}

/**
 *
 * @param {*} smId
 * @returns {Promise<Setmeal>}
 */
function setmealInfo(smId) {
    return post('/setmeal/getSetmealById', { smId })
}

/**
 * 根据 orders，获取具体的 user、setmeal 和 hospital 内容
 * @param {Orders} order
 * @returns {Promise<OrdersMore>}
 */
async function mulOrder(order) {
    const { hpId, smId, userId } = order
    const data = await Promise.allSettled([
        hospitalInfo(hpId),
        setmealInfo(smId),
        userInfo(userId),
    ])
    order.hospital = data[0].value
    order.setmeal = data[1].value
    order.users = data[2].value
    return order
}

/**
 * 根据 user id 获取预约用户的信息
 * @param {{orderId: string}} data
 * @returns {Promise<OrdersMore>}
 */
export default async function requestOrderUserData(data) {
    const order = await post('/orders/getOrdersById', data)
    const orderMore = await mulOrder(order)
    return orderMore
}
