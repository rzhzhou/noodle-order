<template>
  <div>
    <div class="header-row">
      <h2 class="page-title">📝 商品管理</h2>
      <el-button type="danger" @click="openEdit(null)">+ 新增商品</el-button>
    </div>

    <el-card shadow="hover">
      <el-table :data="products" stripe size="small" style="width:100%">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column label="图片" width="80" align="center">
          <template #default="{ row }">
            <el-image v-if="row.image" :src="row.image" style="width:48px;height:48px" fit="cover" class="product-thumb" />
            <span v-else class="no-img">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" min-width="120" />
        <el-table-column label="分类" width="80">
          <template #default="{ row }">
            <el-tag>{{ row.category }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="80">
          <template #default="{ row }">¥{{ row.price?.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="60" />
        <el-table-column prop="maxPerOrder" label="限购" width="60" align="center" />
        <el-table-column label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.available ? 'success' : 'danger'" size="small">
              {{ row.available ? "上架" : "下架" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sortOrder" label="排序" width="60" align="center" />
        <el-table-column label="操作" width="120" align="center">
          <template #default="{ row }">
            <el-button size="small" circle @click="openEdit(row)">
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button size="small" type="danger" circle @click="deleteProduct(row)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Edit Dialog -->
    <el-dialog v-model="showModal" :title="editing ? '编辑商品' : '新增商品'" width="560px" :close-on-click-modal="false">
      <el-form :model="form" label-width="80px" size="small">
        <el-form-item label="名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.category" style="width:100%">
            <el-option v-for="c in categories" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number v-model="form.price" :min="0" :step="0.5" :precision="2" style="width:100%" />
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="form.unit" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" />
        </el-form-item>
        <el-form-item label="商品图片">
          <el-upload
            :auto-upload="false"
            :show-file-list="false"
            accept="image/*"
            @change="onImageChange"
          >
            <template #trigger>
              <el-button type="primary">选择图片</el-button>
            </template>
            <div v-if="form.image" class="image-preview-wrap">
              <el-image :src="form.image" class="image-preview" fit="contain" />
              <el-button size="small" circle type="danger" class="img-remove" @click="form.image = ''">
                <el-icon><Close /></el-icon>
              </el-button>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="限购">
          <el-input-number v-model="form.maxPerOrder" :min="1" :max="999" style="width:100%" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sortOrder" :min="0" :max="999" style="width:100%" />
        </el-form-item>
        <el-form-item label="上架">
          <el-switch v-model="form.available" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showModal = false">取消</el-button>
        <el-button type="danger" @click="saveProduct">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { get, post, put, del } from "../api/index.js";
import { ElMessage, ElMessageBox } from "element-plus";

const products = ref([]);
const categories = ref(["汤粉", "干捞", "加料", "饮品"]);
const showModal = ref(false);
const editing = ref(null);
const form = ref({});

function onImageChange(uploadFile) {
  const file = uploadFile.raw;
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => { form.value.image = ev.target.result; };
  reader.readAsDataURL(file);
}

async function load() {
  try { products.value = await get("/products") || []; }
  catch (e) { console.error(e); }
}

function openEdit(product) {
  editing.value = product;
  form.value = product
    ? { ...product }
    : { name: "", category: "汤粉", price: 0, unit: "份", description: "", image: "", maxPerOrder: 99, sortOrder: 1, available: true };
  showModal.value = true;
}

async function saveProduct() {
  try {
    if (editing.value) {
      await put("/products/" + editing.value.id, form.value);
      ElMessage.success("修改成功");
    } else {
      await post("/products", form.value);
      ElMessage.success("新增成功");
    }
    showModal.value = false;
    await load();
  } catch (e) {
    ElMessage.error("保存失败: " + e.message);
  }
}

async function deleteProduct(p) {
  try {
    await ElMessageBox.confirm("确定删除「" + p.name + "」？", "确认删除", { type: "warning" });
    await del("/products/" + p.id);
    ElMessage.success("删除成功");
    await load();
  } catch (e) {
    if (e !== "cancel") ElMessage.error("删除失败");
  }
}

onMounted(load);
</script>

<style scoped>
.header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.page-title { font-size: 22px; margin: 0; }
.product-thumb { border-radius: 6px; border: 1px solid #eee; }
.no-img { color: #ccc; font-size: 12px; }
.image-preview-wrap { display: inline-flex; align-items: center; gap: 8px; margin-top: 8px; position: relative; }
.image-preview { max-width: 160px; max-height: 120px; border-radius: 8px; border: 1px solid #eee; }
.img-remove { position: absolute; top: -8px; right: -8px; }
</style>