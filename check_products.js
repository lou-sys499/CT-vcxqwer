import { getFirestoreProducts } from './src/services/productService.js';

async function run() {
  const products = await getFirestoreProducts();
  console.log("Products:");
  products.forEach(p => console.log(p.name));
}

run();
