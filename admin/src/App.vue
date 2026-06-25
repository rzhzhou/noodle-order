<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="logo">🍜 粉面后台</div>
      <nav>
        <router-link v-for="m in menus" :key="m.path" :to="m.path"
          class="menu-item" :class="{ active: $route.path === m.path }">
          <span>{{ m.icon }}</span>
          <span>{{ m.label }}</span>
        </router-link>
      </nav>
      <div class="sidebar-footer" @click="logout">🚪 退出</div>
    </aside>
    <main class="main-area">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const menus = [
  { path: "/", icon: "📊", label: "数据概览" },
  { path: "/products", icon: "📦", label: "商品管理" },
  { path: "/orders", icon: "📋", label: "订单管理" },
];
function logout() { router.push("/login"); }
</script>

<style>
#app { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
.admin-layout { display: flex; min-height: 100vh; }
.sidebar {
  width: 220px; background: #001529; color: #fff; display: flex;
  flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100;
}
.logo { padding: 20px; font-size: 18px; font-weight: 700; border-bottom: 1px solid #003; text-align: center; }
nav { flex: 1; padding: 12px; }
.menu-item {
  display: flex; align-items: center; gap: 10px; padding: 12px 16px;
  border-radius: 8px; color: rgba(255,255,255,0.7); text-decoration: none;
  font-size: 14px; margin-bottom: 4px; transition: all 0.2s;
}
.menu-item:hover { background: rgba(255,255,255,0.08); color: #fff; }
.menu-item.active { background: #f56c6c; color: #fff; }
.sidebar-footer {
  padding: 16px 20px; border-top: 1px solid #003; cursor: pointer;
  color: rgba(255,255,255,0.5); font-size: 13px;
}
.main-area { margin-left: 220px; flex: 1; padding: 24px; }
</style>