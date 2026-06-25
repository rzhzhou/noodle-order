<template>
  <!-- 全屏页面（如登录页），不带侧边栏 -->
  <router-view v-if="$route.meta.noLayout" />

  <!-- 后台管理布局，带侧边栏 -->
  <el-container v-else class="admin-layout">
    <el-aside width="220px" class="sidebar">
      <div class="logo">🍪 粉面后台</div>
      <el-menu
        :default-active="$route.path"
        router
        background-color="#001529"
        text-color="rgba(255,255,255,0.7)"
        active-text-color="#fff"
        class="sidebar-menu"
      >
        <el-menu-item index="/">
          <el-icon><DataAnalysis /></el-icon>
          <span>数据概览</span>
        </el-menu-item>
        <el-menu-item index="/products">
          <el-icon><Goods /></el-icon>
          <span>商品管理</span>
        </el-menu-item>
        <el-menu-item index="/orders">
          <el-icon><List /></el-icon>
          <span>订单管理</span>
        </el-menu-item>
      </el-menu>
      <div class="sidebar-footer" @click="logout">
        <el-icon><SwitchButton /></el-icon>
        <span>退出</span>
      </div>
    </el-aside>
    <el-main class="main-area">
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
function logout() { router.push("/login"); }
</script>

<style>
#app { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
.admin-layout { min-height: 100vh; }
.sidebar {
  background: #001529;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  overflow: hidden;
}
.logo {
  padding: 20px;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  text-align: center;
  border-bottom: 1px solid #003;
}
.sidebar-menu {
  flex: 1;
  border-right: none !important;
}
.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid #003;
  cursor: pointer;
  color: rgba(255,255,255,0.5);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.sidebar-footer:hover { color: #fff; }
.main-area { margin-left: 220px; padding: 24px; background: #f5f7fa; min-height: 100vh; box-sizing: border-box; }
</style>