import { useState } from "react";
import styles from "./ProductCard.module.css";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  const handleMouseOver = () => {
    setHover(true);
  };
  const handleMouseOut = () => {
    setHover(false);
  };
  const priceSet = () => {
    if (Number(product.qty) === 0) return "SOLD OUT";
    else return `${product.price}원`;
  };
  const handleNavigate = () => {
    navigate(`./${product.id}`);
  };
  return (
    <div onClick={handleNavigate} className={styles.productCard}>
      {/* <div className={styles.productImg}>
        <img
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
          src={hover ? `${product.img[1]}` : `${product.img[0]}`}
        />
      </div>
      <div className={styles.productInfo}>
        <span>{product.name}</span>
        <span>{priceSet()}</span>
      </div> */}
      <div className={styles.productImg}>
        <img src={`${product.img[0]}`} />
      </div>
    </div>
  );
}
