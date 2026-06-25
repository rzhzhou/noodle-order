<template>
  <view class="page">
    <view class="title">确认订单</view>

    <view class="field">
      <text class="label">用户名称</text>
      <input v-model="userName" placeholder="请输入你的名字" class="input" />
    </view>
    <view class="field">
      <text class="label">所属单位</text>
      <input v-model="userUnit" placeholder="请输入所属单位/部门" class="input" />
    </view>
    <view class="field">
      <text class="label">备注</text>
      <input v-model="note" placeholder="选填，如口味要求" class="input" />
    </view>

    <view class="summary">
      <view class="summary-title">订单明细</view>
      <view v-for="item in cart.items" :key="item.id" class="summary-row">
        <text>{{ item.name }} × {{ item.quantity }}</text>
        <text>¥{{ (item.price * item.quantity).toFixed(2) }}</text>
      </view>
      <view class="summary-total">
        <text>合计</text>
        <text>¥{{ cart.total.toFixed(2) }}</text>
      </view>
    </view>

    <view class="submit-btn" @click="submitOrder">
      <text>{{ submitting ? "提交中..." : "提交订单" }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import cart from "../../store/cart.js";
import { createOrder } from "../../api/api.js";

const userName = ref("");
const userUnit = ref(uni.getStorageSync("noodle_unit") || "");
const note = ref("");
const submitting = ref(false);

async function submitOrder() {
  if (!userName.value.trim()) { uni.showToast({ title: "请输入名字", icon: "none" }); return; }
  if (!userUnit.value.trim()) { uni.showToast({ title: "请输入所属单位", icon: "none" }); return; }
  if (!cart.items.length) { uni.showToast({ title: "购物车为空", icon: "none" }); return; }

  submitting.value = true;
  try {
    await createOrder({
      userId: "demo_user",
      userName: userName.value,
      userUnit: userUnit.value,
      note: note.value,
      items: cart.items.map(i => ({ productId: i.id, quantity: i.quantity })),
    });
    uni.setStorageSync("noodle_unit", userUnit.value);
    cart.clear();
    uni.showToast({ title: "下单成功", icon: "success" });
    setTimeout(() => uni.switchTab({ url: "/pages/order/order" }), 1500);
  } catch (e) {
    uni.showToast({ title: "下单失败: " + e.message, icon: "none" });
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.page { padding: 16px; padding-bottom: 40px; }
.title { font-size: 18px; font-weight: 700; margin-bottom: 20px; }
.field { margin-bottom: 16px; }
.label { display: block; font-size: 14px; color: #666; margin-bottom: 4px; }
.input { width: 100%; padding: 12px 14px; border: 1px solid #ddd; border-radius: 8px; font-size: 15px; background: #fff; }
.summary { background: #fff; border-radius: 12px; padding: 16px; margin: 20px 0; }
.summary-title { font-size: 14px; font-weight: 600; margin-bottom: 10px; }
.summary-row { display: flex; justify-content: space-between; font-size: 14px; color: #666; padding: 4px 0; }
.summary-total { display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; color: #f56c6c; padding-top: 10px; border-top: 1px solid #eee; margin-top: 6px; }
.submit-btn { width: 100%; background: #f56c6c; color: #fff; padding: 14px 0; border-radius: 24px; font-size: 16px; font-weight: 600; text-align: center; }
</style>