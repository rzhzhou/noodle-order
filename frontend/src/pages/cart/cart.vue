<template>
  <div class="page">
    <div v-if="!cart.items.length" class="empty">
      <div style="font-size:60px;margin-bottom:12px">🛒</div>
      <div>购物车是空的</div>
      <div style="font-size:13px;color:#999;margin-top:6px">去首页挑选商品吧</div>
    </div>

    <div v-else class="list">
      <div v-for="item in cart.items" :key="item.id" class="item">
        <div class="info">
          <div class="name">{{ item.name }}</div>
          <div class="price">¥{{ (item.price * item.quantity).toFixed(2) }}</div>
        </div>
        <div class="qty">
          <button class="qty-btn" @click="decrease(item)">−</button>
          <span class="num">{{ item.quantity }}</span>
          <button class="qty-btn" @click="increase(item)">+</button>
        </div>
      </div>
    </div>

    <div v-if="cart.items.length" class="bottom-bar">
      <div>
        <span style="color:#fff;font-size:13px">合计：</span>
        <span style="color:#ff6b6b;font-size:20px;font-weight:700">¥{{ cart.total.toFixed(2) }}</span>
      </div>
      <div style="display:flex;gap:12px">
        <button class="clear-btn" @click="clearCart">清空</button>
        <button class="submit-btn" @click="goCheckout">去下单</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import cart from "../../store/cart.js";

const router = useRouter();
const trigger = ref(0);
function refresh() { trigger.value++; }
function increase(item) { cart.addItem(item, 1); refresh(); }
function decrease(item) { cart.updateQuantity(item.id, item.quantity - 1); refresh(); }
function clearCart() { if (confirm("确定清空购物车？")) { cart.clear(); refresh(); } }
function goCheckout() { router.push("/checkout"); }
</script>

<style scoped>
.page { padding: 12px 16px 80px; }
.empty { text-align: center; padding: 100px 0; color: #333; font-size: 15px; }
.list { }
.item { background: #fff; border-radius: 12px; padding: 16px; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; }
.name { font-size: 15px; font-weight: 600; }
.price { font-size: 17px; color: #f56c6c; font-weight: 700; margin-top: 4px; }
.qty { display: flex; align-items: center; gap: 10px; }
.qty-btn { width: 28px; height: 28px; border-radius: 50%; border: 1px solid #ddd; background: #fff; font-size: 16px; cursor: pointer; }
.num { font-size: 14px; font-weight: 600; min-width: 24px; text-align: center; }
.bottom-bar {
  position: fixed; bottom: 70px; left: 50%; transform: translateX(-50%); max-width: 450px; width: calc(100% - 32px);
  background: #333; border-radius: 28px; padding: 14px 20px; display: flex; align-items: center; justify-content: space-between;
}
.clear-btn { color: #ccc; background: none; border: none; font-size: 13px; cursor: pointer; padding: 8px 12px; }
.submit-btn { background: #f56c6c; color: #fff; border: none; padding: 10px 28px; border-radius: 20px; font-size: 14px; cursor: pointer; }
</style>