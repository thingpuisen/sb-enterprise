import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export interface SiteSettings {
  location: string;
  contactNumber: string;
  contactEmail: string;
  estDate: string;
  categories: string[];
  materials: string[];
  styles: string[];
}

const SETTINGS_COLLECTION = 'settings';
const SETTINGS_DOC = 'siteSettings';

export const defaultSettings: SiteSettings = {
  location: "842 Design Blvd, Suite 100\nSan Francisco, CA 94103",
  contactNumber: "+1 (555) 012-3456",
  contactEmail: "hello@sb-enterprise.com",
  estDate: "2026",
  categories: ["Chair", "Table", "Sofa", "Bed", "Storage"],
  materials: ["Wood", "Leather", "Fabric", "Metal", "Glass"],
  styles: ["Modern", "Classic", "Minimalist", "Industrial", "Rustic", "Mid-Century"]
};

export async function fetchSettings(): Promise<SiteSettings> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as SiteSettings;
    }
    return defaultSettings;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, SETTINGS_COLLECTION);
    return defaultSettings;
  }
}

export async function updateSettings(settings: SiteSettings): Promise<void> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC);
    await setDoc(docRef, settings);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, SETTINGS_COLLECTION);
  }
}
