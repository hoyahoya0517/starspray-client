import { useMutation, useQueryClient } from "@tanstack/react-query";
import styles from "./AdminOrderCard.module.css";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  mongoAdminDeleteOrder,
  mongoAdminRefundOrder,
  mongoAdminUpdateOrder,
} from "../../api/admin";

export default function AdminOrderCard({ order }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(order.name);
  const [phone, setPhone] = useState(order.phone);
  const [zipcode, setZipcode] = useState(order.zipcode);
  const [address1, setAddress1] = useState(order.address1);
  const [address2, setAddress2] = useState(order.address2);
  const [complete, setComplete] = useState(order.complete);
  const [refund, setRefund] = useState(order.refund);
  const [shipping, setShipping] = useState(order.shipping);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const orderUpdateMutate = useMutation({
    mutationFn: (updateOrder) => mongoAdminUpdateOrder(updateOrder),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order"] });
      setErrorMessage("업데이트 완료");
      return setError(true);
    },
    onError(error) {
      setErrorMessage(error.message);
      return setError(true);
    },
  });
  const orderDeleteMutate = useMutation({
    mutationFn: (orderId) => mongoAdminDeleteOrder(orderId),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order"] });
    },
    onError(error) {
      setErrorMessage(error.message);
      return setError(true);
    },
  });
  const orderRefundMutate = useMutation({
    mutationFn: (paymentId) => mongoAdminRefundOrder(paymentId),
    onSuccess() {},
    onError() {},
  });
  const handleUpdateOrder = async () => {
    if (!String(complete).trim()) {
      setErrorMessage("complete을 입력하세요");
      return setError(true);
    }
    if (!String(refund).trim()) {
      setErrorMessage("refund을 입력하세요");
      return setError(true);
    }
    const newComplete = String(complete) === "true" ? true : false;
    const newRefund = String(refund) === "true" ? true : false;
    const updateOrder = {
      id: order.id,
      name,
      phone,
      zipcode,
      address1,
      address2,
      complete: newComplete,
      refund: newRefund,
      shipping,
    };
    orderUpdateMutate.mutate(updateOrder);
  };
  const handleDeleteOrder = () => {
    const go = window.confirm("구매기록을 삭제합니까?");
    if (go) orderDeleteMutate.mutate(order.id);
    return;
  };
  const handleRefundOrder = () => {
    orderRefundMutate.mutate(order.paymentId);
  };
  const handleName = (e) => {
    setName(e.target.value);
  };
  const handlePhone = (e) => {
    setPhone(e.target.value);
  };
  const handleZipcode = (e) => {
    setZipcode(e.target.value);
  };
  const handleAddress1 = (e) => {
    setAddress1(e.target.value);
  };
  const handleAddress2 = (e) => {
    setAddress2(e.target.value);
  };
  const handleComplete = (e) => {
    setComplete(e.target.value);
  };
  const handleRefund = (e) => {
    setRefund(e.target.value);
  };
  const handleShipping = (e) => {
    setShipping(e.target.value);
  };
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(false);
        setErrorMessage("");
      }, 3000);
    }
  }, [error]);
  return (
    <div className={styles.adminOrderCard}>
      <div className={styles.main}>
        <div className={styles.main_div}>
          <span>id</span>
          <span>{order.id}</span>
        </div>
        <div className={styles.main_div}>
          <span>paymentId</span>
          <span>{order.paymentId}</span>
        </div>
        <div className={styles.main_div}>
          <span>orderDate</span>
          <span>
            {dayjs(Number(order.orderDate)).format("YYYY.M.D / HH:mm")}
          </span>
        </div>
        <div className={styles.cart}>
          {order.cart &&
            order.cart.map((product) => (
              <div className={styles.main_div} key={product.id}>
                <span>{product.name}</span>
                <span>{`수량 : ${product.qty} / 정가 : ${product.price}`}</span>
              </div>
            ))}
        </div>
        <div className={styles.main_div}>
          <span>name</span>
          <input value={name} onChange={handleName} />
        </div>
        <div className={styles.main_div}>
          <span>phone</span>
          <input value={phone} onChange={handlePhone} />
        </div>
        <div className={styles.main_div}>
          <span>email</span>
          <span>{order.email}</span>
        </div>
        <div className={styles.main_div}>
          <span>zipcode</span>
          <input value={zipcode} onChange={handleZipcode} />
        </div>
        <div className={styles.main_div}>
          <span>address1</span>
          <input value={address1} onChange={handleAddress1} />
        </div>
        <div className={styles.main_div}>
          <span>address2</span>
          <input value={address2} onChange={handleAddress2} />
        </div>
        <div className={styles.main_div}>
          <span>total</span>
          <span>{order.total}</span>
        </div>
        <div className={styles.main_div}>
          <span>customerId</span>
          <span>{order.customerId}</span>
        </div>
        <div className={styles.main_div}>
          <span>complete</span>
          <input value={complete} onChange={handleComplete} />
        </div>
        <div className={styles.main_div}>
          <span>refund</span>
          <input value={refund} onChange={handleRefund} />
        </div>
        <div className={styles.main_div}>
          <span>shipping</span>
          <input value={shipping} onChange={handleShipping} />
        </div>
        <div className={styles.info}>
          <span>우선순위 : complete - refund - shipping</span>
          <span>complete은 결제상태</span>
          <span>
            complete이 false면 결제실패라고 나옴 / complete이 true면 shipping이
            나옴
          </span>
          <span>refund가 true면 반품완료라고 나옴</span>
          <span>둘 다 아니면 shipping문구가 나옴</span>
          <span>자세히 보기 누르면 complete와 shpping은 나옴</span>
          <span>refund은 true일때만 출력</span>
          <span>주의 : complete나 refund에 문자적으면 안됨</span>
        </div>
      </div>
      <div className={styles.right}>
        <button onClick={handleUpdateOrder}>업데이트</button>
        <button onClick={handleDeleteOrder}>삭제</button>
        <button onClick={handleRefundOrder}>환불하기(미완성)</button>
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
