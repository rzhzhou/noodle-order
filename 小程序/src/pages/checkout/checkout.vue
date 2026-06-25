<template>
  <div class="page">
    <h2 class="title">确认订单</h2>

    <div class="field">
      <label>用户名称</label>
      <input v-model="userName" placeholder="请输入你的名字" />
    </div>
    <div class="field">
      <label>所属单位</label>
      <input v-model="userUnit" placeholder="请输入所属单位/部门" />
    </div>
    <div class="field">
      <label>备注</label>
      <input v-model="note" placeholder="选填，如口味要求" />
    </div>

    <div class="summary">
      <div class="summary-title">订单明细</div>
      <div v-for="item in cart.items" :key="item.id" class="summary-row">
        <span>{{ item.name }} × {{ item.quantity }}</span>
        <span>¥{{ (item.price * item.quantity).toFixed(2) }}</span>
      </div>
      <div class="summary-total">
        <span>合计</span>
        <span>¥{{ cart.total.toFixed(2) }}</span>
      </div>
    </div>

    <button class="submit-btn" @click="submitOrder" :disabled="submitting">
      {{ submitting ? "提交中..." : "提交订单" }}
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import cart from "../../store/cart.js";
import { createOrder } from "../../api/api.js";

const router = useRouter();
const userName = ref("");
const userUnit = ref(localStorage.getItem("noodle_unit") || "");
const note = ref("");
const submitting = ref(false);

async function submitOrder() {
  if (!userName.value.trim()) { alert("请输入名字"); return; }
  if (!userUnit.value.trim()) { alert("请输入所属单位"); return; }
  if (!cart.items.length) { alert("购物车为空"); return; }

  submitting.value = true;
  try {
    await createOrder({
      userId: "demo_user",
      userName: userName.value,
      userUnit: userUnit.value,
      note: note.value,
      items: cart.items.map((i) => ({ productId: i.id, quantity: i.quantity })),
    });
    localStorage.setItem("noodle_unit", userUnit.value);
    cart.clear();
    alert("下单成功！");
    router.push("/order");
  } catch (e) {
    alert("下单失败：" + e.message);
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.page { padding: 16px; padding-bottom: 40px; }
.title { font-size: 18px; font-weight: 700; margin-bottom: 20px; }
.field { margin-bottom: 16px; }
.field label { display: block; font-size: 14px; color: #666; margin-bottom: 4px; }
.field input {
  width: 100%; padding: 12px 14px; border: 1px solid #ddd; border-radius: 8px;
  font-size: 15px; box-sizing: border-box; background: #fff;
}
.summary { background: #fff; border-radius: 12px; padding: 16px; margin: 20px 0; }
.summary-title { font-size: 14px; font-weight: 600; margin-bottom: 10px; }
.summary-row { display: flex; justify-content: space-between; font-size: 14px; color: #666; padding: 4px 0; }
.summary-total { display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; color: #f56c6c; padding-top: 10px; border-top: 1px solid #eee; margin-top: 6px; }
.submit-btn {
  width: 100%; background: #f56c6c; color: #fff; border: none;
  padding: 14px; border-radius: 24px; font-size: 16px; font-weight: 600; cursor: pointer;
}
.submit-btn:disabled { opacity: 0.6; }
</style>