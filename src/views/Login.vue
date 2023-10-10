<template>
    <el-card class="box-card">
        <template #header>
            <div class="card-header">
                <span>登录</span>
            </div>
        </template>
        <div class="text item">
            <el-form ref="formRef" :model="loginForm" label-width="120px">
                <el-form-item label="医生编码">
                    <el-input v-model="loginForm.docCode"></el-input>
                </el-form-item>
                <el-form-item label="登录密码">
                    <el-input
                        v-model="loginForm.password"
                        type="password"
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="login">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-card>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { setSessionStorage } from '@/utils/common'
import requestLogin from '@/requests/requestLogin'

const router = useRouter()

const loginForm = reactive({
    docCode: '',
    password: '',
})

// ------------------ dom events ------------------
function login() {
    if (!validateLoginForm()) {
        return
    }

    requestLogin(loginForm)
        .then((data) => {
            const doctorName = data
            if (data !== '') {
                setSessionStorage('doctor', { realName: doctorName })
                router.push({ name: 'OrdersList' })
            } else {
                alert('不存在该医生')
            }
        })
        .catch((e) => {
            alert(e.message)
        })
}

// ------------------ utils ------------------

function validateLoginForm() {
    if (loginForm.docCode == '') {
        alert('医生编码不能为空！')
        return false
    }
    if (loginForm.password == '') {
        alert('密码不能为空！')
        return false
    }
    return true
}
</script>

<style scoped>
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}

.box-card {
    width: 400px;
    margin: 0 auto;
    margin-top: 150px;
}
</style>
