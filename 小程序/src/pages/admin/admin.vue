<template>
  <div class="admin-layout">
    <header class="admin-header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h2>管理后台</h2>
      <button class="logout-btn" @click="handleLogout">退出</button>
    </header>
    <main class="admin-main">
      <div class="welcome-card">
        <div class="welcome-icon">🎉</div>
        <h3>欢迎进入管理后台</h3>
        <p>您已成功登录</p>
      </div>
      <div class="info-card">
        <h4>功能模块（开发中）</h4>
        <div class="module-grid">
          <div class="module-item">📋 订单管理</div>
          <div class="module-item">🍜 菜品管理</div>
          <div class="module-item">👥 用户管理</div>
          <div class="module-item">📊 数据统计</div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

function goBack() {
  router.push("/");
}

function handleLogout() {
  router.push("/login");
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background: #f0f2f5;
}

.admin-header {
  background: #1a1a2e;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.admin-header h2 {
  font-size: 17px;
  font-weight: 600;
}

.back-btn,
.logout-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s;
}

.back-btn:hover,
.logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.admin-main {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px 16px;
}

.welcome-card {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  margin-bottom: 20px;
}

.welcome-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.welcome-card h3 {
  font-size: 20px;
  margin-bottom: 6px;
}

.welcome-card p {
  opacity: 0.85;
  font-size: 14px;
}

.info-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.info-card h4 {
  font-size: 16px;
  color: #333;
  margin-bottom: 16px;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.module-item {
  background: #f8f9fa;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px 16px;
  text-align: center;
  font-size: 14px;
  color: #555;
  cursor: pointer;
  transition: all 0.2s;
}

.module-item:hover {
  border-color: #667eea;
  color: #667eea;
  background: #f0f0ff;
}
</style>
