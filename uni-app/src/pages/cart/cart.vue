<template>
  <view class="page">
    <view v-if="!items.length" class="empty">
      <view style="font-size:60px;margin-bottom:12px">🛒</view>
      <view>购物车是空的</view>
      <view style="font-size:13px;color:#999;margin-top:6px">去首页挑选商品吧</view>
    </view>
    <view v-else class="list">
      <view v-for="item in items" :key="item.id" class="item">
        <view class="info">
          <text class="name">{{ item.name }}</text>
          <text class="price">¥{{ (item.price * item.quantity).toFixed(2) }}</text>
        </view>
        <view class="qty">
          <view class="qty-btn" @click="decrease(item)">-</view>
          <text class="num">{{ item.quantity }}</text>
          <view class="qty-btn" @click="increase(item)">+</view>
        </view>
      </view>
    </view>
    <view v-if="items.length" class="bottom-bar">
      <view>
        <text style="color:#fff;font-size:13px">合计：</text>
        <text style="color:#ff6b6b;font-size:20px;font-weight:700">¥{{ total.toFixed(2) }}</text>
      </view>
      <view class="bottom-actions">
        <view class="clear-btn" @click="clearCart">清空</view>
        <view class="submit-btn" @click="goCheckout">去下单</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import { onShow } from "@dcloudio/uni-app";
import cart from "../../store/cart.js";

const items = ref(cart.items);
const total = computed(() => cart.total);

function refresh() { items.value = [...cart.items]; }

function increase(item) { cart.addItem(item, 1); refresh(); }
function decrease(item) { cart.updateQuantity(item.id, item.quantity - 1); refresh(); }

function clearCart() {
  uni.showModal({ title: "提示", content: "确定清空购物车？", success: (r) => { if (r.confirm) { cart.clear(); refresh(); } } });
}

function goCheckout() { uni.navigateTo({ url: "/pages/checkout/checkout" }); }

onShow(() => { refresh(); });
</script>

<style scoped>
.page { padding: 12px 16px 80rpx; }
.empty { text-align: center; padding: 100px 0; color: #333; font-size: 15px; }
.item { background: #fff; border-radius: 12px; padding: 16px; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; }
.name { font-size: 15px; font-weight: 600; display: block; }
.price { font-size: 17px; color: #f56c6c; font-weight: 700; margin-top: 4px; display: block; }
.qty { display: flex; align-items: center; gap: 10px; }
.qty-btn { width: 28px; height: 28px; border-radius: 50%; border: 1px solid #ddd; background: #fff; font-size: 16px; display: flex; align-items: center; justify-content: center; }
.num { font-size: 14px; font-weight: 600; min-width: 24px; text-align: center; }
.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; background: #333; padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; }
.bottom-actions { display: flex; gap: 12px; align-items: center; }
.clear-btn { color: #ccc; font-size: 13px; padding: 8px 12px; }
.submit-btn { background: #f56c6c; color: #fff; padding: 10px 28px; border-radius: 20px; font-size: 14px; }
</style>