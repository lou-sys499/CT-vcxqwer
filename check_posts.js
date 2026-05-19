import { getBlogPosts } from './src/services/blogService.js';

async function run() {
  const posts = await getBlogPosts();
  console.log("Posts:");
  posts.forEach(p => console.log(p.title, p.content));
}

run();
