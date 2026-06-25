<template>
  <view class="page">
    <view class="avatar">👁</view>
    <view class="name">Demo 用户</view>

    <view class="card">
      <text class="card-label">所属单位</text>
      <input v-model="unit" placeholder="设置你的单位" class="input" @blur="saveUnit" />
    </view>

    <view class="menu">
      <view class="menu-item" @click="goOrders">
        <text>📋 我的订单</text>
        <text class="arrow">›</text>
      </view>
      <view class="menu-item" @click="clearCart">
        <text>🗑 清空购物车</text>
        <text class="arrow">›</text>
      </view>
    </view>

    <view class="version">粉面下单系统 v1.0.0</view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import cart from "../../store/cart.js";

const unit = ref(uni.getStorageSync("noodle_unit") || "");

function saveUnit() { if (unit.value) uni.setStorageSync("noodle_unit", unit.value); }

function goOrders() { uni.switchTab({ url: "/pages/order/order" }); }

function clearCart() {
  uni.showModal({ title: "提示", content: "确定清空购物车？", success: (r) => { if (r.confirm) cart.clear(); } });
}
</script>

<style scoped>
.page { padding: 16px; display: flex; flex-direction: column; align-items: center; }
.avatar { font-size: 72px; margin: 30px 0 6px; }
.name { font-size: 18px; font-weight: 600; margin-bottom: 30px; }
.card { width: 100%; background: #fff; border-radius: 12px; padding: 16px; display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.card-label { font-size: 14px; color: #666; min-width: 70px; }
.input { flex: 1; font-size: 15px; padding: 4px 0; }
.menu { width: 100%; background: #fff; border-radius: 12px; overflow: hidden; }
.menu-item { display: flex; justify-content: space-between; padding: 16px; font-size: 15px; border-bottom: 1px solid #f0f0f0; }
.arrow { color: #ccc; }
.version { font-size: 12px; color: #ccc; margin-top: 30px; }
</style>