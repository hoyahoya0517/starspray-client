import styles from "./AdminOrders.module.css";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { mongoMe } from "../../api/auth";
import { useEffect, useState } from "react";
import { mongoGetAllOrders } from "../../api/admin";
import { motion } from "framer-motion";
import AdminOrderCard from "../../components/AdminOrderCard/AdminOrderCard";

export default function AdminOrders() {
  const navigate = useNavigate();
  const {
    isLoading,
    data: user,
    isError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const data = await mongoMe();
      return data;
    },
  });
  const { data: orders, isLoading2 } = useQuery({
    queryKey: ["adminOrders"],
    queryFn: async () => {
      const data = await mongoGetAllOrders();
      return data;
    },
  });
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    if (!isLoading) {
      if (!(user?.isAdmin ? user.isAdmin : false)) navigate("/");
    }
  }, [isLoading]);
  useEffect(() => {
    if (isError) navigate("/");
  }, [isError]);
  if (isLoading || isLoading2) {
    return <div className={styles.adminOrders}></div>;
  }
  return (
    <div className={styles.adminOrders}>
      <div className={styles.adminOrdersMap}>
        {orders &&
          orders.map((order) => {
            return <AdminOrderCard order={order} key={order.paymentId} />;
          })}
      </div>
      {error && (
        <motion.div
          style={{
            fontSize: "2rem",
            zIndex: "2",
            color: "#fff54f",
            transform: "translate(-50%, -50%)",
          }}
          initial={{
            position: "fixed",
            top: "-20%",
            left: "50%",
          }}
          animate={{
            position: "fixed",
            top: "50%",
            left: "50%",
          }}
          transition={{
            duration: 1.2,
          }}
        >
          <span>{errorMessage}</span>
        </motion.div>
      )}
    </div>
  );
}
