// Dummy Data for Thrift Store Platform

export type Condition = "New" | "Like New" | "Good" | "Fair";
export type Category = "Second-hand Clothes" | "Second-hand Books" | "Arts & Crafts";
export type ListingStatus = "Active" | "Draft" | "Sold" | "Archived";
export type OrderStatus = "Pending" | "Confirmed" | "Dispatched" | "Completed" | "Cancelled";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  location: string;
  rating: number;
  reviewCount: number;
  joinedAt: string;
  isBlocked: boolean;
  role: "buyer" | "seller" | "admin";
  totalListings: number;
  totalSales: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: Condition;
  category: Category;
  status: ListingStatus;
  images: string[];
  seller: User;
  location: string;
  createdAt: string;
  expiresAt: string;
  views: number;
  wishlistCount: number;
}

export interface Order {
  id: string;
  product: Product;
  buyer: User;
  seller: User;
  status: OrderStatus;
  buyerNote: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusHistory[];
}

export interface StatusHistory {
  status: OrderStatus;
  note: string;
  changedAt: string;
}

export interface Review {
  id: string;
  buyer: User;
  seller: User;
  rating: number;
  comment: string;
  createdAt: string;
  orderId: string;
}

export interface Payment {
  id: string;
  productTitle: string;
  amount: number;
  currency: string;
  method: string;
  status: "success" | "failed" | "pending" | "refunded";
  transactionRef: string;
  paidAt: string;
}

// ---- USERS ----
export const CURRENT_USER: User = {
  id: "u1",
  name: "Alex Johnson",
  email: "alex@example.com",
  phone: "+14155552671",
  avatar: "https://i.pravatar.cc/150?img=12",
  location: "New York, NY",
  rating: 4.7,
  reviewCount: 23,
  joinedAt: "2024-03-15",
  isBlocked: false,
  role: "seller",
  totalListings: 12,
  totalSales: 8,
};

export const USERS: User[] = [
  CURRENT_USER,
  {
    id: "u2",
    name: "Sarah Miller",
    email: "sarah@example.com",
    phone: "+14155553892",
    avatar: "https://i.pravatar.cc/150?img=47",
    location: "Los Angeles, CA",
    rating: 4.9,
    reviewCount: 41,
    joinedAt: "2023-11-02",
    isBlocked: false,
    role: "seller",
    totalListings: 27,
    totalSales: 22,
  },
  {
    id: "u3",
    name: "Marcus Chen",
    email: "marcus@example.com",
    phone: "+14155554320",
    avatar: "https://i.pravatar.cc/150?img=33",
    location: "Chicago, IL",
    rating: 4.3,
    reviewCount: 15,
    joinedAt: "2024-01-18",
    isBlocked: false,
    role: "seller",
    totalListings: 8,
    totalSales: 5,
  },
  {
    id: "u4",
    name: "Priya Patel",
    email: "priya@example.com",
    phone: "+14155556712",
    avatar: "https://i.pravatar.cc/150?img=56",
    location: "Austin, TX",
    rating: 4.8,
    reviewCount: 32,
    joinedAt: "2023-08-29",
    isBlocked: false,
    role: "seller",
    totalListings: 19,
    totalSales: 16,
  },
  {
    id: "u5",
    name: "Jake Williams",
    email: "jake@example.com",
    phone: "+14155558901",
    avatar: "https://i.pravatar.cc/150?img=68",
    location: "Seattle, WA",
    rating: 3.9,
    reviewCount: 9,
    joinedAt: "2024-05-10",
    isBlocked: true,
    role: "buyer",
    totalListings: 3,
    totalSales: 1,
  },
];

// ---- PRODUCTS ----
export const PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "Vintage Levi's 501 Jeans - Classic Blue",
    description: "Authentic vintage Levi's 501 jeans from the 1990s. Perfect fade and wear patterns. Waist 32, Length 30. Minor wear on back pocket but otherwise excellent condition. A true wardrobe staple that never goes out of style.",
    price: 45.00,
    condition: "Like New",
    category: "Second-hand Clothes",
    status: "Active",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800",
      "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=800",
      "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800",
    ],
    seller: USERS[1],
    location: "Los Angeles, CA",
    createdAt: "2025-04-01",
    expiresAt: "2025-05-31",
    views: 234,
    wishlistCount: 18,
  },
  {
    id: "p2",
    title: "The Great Gatsby - First Edition Replica",
    description: "Beautifully restored replica of the 1925 first edition cover. This hardcover edition is in excellent condition with minimal wear. Perfect for book collectors and Fitzgerald fans alike.",
    price: 28.50,
    condition: "Good",
    category: "Second-hand Books",
    status: "Active",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
    ],
    seller: USERS[2],
    location: "Chicago, IL",
    createdAt: "2025-03-28",
    expiresAt: "2025-05-27",
    views: 89,
    wishlistCount: 7,
  },
  {
    id: "p3",
    title: "Handmade Macramé Wall Hanging - Boho Decor",
    description: "Handcrafted macramé wall hanging made from 100% natural cotton rope. Measures 24\" wide x 36\" tall. Perfect for boho, farmhouse, or Scandinavian decor styles. Made with love in Seattle.",
    price: 65.00,
    condition: "New",
    category: "Arts & Crafts",
    status: "Active",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
    ],
    seller: USERS[0],
    location: "New York, NY",
    createdAt: "2025-04-05",
    expiresAt: "2025-06-04",
    views: 156,
    wishlistCount: 24,
  },
  {
    id: "p4",
    title: "Zara Wool Blend Coat - Camel, Size M",
    description: "Stunning Zara camel coat in wool blend. Size M, fits true to size. Only worn 3 times, in perfect condition. No pills, tears or stains. Great for fall/winter layering.",
    price: 85.00,
    condition: "Like New",
    category: "Second-hand Clothes",
    status: "Active",
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
      "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800",
    ],
    seller: USERS[3],
    location: "Austin, TX",
    createdAt: "2025-04-10",
    expiresAt: "2025-06-09",
    views: 312,
    wishlistCount: 41,
  },
  {
    id: "p5",
    title: "Atomic Habits by James Clear - Hardcover",
    description: "Hardcover edition of Atomic Habits, one of the best self-improvement books of the decade. Barely read, no highlighting or notes. Spine is crisp. A must-have for anyone looking to build better habits.",
    price: 18.00,
    condition: "Like New",
    category: "Second-hand Books",
    status: "Active",
    images: [
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=800",
      "https://images.unsplash.com/photo-1550399105-c4db5952235a?w=800",
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=800",
    ],
    seller: USERS[1],
    location: "Los Angeles, CA",
    createdAt: "2025-04-12",
    expiresAt: "2025-06-11",
    views: 67,
    wishlistCount: 5,
  },
  {
    id: "p6",
    title: "Hand-Painted Ceramic Mug Set (Set of 4)",
    description: "Unique hand-painted ceramic mugs with botanical motifs. Each mug is one-of-a-kind, dishwasher safe. Holds 12oz. Perfect gift or for adding artisanal charm to your kitchen.",
    price: 48.00,
    condition: "New",
    category: "Arts & Crafts",
    status: "Active",
    images: [
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800",
      "https://images.unsplash.com/photo-1572635148818-ef6fd45eb394?w=800",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
    ],
    seller: USERS[3],
    location: "Austin, TX",
    createdAt: "2025-04-08",
    expiresAt: "2025-06-07",
    views: 198,
    wishlistCount: 29,
  },
  {
    id: "p7",
    title: "Nike Air Force 1 '07 - White, Size 10",
    description: "Classic Nike Air Force 1s in white. Size 10 US. Worn only a handful of times, kept clean. No yellowing, original box included. These are an iconic silhouette that goes with everything.",
    price: 70.00,
    condition: "Good",
    category: "Second-hand Clothes",
    status: "Active",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800",
    ],
    seller: USERS[0],
    location: "New York, NY",
    createdAt: "2025-04-02",
    expiresAt: "2025-06-01",
    views: 445,
    wishlistCount: 53,
  },
  {
    id: "p8",
    title: "Sapiens: A Brief History of Humankind",
    description: "Yuval Noah Harari's groundbreaking book in paperback. Some light highlighting in first 3 chapters, otherwise pristine. A fascinating read that will change how you see the world.",
    price: 14.00,
    condition: "Good",
    category: "Second-hand Books",
    status: "Active",
    images: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800",
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800",
    ],
    seller: USERS[2],
    location: "Chicago, IL",
    createdAt: "2025-04-14",
    expiresAt: "2025-06-13",
    views: 43,
    wishlistCount: 3,
  },
  {
    id: "p9",
    title: "Crocheted Plant Hanger Set - 3 Piece",
    description: "Set of 3 crocheted macramé plant hangers in various sizes. Handmade from natural jute. Perfect for displaying your indoor plants. Suitable for pots up to 8 inches in diameter.",
    price: 35.00,
    condition: "New",
    category: "Arts & Crafts",
    status: "Sold",
    images: [
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800",
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800",
    ],
    seller: USERS[3],
    location: "Austin, TX",
    createdAt: "2025-03-20",
    expiresAt: "2025-05-19",
    views: 271,
    wishlistCount: 19,
  },
  {
    id: "p10",
    title: "Vintage Polaroid Camera - SX-70",
    description: "Working Polaroid SX-70 from the 1970s. Tested and fully functional. Comes with partial pack of film. Leather is in great condition with minimal wear. A true collector's piece.",
    price: 120.00,
    condition: "Good",
    category: "Arts & Crafts",
    status: "Active",
    images: [
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800",
      "https://images.unsplash.com/photo-1495121553079-4c61bcce1894?w=800",
    ],
    seller: USERS[1],
    location: "Los Angeles, CA",
    createdAt: "2025-04-16",
    expiresAt: "2025-06-15",
    views: 389,
    wishlistCount: 47,
  },
  {
    id: "p11",
    title: "H&M Floral Summer Dress - Size S",
    description: "Beautiful floral midi dress from H&M Conscious collection. Size Small. Only worn once to a garden party. Dry cleaned and ready to wear. Features adjustable straps and side pockets.",
    price: 22.00,
    condition: "Like New",
    category: "Second-hand Clothes",
    status: "Active",
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800",
    ],
    seller: USERS[0],
    location: "New York, NY",
    createdAt: "2025-04-18",
    expiresAt: "2025-06-17",
    views: 127,
    wishlistCount: 14,
  },
  {
    id: "p12",
    title: "The Psychology of Money - Hardcover",
    description: "Morgan Housel's brilliant exploration of wealth and decision-making. Hardcover, like new condition. No marks or damage. One of the most impactful finance books of the last decade.",
    price: 20.00,
    condition: "Like New",
    category: "Second-hand Books",
    status: "Draft",
    images: [
      "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800",
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800",
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=800",
    ],
    seller: USERS[0],
    location: "New York, NY",
    createdAt: "2025-04-20",
    expiresAt: "2025-06-19",
    views: 0,
    wishlistCount: 0,
  },
];

// ---- ORDERS ----
export const ORDERS: Order[] = [
  {
    id: "ord1",
    product: PRODUCTS[0],
    buyer: CURRENT_USER,
    seller: USERS[1],
    status: "Completed",
    buyerNote: "Please ship as soon as possible, thanks!",
    createdAt: "2025-04-02",
    updatedAt: "2025-04-10",
    statusHistory: [
      { status: "Pending", note: "Order placed", changedAt: "2025-04-02T10:00:00Z" },
      { status: "Confirmed", note: "Seller confirmed availability", changedAt: "2025-04-03T09:00:00Z" },
      { status: "Dispatched", note: "Shipped via USPS", changedAt: "2025-04-06T14:00:00Z" },
      { status: "Completed", note: "Buyer confirmed receipt", changedAt: "2025-04-10T11:00:00Z" },
    ],
  },
  {
    id: "ord2",
    product: PRODUCTS[3],
    buyer: CURRENT_USER,
    seller: USERS[3],
    status: "Dispatched",
    buyerNote: "",
    createdAt: "2025-04-15",
    updatedAt: "2025-04-18",
    statusHistory: [
      { status: "Pending", note: "Order placed", changedAt: "2025-04-15T16:30:00Z" },
      { status: "Confirmed", note: "Available and ready", changedAt: "2025-04-16T10:00:00Z" },
      { status: "Dispatched", note: "Shipped via FedEx, tracking #FX98234", changedAt: "2025-04-18T12:00:00Z" },
    ],
  },
  {
    id: "ord3",
    product: PRODUCTS[6],
    buyer: USERS[2],
    seller: CURRENT_USER,
    status: "Pending",
    buyerNote: "Can you include original box?",
    createdAt: "2025-04-20",
    updatedAt: "2025-04-20",
    statusHistory: [
      { status: "Pending", note: "Order placed", changedAt: "2025-04-20T08:45:00Z" },
    ],
  },
  {
    id: "ord4",
    product: PRODUCTS[2],
    buyer: USERS[3],
    seller: CURRENT_USER,
    status: "Confirmed",
    buyerNote: "Looks amazing!",
    createdAt: "2025-04-17",
    updatedAt: "2025-04-18",
    statusHistory: [
      { status: "Pending", note: "Order placed", changedAt: "2025-04-17T11:00:00Z" },
      { status: "Confirmed", note: "Ready to dispatch", changedAt: "2025-04-18T09:00:00Z" },
    ],
  },
];

// ---- REVIEWS ----
export const REVIEWS: Review[] = [
  {
    id: "rev1",
    buyer: CURRENT_USER,
    seller: USERS[1],
    rating: 5,
    comment: "Absolutely fantastic seller! The jeans were exactly as described and shipped super fast. Highly recommend!",
    createdAt: "2025-04-11",
    orderId: "ord1",
  },
  {
    id: "rev2",
    buyer: USERS[2],
    seller: CURRENT_USER,
    rating: 4,
    comment: "Great item, well packaged. Took a couple extra days to ship but worth the wait.",
    createdAt: "2025-03-28",
    orderId: "ord3",
  },
  {
    id: "rev3",
    buyer: USERS[3],
    seller: USERS[1],
    rating: 5,
    comment: "Sarah is the best seller on this platform! Everything is always perfect.",
    createdAt: "2025-04-05",
    orderId: "ord4",
  },
  {
    id: "rev4",
    buyer: USERS[1],
    seller: CURRENT_USER,
    rating: 5,
    comment: "Wonderful transaction. Item was exactly as described, fast shipping!",
    createdAt: "2025-03-15",
    orderId: "ord4",
  },
  {
    id: "rev5",
    buyer: USERS[0],
    seller: USERS[2],
    rating: 3,
    comment: "Item was okay but the condition was slightly worse than advertised. Seller was responsive though.",
    createdAt: "2025-04-08",
    orderId: "ord2",
  },
];

// ---- PAYMENTS ----
export const PAYMENTS: Payment[] = [
  {
    id: "pay1",
    productTitle: "Handmade Macramé Wall Hanging",
    amount: 4.99,
    currency: "USD",
    method: "Card",
    status: "success",
    transactionRef: "TXN-2025041503822",
    paidAt: "2025-04-05T10:22:00Z",
  },
  {
    id: "pay2",
    productTitle: "Nike Air Force 1 '07 - White",
    amount: 4.99,
    currency: "USD",
    method: "Card",
    status: "success",
    transactionRef: "TXN-2025040207814",
    paidAt: "2025-04-02T14:10:00Z",
  },
  {
    id: "pay3",
    productTitle: "H&M Floral Summer Dress",
    amount: 4.99,
    currency: "USD",
    method: "Card",
    status: "success",
    transactionRef: "TXN-2025041809231",
    paidAt: "2025-04-18T09:45:00Z",
  },
  {
    id: "pay4",
    productTitle: "The Psychology of Money",
    amount: 4.99,
    currency: "USD",
    method: "Card",
    status: "failed",
    transactionRef: "TXN-2025042012345",
    paidAt: "2025-04-20T16:30:00Z",
  },
];

// ---- ADMIN STATS ----
export const ADMIN_STATS = {
  totalUsers: 1842,
  totalActiveListings: 634,
  totalRevenue: 8921.43,
  totalOrders: 1289,
  newUsersThisMonth: 124,
  revenueThisMonth: 1243.51,
  flaggedItems: 7,
  pendingReports: 3,
};

export const REVENUE_DATA = [
  { month: "Nov", revenue: 620 },
  { month: "Dec", revenue: 890 },
  { month: "Jan", revenue: 740 },
  { month: "Feb", revenue: 1020 },
  { month: "Mar", revenue: 980 },
  { month: "Apr", revenue: 1243 },
];

export const FLAGGED_ITEMS = [
  {
    id: "flag1",
    type: "listing" as const,
    title: "Suspicious Designer Bag Listing",
    reporter: USERS[2],
    reason: "Possible counterfeit item - images look stock",
    createdAt: "2025-04-19",
    status: "pending" as const,
  },
  {
    id: "flag2",
    type: "review" as const,
    title: "Offensive language in review",
    reporter: USERS[1],
    reason: "Contains inappropriate language and personal attacks",
    createdAt: "2025-04-18",
    status: "pending" as const,
  },
  {
    id: "flag3",
    type: "user" as const,
    title: "Account: Jake Williams",
    reporter: USERS[3],
    reason: "Multiple fake listings, possible scammer",
    createdAt: "2025-04-17",
    status: "pending" as const,
  },
];

export const CATEGORIES: { name: Category; icon: string; count: number; color: string }[] = [
  { name: "Second-hand Clothes", icon: "👗", count: 342, color: "from-emerald-500/20 to-teal-500/20" },
  { name: "Second-hand Books", icon: "📚", count: 189, color: "from-violet-500/20 to-purple-500/20" },
  { name: "Arts & Crafts", icon: "🎨", count: 103, color: "from-amber-500/20 to-orange-500/20" },
];

export const WISHLIST_PRODUCTS = [PRODUCTS[3], PRODUCTS[6], PRODUCTS[9]];
