function loadCart() {
  try {
    const d = uni.getStorageSync("noodle_cart");
    return d ? JSON.parse(d) : [];
  } catch (e) { return []; }
}
function save(items) { uni.setStorageSync("noodle_cart", JSON.stringify(items)); }

const cart = {
  items: loadCart(),
  addItem(product, qty) {
    const idx = this.items.findIndex((i) => i.id === product.id);
    if (idx > -1) this.items[idx].quantity += (qty || 1);
    else this.items.push({ id: product.id, name: product.name, price: product.price, unit: product.unit, quantity: qty || 1 });
    save(this.items);
  },
  removeItem(id) { this.items = this.items.filter((i) => i.id !== id); save(this.items); },
  updateQuantity(id, qty) {
    const item = this.items.find((i) => i.id === id);
    if (item) { item.quantity = qty; if (qty <= 0) this.removeItem(id); else save(this.items); }
  },
  get total() { return this.items.reduce((s, i) => s + i.price * i.quantity, 0); },
  get count() { return this.items.reduce((s, i) => s + i.quantity, 0); },
  clear() { this.items = []; save(this.items); },
};

export default cart;
