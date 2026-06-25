<template>
  <div>
    <h2 class="page-title">📋 订单管理</h2>

    <el-card shadow="hover">
      <el-table :data="orders" stripe size="small" style="width:100%">
        <el-table-column prop="id" label="ID" width="60">
          <template #default="{ row }">#{{ row.id }}</template>
        </el-table-column>
        <el-table-column label="下单人" width="100">
          <template #default="{ row }">{{ row.userName || row.userId }}</template>
        </el-table-column>
        <el-table-column label="单位" width="100">
          <template #default="{ row }">
            <el-tag>{{ row.userUnit }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="商品" min-width="160">
          <template #default="{ row }">
            <div v-for="item in row.items" :key="item.id" class="item-line">
              {{ item.productName }} × {{ item.quantity }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="金额" width="90">
          <template #default="{ row }">
            <span class="price">¥{{ row.totalAmount?.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)" size="small">
              {{ statusMap[row.status] || row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="备注" width="120">
          <template #default="{ row }">{{ row.note || "-" }}</template>
        </el-table-column>
        <el-table-column label="时间" width="100">
          <template #default="{ row }">{{ formatTime(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template #default="{ row }">
            <template v-if="row.status === 'pending'">
              <el-button size="small" type="success" @click="confirmOrder(row)">确认</el-button>
              <el-button size="small" type="danger" @click="cancelOrder(row)">取消</el-button>
            </template>
            <span v-else class="done">-</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { get, put } from "../api/index.js";
import { ElMessage } from "element-plus";

const orders = ref([]);
const statusMap = { pending: "待确认", confirmed: "已确认", completed: "已完成", cancelled: "已取消" };
const statusType = (s) => ({ pending: "warning", confirmed: "success", completed: "primary", cancelled: "info" }[s] || "");

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
    ElMessage.success("已确认");
    await load();
  } catch (e) { ElMessage.error("操作失败"); }
}

async function cancelOrder(order) {
  try {
    await put("/orders/" + order.id + "/status", { status: "cancelled" });
    ElMessage.success("已取消");
    await load();
  } catch (e) { ElMessage.error("操作失败"); }
}

onMounted(load);
</script>

<style scoped>
.page-title { font-size: 22px; margin-bottom: 16px; }
.price { color: #f56c6c; font-weight: 700; }
.item-line { padding: 2px 0; }
.done { color: #ccc; font-size: 12px; }
</style>