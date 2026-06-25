<template>
  <div class="page">
    <!-- Pull-to-refresh hint -->
    <div class="refresh-bar" v-if="refreshing">
      <span class="refresh-spinner"></span>
      <span>同步中...</span>
    </div>
    <div class="refresh-bar muted" v-else>
      <span>{{ lastSyncText }}</span>
      <span class="refresh-link" @click="refreshData">↻ 刷新</span>
    </div>

    <!-- Category tabs -->
    <div class="tabs">
      <span
        v-for="cat in categories"
        :key="cat"
        :class="['tab', { active: currentCat === cat }]"
        @click="switchCategory(cat)"
      >{{ cat }}</span>
    </div>

    <!-- Products -->
    <div class="product-list">
      <div v-for="item in products" :key="item.id" class="card">
        <div class="card-body">
          <div class="card-name">{{ item.name }}</div>
          <div class="card-desc">{{ item.description }}</div>
          <div class="card-price">¥{{ item.price?.toFixed(2) }}</div>
        </div>
        <div class="card-action">
          <div v-if="getQty(item.id) > 0" class="qty-wrap">
            <button class="qty-btn" @click="decrease(item)">−</button>
            <span class="qty-num">{{ getQty(item.id) }}</span>
          </div>
          <button class="add-btn" @click="increase(item)">+ 加入</button>
        </div>
      </div>
    </div>

    <div v-if="!products.length" class="empty">暂无商品</div>

    <!-- Floating bar -->
    <div v-if="cart.count > 0" class="cart-bar" @click="$router.push('/cart')">
      <div class="bar-left">
        <span class="bar-icon">🛒</span>
        <span class="bar-badge">{{ cart.count }}</span>
        <span class="bar-total">合计 ¥{{ cart.total.toFixed(2) }}</span>
      </div>
      <span class="bar-btn">去结算 →</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { getProducts, getCategories } from "../../api/api.js";
import cart from "../../store/cart.js";

const categories = ref(["全部"]);
const currentCat = ref("全部");
const products = ref([]);
const allProducts = ref([]);
const refreshing = ref(false);
const lastSync = ref(null);

const lastSyncText = computed(() => {
  if (!lastSync.value) return "暂无数据";
  const t = new Date(lastSync.value);
  return `同步于 ${t.getHours().toString().padStart(2,"0")}:${t.getMinutes().toString().padStart(2,"0")}:${t.getSeconds().toString().padStart(2,"0")}`;
});

let pollTimer = null;

function getQty(id) {
  const item = cart.items.find((i) => i.id === id);
  return item ? item.quantity : 0;
}
function increase(p) { cart.addItem(p, 1); products.value = [...products.value]; }
function decrease(p) { cart.updateQuantity(p.id, getQty(p.id) - 1); products.value = [...products.value]; }
function switchCategory(cat) {
  currentCat.value = cat;
  products.value = cat === "全部" ? [...allProducts.value] : allProducts.value.filter((p) => p.category === cat);
}

async function fetchData() {
  try {
    const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
    allProducts.value = prods;
    categories.value = ["全部", ...cats];
    currentCat.value = "全部";
    products.value = [...prods];
    lastSync.value = Date.now();
  } catch (e) {
    console.error("同步失败:", e);
  }
}

async function refreshData() {
  if (refreshing.value) return;
  refreshing.value = true;
  await fetchData();
  refreshing.value = false;
}

onMounted(async () => {
  await fetchData();
  // Auto-poll every 30 seconds to stay in sync with admin
  pollTimer = setInterval(fetchData, 30000);
  // Listen for page visibility changes (user switching tabs back)
  document.addEventListener("visibilitychange", onVisibilityChange);
});

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer);
  document.removeEventListener("visibilitychange", onVisibilityChange);
});

function onVisibilityChange() {
  if (document.visibilityState === "visible") {
    fetchData();
  }
}
</script>

<style scoped>
.page { padding: 12px 16px 80px; }
.refresh-bar {
  display: flex; justify-content: space-between; align-items: center;
  padding: 6px 4px 0; font-size: 12px; color: #999;
}
.refresh-bar.muted { color: #bbb; }
.refresh-link { color: #f56c6c; cursor: pointer; }
.refresh-spinner {
  width: 14px; height: 14px; border: 2px solid #f56c6c;
  border-top-color: transparent; border-radius: 50%;
  display: inline-block; animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.tabs { display: flex; gap: 8px; overflow-x: auto; padding: 8px 0; margin-bottom: 12px; }
.tab { padding: 6px 18px; border-radius: 20px; font-size: 14px; color: #666; background: #fff; white-space: nowrap; cursor: pointer; }
.tab.active { background: #f56c6c; color: #fff; }
.card { background: #fff; border-radius: 12px; padding: 16px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; }
.card-name { font-size: 16px; font-weight: 600; color: #333; }
.card-desc { font-size: 12px; color: #999; margin: 4px 0; }
.card-price { font-size: 18px; color: #f56c6c; font-weight: 700; }
.card-action { display: flex; align-items: center; gap: 8px; }
.qty-wrap { display: flex; align-items: center; gap: 8px; }
.qty-btn { width: 28px; height: 28px; border-radius: 50%; border: 1px solid #ddd; background: #fff; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.qty-num { font-size: 14px; font-weight: 600; min-width: 24px; text-align: center; }
.add-btn { background: #f56c6c; color: #fff; border: none; padding: 6px 16px; border-radius: 20px; font-size: 13px; cursor: pointer; }
.empty { text-align: center; color: #999; padding: 80px 0; font-size: 14px; }
.cart-bar {
  position: fixed; bottom: 70px; left: 50%; transform: translateX(-50%); max-width: 450px; width: calc(100% - 32px);
  background: #333; color: #fff; border-radius: 28px; padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; z-index: 100;
}
.bar-left { display: flex; align-items: center; gap: 8px; }
.bar-icon { font-size: 20px; }
.bar-badge { background: #f56c6c; color: #fff; font-size: 11px; padding: 1px 7px; border-radius: 10px; }
.bar-total { font-size: 14px; }
.bar-btn { background: #f56c6c; padding: 8px 20px; border-radius: 20px; font-size: 14px; }
</style>