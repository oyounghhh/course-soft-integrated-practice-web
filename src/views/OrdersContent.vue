<template>
    <el-container style="height: 100%">
        <el-header>
            <h1>体检报告管理系统</h1>
            <p>医生：{{ doctorName }}</p>
        </el-header>

        <el-container>
            <!-- 侧边栏：预约用户的个人信息 -->
            <el-aside width="260px" v-if="isAsideShow">
                <el-descriptions
                    class="margin-top"
                    title="预约客户信息"
                    :column="1"
                    border
                >
                    <el-descriptions-item>
                        <template #label>
                            <div class="cell-item">预约编号</div>
                        </template>
                        {{ orders.orderId }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>
                            <div class="cell-item">手机号码</div>
                        </template>
                        {{ orders.userId }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>
                            <div class="cell-item">真实姓名</div>
                        </template>
                        {{ orders.users.realName }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>
                            <div class="cell-item">性别</div>
                        </template>
                        {{ orders.users.sex == 1 ? '男' : '女' }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>
                            <div class="cell-item">套餐类型</div>
                        </template>
                        {{ orders.setmeal.name }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>
                            <div class="cell-item">体检日期</div>
                        </template>
                        {{ orders.orderDate }}
                    </el-descriptions-item>
                </el-descriptions>
                <el-button
                    type="primary"
                    style="margin-top: 20px"
                    @click="queryOrderUserData"
                    >查询体检用户</el-button
                >
            </el-aside>

            <el-main v-if="isMainShow">
                <div class="main-box">
                    <!-- 折叠框，显示各项身体标准的体检值 -->
                    <el-collapse>
                        <el-collapse-item
                            v-for="(ci, ciIndex) in ciReportArrRef"
                            :title="ci.ciName"
                            :key="ci.ciId"
                        >
                            <el-row style="color: #888">
                                <el-col
                                    :span="12"
                                    style="
                                        box-sizing: border-box;
                                        padding: 6px 10px;
                                    "
                                    v-for="(cidr, cidrIndex) in ci.cidrList"
                                    :key="cidr.ciId"
                                >
                                    <span
                                        style="
                                            background-color: #ba634e;
                                            color: #fff;
                                            box-sizing: border-box;
                                            padding: 1px 3px;
                                            border-radius: 3px;
                                            margin-right: 5px;
                                        "
                                        v-if="cidr.isError == 1"
                                        >异</span
                                    >

                                    <span
                                        style="
                                            margin-right: 5px;
                                            vertical-align: top;
                                        "
                                        >{{ cidr.name }}</span
                                    >

                                    <el-input
                                        style="width: 26%; margin-right: 2px"
                                        size="small"
                                        :placeholder="cidr.name"
                                        v-if="cidr.type != 4"
                                        v-model="
                                            ciReportArrRef[ciIndex].cidrList[
                                                cidrIndex
                                            ].value
                                        "
                                        @blur="
                                            cidrCheckByBlur(ciIndex, cidrIndex)
                                        "
                                    />
                                    <el-input
                                        style="width: 80%"
                                        type="textarea"
                                        :rows="2"
                                        :placeholder="cidr.name"
                                        v-model="
                                            ciReportArrRef[ciIndex].cidrList[
                                                cidrIndex
                                            ].value
                                        "
                                        v-if="cidr.type == 4"
                                    />

                                    <span style="margin-right: 15px">{{
                                        cidr.unit
                                    }}</span>

                                    <span v-if="cidr.normalValueString"
                                        >正常值范围:
                                        {{ cidr.normalValueString }}</span
                                    >
                                </el-col>
                            </el-row>
                            <el-button
                                type="primary"
                                style="margin-top: 8px"
                                @click="updateCiDetailedReport(ciIndex)"
                                v-if="orders.state == 1"
                                >{{ ci.ciName }}项保存</el-button
                            >
                        </el-collapse-item>
                    </el-collapse>

                    <!-- 总检结论 -->
                    <el-card class="box-card" style="margin-top: 20px">
                        <template #header>
                            <div class="card-header">
                                <span>总检结论</span>
                                <el-button
                                    class="button"
                                    type="danger"
                                    @click="updateOrdersState"
                                    v-if="orders.state == 1"
                                    >体检套餐总检结果报告归档</el-button
                                >
                            </div>
                        </template>
                        <div>
                            <el-table
                                :data="overallResultArr"
                                style="width: 100%"
                            >
                                <el-table-column
                                    prop="code"
                                    label="编号"
                                    width="60"
                                />
                                <el-table-column
                                    prop="title"
                                    label="总检结论项标题"
                                    width="180"
                                />
                                <el-table-column
                                    prop="content"
                                    label="总检结论项内容"
                                />
                                <el-table-column label="操作" width="120">
                                    <template #default="scope">
                                        <div class="two-btn-box">
                                            <el-button
                                                size="small"
                                                @click="showDialog(scope.row)"
                                                v-if="orders.state == 1"
                                                >更新</el-button
                                            >
                                            <el-button
                                                size="small"
                                                @click="
                                                    removeOverallResult(
                                                        scope.row,
                                                    )
                                                "
                                                v-if="orders.state == 1"
                                                >删除</el-button
                                            >
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>

                            <el-form
                                ref="formRef"
                                :model="overallResultItemTmp"
                                style="margin-top: 20px"
                                label-width="120px"
                                v-if="orders.state == 1"
                                v-show="!isDialogVisibleRef"
                            >
                                <el-form-item label="总检结论标题">
                                    <el-input
                                        v-model="overallResultItemTmp.title"
                                        placeholder="总检结论标题"
                                    ></el-input>
                                </el-form-item>
                                <el-form-item label="总检结论内容">
                                    <el-input
                                        v-model="overallResultItemTmp.content"
                                        :rows="2"
                                        type="textarea"
                                        placeholder="总检结论内容"
                                    ></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button
                                        type="primary"
                                        @click="addOverallResult"
                                        >添加</el-button
                                    >
                                    <el-button
                                        type="warning"
                                        @click="clearOverallResultInput"
                                        >清空</el-button
                                    >
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-card>

                    <!-- 总检结论更新用对话框 -->
                    <el-dialog
                        v-model="isDialogVisibleRef"
                        title="总检结论项更新"
                        width="60%"
                    >
                        <span>
                            <el-form
                                :model="overallResultItemTmp"
                                label-width="120px"
                            >
                                <el-form-item label="总检结论标题">
                                    <el-input
                                        v-model="overallResultItemTmp.title"
                                    ></el-input>
                                </el-form-item>
                                <el-form-item label="总检结论内容">
                                    <el-input
                                        v-model="overallResultItemTmp.content"
                                        type="textarea"
                                        :rows="3"
                                    ></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button
                                        type="primary"
                                        @click="updateOverallResult"
                                        >更新</el-button
                                    >
                                    <el-button
                                        @click="cancelUpdateOverallResult"
                                        >取消</el-button
                                    >
                                </el-form-item>
                            </el-form>
                        </span>
                    </el-dialog>
                </div>
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup>
import { onBeforeMount, onMounted, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getSessionStorage } from '@/utils/common'

import requestOrderUserData from '@/requests/requestOrderUserData'
import requestCiReports from '@/requests/requestCiReports'
import requestUpdateCiDetailReport from '@/requests/requestUpdateCiDetailReport'
import requestUpdateCiReportResult from '@/requests/requestUpdateCiReportResult'

// 异步数据未请求完成时，不进行组件的渲染
const isMainShow = ref(false)
const isAsideShow = ref(false)
// 体检预约用户的个人预约信息
const orders = ref({})

const router = useRouter()
const route = useRoute()
const orderId = route.query.orderId // 当前页面的预约用户的用户id
const doctorName = getSessionStorage('doctor')?.realName

// ------------------ 临时数据 ------------------
// 总检结论单项
const overallResultItemTmp = reactive({
    title: '',
    content: '',
    indexWaitUpdate: -1, // 更新时，该值为对应项在 overallResultArr 中的下标
})

// 总结结论的总内容
const overallResultArr = reactive([
    { code: '0', title: '标题xx', content: '内容xx' },
    { code: '1', title: '标题xx', content: '内容xx' },
    { code: '2', title: '标题xx', content: '内容xx' },
])

const ciReportArrRef = ref([])
const isDialogVisibleRef = ref(false)

// ------------------ life cycle ------------------
onBeforeMount(async () => {
    await getOrdersById()
    isAsideShow.value = true
    // await getUserCiReports()
    // isLoaded.value = true
})

// ------------------ fetch data ------------------
async function getOrdersById() {
    try {
        orders.value = await requestOrderUserData({ orderId })
    } catch (err) {
        alert(err.message)
    }
}

async function getUserCiReports() {
    try {
        ciReportArrRef.value = await requestCiReports(orderId)
    } catch (error) {
        alert(err.message)
    }
}

// ------------------ btn events ------------------

/**
 * 查询体检用户的信息 --> 进入 OrderList 页面
 */
function queryOrderUserData() {
    router.push({
        name: 'OrdersList',
        query: {
            userId: orders.userId,
        },
    })
}

/**
 * 更新某个类型的指标项的值，保存成功后需要更新指标项 ciReportArrRef
 * @param {Number} ciIndex
 */
function updateCiDetailedReport(ciIndex) {
    //表单验证（1：非空；2：当type==1时验证是否为数字）
    let cidrArr = ciReportArrRef.value[ciIndex].cidrList
    for (let i = 0; i < cidrArr.length; i++) {
        if (cidrArr[i].value == '') {
            alert(cidrArr[i].name + '不能为空！')
            return
        }
        if (
            cidrArr[i].type == 1 &&
            parseFloat(cidrArr[i].value).toString() == 'NaN'
        ) {
            alert(cidrArr[i].name + '必须为数字！')
            return
        }
    }

    //封装提交参数（压缩提交参数）
    let arr = []
    for (let i = 0; i < cidrArr.length; i++) {
        arr.push({
            cidrId: cidrArr[i].cidrId,
            value: cidrArr[i].value,
            isError: cidrArr[i].isError,
        })
    }
    requestUpdateCiDetailReport(arr)
        .then((data) => {
            if (data > 0) {
                alert('保存成功！')
                getUserCiReports()
            } else {
                alert('保存失败！')
            }
        })
        .catch((err) => {
            alert(err.message)
        })
}

// ------------------ 总检框按钮事件 ------------------

/**
 * 将总检结论的内容归档
 */
function updateOrdersState() {
    if (!confirm('总检结论报告归档前，请务必确认是否所有检查项数据都正确？')) {
        return
    }

    requestUpdateCiReportResult({ orderId, state: 2 })
        .then((data) => {
            if (data > 0) {
                router.push({ name: 'OrdersList' })
            } else {
                alert('总检结论报告归档失败！')
            }
        })
        .catch((err) => {
            alert(err.message)
        })
}

/**
 * 添加一条总检结论单项
 */
function addOverallResult() {
    overallResultArr.push({
        code: (Math.random() * 100).toFixed(),
        title: overallResultItemTmp.title,
        content: overallResultItemTmp.content,
    })
    clearOverallResultInput()
}
/**
 * 清空总检结论单项中的内容
 */
function clearOverallResultInput() {
    overallResultItemTmp.title = ''
    overallResultItemTmp.content = ''
    overallResultItemTmp.indexWaitUpdate = -1
    isDialogVisibleRef.value = false
}
/**
 * 删除某项总检结论
 * @param {{code: string}} row
 */
function removeOverallResult(row) {
    const code = row.code
    const index = overallResultArr.findIndex((ele) => ele.code === code)
    if (index !== -1) {
        overallResultArr.splice(index, 1)
    }
}
/**
 * 显示更新框，用于更新指定某项总检结论
 */
function showDialog(row) {
    const code = row.code
    const index = overallResultArr.findIndex((ele) => ele.code === code)
    if (index !== -1) {
        overallResultItemTmp.title = overallResultArr[index].title
        overallResultItemTmp.content = overallResultArr[index].content
        overallResultItemTmp.indexWaitUpdate = index
        isDialogVisibleRef.value = true
    } else {
        alert('出错了，找不到该总结单项')
    }
}
/**
 * 更新某项总检结论
 */
function updateOverallResult() {
    const i = overallResultItemTmp.indexWaitUpdate
    overallResultArr[i].title = overallResultItemTmp.title
    overallResultArr[i].content = overallResultItemTmp.content
    clearOverallResultInput()
}
/**
 * 取消更新某项总检结论
 */
function cancelUpdateOverallResult() {
    clearOverallResultInput()
}
// ------------------ element-plus events ------------------
function cidrCheckByBlur(ciIndex, cidrIndex) {
    //获取当前选中的检查项明细
    let cidr = ciReportArrRef.value[ciIndex].cidrList[cidrIndex]
    //判断type属性（1：数值范围验证型；2：数值相等验证型；）
    if (cidr.type == 1) {
        if (
            !(cidr.value == null || cidr.value == '') &&
            (cidr.value < cidr.minrange || cidr.value > cidr.maxrange)
        ) {
            cidr.isError = 1
        } else {
            cidr.isError = 0
        }
    } else if (cidr.type == 2) {
        if (
            !(cidr.value == null || cidr.value == '') &&
            cidr.value != cidr.normalValue
        ) {
            cidr.isError = 1
        } else {
            cidr.isError = 0
        }
    }
}
</script>

<style scoped>
.two-btn-box {
    display: flex;
    justify-content: space-evenly;
}
.el-header {
    background-color: #b3c0d1;
    color: var(--el-text-color-primary);
    text-align: center;
    line-height: 60px;

    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #1c51a3;
}

.el-header h1 {
    font-size: 22px;
    font-weight: 700;
}
.el-header p {
    font-size: 16px;
}

.el-aside {
    background-color: #d3dce6;
    box-sizing: border-box;
    padding: 20px;
}

.el-main {
    background-color: #e9eef3;
    padding: 0;
}

.el-main .main-box {
    width: 100%;
    height: 680px;
    overflow: auto;
    background-color: #fff;
    box-sizing: border-box;
    padding: 20px;
}

/*********** 描述列表 ***********/

.el-descriptions {
    margin-top: 20px;
}
.cell-item {
    display: flex;
    align-items: center;
}
.margin-top {
    margin-top: 20px;
}

/*********** 总检结论 ***********/
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.box-card {
    width: 100%;
}
</style>
