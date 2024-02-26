import { useState } from "react";
import styles from "./ProductCard.module.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const width = document.querySelector("#root").clientWidth;
  const [hover, setHover] = useState(false);
  const [touch, setTouch] = useState(false);
  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };
  return (
    <motion.div
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      onTouchStart={() => {
        setTouch(true);
      }}
      onTouchEnd={() => {
        setTouch(false);
      }}
      whileHover={{
        scale: width > 767 ? 1.2 : 1.15,
        transition: { duration: 0.3 },
      }}
      animate={
        touch
          ? {
              scale: width > 767 ? 1.2 : 1.15,
              transition: { duration: 0.2 },
            }
          : {}
      }
      onClick={handleClick}
      className={styles.productCard}
    >
      <div className={styles.productImg}>
        <img src={`${product.img[0]}`} />
      </div>
      {hover && product.qty < 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={
            hover && {
              opacity: 1,
              transition: { duration: 0.3 },
            }
          }
          className={styles.soldout}
        >
          <img src="https://res.cloudinary.com/hoyahoya/image/upload/v1707481140/letter/soldout2_gvcesy.png" />
        </motion.div>
      )}
    </motion.div>
  );
}
