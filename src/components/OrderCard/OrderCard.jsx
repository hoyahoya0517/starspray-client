import { useQuery } from "@tanstack/react-query";
import styles from "./OrderCard.module.css";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

export default function OrderCard({ order }) {
  const navigate = useNavigate();
  const refund = order.refund;
  const dayjsDate = dayjs(Number(order.orderDate)).format("YYYY.M.D");
  return (
    <div className={styles.orderCard}>
      <div className={styles.date}>
        <span>{dayjsDate}</span>
        <span
          onClick={() => {
            navigate(`order/${order.paymentId}`);
          }}
        >
          자세히 보기
        </span>
      </div>
      <div className={styles.info}>
        {refund ? (
          <span className={styles.refund}>반품 완료</span>
        ) : (
          <span className={styles.shipping}>
            {`주문 상태 : ${order.shipping}`}
          </span>
        )}
      </div>
      <div className={styles.total}>
        <span>{`총 결제금액 : ${order.total}`}</span>
      </div>
    </div>
  );
}
