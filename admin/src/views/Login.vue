<template>
  <div class="login-page">
    <el-card class="login-card" shadow="always">
      <div class="login-logo">🍪</div>
      <h2>粉面后台管理</h2>
      <el-form @submit.prevent="login">
        <el-form-item>
          <el-input v-model="username" placeholder="管理员账号" prefix-icon="User" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="password" type="password" placeholder="密码" prefix-icon="Lock" show-password @keyup.enter="login" />
        </el-form-item>
        <el-form-item>
          <el-button type="danger" size="large" style="width:100%" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
      <p class="hint">默认账号: admin / 密码: 123456</p>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
const router = useRouter();
const username = ref("");
const password = ref("");
function login() {
  if (username.value === "admin" && password.value === "123456") {
    localStorage.setItem("admin_token", "demo");
    router.push("/");
  } else {
    ElMessage.error("账号或密码错误");
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #f56c6c 100%);
}
.login-card { width: 400px; }
.login-logo { text-align: center; font-size: 60px; margin-bottom: 10px; margin-top: 10px; }
h2 { text-align: center; color: #333; margin-bottom: 24px; font-size: 20px; }
.hint { text-align: center; color: #999; font-size: 12px; margin-top: 8px; }
</style>