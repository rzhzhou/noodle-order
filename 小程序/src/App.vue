<template>
  <div class="app">
    <header class="header">
      <h1 class="title">{{ currentTitle }}</h1>
    </header>
    <main class="main">
      <router-view />
    </main>
    <nav class="tab-bar">
      <router-link
        v-for="tab in tabs"
        :key="tab.path"
        :to="tab.path"
        class="tab-item"
        :class="{ active: $route.path === tab.path }"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-text">{{ tab.label }}</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const tabs = [
  { path: "/index", icon: "🍜", label: "首页" },
  { path: "/cart", icon: "🛒", label: "购物车" },
  { path: "/order", icon: "📋", label: "订单" },
  { path: "/profile", icon: "👤", label: "我的" },
];

const currentTitle = computed(() => route.meta?.title || "粉面下单");
</script>

<style>
#app { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
.app { max-width: 480px; margin: 0 auto; min-height: 100vh; background: #f5f5f5; position: relative; }
.header {
  position: sticky; top: 0; z-index: 100; background: #fff;
  padding: 16px 20px; border-bottom: 1px solid #eee; text-align: center;
}
.title { font-size: 18px; font-weight: 600; color: #333; }
.main { padding-bottom: 70px; min-height: calc(100vh - 100px); }
.tab-bar {
  position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
  max-width: 480px; width: 100%; background: #fff;
  display: flex; border-top: 1px solid #eee; z-index: 200;
}
.tab-item {
  flex: 1; display: flex; align-items: center; justify-content: center;
  gap: 4px; padding: 10px 0; text-decoration: none; color: #999; font-size: 11px;
}
.tab-item.active { color: #f56c6c; }
.tab-icon { font-size: 18px; }
.tab-text { font-size: 12px; }
</style>