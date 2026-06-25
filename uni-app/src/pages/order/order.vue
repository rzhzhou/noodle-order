<template>
  <view class="page">
    <view v-if="!loading && !orders.length" class="empty">
      <view style="font-size:60px;margin-bottom:12px">📋</view>
      <view>暂无订单</view>
    </view>
    <view v-else>
      <view v-for="order in orders" :key="order.id" class="card">
        <view class="card-header">
          <text style="font-weight:600">订单 #{{ order.id }}</text>
          <text :class="['badge', order.status]">{{ statusMap[order.status] || order.status }}</text>
        </view>
        <view class="card-items">
          <view v-for="(item, idx) in order.items" :key="idx" class="row">
            <text>{{ item.productName }} × {{ item.quantity }}</text>
            <text>¥{{ (item.subtotal || 0).toFixed(2) }}</text>
          </view>
        </view>
        <view class="card-footer">
          <text style="color:#999;font-size:12px">{{ order.userUnit || "-" }}</text>
          <text style="color:#f56c6c;font-weight:700;font-size:16px">¥{{ (order.totalAmount || 0).toFixed(2) }}</text>
        </view>
      </view>
    </view>
    <view v-if="loading" class="loading">加载中...</view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { getUserOrders } from "../../api/api.js";

const orders = ref([]);
const loading = ref(true);
const statusMap = { pending: "待确认", confirmed: "已确认", completed: "已完成", cancelled: "已取消" };

async function load() {
  loading.value = true;
  try { orders.value = await getUserOrders("demo_user") || []; }
  catch (e) { console.error(e); }
  finally { loading.value = false; }
}

onShow(() => { load(); });
</script>

<style scoped>
.page { padding: 12px 16px 80rpx; }
.empty { text-align: center; padding: 100px 0; color: #333; font-size: 15px; }
.card { background: #fff; border-radius: 12px; padding: 16px; margin-bottom: 12px; }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.badge { font-size: 12px; padding: 2px 12px; border-radius: 12px; }
.badge.pending { background: #fff3e0; color: #f57c00; }
.badge.confirmed { background: #e8f5e9; color: #388e3c; }
.card-items { border-top: 1px solid #f0f0f0; padding: 8px 0; }
.row { display: flex; justify-content: space-between; font-size: 14px; color: #666; padding: 4px 0; }
.card-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f0f0f0; padding-top: 10px; }
.loading { text-align: center; color: #999; padding: 40px 0; }
</style>