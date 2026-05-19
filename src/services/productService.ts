import { collection, getDocs, query, where, orderBy, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product } from '../types';

export const getFirestoreProducts = async (categorySlug?: string): Promise<Product[]> => {
  const path = 'products';
  try {
    const productsRef = collection(db, path);
    let q = query(productsRef, orderBy('createdAt', 'desc'));
    
    if (categorySlug) {
      q = query(productsRef, where('category', '==', categorySlug), orderBy('createdAt', 'desc'));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.GET, path);
    }
    console.error("Error fetching firebase products:", error);
    return [];
  }
};

export const updateFirestoreProduct = async (productId: string, data: Partial<Product>) => {
  const path = `products/${productId}`;
  try {
    const productRef = doc(db, 'products', productId);
    await setDoc(productRef, {
      ...data,
      updatedAt: new Date()
    }, { merge: true });
  } catch (error: any) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export const deleteFirestoreProduct = async (productId: string) => {
  const path = `products/${productId}`;
  try {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
  } catch (error: any) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

export const getFirestoreCategories = async (): Promise<any[]> => {
  const path = 'categories';
  try {
    const categoriesRef = collection(db, path);
    const q = query(categoriesRef, orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);
    const rawCategories = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[];
    return rawCategories.filter(c => c.name && c.name.trim() !== '' && c.name !== 'Test CAT' && c.name !== 'Drills & Drivers');
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.GET, path);
    }
    console.error("Error fetching firebase categories:", error);
    return [];
  }
};

export const updateFirestoreCategory = async (categoryId: string, data: any) => {
  const path = `categories/${categoryId}`;
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    await setDoc(categoryRef, {
      ...data,
      updatedAt: new Date()
    }, { merge: true });
  } catch (error: any) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export const deleteFirestoreCategory = async (categoryId: string) => {
  const path = `categories/${categoryId}`;
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    await deleteDoc(categoryRef);
  } catch (error: any) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};
