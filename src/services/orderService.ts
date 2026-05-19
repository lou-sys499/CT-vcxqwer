import { collection, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product } from '../types';

export const createOrder = async (orderData: any): Promise<string> => {
  const path = 'orders';
  try {
    const ordersRef = collection(db, path);
    // Add timestamp
    const dataWithTimestamp = {
      ...orderData,
      status: 'pending',
      createdAt: new Date(),
    };
    const orderDoc = await addDoc(ordersRef, dataWithTimestamp);
    
    // Inventory deduction
    if (orderData.items && Array.isArray(orderData.items)) {
      for (const item of orderData.items) {
        if (item.id) {
          try {
            const productRef = doc(db, 'products', item.id);
            const productSnap = await getDoc(productRef);
            if (productSnap.exists()) {
               const pData = productSnap.data();
               // We just update the total sales here and in-stock flag if required
               const totalSales = (pData.totalSales || 0) + item.quantity;
               await updateDoc(productRef, { totalSales });
            }
          } catch (err) {
            console.error("Failed to update product after order", err);
          }
        }
      }
    }

    return orderDoc.id;
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
    console.error("Error creating order:", error);
    throw error;
  }
};
