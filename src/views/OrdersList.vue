<template>
    <el-container style="height: 100%">
        <el-header>
            <h1>体检报告管理系统</h1>
            <p>医生：{{ doctorName }}</p>
        </el-header>
        <el-container>
            <el-aside width="260px">
                <h4>体检用户查询</h4>
                <el-form
                    ref="formRef"
                    :model="dataCondition"
                    label-width="auto"
                >
                    <el-form-item label="手机号码">
                        <el-input
                            v-model="dataCondition.userId"
                            placeholder="手机号码"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="姓名">
                        <el-input
                            v-model="dataCondition.realName"
                            placeholder="姓名"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="性别">
                        <el-radio-group v-model="dataCondition.sex">
                            <el-radio label="1">男</el-radio>
                            <el-radio label="0">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="套餐类型">
                        <el-select
                            v-model="dataCondition.smId"
                            placeholder="套餐类型"
                        >
                            <el-option
                                v-for="setmeal in setmealArrRef"
                                :key="setmeal.smId"
                                :label="setmeal.name"
                                :value="setmeal.smId"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="体检日期">
                        <el-date-picker
                            v-model="dataCondition.orderDate"
                            type="date"
                            placeholder="体检日期"
                            style="width: 100%"
                            format="YYYY/MM/DD"
                            value-format="YYYY-MM-DD"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="是否归档">
                        <el-radio-group v-model="dataCondition.state">
                            <el-radio border label="1">未归档</el-radio>
                            <el-radio border label="2">已归档</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search"
                            >查询</el-button
                        >
                        <el-button type="warning" @click="reset"
                            >重置</el-button
                        >
                    </el-form-item>
                </el-form>
            </el-aside>
            <el-main>
                <el-table
                    :data="ordersPageResponseDtoRef?.list"
                    style="width: 100%"
                >
                    <el-table-column
                        prop="orderId"
                        label="预约编号"
                        width="120"
                    />
                    <el-table-column
                        prop="userId"
                        label="手机号码"
                        width="140"
                    />
                    <el-table-column
                        prop="users.realName"
                        label="真实姓名"
                        width="120"
                    />
                    <el-table-column prop="users.sex" label="性别" width="60" />
                    <el-table-column prop="setmeal.name" label="套餐类型" />
                    <el-table-column
                        prop="hospital.name"
                        label="体检医院"
                        width="220"
                    />
                    <el-table-column prop="orderDate" label="体检日期" />
                    <el-table-column label="操作" width="120">
                        <template #default="scope">
                            <el-button
                                size="small"
                                @click="handleReport(scope.row)"
                                >{{
                                    scope.row.state == 1
                                        ? '编辑体检报告'
                                        : '查看体检报告'
                                }}
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    layout="prev, pager, next"
                    :total="1"
                    style="margin-top: 20px"
                />
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getSessionStorage } from '@/utils/common'
import requestReportTemplate from '@/requests/requestReportTemplate'
import requestSetmealList from '@/requests/requestSetmealList'
import requestOrderByPage from '@/requests/requestOrderByPage'

const MAX_PAGE_NUM = 10
const router = useRouter()
const doctorName = getSessionStorage('doctor')?.realName

const dataCondition = reactive({
    userId: '',
    realName: '',
    sex: '',
    smId: '',
    orderDate: '',
    state: '1',
})

const setmealArrRef = ref([])
const ordersPageResponseDtoRef = ref({})

// ------------------ life cycle ------------------
onMounted(() => {
    getAllSetmealList()
    getOrdersData(1)
})

function getAllSetmealList() {
    requestSetmealList()
        .then((data) => {
            setmealArrRef.value = data
        })
        .catch((err) => {
            alert(err.message)
        })
}
function getOrdersData(pageNum) {
    requestOrderByPage({
        ...dataCondition,
        pageNum,
        maxPageNum: MAX_PAGE_NUM,
    }).then((data) => {
        ordersPageResponseDtoRef.value = data
    })
}

// ------------------ btn events ------------------

function search() {
    console.log('查询')
}
function reset() {
    if (window.confirm('确定重置？')) {
        selectForm.userId = ''
        selectForm.realName = ''
        selectForm.sex = ''
        selectForm.smId = ''
        selectForm.orderDate = ''
        selectForm.state = '1'
    }
}
function handleReport(row) {
    const orderId = row.orderId
    const smId = row.smId
    requestReportTemplate({
        orderId,
        smId,
    })
        .then((data) => {
            const succeed = data === 1 || data === '1'
            if (succeed) {
                router.push({
                    name: 'OrdersContent',
                    query: { orderId },
                })
            } else {
                alert('生成报告模板失败！')
            }
        })
        .catch((err) => {
            alert(err.message)
            console.log(err)
        })
}

// ------------------ element events props ------------------
function currentChange() {}
</script>

<style scoped>
:deep(div.cell) {
    text-align: center;
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
.el-aside h4 {
    color: #555;
    margin-bottom: 20px;
}

.el-main {
    background-color: #e9eef3;
}
</style>
