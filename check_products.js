import { getFirestoreProducts } from './src/services/productService.ts';

async function run() {
  try {
    const products = await getFirestoreProducts();
    console.log("FOUND_PRODUCTS_START");
    products.forEach(p => {
      console.log(JSON.stringify({
        id: p.id,
        name: p.name,
        brand: p.brand,
        category: p.category
      }));
    });
    console.log("FOUND_PRODUCTS_END");
  } catch (err) {
    console.error("Error in check_products.js:", err);
  } finally {
    process.exit(0);
  }
}

run();
