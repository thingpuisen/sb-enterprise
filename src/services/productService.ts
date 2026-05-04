import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp, 
  query 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product } from '../data/products'; // Use existing Product interface

const PRODUCTS_COLLECTION = 'products';

export async function fetchProducts(): Promise<Product[]> {
  try {
    const q = query(collection(db, PRODUCTS_COLLECTION));
    const snapshot = await getDocs(q);
    
    const productsList: Product[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      productsList.push({
        id: docSnap.id,
        name: data.name,
        price: data.price,
        material: data.material,
        style: data.style,
        type: data.type,
        image: data.image,
        images: data.images || [],
        description: data.description,
      });
    });
    return productsList;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, PRODUCTS_COLLECTION);
    return []; // fallback
  }
}

export async function createProduct(id: string, productData: Omit<Product, 'id'>): Promise<void> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await setDoc(docRef, {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, PRODUCTS_COLLECTION);
  }
}

export async function updateProduct(id: string, productData: Omit<Product, 'id'>): Promise<void> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(docRef, {
      ...productData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, PRODUCTS_COLLECTION);
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, PRODUCTS_COLLECTION);
  }
}
