import { useState } from "react";
import styles from "./ProductCard.module.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [click, setClick] = useState(false);
  const handleClick = () => {
    if (!click) return setClick(true);
    navigate(`/product/${product.id}`);
  };
  return (
    <motion.div
      animate={
        click && {
          scale: 1.3,
          transition: { duration: 0.3 },
        }
      }
      onClick={handleClick}
      className={styles.productCard}
    >
      <motion.div
        animate={
          click && {
            opacity: 0.8,
            transition: { duration: 0.2 },
          }
        }
        className={styles.productImg}
      >
        <img src={`${product.img[0]}`} />
      </motion.div>
      {click ? (
        product.qty > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={
              click && {
                opacity: 1,
                transition: { duration: 0.3, delay: 0.2 },
              }
            }
            className={styles.hoverDetail}
          >
            <span>{product.name}</span>
            <span>{`₩${product.price}`}</span>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={
              click && {
                opacity: 1,
                transition: { duration: 0.3, delay: 0.2 },
              }
            }
            className={styles.soldout}
          >
            <img src="https://res.cloudinary.com/hoyahoya/image/upload/v1707481140/letter/soldout2_gvcesy.png" />
          </motion.div>
        )
      ) : (
        <></>
      )}
    </motion.div>
  );
}
