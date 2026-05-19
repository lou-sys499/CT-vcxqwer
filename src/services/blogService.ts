import { collection, getDocs, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { BlogPost } from '../types';

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  const path = 'blogPosts';
  try {
    const blogRef = collection(db, path);
    const q = query(blogRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as BlogPost));
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.GET, path);
    }
    console.error("Error fetching blog posts:", error);
    return [];
  }
};

export const addBlogPost = async (post: Omit<BlogPost, 'id'>): Promise<void> => {
  const path = 'blogPosts';
  try {
    await addDoc(collection(db, path), {
      ...post,
      createdAt: serverTimestamp()
    });
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
    throw error;
  }
};

export const deleteBlogPost = async (id: string): Promise<void> => {
  const path = 'blogPosts';
  try {
    const { doc, deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, path, id));
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
    throw error;
  }
};

export const updateBlogPost = async (id: string, post: Partial<Omit<BlogPost, 'id'>>): Promise<void> => {
  const path = 'blogPosts';
  try {
    const { doc, updateDoc } = await import('firebase/firestore');
    await updateDoc(doc(db, path, id), {
      ...post,
      updatedAt: serverTimestamp()
    });
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
    throw error;
  }
};

