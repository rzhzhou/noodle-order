<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="logo">
          <span class="logo-icon">🍜</span>
        </div>
        <h2 class="system-title">粉面下单管理系统</h2>
        <p class="system-subtitle">请登录您的账号</p>
      </div>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label" for="username">用户名</label>
          <div class="input-wrapper">
            <span class="input-icon">👤</span>
            <input
              id="username"
              v-model="form.username"
              type="text"
              class="form-input"
              placeholder="请输入用户名"
              autocomplete="username"
              @input="clearError"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="password">密码</label>
          <div class="input-wrapper">
            <span class="input-icon">🔒</span>
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input"
              placeholder="请输入密码"
              autocomplete="current-password"
              @input="clearError"
            />
            <button
              type="button"
              class="toggle-pwd"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
        </div>

        <div class="form-options">
          <label class="remember-checkbox">
            <input
              type="checkbox"
              v-model="rememberPassword"
              class="checkbox-input"
            />
            <span class="checkbox-custom"></span>
            <span class="checkbox-label">记住密码</span>
          </label>
          <a href="javascript:;" class="forgot-link">忘记密码？</a>
        </div>

        <div v-if="errorMsg" class="error-message">
          <span class="error-icon">⚠️</span>
          {{ errorMsg }}
        </div>

        <button type="submit" class="login-btn" :disabled="loading">
          <span v-if="loading" class="loading-spinner"></span>
          <span v-else>登 录</span>
        </button>
      </form>

      <div class="login-footer">
        <p>首次使用请联系管理员获取账号</p>
        <p style="margin-top:6px;font-size:11px;color:#ddd;">默认账号: admin / 123456</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const form = reactive({
  username: "",
  password: "",
});

const STORAGE_KEY = "admin_login_remember";
const showPassword = ref(false);
const rememberPassword = ref(false);
const loading = ref(false);
const errorMsg = ref("");

onMounted(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.username) form.username = parsed.username;
      if (parsed.password) form.password = parsed.password;
      rememberPassword.value = true;
    }
  } catch {
    // ignore
  }
});

function clearError() {
  errorMsg.value = "";
}

async function handleLogin() {
  errorMsg.value = "";

  if (!form.username.trim()) {
    errorMsg.value = "请输入用户名";
    return;
  }
  if (!form.password.trim()) {
    errorMsg.value = "请输入密码";
    return;
  }

  loading.value = true;

  try {
    // 模拟登录（开发用，后续替换为真实 API）
    await mockLogin(form.username, form.password);

    // 记住密码
    if (rememberPassword.value) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          username: form.username,
          password: form.password,
        })
      );
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }

    router.push("/admin");
  } catch (err) {
    errorMsg.value = err.message || "登录失败，请检查账号密码";
  } finally {
    loading.value = false;
  }
}

function mockLogin(username, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === "admin" && password === "123456") {
        resolve({ token: "mock-token-xxx" });
      } else {
        reject(new Error("用户名或密码错误"));
      }
    }, 800);
  });
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 16px;
  padding: 40px 32px 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  animation: fadeInUp 0.5s ease;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.logo-icon { font-size: 36px; }

.system-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 6px;
}

.system-subtitle {
  font-size: 14px;
  color: #999;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  font-size: 16px;
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 12px 14px 12px 42px;
  border: 1.5px solid #e0e0e0;
  border-radius: 10px;
  font-size: 15px;
  color: #333;
  background: #fafafa;
  transition: all 0.25s ease;
  outline: none;
}

.form-input::placeholder { color: #bbb; }

.form-input:focus {
  border-color: #667eea;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
}

.toggle-pwd {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.toggle-pwd:hover { opacity: 1; }

.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.remember-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.checkbox-input { display: none; }

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid #ccc;
  border-radius: 4px;
  position: relative;
  transition: all 0.2s;
  flex-shrink: 0;
}

.checkbox-input:checked + .checkbox-custom {
  background: #667eea;
  border-color: #667eea;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: "✓";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 12px;
  font-weight: bold;
}

.checkbox-label {
  font-size: 14px;
  color: #666;
}

.forgot-link {
  font-size: 13px;
  color: #667eea;
  text-decoration: none;
}

.forgot-link:hover { text-decoration: underline; }

.error-message {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 13px;
}

.error-icon { font-size: 14px; }

.login-btn {
  width: 100%;
  padding: 13px 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 2px;
}

.login-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.35);
}

.login-btn:active { transform: translateY(0); }

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2.5px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.login-footer {
  text-align: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.login-footer p {
  font-size: 12px;
  color: #bbb;
}

@media (max-width: 480px) {
  .login-card { padding: 32px 24px 24px; border-radius: 12px; }
  .system-title { font-size: 20px; }
}
</style>
