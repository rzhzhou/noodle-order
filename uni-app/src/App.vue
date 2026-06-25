<template>
  <view class="app">
    <tabbar :conf="tabBar" />
  </view>
</template>

<script setup>
const tabBar = {
  color: "#999999",
  selectedColor: "#f56c6c",
  backgroundColor: "#ffffff",
  borderStyle: "black",
  list: [
    { pagePath: "/pages/index/index", text: "首页", iconPath: "/static/tab/home.png", selectedIconPath: "/static/tab/home-active.png" },
    { pagePath: "/pages/cart/cart", text: "购物车", iconPath: "/static/tab/cart.png", selectedIconPath: "/static/tab/cart-active.png" },
    { pagePath: "/pages/order/order", text: "订单", iconPath: "/static/tab/order.png", selectedIconPath: "/static/tab/order-active.png" },
    { pagePath: "/pages/profile/profile", text: "我的", iconPath: "/static/tab/profile.png", selectedIconPath: "/static/tab/profile-active.png" }
  ]
};
</script>

<style>
/* tabBar is handled by pages.json config */
</style>