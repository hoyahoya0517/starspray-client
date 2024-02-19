import { useLocation, useNavigate } from "react-router-dom";
import styles from "./OrderComplete.module.css";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function OrderComplete() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const payComplete = state?.payComplete ? state.payComplete : false;
  const name = state?.name ? state.name : "who?";
  const cart = state?.cart ? state.cart : [];
  useEffect(() => {
    if (!payComplete) return navigate("/");
  }, [payComplete]);
  return (
    <div className={styles.orderComplete}>
      <div className={styles.orderCompleteWrap}>
        <span>Thanks to</span>
        <span>{name}</span>
        <span
          onClick={() => {
            navigate("/");
          }}
        >
          Home
        </span>
        <div>
          {cart &&
            cart.map((product) => {
              const width = document.querySelector("#root").clientWidth;
              const random =
                width > 767
                  ? Math.floor(Math.random() * 80) + 100
                  : Math.floor(Math.random() * 70) + 100;
              const random1 = Math.floor(Math.random() * 71) + 10;
              const random2 =
                width > 767
                  ? Math.floor(Math.random() * 75) + 10
                  : Math.floor(Math.random() * 60) + 10;
              const random3 = Math.floor(Math.random() * 10) + 1;
              return (
                <motion.div
                  className={styles.motion}
                  style={{
                    width: random,
                    top: `${random1}%`,
                    left: `${random2}%`,
                  }}
                  animate={{ rotate: 360 }}
                  transition={{
                    ease: "linear",
                    duration: random3,
                    repeat: Infinity,
                  }}
                  key={product._id}
                >
                  <img src={product.img[0]} />
                </motion.div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
