import { post } from '@/requests'

/**
 * 分页查询某类用户体检预约列表
 * @param {*} data
 * @returns {Promise<OrdersPageResponseDto>}
 */
function listOrders(data) {
    return post('/orders/listOrders', data)
}

/**
 *
 * @param {*} htId
 * @returns {Promise<Hospital>}
 */
function hospitalInfo(hpId) {
    return post('/hospital/getHospitalById', { hpId })
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
 *
 * @param {*} userId
 * @returns {Promise<Users>}
 */
function userInfo(userId) {
    return post('/users/getUsersById', { userId })
}

export default async function requestOrderByPage(data) {
    const ordersPageResponseDto = await listOrders(data)
    const hospitalInfoPromiseArr = []
    const setmealInfoPromiseArr = []
    const userInfoPromiseArr = []
    ordersPageResponseDto.list.forEach((item) => {
        const { hpId, smId, userId } = item
        hospitalInfoPromiseArr.push(hospitalInfo(hpId))
        setmealInfoPromiseArr.push(setmealInfo(smId))
        userInfoPromiseArr.push(userInfo(userId))
    })
    const result = await Promise.allSettled([
        ...hospitalInfoPromiseArr,
        ...setmealInfoPromiseArr,
        ...userInfoPromiseArr,
    ])
    const listLen = ordersPageResponseDto.list.length
    ordersPageResponseDto.list.forEach((obj, index) => {
        obj.hospital = {
            name: result[index].value.name,
        }
        obj.setmeal = {
            name: result[index + listLen].value.name,
        }
        obj.users = {
            realName: result[index + 2 * listLen].value.realName,
            sex: result[index + 2 * listLen].value.sex === 1 ? '男' : '女',
        }
    })

    return ordersPageResponseDto
}
