// Netlify Function: Noodle Order API
// Handles all backend API routes: products, orders, admin
// Single file to avoid bundler import resolution issues

import { getStore } from "@netlify/blobs";

// ─── Data Store Layer ────────────────────────────────────────────

const PRODUCTS_KEY = "db:products";
const ORDERS_KEY = "db:orders";
const COUNTER_KEY = "db:nextId";
const INIT_KEY = "db:initialized";

let _store = null;
function store() {
  if (!_store) _store = getStore({ name: "noodle-order-db", consistency: "strong" });
  return _store;
}

async function getJSON(key) {
  return await store().get(key, { type: "json" });
}
async function setJSON(key, data) {
  await store().setJSON(key, data);
}

async function nextId() {
  const c = (await getJSON(COUNTER_KEY)) || 0;
  const id = c + 1;
  await setJSON(COUNTER_KEY, id);
  return id;
}

async function getAllProducts() {
  return (await getJSON(PRODUCTS_KEY)) || [];
}
async function saveProducts(p) {
  await setJSON(PRODUCTS_KEY, p);
}
async function getProduct(id) {
  const products = await getAllProducts();
  return products.find((p) => p.id === id) || null;
}
async function addProduct(product) {
  const products = await getAllProducts();
  product.id = await nextId();
  products.push(product);
  await saveProducts(products);
  return product;
}
async function updateProduct(id, updates) {
  const products = await getAllProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  products[idx] = { ...products[idx], ...updates };
  await saveProducts(products);
  return products[idx];
}
async function deleteProduct(id) {
  let products = await getAllProducts();
  products = products.filter((p) => p.id !== id);
  await saveProducts(products);
}
async function getAvailableProducts() {
  const products = await getAllProducts();
  return products.filter((p) => p.available !== false).sort((a, b) => (a.sortOrder || 999) - (b.sortOrder || 999));
}
async function getProductsByCategory(category) {
  const products = await getAvailableProducts();
  return products.filter((p) => p.category === category);
}
async function getCategories() {
  const products = await getAllProducts();
  return [...new Set(products.map((p) => p.category))].sort();
}

async function getAllOrders() {
  return (await getJSON(ORDERS_KEY)) || [];
}
async function saveOrders(o) {
  await setJSON(ORDERS_KEY, o);
}
async function getOrder(id) {
  const orders = await getAllOrders();
  return orders.find((o) => o.id === id) || null;
}
async function addOrder(order) {
  const orders = await getAllOrders();
  order.id = await nextId();
  order.createdAt = new Date().toISOString();
  orders.unshift(order);
  await saveOrders(orders);
  return order;
}
async function updateOrder(id, updates) {
  const orders = await getAllOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  orders[idx] = { ...orders[idx], ...updates };
  await saveOrders(orders);
  return orders[idx];
}
async function getUserOrders(userId) {
  const orders = await getAllOrders();
  return orders.filter((o) => o.userId === userId);
}

async function isInitialized() {
  return (await getJSON(INIT_KEY)) === true;
}
async function markInitialized() {
  await setJSON(INIT_KEY, true);
}

// ─── Seed Data ────────────────────────────────────────────────────

const SEED_PRODUCTS = [
  { name: "红烧牛肉粉", category: "汤粉", price: 18.00, unit: "份", description: "浓郁牛肉汤底，大块牛肉", sortOrder: 1, maxPerOrder: 5 },
  { name: "酸菜鱼粉", category: "汤粉", price: 16.00, unit: "份", description: "酸爽开胃，鲜嫩鱼片", sortOrder: 2, maxPerOrder: 5 },
  { name: "香菇鸡丝粉", category: "汤粉", price: 15.00, unit: "份", description: "鲜香滑嫩，养生暖胃", sortOrder: 3, maxPerOrder: 5 },
  { name: "炸酱面", category: "干拌", price: 14.00, unit: "份", description: "老北京炸酱，劲道面条", sortOrder: 4, maxPerOrder: 5 },
  { name: "葱油拌面", category: "干拌", price: 12.00, unit: "份", description: "葱香四溢，简单美味", sortOrder: 5, maxPerOrder: 5 },
  { name: "热干面", category: "干拌", price: 13.00, unit: "份", description: "武汉特色，芝麻酱香", sortOrder: 6, maxPerOrder: 5 },
  { name: "卤蛋", category: "加料", price: 3.00, unit: "个", description: "秘制卤蛋，入味十足", sortOrder: 7, maxPerOrder: 10 },
  { name: "豆奶", category: "饮品", price: 5.00, unit: "瓶", description: "冰镇豆奶，清爽解渴", sortOrder: 8, maxPerOrder: 10 },
];

async function ensureSeedData() {
  if (await isInitialized()) return;
  const existing = await getAllProducts();
  if (existing.length > 0) {
    await markInitialized();
    return;
  }
  for (const p of SEED_PRODUCTS) {
    await addProduct(p);
  }
  await markInitialized();
}

// ─── Route Handler ────────────────────────────────────────────────

export default async (req, context) => {
  await ensureSeedData();

  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;

  // CORS headers for all responses
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle preflight
  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // ── Products API ──
  // GET /api/products
  // GET /api/products/categories
  // GET /api/products/category/:category
  // GET /api/products/:id

  const prodMatch = path.match(/^\/api\/products?(.*)/);
  if (prodMatch) {
    const sub = prodMatch[1] || "/";
    if (method === "GET") {
      if (sub === "/" || sub === "") {
        return json(await getAvailableProducts(), corsHeaders);
      }
      if (sub === "/categories") {
        return json(await getCategories(), corsHeaders);
      }
      const catM = sub.match(/^\/category\/(.+)/);
      if (catM) {
        return json(await getProductsByCategory(decodeURIComponent(catM[1])), corsHeaders);
      }
      const idM = sub.match(/^\/(\d+)/);
      if (idM) {
        const p = await getProduct(parseInt(idM[1]));
        if (!p) return jsonError(404, "商品不存在", corsHeaders);
        return json(p, corsHeaders);
      }
    }
    return jsonError(404, "Not found", corsHeaders);
  }

  // ── Orders API ──
  // POST /api/orders          - create order
  // GET  /api/orders/user/:id - get user orders
  // GET  /api/orders/:id      - get order detail

  const orderMatch = path.match(/^\/api\/orders?(.*)/);
  if (orderMatch) {
    const sub = orderMatch[1] || "/";
    if (method === "POST" && (sub === "/" || sub === "")) {
      const body = await req.json();
      const { userId, userName, userUnit, note, items } = body;
      if (!userId || !userUnit || !items || !Array.isArray(items) || items.length === 0) {
        return jsonError(400, "请填写完整订单信息", corsHeaders);
      }
      let total = 0;
      const orderItems = [];
      for (const item of items) {
        if (!item.productId || !item.quantity || item.quantity < 1) {
          return jsonError(400, "订单明细无效", corsHeaders);
        }
        const product = await getProduct(item.productId);
        if (!product) return jsonError(400, `商品 ${item.productId} 不存在`, corsHeaders);
        if (product.maxPerOrder && item.quantity > product.maxPerOrder) {
          return jsonError(400, `${product.name} 最多可订 ${product.maxPerOrder} ${product.unit}`, corsHeaders);
        }
        const subtotal = Math.round(product.price * item.quantity * 100) / 100;
        total += subtotal;
        orderItems.push({
          productId: product.id, productName: product.name,
          price: product.price, quantity: item.quantity, subtotal,
        });
      }
      const order = await addOrder({
        userId, userName: userName || "", userUnit, note: note || "",
        status: "pending", totalAmount: Math.round(total * 100) / 100, items: orderItems,
      });
      return json(order, corsHeaders);
    }
    if (method === "GET") {
      const userM = sub.match(/^\/user\/(.+)/);
      if (userM) {
        return json(await getUserOrders(decodeURIComponent(userM[1])), corsHeaders);
      }
      const idM = sub.match(/^\/(\d+)/);
      if (idM) {
        const o = await getOrder(parseInt(idM[1]));
        if (!o) return jsonError(404, "订单不存在", corsHeaders);
        return json(o, corsHeaders);
      }
    }
    return jsonError(404, "Not found", corsHeaders);
  }

  // ── Admin API ──
  // GET    /api/admin/dashboard
  // GET    /api/admin/products
  // POST   /api/admin/products
  // PUT    /api/admin/products/:id
  // DELETE /api/admin/products/:id
  // GET    /api/admin/orders
  // PUT    /api/admin/orders/:id/status

  const adminMatch = path.match(/^\/api\/admin(.*)/);
  if (adminMatch) {
    const sub = adminMatch[1] || "/";

    // Dashboard
    if (sub === "/dashboard" && method === "GET") {
      const products = await getAllProducts();
      const orders = await getAllOrders();
      const totalOrders = orders.length;
      const pendingOrders = orders.filter((o) => o.status === "pending").length;
      const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
      const totalProducts = products.length;

      const unitMap = {};
      for (const o of orders) {
        const u = o.userUnit || "未知";
        if (!unitMap[u]) unitMap[u] = { unit: u, orderCount: 0, totalAmount: 0 };
        unitMap[u].orderCount++;
        unitMap[u].totalAmount += o.totalAmount || 0;
      }
      const catMap = {};
      for (const o of orders) {
        if (o.items) {
          for (const item of o.items) {
            const prod = await getProduct(item.productId);
            const cat = prod ? prod.category : "未知";
            if (!catMap[cat]) catMap[cat] = { category: cat, quantity: 0, amount: 0 };
            catMap[cat].quantity += item.quantity || 0;
            catMap[cat].amount += item.subtotal || 0;
          }
        }
      }
      return json({
        totalOrders, totalProducts,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        pendingOrders,
        unitStats: Object.values(unitMap),
        categoryStats: Object.values(catMap),
      }, corsHeaders);
    }

    // Product CRUD
    if (sub === "/products") {
      if (method === "GET") {
        return json(await getAllProducts(), corsHeaders);
      }
      if (method === "POST") {
        const body = await req.json();
        if (!body.name || !body.category || body.price === undefined) {
          return jsonError(400, "请填写完整商品信息", corsHeaders);
        }
        const p = await addProduct({
          name: body.name, category: body.category, price: parseFloat(body.price),
          unit: body.unit || "份", description: body.description || "",
          available: body.available !== undefined ? body.available : true,
          sortOrder: body.sortOrder || 0, maxPerOrder: body.maxPerOrder || 99,
        });
        return json(p, corsHeaders);
      }
      return jsonError(405, "Method not allowed", corsHeaders);
    }

    const prodIdM = sub.match(/^\/products\/(\d+)/);
    if (prodIdM) {
      const id = parseInt(prodIdM[1]);
      if (method === "PUT") {
        const existing = await getProduct(id);
        if (!existing) return jsonError(404, "商品不存在", corsHeaders);
        const body = await req.json();
        const updates = {};
        if (body.name !== undefined) updates.name = body.name;
        if (body.category !== undefined) updates.category = body.category;
        if (body.price !== undefined) updates.price = parseFloat(body.price);
        if (body.unit !== undefined) updates.unit = body.unit;
        if (body.description !== undefined) updates.description = body.description;
        if (body.available !== undefined) updates.available = body.available;
        if (body.sortOrder !== undefined) updates.sortOrder = body.sortOrder;
        if (body.maxPerOrder !== undefined) updates.maxPerOrder = body.maxPerOrder;
        return json(await updateProduct(id, updates), corsHeaders);
      }
      if (method === "DELETE") {
        await deleteProduct(id);
        return json(null, corsHeaders);
      }
      return jsonError(405, "Method not allowed", corsHeaders);
    }

    // Order management
    if (sub === "/orders" && method === "GET") {
      return json(await getAllOrders(), corsHeaders);
    }

    const statusM = sub.match(/^\/orders\/(\d+)\/status/);
    if (statusM && method === "PUT") {
      const id = parseInt(statusM[1]);
      const body = await req.json();
      if (!body.status) return jsonError(400, "状态不能为空", corsHeaders);
      const existing = await getOrder(id);
      if (!existing) return jsonError(404, "订单不存在", corsHeaders);
      return json(await updateOrder(id, { status: body.status }), corsHeaders);
    }

    return jsonError(404, "Not found", corsHeaders);
  }

  return jsonError(404, "Not found", corsHeaders);
};

export const config = {
  path: [
    "/api/products",
    "/api/products/categories",
    "/api/products/category/:category",
    "/api/products/:id",
    "/api/orders",
    "/api/orders/user/:userId",
    "/api/orders/:id",
    "/api/admin/dashboard",
    "/api/admin/products",
    "/api/admin/products/:id",
    "/api/admin/orders",
    "/api/admin/orders/:id/status",
  ],
};

// ─── Response Helpers ─────────────────────────────────────────────

function jsonResponse(body, status, headers) {
  return new Response(JSON.stringify({ code: status < 400 ? 200 : status, message: status < 400 ? "success" : body.message || "error", data: status < 400 ? body : null }), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

function json(data, headers) {
  return jsonResponse(data, 200, headers);
}

function jsonError(status, message, headers) {
  return jsonResponse({ message }, status, headers);
}
