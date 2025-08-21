import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { FaShoppingCart, FaStar, FaRecycle, FaHeart, FaLeaf, FaPalette, FaLightbulb } from "react-icons/fa";
import "../styles/RefurbishedStore.css";

const RefurbishedStore = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fresh upcycled products data
  const upcycledProducts = [
    {
      id: "1",
      name: "Upcycled Plastic Bottle Planters",
      description: "Beautiful planters made from recycled plastic bottles, perfect for indoor and outdoor gardening",
      price: 299,
      originalPrice: 599,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop",
      rating: 4.8,
      reviews: 156,
      category: "Home & Garden",
      warranty: "6 Months",
      material: "Recycled Plastic"
    },
    {
      id: "2",
      name: "Upcycled Tire Ottoman",
      description: "Stylish ottoman crafted from old car tires, comfortable and eco-friendly seating solution",
      price: 899,
      originalPrice: 1499,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=200&fit=crop",
      rating: 4.9,
      reviews: 89,
      category: "Furniture",
      warranty: "1 Year",
      material: "Recycled Tires"
    },
    {
      id: "3",
      name: "Upcycled Denim Tote Bags",
      description: "Durable and stylish tote bags made from recycled denim jeans, perfect for shopping",
      price: 199,
      originalPrice: 399,
      image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=300&h=200&fit=crop",
      rating: 4.7,
      reviews: 234,
      category: "Fashion",
      warranty: "3 Months",
      material: "Recycled Denim"
    },
    {
      id: "4",
      name: "Upcycled Glass Bottle Lamps",
      description: "Elegant table lamps crafted from recycled glass bottles, creates beautiful ambient lighting",
      price: 599,
      originalPrice: 999,
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&h=200&fit=crop",
      rating: 4.6,
      reviews: 178,
      category: "Lighting",
      warranty: "1 Year",
      material: "Recycled Glass"
    },
    {
      id: "5",
      name: "Upcycled Wooden Pallet Coffee Table",
      description: "Rustic coffee table made from recycled wooden pallets, perfect for modern homes",
      price: 1299,
      originalPrice: 1999,
      image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=300&h=200&fit=crop",
      rating: 4.8,
      reviews: 145,
      category: "Furniture",
      warranty: "2 Years",
      material: "Recycled Wood"
    },
    {
      id: "6",
      name: "Upcycled Newspaper Baskets",
      description: "Handcrafted baskets made from rolled newspaper, perfect for storage and decoration",
      price: 149,
      originalPrice: 299,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
      rating: 4.5,
      reviews: 267,
      category: "Home Decor",
      warranty: "3 Months",
      material: "Recycled Newspaper"
    },
    {
      id: "7",
      name: "Upcycled Metal Can Wall Art",
      description: "Creative wall art made from recycled metal cans, adds unique character to any room",
      price: 399,
      originalPrice: 699,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
      rating: 4.7,
      reviews: 98,
      category: "Wall Art",
      warranty: "6 Months",
      material: "Recycled Metal"
    },
    {
      id: "8",
      name: "Upcycled Fabric Quilted Blankets",
      description: "Cozy blankets made from recycled fabric scraps, each piece tells a unique story",
      price: 449,
      originalPrice: 799,
      image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=300&h=200&fit=crop",
      rating: 4.9,
      reviews: 189,
      category: "Home & Living",
      warranty: "1 Year",
      material: "Recycled Fabric"
    },
    {
      id: "9",
      name: "Upcycled Vinyl Record Clock",
      description: "Unique wall clock made from recycled vinyl records, perfect for music lovers",
      price: 299,
      originalPrice: 499,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
      rating: 4.6,
      reviews: 134,
      category: "Home Decor",
      warranty: "6 Months",
      material: "Recycled Vinyl"
    },
    {
      id: "10",
      name: "Upcycled Bicycle Wheel Chandelier",
      description: "Stunning chandelier crafted from recycled bicycle wheels, creates dramatic lighting",
      price: 899,
      originalPrice: 1499,
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&h=200&fit=crop",
      rating: 4.8,
      reviews: 76,
      category: "Lighting",
      warranty: "1 Year",
      material: "Recycled Metal"
    },
    {
      id: "11",
      name: "Upcycled Cork Coasters",
      description: "Eco-friendly coasters made from recycled wine corks, protects surfaces beautifully",
      price: 99,
      originalPrice: 199,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
      rating: 4.4,
      reviews: 312,
      category: "Home & Living",
      warranty: "3 Months",
      material: "Recycled Cork"
    },
    {
      id: "12",
      name: "Upcycled Magazine Paper Beads",
      description: "Handcrafted jewelry made from rolled magazine paper, unique and sustainable fashion",
      price: 199,
      originalPrice: 349,
      image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=300&h=200&fit=crop",
      rating: 4.7,
      reviews: 223,
      category: "Jewelry",
      warranty: "3 Months",
      material: "Recycled Paper"
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "upcycledProducts"));
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        // Use upcycled products if Firestore is empty
        if (productList.length === 0) {
          setProducts(upcycledProducts);
        } else {
          setProducts(productList);
        }
      } catch (error) {
        console.log("Using upcycled products due to Firestore error:", error);
        setProducts(upcycledProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleBuyNow = (product) => {
    alert(`Coming Soon! 🚀\n\n${product.name} will be available for purchase soon.\n\nPrice: ₹${product.price}\nOriginal Price: ₹${product.originalPrice}\nMaterial: ${product.material}\n\nStay tuned for our e-commerce launch!`);
  };

  const handleAddToCart = (product) => {
    alert(`Coming Soon! 🛒\n\nCart functionality will be available soon.\n\n${product.name} would be added to your cart.\n\nPrice: ₹${product.price}`);
  };

  const handleWishlist = (product) => {
    alert(`Coming Soon! ❤️\n\nWishlist functionality will be available soon.\n\n${product.name} would be added to your wishlist.`);
  };

  if (loading) {
    return (
      <div className="refurbished-store">
        <div className="loading-spinner">
          <FaRecycle className="spinner" />
          <p>Loading upcycled products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="refurbished-store">
      <div className="store-header">
        <h1>♻️ Upcycled Products Store</h1>
        <p>Discover unique, sustainable products crafted from recycled materials. Each item tells a story of transformation and environmental consciousness.</p>
      </div>

      <div className="store-stats">
        <div className="stat-item">
          <FaRecycle />
          <span>100% Recycled</span>
        </div>
        <div className="stat-item">
          <FaLeaf />
          <span>Eco-Friendly</span>
        </div>
        <div className="stat-item">
          <FaPalette />
          <span>Handcrafted</span>
        </div>
        <div className="stat-item">
          <FaLightbulb />
          <span>Creative Design</span>
        </div>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
              <div className="product-overlay">
                <button 
                  className="wishlist-btn"
                  onClick={() => handleWishlist(product)}
                >
                  <FaHeart />
                </button>
                <div className="product-category">{product.category}</div>
              </div>
            </div>
            
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              
              <div className="product-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={i < Math.floor(product.rating) ? "star filled" : "star"} 
                    />
                  ))}
                </div>
                <span className="rating-text">{product.rating} ({product.reviews} reviews)</span>
              </div>

              <div className="product-pricing">
                <div className="price-container">
                  <span className="current-price">₹{product.price}</span>
                  <span className="original-price">₹{product.originalPrice}</span>
                  <span className="discount">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </div>
              </div>

              <div className="product-warranty">
                <FaRecycle />
                <span>{product.warranty} Warranty • {product.material}</span>
              </div>

              <div className="product-actions">
                <button 
                  className="buy-now-btn"
                  onClick={() => handleBuyNow(product)}
                >
                  Buy Now
                </button>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  <FaShoppingCart /> Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="coming-soon-banner">
        <h2>🚀 E-Commerce Platform Coming Soon!</h2>
        <p>We're working hard to bring you a complete shopping experience with secure payments, order tracking, and more!</p>
        <div className="features-preview">
          <div className="feature">
            <FaShoppingCart />
            <span>Secure Checkout</span>
          </div>
          <div className="feature">
            <FaRecycle />
            <span>Easy Returns</span>
          </div>
          <div className="feature">
            <FaStar />
            <span>Quality Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefurbishedStore;
