import { post } from '@/requests'

/**
 * 分页查询某类用户体检预约列表
 * @param {*} data
 * @returns
 */
export default function requestOrderByPage(data) {
    console.log('oerders')
    return post('/orders/listOrders', data)
}
