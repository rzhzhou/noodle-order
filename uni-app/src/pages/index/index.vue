<template>
  <view class="page">
    <view class="refresh-bar" v-if="refreshing">
      <text>同步中...</text>
    </view>
    <view class="refresh-bar muted" v-else>
      <text>{{ lastSyncText }}</text>
      <text class="refresh-link" @click="refreshData">刷新</text>
    </view>
    <scroll-view class="tabs" scroll-x>
      <view v-for="cat in categories" :key="cat" :class="['tab', { active: currentCat === cat }]" @click="switchCategory(cat)">
        <text>{{ cat }}</text>
      </view>
    </scroll-view>
    <view class="product-list">
      <view v-for="item in products" :key="item.id" class="card">
        <view class="card-body">
          <text class="card-name">{{ item.name }}</text>
          <text class="card-desc">{{ item.description }}</text>
          <text class="card-price">¥{{ item.price.toFixed(2) }}</text>
        </view>
        <view class="card-action">
          <view v-if="getQty(item.id) > 0" class="qty-wrap">
            <view class="qty-btn" @click="decrease(item)">-</view>
            <text class="qty-num">{{ getQty(item.id) }}</text>
          </view>
          <view class="add-btn" @click="increase(item)">+ 加入</view>
        </view>
      </view>
    </view>
    <view v-if="!products.length" class="empty"><text>暂无商品</text></view>
    <view v-if="cart.count > 0" class="cart-bar" @click="goCart">
      <view class="bar-left">
        <text>🛒 {{ cart.count }}</text>
        <text class="bar-total">合计 ¥{{ cart.total.toFixed(2) }}</text>
      </view>
      <text class="bar-btn">去结算 →</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import { onShow, onHide } from "@dcloudio/uni-app";
import { getProducts, getCategories } from "../../api/api.js";
import cart from "../../store/cart.js";

const categories = ref(["全部"]);
const currentCat = ref("全部");
const products = ref([]);
const allProducts = ref([]);
const refreshing = ref(false);
const lastSync = ref(null);
let pollTimer = null;

const lastSyncText = computed(() => {
  if (!lastSync.value) return "暂无数据";
  const t = new Date(lastSync.value);
  return "同步于 " + [t.getHours(), t.getMinutes(), t.getSeconds()].map(v => String(v).padStart(2,"0")).join(":");
});

function getQty(id) {
  const i = cart.items.find(item => item.id === id);
  return i ? i.quantity : 0;
}
function increase(p) { cart.addItem(p, 1); products.value = [...products.value]; }
function decrease(p) { cart.updateQuantity(p.id, getQty(p.id) - 1); products.value = [...products.value]; }

function switchCategory(cat) {
  currentCat.value = cat;
  products.value = cat === "全部" ? [...allProducts.value] : allProducts.value.filter(p => p.category === cat);
}

async function fetchData() {
  try {
    const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
    allProducts.value = prods;
    categories.value = ["全部", ...cats];
    if (currentCat.value === "全部" || !cats.includes(currentCat.value)) {
      currentCat.value = "全部";
      products.value = [...prods];
    } else {
      products.value = allProducts.value.filter(p => p.category === currentCat.value);
    }
    lastSync.value = Date.now();
  } catch (e) { console.error("同步失败:", e); }
}

async function refreshData() {
  if (refreshing.value) return;
  refreshing.value = true;
  await fetchData();
  refreshing.value = false;
}

onShow(() => { fetchData(); pollTimer = setInterval(fetchData, 30000); });
onHide(() => { if (pollTimer) clearInterval(pollTimer); });

function goCart() { uni.switchTab({ url: "/pages/cart/cart" }); }
</script>

<style scoped>
.page { padding: 12px 16px 80rpx; }
.refresh-bar { display: flex; justify-content: space-between; padding: 6px 4px; font-size: 12px; color: #999; }
.muted { color: #bbb; }
.refresh-link { color: #f56c6c; }
.tabs { display: flex; gap: 8px; padding: 8px 0; margin-bottom: 12px; white-space: nowrap; }
.tab { display: inline-block; padding: 6px 18px; border-radius: 20px; font-size: 14px; color: #666; background: #fff; margin-right: 8px; }
.tab.active { background: #f56c6c; color: #fff; }
.card { background: #fff; border-radius: 12px; padding: 16px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; }
.card-name { font-size: 16px; font-weight: 600; color: #333; display: block; }
.card-desc { font-size: 12px; color: #999; margin: 4px 0; display: block; }
.card-price { font-size: 18px; color: #f56c6c; font-weight: 700; display: block; }
.qty-btn { width: 28px; height: 28px; border-radius: 50%; border: 1px solid #ddd; background: #fff; font-size: 16px; display: flex; align-items: center; justify-content: center; }
.qty-num { font-size: 14px; font-weight: 600; min-width: 24px; text-align: center; margin: 0 8px; }
.add-btn { background: #f56c6c; color: #fff; padding: 6px 16px; border-radius: 20px; font-size: 13px; }
.empty { text-align: center; color: #999; padding: 80px 0; font-size: 14px; }
.cart-bar { position: fixed; bottom: 110rpx; left: 16px; right: 16px; background: #333; color: #fff; border-radius: 28px; padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; }
.bar-btn { background: #f56c6c; padding: 8px 20px; border-radius: 20px; font-size: 14px; }
</style>