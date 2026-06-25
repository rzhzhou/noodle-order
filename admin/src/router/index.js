import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  { path: "/login", component: () => import("../views/Login.vue"), meta: { noLayout: true } },
  { path: "/", component: () => import("../views/Dashboard.vue") },
  { path: "/products", component: () => import("../views/Products.vue") },
  { path: "/orders", component: () => import("../views/Orders.vue") },
];

const router = createRouter({ history: createWebHashHistory(), routes });
router.beforeEach((to, from, next) => {
  if (to.path !== "/login" && !localStorage.getItem("admin_token")) {
    next("/login");
  } else {
    next();
  }
});
export default router;