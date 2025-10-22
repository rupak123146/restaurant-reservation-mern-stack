// Mock restaurant data
export const restaurants = [
  {
    id: 1,
    name: "Annapoorna Restaurant",
    cuisine: "South Indian",
    rating: 4.8,
    priceRange: "₹300-600",
    location: "Chennai",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400",
    description: "Authentic South Indian cuisine with traditional dosas, idlis, and sambar. Pure vegetarian restaurant.",
    phone: "+91 44 1234-5678",
    address: "123 Anna Salai, Chennai",
    hours: "6:00 AM - 10:00 PM",
    availableSlots: ["6:00 PM", "7:30 PM", "9:00 PM"],
    isAvailable: true,
    availableSeats: 15
  },
  {
    id: 2,
    name: "Murugan Idli Shop",
    cuisine: "South Indian",
    rating: 4.9,
    priceRange: "₹100-300",
    location: "Coimbatore",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=200&fit=crop",
    description: "Famous for soft idlis and variety of chutneys. Traditional Tamil Nadu breakfast and tiffin items.",
    phone: "+91 422 234-5678",
    address: "456 Race Course Road, Coimbatore",
    hours: "6:00 AM - 11:00 PM",
    availableSlots: ["6:30 PM", "8:00 PM", "9:30 PM"],
    isAvailable: false,
    availableSeats: 0
  },
  {
    id: 3,
    name: "Chettinad Palace",
    cuisine: "South Indian",
    rating: 4.6,
    priceRange: "₹600-1000",
    location: "Madurai",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400",
    description: "Authentic Chettinad cuisine with spicy curries and traditional non-vegetarian dishes.",
    phone: "+91 452 345-6789",
    address: "789 West Masi Street, Madurai",
    hours: "12:00 PM - 10:00 PM",
    availableSlots: ["7:00 PM", "8:30 PM", "10:00 PM"],
    isAvailable: true,
    availableSeats: 8
  },
  {
    id: 4,
    name: "Saravana Bhavan",
    cuisine: "South Indian",
    rating: 4.7,
    priceRange: "₹300-600",
    location: "Trichy",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400",
    description: "World-famous South Indian vegetarian restaurant chain. Authentic Tamil cuisine and sweets.",
    phone: "+91 431 456-7890",
    address: "321 Bharathidasan Salai, Trichy",
    hours: "6:00 AM - 11:00 PM",
    availableSlots: ["6:00 PM", "7:30 PM", "9:00 PM", "10:30 PM"],
    isAvailable: true,
    availableSeats: 12
  },
  {
    id: 5,
    name: "Aryaas Restaurant",
    cuisine: "South Indian",
    rating: 4.5,
    priceRange: "₹300-600",
    location: "Salem",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
    description: "Traditional Kerala and Tamil cuisine with variety of vegetarian and non-vegetarian options.",
    phone: "+91 427 567-8901",
    address: "654 Cherry Road, Salem",
    hours: "6:00 AM - 10:00 PM",
    availableSlots: ["6:30 PM", "8:00 PM", "9:30 PM"],
    isAvailable: true,
    availableSeats: 6
  },
  {
    id: 6,
    name: "Ponram Fish Curry",
    cuisine: "South Indian",
    rating: 4.4,
    priceRange: "₹300-600",
    location: "Kanyakumari",
    image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400",
    description: "Coastal Tamil Nadu seafood specialties with fresh fish curry and traditional preparations.",
    phone: "+91 4652 678-9012",
    address: "987 Beach Road, Kanyakumari",
    hours: "11:00 AM - 11:00 PM",
    availableSlots: ["6:00 PM", "7:30 PM", "9:00 PM", "10:30 PM"],
    isAvailable: true,
    availableSeats: 10
  }
];

export const cuisines = [
  "All", "South Indian", "North Indian", "Chinese", "Continental"
];

export const locations = [
  "All", "Chennai", "Coimbatore", "Madurai", "Trichy", "Salem", "Kanyakumari"
];

export const priceRanges = [
  "All", "₹100-300", "₹300-600", "₹600-1000", "₹1000+"
];
