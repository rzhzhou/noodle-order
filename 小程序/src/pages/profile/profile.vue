<template>
  <div class="page">
    <div class="avatar">👤</div>
    <div class="name">Demo 用户</div>

    <div class="card">
      <label>所属单位</label>
      <input v-model="unit" placeholder="设置你的单位" @blur="saveUnit" />
    </div>

    <div class="menu">
      <div class="menu-item" @click="$router.push('/order')">📋 我的订单 <span>›</span></div>
      <div class="menu-item" @click="clearData">🗑️ 清空购物车 <span>›</span></div>
    </div>

    <div class="version">粉面下单系统 v1.0.0</div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import cart from "../../store/cart.js";

const unit = ref(localStorage.getItem("noodle_unit") || "");
function saveUnit() { if (unit.value) localStorage.setItem("noodle_unit", unit.value); }
function clearData() { if (confirm("确定清空购物车？")) { cart.clear(); } }
</script>

<style scoped>
.page { padding: 16px; display: flex; flex-direction: column; align-items: center; }
.avatar { font-size: 72px; margin: 30px 0 6px; }
.name { font-size: 18px; font-weight: 600; margin-bottom: 30px; }
.card { width: 100%; background: #fff; border-radius: 12px; padding: 16px; display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.card label { font-size: 14px; color: #666; min-width: 70px; }
.card input { flex: 1; font-size: 15px; border: none; outline: none; padding: 4px 0; }
.menu { width: 100%; background: #fff; border-radius: 12px; overflow: hidden; }
.menu-item { display: flex; justify-content: space-between; padding: 16px; font-size: 15px; border-bottom: 1px solid #f0f0f0; cursor: pointer; }
.menu-item span { color: #ccc; }
.version { font-size: 12px; color: #ccc; margin-top: 30px; }
</style>