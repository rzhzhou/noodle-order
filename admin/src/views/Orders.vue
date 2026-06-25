<template>
  <div>
    <h2 class="page-title">📋 订单管理</h2>

    <div class="card">
      <table class="table" v-if="orders.length">
        <thead>
          <tr>
            <th>ID</th><th>下单人</th><th>单位</th><th>商品</th>
            <th>金额</th><th>状态</th><th>备注</th><th>时间</th><th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>#{{ order.id }}</td>
            <td>{{ order.userName || order.userId }}</td>
            <td><span class="tag">{{ order.userUnit }}</span></td>
            <td>
              <div v-for="item in order.items" :key="item.id" class="item-line">
                {{ item.productName }} × {{ item.quantity }}
              </div>
            </td>
            <td class="price">¥{{ order.totalAmount?.toFixed(2) }}</td>
            <td>
              <span :class="['badge', order.status]">{{ statusMap[order.status] || order.status }}</span>
            </td>
            <td class="note">{{ order.note || "-" }}</td>
            <td class="time">{{ formatTime(order.createdAt) }}</td>
            <td class="actions">
              <button v-if="order.status === 'pending'" class="btn-confirm" @click="confirmOrder(order)">确认</button>
              <button v-if="order.status === 'pending'" class="btn-cancel" @click="cancelOrder(order)">取消</button>
              <span v-else class="done">-</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-hint">暂无订单</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { get, put } from "../api/index.js";

const orders = ref([]);
const statusMap = { pending: "待确认", confirmed: "已确认", completed: "已完成", cancelled: "已取消" };

function formatTime(t) {
  if (!t) return "-";
  return new Date(t).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

async function load() {
  try { orders.value = await get("/orders") || []; }
  catch (e) { console.error(e); }
}

async function confirmOrder(order) {
  try {
    await put("/orders/" + order.id + "/status", { status: "confirmed" });
    await load();
  } catch (e) { alert("操作失败"); }
}

async function cancelOrder(order) {
  if (!confirm("确定取消该订单？")) return;
  try {
    await put("/orders/" + order.id + "/status", { status: "cancelled" });
    await load();
  } catch (e) { alert("操作失败"); }
}

onMounted(load);
</script>

<style scoped>
.page-title { font-size: 22px; margin-bottom: 16px; }
.card { background: #fff; border-radius: 12px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.table { width: 100%; border-collapse: collapse; font-size: 13px; }
.table th, .table td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #f0f0f0; }
.table th { color: #999; font-weight: 500; background: #fafafa; white-space: nowrap; }
.tag { background: #f0f9ff; color: #409eff; padding: 2px 10px; border-radius: 10px; font-size: 12px; white-space: nowrap; }
.price { color: #f56c6c; font-weight: 700; }
.note { max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #999; }
.time { white-space: nowrap; color: #999; font-size: 12px; }
.badge { padding: 2px 10px; border-radius: 10px; font-size: 12px; white-space: nowrap; }
.badge.pending { background: #fff3e0; color: #f57c00; }
.badge.confirmed { background: #e8f5e9; color: #388e3c; }
.badge.cancelled { background: #fce4ec; color: #c62828; }
.badge.completed { background: #e3f2fd; color: #1976d2; }
.actions { display: flex; gap: 6px; }
.btn-confirm { padding: 4px 12px; background: #67c23a; color: #fff; border: none; border-radius: 6px; font-size: 12px; cursor: pointer; }
.btn-cancel { padding: 4px 12px; background: #f56c6c; color: #fff; border: none; border-radius: 6px; font-size: 12px; cursor: pointer; }
.done { color: #ccc; font-size: 12px; }
.item-line { padding: 2px 0; }
.empty-hint { color: #ccc; text-align: center; padding: 40px 0; font-size: 14px; }
</style>