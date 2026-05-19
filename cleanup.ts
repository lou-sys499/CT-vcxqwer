import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import * as fs from 'fs';

const rawConfig = fs.readFileSync('./firebase-applet-config.json', 'utf-8');
const firebaseConfig = JSON.parse(rawConfig);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function cleanup() {
  const querySnapshot = await getDocs(collection(db, 'categories'));
  const toDelete = [];
  querySnapshot.forEach((d) => {
    const data = d.data();
    const name = data.name || '';
    const slug = data.slug || '';
    if (name === 'Test CAT' || name === 'Drills & Drivers' || name.trim() === '' || slug.trim() === '') {
      toDelete.push(d.id);
    }
  });

  for (const id of toDelete) {
    console.log('Deleting category:', id);
    await deleteDoc(doc(db, 'categories', id));
  }
  console.log('Done cleaning categories. Deleted:', toDelete.length);
}

cleanup().catch(console.error);
