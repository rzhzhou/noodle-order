<template>
  <div>
    <h2 class="page-title">📊 数据概览</h2>

    <div class="stat-cards">
      <div class="stat-card"><div class="num">{{ stats.totalOrders }}</div><div class="lbl">总订单数</div></div>
      <div class="stat-card"><div class="num" style="color:#f56c6c">{{ stats.pendingOrders }}</div><div class="lbl">待处理订单</div></div>
      <div class="stat-card"><div class="num" style="color:#67c23a">{{ stats.totalProducts }}</div><div class="lbl">商品总数</div></div>
      <div class="stat-card"><div class="num" style="color:#409eff">¥{{ stats.totalRevenue?.toFixed(2) }}</div><div class="lbl">总营收</div></div>
    </div>

    <div class="grid-2">
      <!-- Unit Stats -->
      <div class="card">
        <h3>各单位下单统计</h3>
        <table v-if="stats.unitStats?.length" class="table">
          <thead><tr><th>单位</th><th>订单数</th><th>总金额</th></tr></thead>
          <tbody>
            <tr v-for="u in stats.unitStats" :key="u.unit">
              <td>{{ u.unit }}</td><td>{{ u.orderCount }}</td><td>¥{{ u.totalAmount?.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else class="empty-hint">暂无数据</div>
      </div>

      <!-- Category Stats -->
      <div class="card">
        <h3>分类销售统计</h3>
        <table v-if="stats.categoryStats?.length" class="table">
          <thead><tr><th>分类</th><th>销量</th><th>销售额</th></tr></thead>
          <tbody>
            <tr v-for="c in stats.categoryStats" :key="c.category">
              <td>{{ c.category }}</td><td>{{ c.quantity }}</td><td>¥{{ c.amount?.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else class="empty-hint">暂无数据</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { get } from "../api/index.js";

const stats = ref({});

onMounted(async () => {
  try { stats.value = await get("/dashboard") || {}; }
  catch (e) { console.error(e); }
});
</script>

<style scoped>
.page-title { font-size: 22px; margin-bottom: 20px; }
.stat-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.stat-card { background: #fff; border-radius: 12px; padding: 20px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.num { font-size: 28px; font-weight: 700; color: #333; }
.lbl { font-size: 13px; color: #999; margin-top: 6px; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.card { background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.card h3 { font-size: 15px; margin-bottom: 12px; }
.table { width: 100%; border-collapse: collapse; font-size: 13px; }
.table th, .table td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #f0f0f0; }
.table th { color: #999; font-weight: 500; }
.empty-hint { color: #ccc; font-size: 13px; text-align: center; padding: 30px 0; }
</style>