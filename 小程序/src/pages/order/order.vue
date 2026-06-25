<template>
  <div class="page">
    <div v-if="!loading && !orders.length" class="empty">
      <div style="font-size:60px;margin-bottom:12px">📋</div>
      <div>暂无订单</div>
    </div>
    <div v-else>
      <div v-for="order in orders" :key="order.id" class="card">
        <div class="card-header">
          <span style="font-weight:600">订单 #{{ order.id }}</span>
          <span :class="['badge', order.status]">{{ statusMap[order.status] || order.status }}</span>
        </div>
        <div class="card-items">
          <div v-for="item in order.items" :key="item.id" class="row">
            <span>{{ item.productName }} × {{ item.quantity }}</span>
            <span>¥{{ item.subtotal?.toFixed(2) }}</span>
          </div>
        </div>
        <div class="card-footer">
          <span style="color:#999;font-size:12px">{{ order.userUnit || "—" }}</span>
          <span style="color:#f56c6c;font-weight:700;font-size:16px">¥{{ order.totalAmount?.toFixed(2) }}</span>
        </div>
      </div>
    </div>
    <div v-if="loading" class="empty" style="padding:40px 0;color:#999">加载中...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getUserOrders } from "../../api/api.js";

const orders = ref([]);
const loading = ref(true);
const statusMap = { pending: "待确认", confirmed: "已确认", completed: "已完成", cancelled: "已取消" };

onMounted(async () => {
  try { orders.value = await getUserOrders("demo_user"); }
  catch (e) { console.error(e); }
  finally { loading.value = false; }
});
</script>

<style scoped>
.page { padding: 12px 16px 80px; }
.empty { text-align: center; padding: 100px 0; color: #333; font-size: 15px; }
.card { background: #fff; border-radius: 12px; padding: 16px; margin-bottom: 12px; }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.badge { font-size: 12px; padding: 2px 12px; border-radius: 12px; }
.badge.pending { background: #fff3e0; color: #f57c00; }
.badge.confirmed { background: #e8f5e9; color: #388e3c; }
.card-items { border-top: 1px solid #f0f0f0; padding: 8px 0; }
.row { display: flex; justify-content: space-between; font-size: 14px; color: #666; padding: 4px 0; }
.card-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f0f0f0; padding-top: 10px; }
</style>