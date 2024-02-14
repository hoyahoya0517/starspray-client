import { useNavigate } from "react-router-dom";
import styles from "./OrderProductCard.module.css";

export default function OrderProductCard({ product }) {
  const navigate = useNavigate();
  return (
    <div className={styles.orderProductCard}>
      <div className={styles.left}>
        <img
          onClick={() => {
            navigate(`/product/${product.id}`);
          }}
          src={product.img[0]}
        />
      </div>
      <div className={styles.right}>
        <p
          className={styles.productTitle}
          onClick={() => {
            navigate(`/product/${product.id}`);
          }}
        >
          {product.name}
        </p>
        <p>{product.size}</p>
        <p>{`₩${product.price}`}</p>
      </div>
    </div>
  );
}
