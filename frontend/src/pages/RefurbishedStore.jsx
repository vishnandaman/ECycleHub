import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import "../styles/RefurbishedStore.css";

const RefurbishedStore = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "refurbishedProducts"));
      const productList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    };

    fetchProducts();
  }, []);

  return (
    <div className="refurbished-store">
      <h2>♻️ Refurbished Electronics Store</h2>
      <div className="product-list">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p><strong>Price:</strong> {product.price} E-Coins</p>
              <button>Redeem Now</button>
            </div>
          ))
        ) : (
          <p>No refurbished products available right now.</p>
        )}
      </div>
    </div>
  );
};

export default RefurbishedStore;
