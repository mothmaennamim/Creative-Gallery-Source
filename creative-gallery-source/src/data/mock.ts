// ============================================================
// ক্রিয়েটিভ গ্যালারি — প্রোটোটাইপ মক ডেটা
// ডকুমেন্টেশন অনুযায়ী: মাল্টিভেন্ডর ই-কমার্স
// ============================================================

export type Role = "customer" | "seller" | "admin" | "superadmin";

export type ProductStatus = "pending" | "approved" | "rejected";
export type UserStatus = "active" | "pending" | "blocked";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  status: UserStatus;
  shopName?: string;
  shopDesc?: string;
  sellerStatus?: string;
  joined: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  desc: string;
  price: number;
  oldPrice?: number;
  stock: number;
  category: string;
  sellerId: string;
  image: string;
  rating: number;
  reviews: Review[];
  status: ProductStatus;
  rejectReason?: string;
  sales: number;
  createdAt: string;
}

export type PaymentMethod = "bkash" | "nagad" | "sslcommerz" | "cod";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipping"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

export interface Order {
  id: string;
  groupId: string;
  customerName: string;
  phone: string;
  address: string;
  area: string;
  payment: PaymentMethod;
  items: OrderItem[];
  sellerId: string;
  subtotal: number;
  delivery: number;
  total: number;
  commission: number;
  sellerEarning: number;
  status: OrderStatus;
  createdAt: string;
}

export interface Notification {
  id: string;
  text: string;
  time: string;
  role: Role;
}

export interface PayoutRequest {
  id: string;
  sellerId: string;
  sellerName: string;
  shopName: string;
  amount: number;
  date: string;
  status: "অপেক্ষমাণ" | "পরিশোধিত";
}

export const ROLE_LABEL: Record<Role, string> = {
  customer: "কাস্টমার",
  seller: "সেলার",
  admin: "অ্যাডমিন",
  superadmin: "সুপার অ্যাডমিন",
};

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "অপেক্ষমাণ",
  confirmed: "পেমেন্ট নিশ্চিত",
  processing: "প্রস্তুত হচ্ছে",
  shipping: "ডেলিভারিতে",
  delivered: "সম্পন্ন",
  cancelled: "বাতিল",
};

export const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  bkash: "বিকাশ",
  nagad: "নগদ",
  sslcommerz: "SSLCommerz (কার্ড)",
  cod: "ক্যাশ অন ডেলিভারি",
};

export const DELIVERY_FEE = 60;

// ---------------- ইমেজ (ইমেজ-সার্চ থেকে, OSS-হোস্টেড) ----------------
const C = "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt";
export const IMG = {
  hero: `${C}/310e10850d41.jpeg`,
  kantha1: `${C}/800ef971dfa1.jpg`,
  kantha2: `${C}/791c88d120c4.jpg`,
  kantha3: `${C}/14040cc70e21.jpg`,
  pottery1: `${C}/b6b71618c0b3.jpg`,
  pottery2: `${C}/1fc140a1dad0.jpg`,
  pottery3: `${C}/e0f621687f4c.jpg`,
  bamboo1: `${C}/6193f5bb4f54.jpg`,
  bamboo2: `${C}/15a05653d72e.jpg`,
  bamboo3: `${C}/9b4398083fa3.jpeg`,
  jute1: `${C}/02b33f3d2d52.jpg`,
  jute2: `${C}/3e2edcaa34fa.jpg`,
  jute3: `${C}/a104b0f82914.jpg`,
  saree1: `${C}/f2335b6fe716.png`,
  saree2: `${C}/e133bee38dd5.jpg`,
  saree3: `${C}/c3d7355620dd.jpeg`,
  art1: `${C}/f0a4418b2cce.jpg`,
  art2: `${C}/35132674e833.jpg`,
  jewelry1: `${C}/bc57c19823f7.png`,
  jewelry2: `${C}/a22632ee2da9.jpg`,
  honey1: `${C}/9570d41176ca.png`,
  honey2: `${C}/d1c64957b91d.jpg`,
  soap1: `${C}/ae5cdd8ac4eb.png`,
  wood1: `${C}/84d86326f495.jpg`,
  wood2: `${C}/3330e78d4da8.jpg`,
  leather1: `${C}/d581006db2a6.jpg`,
  dolls1: `${C}/e984b12c6e83.jpg`,
  dolls2: `${C}/81d0358154a1.jpg`,
  field1: `${C}/bb5d70af37cc.jpg`,
};

// ---------------- ক্যাটাগরি ----------------
export const CATEGORIES = [
  { id: "handicraft", name: "হস্তশিল্প", emoji: "🧵" },
  { id: "cloth", name: "পোশাক ও বস্ত্র", emoji: "👗" },
  { id: "decor", name: "ঘর সাজানো", emoji: "🏺" },
  { id: "food", name: "খাবার ও কৃষিপণ্য", emoji: "🍯" },
  { id: "art", name: "শিল্পকলা", emoji: "🎨" },
  { id: "jewelry", name: "গয়না", emoji: "📿" },
  { id: "bamboo", name: "বাঁশ-বেতের কাজ", emoji: "🧺" },
  { id: "cosmetics", name: "প্রসাধনী", emoji: "🧼" },
  { id: "leather", name: "চামড়াজাত পণ্য", emoji: "👝" },
];

export const categoryName = (id: string) =>
  CATEGORIES.find((c) => c.id === id)?.name ?? id;

// ---------------- ইউজার (ডেমো) ----------------
export const INITIAL_USERS: User[] = [
  {
    id: "u1", name: "রিনা আক্তার", email: "rina@demo.bd", phone: "০১৭১১-০০১১১১",
    role: "customer", status: "active", joined: "২০২৫-০৮-১২",
  },
  {
    id: "u2", name: "মো. করিম আহমেদ", email: "karim@demo.bd", phone: "০১৭১১-০০২২২২",
    role: "seller", status: "active", shopName: "করিম হস্তশিল্প",
    shopDesc: "মাটি ও কাঠের ঐতিহ্যবাহী হস্তশিল্প", joined: "২০২৫-০৬-০১",
  },
  {
    id: "u3", name: "ফাতেমা বেগম", email: "fatema@demo.bd", phone: "০১৭১১-০০৩৩৩৩",
    role: "seller", status: "active", shopName: "নকশি ঘর",
    shopDesc: "নকশি কাঁথা ও তাঁতের পোশাক", joined: "২০২৫-০৫-২০",
  },
  {
    id: "u4", name: "রফিকুল ইসলাম", email: "rafique@demo.bd", phone: "০১৭১১-০০৪৪৪৪",
    role: "seller", status: "active", shopName: "গ্রামবাংলা কুটির",
    shopDesc: "বাঁশ-বেত ও পাটের পণ্য, প্রাকৃতিক সাবান", joined: "২০২৫-০৭-০৫",
  },
  {
    id: "u5", name: "সাদিয়া ইসলাম", email: "sadia@demo.bd", phone: "০১৭১১-০০৫৫৫৫",
    role: "seller", status: "active", shopName: "ক্রিয়েটিভ আর্ট স্টুডিও",
    shopDesc: "চিত্রকর্ম, গয়না ও পুতুল", joined: "২০২৫-০৭-১৮",
  },
  {
    id: "u6", name: "জাহাঙ্গীর আলম", email: "jahangir@demo.bd", phone: "০১৭১১-০০৬৬৬৬",
    role: "seller", status: "active", shopName: "মধুমতি এগ্রো",
    shopDesc: "খাঁটি মধু ও কৃষিপণ্য", joined: "২০২৫-০৯-০৯",
  },
  {
    id: "u7", name: "মো. আলম মিয়া", email: "alam@demo.bd", phone: "০১৭১১-০০৭৭৭৭",
    role: "seller", status: "pending", shopName: "রংপুর বাঁশশিল্প",
    shopDesc: "রংপুরের ঐতিহ্যবাহী বাঁশশিল্প — অনুমোদনের অপেক্ষায়",
    joined: "২০২৬-১১-০১",
  },
  {
    id: "u8", name: "শাহিন আলম", email: "admin@demo.bd", phone: "০১৭১১-০০৮৮৮৮",
    role: "admin", status: "active", joined: "২০২৫-০১-১০",
  },
  {
    id: "u9", name: "মেহেদী হাসান", email: "super@demo.bd", phone: "০১৭১১-০০৯৯৯৯",
    role: "superadmin", status: "active", joined: "২০২৫-০১-০১",
  },
];

// ---------------- রিভিউ পুল ----------------
const mkReviews = (seed: number): Review[] => {
  const pool: Omit<Review, "id">[] = [
    { userName: "রিনা আক্তার", rating: 5, comment: "পণ্যটা ছবির মতোই সুন্দর! প্যাকেজিং খুব যত্ন করে করা হয়েছে।", date: "২০২৬-১০-১৫", verified: true },
    { userName: "কামরুল হাসান", rating: 4, comment: "কোয়ালিটি ভালো, ডেলিভারি ২ দিনে পেয়েছি। দাম একটু বেশি মনে হলো।", date: "২০২৬-১০-০৮", verified: true },
    { userName: "শারমিন সুলতানা", rating: 5, comment: "উপহার হিসেবে কিনেছিলাম — সবাই খুব পছন্দ করেছে। ধন্যবাদ সেলারকে!", date: "২০২৬-০৯-২৮", verified: true },
    { userName: "তানভীর রহমান", rating: 4, comment: "হাতে বানানো পণ্য, তাই সামান্য অসমানতা আছে — তবু ভালো লেগেছে।", date: "২০২৬-০৯-১৯", verified: true },
    { userName: "মৌসুমী আক্তার", rating: 5, comment: "এমন সুন্দর হস্তশিল্প অনলাইনে পাওয়া ভার। আবার কিনবে ইনশাআল্লাহ।", date: "২০২৬-১০-২২", verified: true },
  ];
  const count = (seed % 3) + 2; // ২-৪টি রিভিউ
  return pool.slice(0, count).map((r, i) => ({ ...r, id: `rv-${seed}-${i}` }));
};

// ---------------- পণ্য ----------------
export const INITIAL_PRODUCTS: Product[] = [
  { id: "p1", name: "নকশি কাঁথা (শালের কাঁথা)", desc: "রংপুর অঞ্চলের ঐতিহ্যবাহী হাতে সেলাই করা নকশি কাঁথা। মেহগনি রঙের ভিতে সাদা-লাল সুতার নকশা, শতভাগ সুতির কাপড়। বিছানাপাশ বা দেয়াল সাজানোর জন্য আদর্শ।", price: 1850, oldPrice: 2200, stock: 12, category: "cloth", sellerId: "u3", image: IMG.kantha1, rating: 4.8, reviews: mkReviews(1), status: "approved", sales: 34, createdAt: "২০২৫-০৯-০১" },
  { id: "p2", name: "টেরাকোটা সুরঙ্গা সেট", desc: "চিনির মাটিতে হাতে গড়া পোড়ামাটির সুরঙ্গা সেট — টি-টেবিলের জন্য সুন্দর সংগ্রহ। প্রতিটি গ্লাসে গ্রামবাংলার ছাপ।", price: 1200, stock: 8, category: "decor", sellerId: "u2", image: IMG.pottery1, rating: 4.6, reviews: mkReviews(2), status: "approved", sales: 21, createdAt: "২০২৫-০৯-১৫" },
  { id: "p3", name: "বাঁশের হ্যান্ডমেড ঝুড়ি", desc: "গ্রামের কারিগরদের হাতে বোনা মজবুত বাঁশের ঝুড়ি। বাজার, স্টোরেজ বা সাজসজ্জার জন্য ব্যবহারযোগ্য। পরিবেশবান্ধব বিকল্প।", price: 650, stock: 20, category: "bamboo", sellerId: "u4", image: IMG.bamboo1, rating: 4.7, reviews: mkReviews(3), status: "approved", sales: 47, createdAt: "২০২৫-০৮-২০" },
  { id: "p4", name: "পাটের ল্যাপটপ ব্যাগ", desc: "প্রাকৃতিক পাটের আঁশে বোনা ল্যাপটপ ব্যাগ, ভেতরে নরম প্যাডিং। ১৫ ইঞ্চি ল্যাপটপের জন্য উপযুক্ত। ক্যাজুয়াল অফিস লুকে দারুণ মানাবে।", price: 950, oldPrice: 1100, stock: 15, category: "handicraft", sellerId: "u4", image: IMG.jute1, rating: 4.5, reviews: mkReviews(4), status: "approved", sales: 29, createdAt: "২০২৫-১০-০২" },
  { id: "p5", name: "হ্যান্ডলুম শাড়ি — যমুনার রঙ", desc: "তাঁতিদের হাতে বোনা আধা-সিল্ক শাড়ি, সবুজ-সোনালি মিশ্রণে নদীর রূপ। ব্লাউজ পিসসহ। পূজা-বিয়ের জন্য চমৎকার।", price: 3200, stock: 5, category: "cloth", sellerId: "u3", image: IMG.saree2, rating: 4.9, reviews: mkReviews(5), status: "approved", sales: 18, createdAt: "২০২৫-১০-১০" },
  { id: "p6", name: "রিকশা আর্ট ক্যানভাস পেইন্টিং", desc: "ঢাকার ঐতিহ্যবাহী রিকশা আর্টের আদলে অ্যাক্রেলিক ক্যানভাস পেইন্টিং। সাইজ ১৮×২৪ ইঞ্চি, ফ্রেমসহ ডেলিভারি।", price: 2400, stock: 6, category: "art", sellerId: "u5", image: IMG.art1, rating: 4.8, reviews: mkReviews(6), status: "approved", sales: 12, createdAt: "২০২৫-১০-১৮" },
  { id: "p7", name: "মুক্তোর হ্যান্ডমেড নেকলেস", desc: "হ্যান্ডপিক করা মুক্তো ও পাথরের গয়না, মরিচা-প্রতিরোধী তারে বাঁধা। প্রতিদিনের পরনে হালকা ও নিরাপদ।", price: 850, stock: 25, category: "jewelry", sellerId: "u5", image: IMG.jewelry1, rating: 4.4, reviews: mkReviews(7), status: "approved", sales: 38, createdAt: "২০২৫-০৯-২৫" },
  { id: "p8", name: "সুন্দরবনের খাঁটি মধু (৫০০ গ্রাম)", desc: "মৌয়েলদের কাছ থেকে সরাসরি সংগ্রহ করা বন্য মধু। কোনো ভেজাল নেই — ল্যাব টেস্টেড। সিল করা ফুড-গ্রেড বোতলে।", price: 750, stock: 30, category: "food", sellerId: "u6", image: IMG.honey1, rating: 4.9, reviews: mkReviews(8), status: "approved", sales: 56, createdAt: "২০২৫-০৮-০৫" },
  { id: "p9", name: "নিম-আদা হ্যান্ডমেড সাবান (৩টির সেট)", desc: "ঠান্ডা পদ্ধতিতে তৈরি প্রাকৃতিক সাবান — নিম, আদা ও নারকেল তেলে। রাসায়নিকমুক্ত, ত্বকের জন্য নরম।", price: 350, stock: 40, category: "cosmetics", sellerId: "u4", image: IMG.soap1, rating: 4.6, reviews: mkReviews(9), status: "approved", sales: 61, createdAt: "২০২৫-১০-০১" },
  { id: "p10", name: "খোদাই করা কাঠের টেবিল ল্যাম্প", desc: "শিশু কাঠে হাতে খোদাই করা ভিত্তি, উষ্ণ হলুদ আলোর ইন্ডোর ল্যাম্প। বারান্দা বা পাশরুমের জন্য ঝলমলে সংযোজন।", price: 2100, stock: 7, category: "decor", sellerId: "u2", image: IMG.wood1, rating: 4.7, reviews: mkReviews(10), status: "approved", sales: 9, createdAt: "২০২৫-১০-২২" },
  { id: "p11", name: "চামড়ার হ্যান্ডমেড ওয়ালেট", desc: "আসল গরুর চামড়ায় হাতে সেলাই করা পাতলা ওয়ালেট — ৬টি কার্ড স্লট ও ২টি নোট পকেট। সময়ের সাথে সাথে আরও সুন্দর হবে।", price: 1100, stock: 10, category: "leather", sellerId: "u2", image: IMG.leather1, rating: 4.5, reviews: mkReviews(11), status: "approved", sales: 24, createdAt: "২০২৫-০৯-১২" },
  { id: "p12", name: "ব্লক প্রিন্ট তাঁতের ওড়না", desc: "কাঠের ব্লকে হাতে ছাপার প্রাকৃতিক রঙের ওড়না। সুতির তাঁতে বোনা, ধোয়ার পরেও রঙ টিকে থাকে।", price: 1400, stock: 9, category: "cloth", sellerId: "u3", image: IMG.saree3, rating: 4.6, reviews: mkReviews(12), status: "approved", sales: 15, createdAt: "২০২৫-১০-২৮" },
  { id: "p13", name: "মাটির পুতুল (৫টির সেট)", desc: "রংপুরের কুমারপাড়ার শিল্পীদের গড়া রঙিন মাটির পুতুল। বাচ্চাদের খেলনা ও শোকেস সাজের দুই-ই উপযোগী।", price: 750, stock: 14, category: "handicraft", sellerId: "u5", image: IMG.dolls1, rating: 4.8, reviews: mkReviews(13), status: "approved", sales: 27, createdAt: "২০২৫-১১-০২" },
  { id: "p14", name: "বাঁশের ফুলদানি", desc: "মসৃণ করা বাঁশের ফুলদানি, ভেতরে পানিরোধী লেপ। শুকনো ফুল বা আস্ত ফুল — দুই ব্যবহারেই সুন্দর।", price: 550, stock: 18, category: "bamboo", sellerId: "u4", image: IMG.bamboo3, rating: 4.3, reviews: mkReviews(14), status: "approved", sales: 19, createdAt: "২০২৫-১০-০৫" },
  { id: "p15", name: "গ্রামবাংলার দৃশ্য — জলরঙ আর্ট", desc: "নদী, নৌকা আর ধানখেতের জলরঙ চিত্রকর্ম। হাতে আঁকা একক পিস — প্রতিটিই অনন্য। ১২×১৬ ইঞ্চি, ফ্রেম ছাড়া।", price: 3500, stock: 4, category: "art", sellerId: "u5", image: IMG.art2, rating: 4.7, reviews: mkReviews(15), status: "approved", sales: 6, createdAt: "২০২৫-১১-০৮" },
  { id: "p16", name: "নকশি প্যানেল ওয়াল হ্যাংগিং", desc: "ঘর সাজানোর জন্য ঐতিহ্যবাহী নকশি প্যানেল — পাখি ও ফুলের নকশা। লাঠি সহ ঝোলানোর ব্যবস্থা আছে।", price: 1600, stock: 6, category: "decor", sellerId: "u3", image: IMG.kantha3, rating: 4.9, reviews: mkReviews(16), status: "approved", sales: 11, createdAt: "২০২৫-১১-১২" },
  // অ্যাডমিন রিভিউর অপেক্ষায় (ডেমো)
  { id: "p17", name: "টেরাকোটা ফ্লাওয়ার ভাস", desc: "পোড়ামাটির হাতে গড়া ফুলদানি — বারান্দার জন্য আদর্শ।", price: 900, stock: 10, category: "decor", sellerId: "u2", image: IMG.pottery2, rating: 0, reviews: [], status: "pending", sales: 0, createdAt: "২০২৬-১১-০৪" },
  { id: "p18", name: "খেজুর গুড় (ভাপা, ১ কেজি)", desc: "রংপুরের খেজুর গাছের রস থেকে তৈরি আসল ভাপা গুড়।", price: 400, stock: 25, category: "food", sellerId: "u6", image: IMG.honey2, rating: 0, reviews: [], status: "pending", sales: 0, createdAt: "২০২৬-১১-০৪" },
];

// ---------------- প্রাথমিক অর্ডার (ডেমো) ----------------
export const INITIAL_ORDERS: Order[] = [
  {
    id: "ord-1021", groupId: "grp-501", customerName: "রিনা আক্তার", phone: "০১৭১১-০০১১১১",
    address: "বাড়ি ১২, রোড ৩, শাপলা চত্বর", area: "রংপুর সদর", payment: "bkash",
    items: [
      { productId: "p1", name: "নকশি কাঁথা (শালের কাঁথা)", price: 1850, qty: 1, image: IMG.kantha1 },
      { productId: "p13", name: "মাটির পুতুল (৫টির সেট)", price: 750, qty: 1, image: IMG.dolls1 },
    ],
    sellerId: "u3", subtotal: 2600, delivery: 60, total: 2660, commission: 260, sellerEarning: 2340,
    status: "delivered", createdAt: "২০২৬-১০-১৪",
  },
  {
    id: "ord-1022", groupId: "grp-502", customerName: "রিনা আক্তার", phone: "০১৭১১-০০১১১১",
    address: "বাড়ি ১২, রোড ৩, শাপলা চত্বর", area: "রংপুর সদর", payment: "cod",
    items: [{ productId: "p8", name: "সুন্দরবনের খাঁটি মধু (৫০০ গ্রাম)", price: 750, qty: 2, image: IMG.honey1 }],
    sellerId: "u6", subtotal: 1500, delivery: 60, total: 1560, commission: 150, sellerEarning: 1350,
    status: "shipping", createdAt: "২০২৬-১১-০১",
  },
  {
    id: "ord-1023", groupId: "grp-502", customerName: "রিনা আক্তার", phone: "০১৭১১-০০১১১১",
    address: "বাড়ি ১২, রোড ৩, শাপলা চত্বর", area: "রংপুর সদর", payment: "cod",
    items: [{ productId: "p3", name: "বাঁশের হ্যান্ডমেড ঝুড়ি", price: 650, qty: 1, image: IMG.bamboo1 }],
    sellerId: "u4", subtotal: 650, delivery: 60, total: 710, commission: 65, sellerEarning: 585,
    status: "processing", createdAt: "২০২৬-১১-০১",
  },
  {
    id: "ord-1024", groupId: "grp-503", customerName: "কামরুল হাসান", phone: "০১৮১১-৩৩৪৪৫৫",
    address: "ফ্ল্যাট ৪বি, আশিক টাওয়ার, জাহাজকোম্পানী মোড়", area: "রংপুর সদর", payment: "nagad",
    items: [{ productId: "p11", name: "চামড়ার হ্যান্ডমেড ওয়ালেট", price: 1100, qty: 1, image: IMG.leather1 }],
    sellerId: "u2", subtotal: 1100, delivery: 60, total: 1160, commission: 110, sellerEarning: 990,
    status: "confirmed", createdAt: "২০২৬-১১-০৩",
  },
];

// ---------------- নোটিফিকেশন (শুরুর ডেমো) ----------------
export const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: "n1", text: "আপনার অর্ডার ord-1022 ডেলিভারিতে আছে 🚚", time: "২ ঘণ্টা আগে", role: "customer" },
  { id: "n2", text: "নতুন সেলার আবেদন: রংপুর বাঁশশিল্প — যাচাই করুন", time: "৫ ঘণ্টা আগে", role: "admin" },
  { id: "n3", text: "নতুন পণ্য রিভিউর অপেক্ষায়: টেরাকোটা ফ্লাওয়ার ভাস", time: "৫ ঘণ্টা আগে", role: "admin" },
  { id: "n4", text: "নতুন অর্ডার ord-1024 — করিম হস্তশিল্প", time: "১ দিন আগে", role: "seller" },
];
