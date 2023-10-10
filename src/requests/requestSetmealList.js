import { post } from '@/requests'

/**
 * 获取所有可选套餐
 * @param {*} data
 * @returns
 */
export default function requestSetmealList(data) {
    return post('/setmeal/listSetmeal', data)
}
