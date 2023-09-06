const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      this.products = JSON.parse(data);
      this.lastProductId = this.products.length > 0 ? this.products[this.products.length - 1].id : 0;
    } catch (error) {
      this.products = [];
      this.lastProductId = 0;
    }
  }

  saveProducts() {
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf8');
  }

  addProduct(product) {
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock
    ) {
      console.error("Todos los campos son obligatorios");
      return;
    }

    const existingProduct = this.products.find((p) => p.code === product.code);
    if (existingProduct) {
      console.error("El código del producto ya está en uso");
      return;
    }

    product.id = ++this.lastProductId;
    this.products.push(product);
    this.saveProducts();
  }

  getProducts(limit) {
    if (limit === undefined) {
      return this.products;
    } else {
      return this.products.slice(0, limit);
    }
  }

  getProductById(id) {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      console.error("Not found");
    }
    return product;
  }

  updateProduct(id, updatedFields) {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex !== -1) {
      this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };
      this.saveProducts();
    }
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex !== -1) {
      this.products.splice(productIndex, 1);
      this.saveProducts();
    }
  }
}

module.exports = ProductManager;
