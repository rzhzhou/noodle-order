<template>
  <view class="page">
    <!-- Header -->
    <view class="header">
      <text class="header-title">粉面下单</text>
      <text class="header-subtitle">精选好面，送到身边</text>
    </view>

    <view class="main-wrap">
      <!-- Left: Category Nav -->
      <scroll-view class="category-side" scroll-y :scroll-into-view="'cat-' + activeCat" enhanced>
        <view
          v-for="(cat, idx) in categories"
          :key="cat"
          :id="'cat-' + cat"
          :class="['cat-item', { active: activeCat === cat }]"
          @click="switchCategory(cat)"
        >
          <view class="cat-dot" :class="'dot-' + (idx % 4)"></view>
          <text class="cat-name">{{ cat }}</text>
        </view>
      </scroll-view>

      <!-- Right: Product List -->
      <scroll-view class="product-side" scroll-y @scrolltolower="loadMore" enhanced>
        <view class="section-title">
          <text class="section-name">{{ activeCat }}</text>
          <text class="section-count">共 {{ products.length }} 款</text>
        </view>

        <view v-for="item in products" :key="item.id" class="food-card">
          <!-- Image -->
          <image
            class="food-img"
            :src="getImage(item)"
            mode="aspectFill"
            lazy-load
          />
          <!-- Info -->
          <view class="food-info">
            <text class="food-name">{{ item.name }}</text>
            <text class="food-desc">{{ item.description }}</text>
            <view class="food-meta">
              <text class="food-price">¥{{ item.price.toFixed(2) }}</text>
              <text class="food-unit">/{{ item.unit }}</text>
            </view>
          </view>
          <!-- Action -->
          <view class="food-action">
            <view v-if="getQty(item.id) > 0" class="qty-wrap">
              <view class="qty-btn" @click.stop="decrease(item)">
                <text class="qty-btn-icon">−</text>
              </view>
              <text class="qty-num">{{ getQty(item.id) }}</text>
            </view>
            <view class="add-btn" @click.stop="increase(item)">
              <text class="add-icon">+</text>
            </view>
          </view>
        </view>

        <view v-if="!products.length" class="empty-state">
          <text class="empty-icon">🍜</text>
          <text class="empty-text">暂无商品</text>
        </view>
      </scroll-view>
    </view>

    <!-- Cart Bar -->
    <view v-if="cart.count > 0" class="cart-bar" @click="goCart">
      <view class="cart-left">
        <view class="cart-badge-wrap">
          <text class="cart-icon">🛒</text>
          <text class="cart-badge">{{ cart.count }}</text>
        </view>
        <view class="cart-info">
          <text class="cart-total">¥{{ cart.total.toFixed(2) }}</text>
          <text class="cart-desc">另需配送费</text>
        </view>
      </view>
      <view class="cart-btn" @click.stop="goCart">
        <text>去结算</text>
        <text class="cart-arrow">→</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import { onShow, onHide } from "@dcloudio/uni-app";
import { getProducts, getCategories } from "../../api/api.js";
import cart from "../../store/cart.js";

// ─── Image map ──────────────────────────────────────────
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
  return IMAGE_MAP[item.name] || "/static/placeholder.jpg";
}

// ─── State ──────────────────────────────────────────────
const categories = ref([]);
const activeCat = ref("");
const products = ref([]);
const allProducts = ref([]);
let pollTimer = null;

// ─── Computed ───────────────────────────────────────────
function getQty(id) {
  const i = cart.items.find((item) => item.id === id);
  return i ? i.quantity : 0;
}

// ─── Actions ────────────────────────────────────────────
function switchCategory(cat) {
  activeCat.value = cat;
  products.value = allProducts.value.filter((p) => p.category === cat);
}

function increase(p) {
  cart.addItem(p, 1);
  // trigger reactivity
  products.value = products.value.map((x) => x);
}
function decrease(p) {
  cart.updateQuantity(p.id, getQty(p.id) - 1);
  products.value = products.value.map((x) => x);
}
function loadMore() {
  // placeholder for pagination
}
function goCart() {
  uni.switchTab({ url: "/pages/cart/cart" });
}

// ─── Data fetching ──────────────────────────────────────
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

onShow(() => {
  fetchData();
  pollTimer = setInterval(fetchData, 30000);
});
onHide(() => {
  if (pollTimer) clearInterval(pollTimer);
});
</script>

<style scoped>
/* ─── Reset ─────────────────────────────────────── */
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
  overflow: hidden;
}

/* ─── Header ────────────────────────────────────── */
.header {
  padding: 40rpx 32rpx 24rpx;
  background: linear-gradient(135deg, #f56c6c 0%, #e63946 100%);
  color: #fff;
  flex-shrink: 0;
}
.header-title {
  font-size: 44rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
}
.header-subtitle {
  font-size: 26rpx;
  opacity: 0.85;
  margin-top: 8rpx;
  display: block;
}

/* ─── Main Layout ───────────────────────────────── */
.main-wrap {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* ─── Left Sidebar ──────────────────────────────── */
.category-side {
  width: 180rpx;
  background: #fff;
  flex-shrink: 0;
  padding: 16rpx 0;
}
.cat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28rpx 16rpx;
  position: relative;
  transition: all 0.2s;
}
.cat-item.active {
  background: #f5f5f5;
}
.cat-item.active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6rpx;
  height: 40rpx;
  background: #f56c6c;
  border-radius: 0 6rpx 6rpx 0;
}
.cat-dot {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  margin-bottom: 8rpx;
}
.dot-0 { background: linear-gradient(135deg, #f56c6c, #ff9a76); }
.dot-1 { background: linear-gradient(135deg, #ff9a76, #fad06c); }
.dot-2 { background: linear-gradient(135deg, #6cc3f5, #a78bfa); }
.dot-3 { background: linear-gradient(135deg, #34d399, #6ee7b7); }
.cat-name {
  font-size: 22rpx;
  color: #666;
  font-weight: 500;
  text-align: center;
}
.cat-item.active .cat-name {
  color: #f56c6c;
  font-weight: 600;
}

/* ─── Right Product Panel ───────────────────────── */
.product-side {
  flex: 1;
  padding: 20rpx 24rpx;
}
.section-title {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 20rpx;
}
.section-name {
  font-size: 32rpx;
  font-weight: 700;
  color: #333;
}
.section-count {
  font-size: 24rpx;
  color: #999;
}

/* ─── Food Card ─────────────────────────────────── */
.food-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
  transition: transform 0.15s;
}
.food-card:active {
  transform: scale(0.98);
}
.food-img {
  width: 160rpx;
  height: 160rpx;
  border-radius: 16rpx;
  flex-shrink: 0;
  background: #f0f0f0;
}
.food-info {
  flex: 1;
  min-width: 0;
}
.food-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  display: block;
  line-height: 1.4;
}
.food-desc {
  font-size: 24rpx;
  color: #999;
  margin-top: 6rpx;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.food-meta {
  margin-top: 10rpx;
  display: flex;
  align-items: baseline;
}
.food-price {
  font-size: 34rpx;
  font-weight: 700;
  color: #f56c6c;
}
.food-unit {
  font-size: 22rpx;
  color: #999;
  margin-left: 4rpx;
}
.food-action {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

/* ─── Qty Controls ──────────────────────────────── */
.qty-wrap {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.qty-btn {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  border: 2rpx solid #f56c6c;
  display: flex;
  align-items: center;
  justify-content: center;
}
.qty-btn-icon {
  font-size: 32rpx;
  color: #f56c6c;
  font-weight: 700;
}
.qty-num {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  min-width: 32rpx;
  text-align: center;
}
.add-btn {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #f56c6c, #e63946);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(245, 108, 108, 0.35);
}
.add-icon {
  font-size: 40rpx;
  color: #fff;
  font-weight: 300;
  line-height: 1;
}

/* ─── Empty ─────────────────────────────────────── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;
}
.empty-icon { font-size: 80rpx; }
.empty-text { font-size: 28rpx; color: #999; margin-top: 16rpx; }

/* ─── Cart Bar ──────────────────────────────────── */
.cart-bar {
  position: fixed;
  left: 32rpx;
  right: 32rpx;
  bottom: 40rpx;
  background: #333;
  border-radius: 50rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 20rpx 16rpx 16rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.15);
  z-index: 100;
}
.cart-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.cart-badge-wrap {
  position: relative;
}
.cart-icon { font-size: 44rpx; }
.cart-badge {
  position: absolute;
  top: -8rpx;
  right: -12rpx;
  background: #f56c6c;
  color: #fff;
  font-size: 20rpx;
  min-width: 32rpx;
  height: 32rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  padding: 0 6rpx;
}
.cart-info { display: flex; flex-direction: column; }
.cart-total {
  font-size: 32rpx;
  font-weight: 700;
  color: #fff;
}
.cart-desc { font-size: 20rpx; color: #999; }
.cart-btn {
  background: #f56c6c;
  padding: 18rpx 36rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #fff;
}
.cart-arrow { font-size: 28rpx; }
</style>