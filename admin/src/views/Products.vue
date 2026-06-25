<template>
  <div>
    <div class="header-row">
      <h2 class="page-title">📦 商品管理</h2>
      <button class="btn btn-primary" @click="openEdit(null)">+ 新增商品</button>
    </div>

    <div class="card">
      <table class="table" v-if="products.length">
        <thead>
          <tr><th>ID</th><th>名称</th><th>分类</th><th>价格</th><th>单位</th><th>限购</th><th>状态</th><th>排序</th><th>操作</th></tr>
        </thead>
        <tbody>
          <tr v-for="p in products" :key="p.id">
            <td>{{ p.id }}</td>
            <td><strong>{{ p.name }}</strong></td>
            <td><span class="tag">{{ p.category }}</span></td>
            <td>¥{{ p.price?.toFixed(2) }}</td>
            <td>{{ p.unit }}</td>
            <td>{{ p.maxPerOrder }}</td>
            <td><span :class="['badge', p.available ? 'on' : 'off']">{{ p.available ? "上架" : "下架" }}</span></td>
            <td>{{ p.sortOrder }}</td>
            <td class="actions">
              <button class="btn-sm" @click="openEdit(p)">✏️</button>
              <button class="btn-sm" @click="deleteProduct(p)">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-hint">暂无商品</div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal=false">
      <div class="modal">
        <h3>{{ editing ? "编辑商品" : "新增商品" }}</h3>
        <div class="form">
          <div class="row"><label>名称</label><input v-model="form.name" /></div>
          <div class="row"><label>分类</label>
            <select v-model="form.category">
              <option v-for="c in categories" :key="c">{{ c }}</option>
            </select>
          </div>
          <div class="row"><label>价格</label><input v-model.number="form.price" type="number" step="0.01" /></div>
          <div class="row"><label>单位</label><input v-model="form.unit" /></div>
          <div class="row"><label>描述</label><input v-model="form.description" /></div>
          <div class="row"><label>限购</label><input v-model.number="form.maxPerOrder" type="number" /></div>
          <div class="row"><label>排序</label><input v-model.number="form.sortOrder" type="number" /></div>
          <div class="row"><label>上架</label>
            <label class="switch"><input type="checkbox" v-model="form.available" /><span></span></label>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn" @click="showModal=false">取消</button>
          <button class="btn btn-primary" @click="saveProduct">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { get, post, put, del } from "../api/index.js";

const products = ref([]);
const categories = ref(["汤粉", "干拌", "加料", "饮品"]);
const showModal = ref(false);
const editing = ref(null);
const form = ref({});

async function load() {
  try { products.value = await get("/products") || []; }
  catch (e) { console.error(e); }
}

function openEdit(product) {
  editing.value = product;
  form.value = product ? { ...product } : { name: "", category: "汤粉", price: 0, unit: "份", description: "", maxPerOrder: 99, sortOrder: 1, available: true };
  showModal.value = true;
}

async function saveProduct() {
  try {
    if (editing.value) {
      await put("/products/" + editing.value.id, form.value);
    } else {
      await post("/products", form.value);
    }
    showModal.value = false;
    await load();
  } catch (e) { alert("保存失败: " + e.message); }
}

async function deleteProduct(p) {
  if (!confirm("确定删除「" + p.name + "」？")) return;
  try {
    await del("/products/" + p.id);
    await load();
  } catch (e) { alert("删除失败"); }
}

onMounted(load);
</script>

<style scoped>
.header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.page-title { font-size: 22px; }
.card { background: #fff; border-radius: 12px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.table { width: 100%; border-collapse: collapse; font-size: 13px; }
.table th, .table td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #f0f0f0; }
.table th { color: #999; font-weight: 500; background: #fafafa; }
.tag { background: #f0f9ff; color: #409eff; padding: 2px 10px; border-radius: 10px; font-size: 12px; }
.badge { padding: 2px 10px; border-radius: 10px; font-size: 12px; }
.badge.on { background: #e8f5e9; color: #388e3c; }
.badge.off { background: #fce4ec; color: #c62828; }
.actions { display: flex; gap: 6px; }
.btn-sm { background: none; border: 1px solid #ddd; border-radius: 6px; padding: 4px 10px; cursor: pointer; font-size: 14px; }
.btn { padding: 8px 20px; border-radius: 8px; border: 1px solid #ddd; background: #fff; cursor: pointer; font-size: 13px; }
.btn-primary { background: #f56c6c; color: #fff; border-color: #f56c6c; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 200; }
.modal { background: #fff; border-radius: 16px; padding: 24px; width: 480px; max-height: 80vh; overflow-y: auto; }
.modal h3 { margin-bottom: 16px; }
.form .row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.form .row label { min-width: 60px; font-size: 13px; color: #666; }
.form .row input, .form .row select { flex: 1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; }
.switch { position: relative; display: inline-block; width: 40px; height: 22px; }
.switch input { opacity: 0; width: 0; height: 0; }
.switch span { position: absolute; cursor: pointer; inset: 0; background: #ccc; border-radius: 22px; transition: 0.3s; }
.switch span:before { content: ""; position: absolute; height: 18px; width: 18px; left: 2px; bottom: 2px; background: #fff; border-radius: 50%; transition: 0.3s; }
.switch input:checked + span { background: #f56c6c; }
.switch input:checked + span:before { transform: translateX(18px); }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
.empty-hint { color: #ccc; text-align: center; padding: 40px 0; font-size: 14px; }
</style>