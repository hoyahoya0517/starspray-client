import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import styles from "./OrderComplete.module.css";
import { useEffect, useState } from "react";
import { orderComplete } from "../../api/payment";
import { useQueryClient } from "@tanstack/react-query";

export default function OrderComplete() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { state } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [payState, setPayState] = useState("결제 진행중..");
  const paymentId = searchParams.get("paymentId");
  const code = searchParams.get("code");
  const payComplete = state?.payComplete;
  useEffect(() => {
    async function mobilePayComplete() {
      const success = code === null ? true : false;
      try {
        await orderComplete(paymentId, success);
        await queryClient.invalidateQueries();
        return setPayState("결제가 완료되었습니다");
      } catch (error) {
        const message = error.message || "결제에 문제가 발생했습니다";
        setPayState(message);
      }
    }
    if (paymentId) mobilePayComplete();
  }, [paymentId]);
  useEffect(() => {
    if (payComplete) {
      setPayState("결제가 완료되었습니다");
    } else if (payComplete === undefined && paymentId === null) {
      navigate("/");
    }
  }, []);
  return (
    <div className={styles.orderComplete}>
      <div className={styles.left}>
        <h1>{payState}</h1>
      </div>
      <div className={styles.right}>
        <span
          onClick={() => {
            navigate("/");
          }}
        >
          Home
        </span>
      </div>
      {/* <div>
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
        </div> */}
    </div>
  );
}
