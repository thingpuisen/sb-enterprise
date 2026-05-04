export interface Product {
  id: string;
  name: string;
  price: number;
  material: string;
  style: string;
  type: string;
  image: string;
  images?: string[];
  description: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Modern Oak Dining Table",
    price: 899,
    material: "Wood",
    style: "Modern",
    type: "Table",
    image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=800",
    description: "A minimal and sturdy oak dining table perfect for family gatherings."
  },
  {
    id: "2",
    name: "Classic Leather Armchair",
    price: 450,
    material: "Leather",
    style: "Classic",
    type: "Chair",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=800",
    description: "Deep brown leather armchair with a timeless design."
  },
  {
    id: "3",
    name: "Minimalist Fabric Sofa",
    price: 1200,
    material: "Fabric",
    style: "Minimalist",
    type: "Sofa",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800",
    description: "A comfortable, three-seater sofa with clean lines and soft grey fabric."
  },
  {
    id: "4",
    name: "Industrial Metal Bookshelf",
    price: 320,
    material: "Metal",
    style: "Industrial",
    type: "Storage",
    image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=800",
    description: "Tall bookshelf featuring open metal framing and wooden shelves."
  },
  {
    id: "5",
    name: "Velvet Accent Chair",
    price: 280,
    material: "Fabric",
    style: "Modern",
    type: "Chair",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800",
    description: "Plush velvet accent chair adding a pop of color to any room."
  },
  {
    id: "6",
    name: "Rustic Pine Bedspread",
    price: 750,
    material: "Wood",
    style: "Rustic",
    type: "Bed",
    image: "https://images.unsplash.com/photo-1505693416035-af855d20449cf?auto=format&fit=crop&q=80&w=800",
    description: "Sturdy pine wood bed frame bringing warmth and nature indoors."
  },
  {
    id: "7",
    name: "Glass Coffee Table",
    price: 210,
    material: "Glass",
    style: "Modern",
    type: "Table",
    image: "https://images.unsplash.com/photo-1532372320572-cda25653a268?auto=format&fit=crop&q=80&w=800",
    description: "Sleek glass top coffee table with an angular metal base."
  },
  {
    id: "8",
    name: "Mid-Century TV Stand",
    price: 410,
    material: "Wood",
    style: "Mid-Century",
    type: "Storage",
    image: "https://images.unsplash.com/photo-1601392740426-ed4562095cc1?auto=format&fit=crop&q=80&w=800",
    description: "Warm walnut TV stand with sliding slatted doors."
  }
];

export const materials = Array.from(new Set(products.map(p => p.material)));
export const styles = Array.from(new Set(products.map(p => p.style)));
export const types = Array.from(new Set(products.map(p => p.type)));
