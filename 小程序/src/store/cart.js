const STORAGE_KEY = "noodle_cart";

const cart = {
  items: JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"),

  addItem(product, quantity = 1) {
    const idx = this.items.findIndex((i) => i.id === product.id);
    if (idx > -1) {
      this.items[idx].quantity += quantity;
    } else {
      this.items.push({ ...product, quantity });
    }
    this.save();
  },

  removeItem(productId) {
    this.items = this.items.filter((i) => i.id !== productId);
    this.save();
  },

  updateQuantity(productId, quantity) {
    const item = this.items.find((i) => i.id === productId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) this.removeItem(productId);
      else this.save();
    }
  },

  get total() {
    return this.items.reduce((s, i) => s + i.price * i.quantity, 0);
  },

  get count() {
    return this.items.reduce((s, i) => s + i.quantity, 0);
  },

  clear() {
    this.items = [];
    this.save();
  },

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
  },
};

export default cart;