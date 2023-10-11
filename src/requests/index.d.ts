interface OrdersMore extends Orders {
    users: Users
    hospital: Hospital
    setmeal: Setmeal
}

interface Orders {
    orderDate: String
    userId: String
    orderId: Number
    hpId: Number
    smId: Number
    state: Number
}

interface OrdersPageResponseDto {
    totalRow: Number
    totalPageNum: Number
    preNum: Number
    nextNum: Number
    pageNum: Number
    maxPageNum: Number
    beginNum: Number
    list: Array<Orders>
}

interface Users {
    userId: String
    password: String
    realName: String
    /**
     * 1-男
     * 0-女
     */
    sex: Number
    identityCard: String
    birthday: String
    userType: Number
}

interface Hospital {
    hpId: Number
    name: String
    picture: String
    telephone: String
    address: String
    businessHours: String
    deadline: String
    rule: String
    state: Number
}

interface Setmeal {
    smId: Number
    name: String
    type: Number
    price: Number
    sdList: Array<SetmealDetailed>
}

interface SetmealDetailed {
    sdId: Number
    smId: Number
    ciId: Number
    checkItem: {
        ciId: Number
        ciName: String
        ciContent: String
        meaning: String
        remarks: String
    }
}

interface CiReport {
    cirId: number
    ciId: number
    ciName: string
    orderId: number
    cidrList: Array<CiDetailedReport>
}
interface CiDetailedReport {
    cidrId: number
    name: string
    unit: string
    minrange: number
    maxrange: number
    normalValue: string
    normalValueString: string
    type: number
    value: string
    isError: number
    ciId: number
    orderId: number
}
