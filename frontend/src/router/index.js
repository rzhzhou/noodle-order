import { createRouter, createWebHashHistory } from "vue-router";

import Index from "../pages/index/index.vue";
import Cart from "../pages/cart/cart.vue";
import Order from "../pages/order/order.vue";
import Profile from "../pages/profile/profile.vue";

const routes = [
  { path: "/", redirect: "/index" },
  { path: "/index", component: Index, meta: { title: "首页" } },
  { path: "/cart", component: Cart, meta: { title: "购物车" } },
  { path: "/order", component: Order, meta: { title: "订单" } },
  { path: "/profile", component: Profile, meta: { title: "我的" } },
  { path: "/checkout", component: () => import("../pages/checkout/checkout.vue"), meta: { title: "确认下单" } },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;