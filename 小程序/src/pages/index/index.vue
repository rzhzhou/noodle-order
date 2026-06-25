<template>
  <div class="page">
    <!-- Header -->
    <div class="header">
      <h1 class="header-title">粉面下单</h1>
      <p class="header-subtitle">精选好面，送到身边</p>
    </div>

    <div class="main-wrap">
      <!-- Left: Category Nav -->
      <div class="category-side" ref="categoryRef">
        <div
          v-for="(cat, idx) in categories"
          :key="cat"
          :class="['cat-item', { active: activeCat === cat }]"
          @click="switchCategory(cat)"
        >
          <div class="cat-dot" :class="'dot-' + (idx % 4)"></div>
          <span class="cat-name">{{ cat }}</span>
        </div>
      </div>

      <!-- Right: Product List -->
      <div class="product-side" ref="productRef">
        <div class="section-title">
          <span class="section-name">{{ activeCat }}</span>
          <span class="section-count">共 {{ products.length }} 款</span>
        </div>

        <div v-for="item in products" :key="item.id" class="food-card">
          <img class="food-img" :src="getImage(item)" :alt="item.name" />
          <div class="food-info">
            <div class="food-name">{{ item.name }}</div>
            <div class="food-desc">{{ item.description }}</div>
            <div class="food-meta">
              <span class="food-price">¥{{ item.price.toFixed(2) }}</span>
              <span class="food-unit">/{{ item.unit }}</span>
            </div>
          </div>
          <div class="food-action">
            <div v-if="getQty(item.id) > 0" class="qty-wrap">
              <button class="qty-btn" @click="decrease(item)">−</button>
              <span class="qty-num">{{ getQty(item.id) }}</span>
            </div>
            <button class="add-btn" @click="increase(item)">+</button>
          </div>
        </div>

        <div v-if="!products.length" class="empty-state">
          <span class="empty-icon">🍜</span>
          <p class="empty-text">暂无商品</p>
        </div>
      </div>
    </div>

    <!-- Cart Bar -->
    <div v-if="cart.count > 0" class="cart-bar" @click="goCart">
      <div class="cart-left">
        <div class="cart-badge-wrap">
          <span class="cart-icon">🛒</span>
          <span class="cart-badge">{{ cart.count }}</span>
        </div>
        <div class="cart-info">
          <span class="cart-total">¥{{ cart.total.toFixed(2) }}</span>
          <span class="cart-desc">另需配送费</span>
        </div>
      </div>
      <button class="cart-btn" @click="goCart">
        <span>去结算</span>
        <span class="cart-arrow">→</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { getProducts, getCategories } from "../../api/api.js";
import cart from "../../store/cart.js";

const IMAGE_MAP = {
  "红烧牛肉粉": "/static/products/01-beef-noodles.jpg",
  "酸菜鱼粉": "/static/products/02-fish-noodles.jpg",
  "香菇鸡丝粉": "/static/products/03-chicken-noodles.jpg",
  "炸酱面": "/static/products/04-zhajiang-noodles.jpg",
  "葱油拌面": "/static/products/05-scallion-noodles.jpg",
  "热干面": "/static/products/06-hot-dry-noodles.jpg",
  "卤蛋": "/static/products/07-egg.jpg",
  "豆奶": "/static/products/08-soy-milk.jpg",
};

function getImage(item) {
  return IMAGE_MAP[item.name] || "";
}

const categories = ref([]);
const activeCat = ref("");
const products = ref([]);
const allProducts = ref([]);
let pollTimer = null;

function getQty(id) {
  const i = cart.items.find((item) => item.id === id);
  return i ? i.quantity : 0;
}

function switchCategory(cat) {
  activeCat.value = cat;
  products.value = allProducts.value.filter((p) => p.category === cat);
}

function increase(p) {
  cart.addItem(p, 1);
  products.value = products.value.map((x) => x);
}
function decrease(p) {
  cart.updateQuantity(p.id, getQty(p.id) - 1);
  products.value = products.value.map((x) => x);
}
function goCart() {
  // Placeholder: navigate to cart page
  alert("前往购物车");
}

async function fetchData() {
  try {
    const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
    allProducts.value = prods;
    categories.value = cats;
    if (!activeCat.value || !cats.includes(activeCat.value)) {
      activeCat.value = cats[0] || "";
    }
    products.value = allProducts.value.filter((p) => p.category === activeCat.value);
  } catch (e) {
    console.error("同步失败:", e);
  }
}

onMounted(() => {
  fetchData();
  pollTimer = setInterval(fetchData, 30000);
});
onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer);
});
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
  overflow: hidden;
}

.header {
  padding: 40px 32px 24px;
  background: linear-gradient(135deg, #f56c6c 0%, #e63946 100%);
  color: #fff;
  flex-shrink: 0;
}
.header-title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 1px;
  margin: 0;
}
.header-subtitle {
  font-size: 13px;
  opacity: 0.85;
  margin-top: 4px;
}

.main-wrap {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.category-side {
  width: 90px;
  background: #fff;
  flex-shrink: 0;
  overflow-y: auto;
  padding: 8px 0;
}
.cat-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 14px 8px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}
.cat-item:hover { background: #fafafa; }
.cat-item.active { background: #f5f5f5; }
.cat-item.active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: #f56c6c;
  border-radius: 0 3px 3px 0;
}
.cat-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.dot-0 { background: linear-gradient(135deg, #f56c6c, #ff9a76); }
.dot-1 { background: linear-gradient(135deg, #ff9a76, #fad06c); }
.dot-2 { background: linear-gradient(135deg, #6cc3f5, #a78bfa); }
.dot-3 { background: linear-gradient(135deg, #34d399, #6ee7b7); }
.cat-name {
  font-size: 11px;
  color: #666;
  font-weight: 500;
  text-align: center;
}
.cat-item.active .cat-name {
  color: #f56c6c;
  font-weight: 600;
}

.product-side {
  flex: 1;
  padding: 10px 12px;
  overflow-y: auto;
}
.section-title {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 10px;
}
.section-name {
  font-size: 16px;
  font-weight: 700;
  color: #333;
}
.section-count {
  font-size: 12px;
  color: #999;
}

.food-card {
  background: #fff;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  transition: transform 0.15s;
  cursor: pointer;
}
.food-card:active { transform: scale(0.98); }
.food-img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  flex-shrink: 0;
  object-fit: cover;
  background: #f0f0f0;
}
.food-info { flex: 1; min-width: 0; }
.food-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}
.food-desc {
  font-size: 12px;
  color: #999;
  margin-top: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.food-meta { margin-top: 5px; }
.food-price {
  font-size: 17px;
  font-weight: 700;
  color: #f56c6c;
}
.food-unit {
  font-size: 11px;
  color: #999;
  margin-left: 2px;
}

.food-action {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
.qty-wrap { display: flex; align-items: center; gap: 6px; }
.qty-btn {
  width: 24px; height: 24px;
  border-radius: 50%;
  border: 1px solid #f56c6c;
  background: #fff;
  font-size: 14px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  color: #f56c6c;
}
.qty-num { font-size: 14px; font-weight: 600; min-width: 16px; text-align: center; }
.add-btn {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f56c6c, #e63946);
  color: #fff;
  font-size: 18px;
  border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(245, 108, 108, 0.35);
}

.empty-state { text-align: center; padding: 60px 0; }
.empty-icon { font-size: 40px; }
.empty-text { font-size: 14px; color: #999; margin-top: 8px; }

.cart-bar {
  position: fixed;
  left: 16px; right: 16px; bottom: 20px;
  background: #333;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px 8px 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  z-index: 100;
}
.cart-left { display: flex; align-items: center; gap: 8px; }
.cart-badge-wrap { position: relative; }
.cart-icon { font-size: 22px; }
.cart-badge {
  position: absolute; top: -4px; right: -6px;
  background: #f56c6c; color: #fff;
  font-size: 10px; min-width: 16px; height: 16px;
  border-radius: 10px; display: flex; align-items: center; justify-content: center;
  font-weight: 600; padding: 0 3px;
}
.cart-info { display: flex; flex-direction: column; }
.cart-total { font-size: 16px; font-weight: 700; color: #fff; }
.cart-desc { font-size: 10px; color: #999; }
.cart-btn {
  background: #f56c6c; padding: 9px 18px; border-radius: 20px;
  border: none; color: #fff; font-size: 14px; font-weight: 600;
  display: flex; align-items: center; gap: 4px; cursor: pointer;
}
.cart-arrow { font-size: 14px; }
</style>


