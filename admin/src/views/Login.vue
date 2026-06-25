<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-logo">🍜</div>
      <h2>粉面后台管理</h2>
      <div class="field">
        <input v-model="username" placeholder="管理员账号" />
      </div>
      <div class="field">
        <input v-model="password" type="password" placeholder="密码" @keyup.enter="login" />
      </div>
      <button class="login-btn" @click="login">登录</button>
      <p class="hint">默认账号: admin / 密码: 123456</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const username = ref("");
const password = ref("");
function login() {
  if (username.value === "admin" && password.value === "123456") {
    localStorage.setItem("admin_token", "demo");
    router.push("/");
  } else {
    alert("账号或密码错误");
  }
}
</script>

<style scoped>
.login-page { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #f56c6c 100%); }
.login-card { background: #fff; padding: 40px; border-radius: 16px; width: 360px; box-shadow: 0 8px 30px rgba(0,0,0,0.15); }
.login-logo { text-align: center; font-size: 60px; margin-bottom: 10px; }
h2 { text-align: center; color: #333; margin-bottom: 30px; font-size: 20px; }
.field { margin-bottom: 16px; }
.field input { width: 100%; padding: 12px 14px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; box-sizing: border-box; }
.login-btn { width: 100%; padding: 12px; background: #f56c6c; color: #fff; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; }
.hint { text-align: center; color: #999; font-size: 12px; margin-top: 16px; }
</style>