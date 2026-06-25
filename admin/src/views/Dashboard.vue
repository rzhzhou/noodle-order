<template>
  <div>
    <h2 class="page-title">📊 数据概览</h2>

    <el-row :gutter="16" style="margin-bottom: 24px;">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="num">{{ stats.totalOrders }}</div>
            <div class="lbl">总订单数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="num" style="color:#f56c6c">{{ stats.pendingOrders }}</div>
            <div class="lbl">待处理订单</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="num" style="color:#67c23a">{{ stats.totalProducts }}</div>
            <div class="lbl">商品总数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="num" style="color:#409eff">¥{{ stats.totalRevenue?.toFixed(2) }}</div>
            <div class="lbl">总营收</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header><span>各单位下单统计</span></template>
          <el-table :data="stats.unitStats || []" stripe size="small" style="width:100%">
            <el-table-column prop="unit" label="单位" />
            <el-table-column prop="orderCount" label="订单数" />
            <el-table-column prop="totalAmount" label="总金额">
              <template #default="{ row }">¥{{ row.totalAmount?.toFixed(2) }}</template>
            </el-table-column>
          </el-table>
          <div v-if="!stats.unitStats?.length" class="empty-hint">暂无数据</div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header><span>分类销售统计</span></template>
          <el-table :data="stats.categoryStats || []" stripe size="small" style="width:100%">
            <el-table-column prop="category" label="分类" />
            <el-table-column prop="quantity" label="销量" />
            <el-table-column prop="amount" label="销售额">
              <template #default="{ row }">¥{{ row.amount?.toFixed(2) }}</template>
            </el-table-column>
          </el-table>
          <div v-if="!stats.categoryStats?.length" class="empty-hint">暂无数据</div>
        </el-card>
      </el-col>
    </el-row>
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
.stat-card { text-align: center; padding: 4px 0; }
.num { font-size: 28px; font-weight: 700; color: #333; }
.lbl { font-size: 13px; color: #999; margin-top: 6px; }
.empty-hint { color: #ccc; font-size: 13px; text-align: center; padding: 20px 0; }
</style>