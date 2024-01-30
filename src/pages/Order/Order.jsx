import { useNavigate, useParams } from "react-router-dom";
import styles from "./Order.module.css";
import { useQuery } from "@tanstack/react-query";
import { mongoGetOrder } from "../../api/auth";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { navOff } from "../../redux/redux";
import { getProductByOrder } from "../../api/product";
import OrderProductCard from "../../components/OrderProductCard/OdrerProductCard";
import dayjs from "dayjs";

export default function Order() {
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const { paymentId } = useParams();
  const dispatch = useDispatch();
  const {
    isLoading,
    data: order,
    isError,
  } = useQuery({
    queryKey: ["order", paymentId],
    queryFn: async () => {
      const data = await mongoGetOrder(paymentId);
      return data;
    },
  });
  const {
    isLoading: isLoading2,
    data: products,
    isError: isError2,
  } = useQuery({
    queryKey: ["order", paymentId, "products"],
    queryFn: async () => {
      const data = await getProductByOrder(paymentId);
      return data;
    },
  });
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(navOff());
  }, []);
  useEffect(() => {
    if (order) {
      setDate(dayjs(Number(order.orderDate)).format("YYYY.M.D"));
    }
  }, [order]);
  useEffect(() => {
    if (isError) navigate("/");
  }, [isError]);
  if (isLoading) {
    return <div className={styles.order}></div>;
  }
  return (
    <div className={styles.order}>
      <div className={styles.left}>
        <div className={styles.products}>
          {products &&
            products.map((product) => {
              return <OrderProductCard product={product} key={product._id} />;
            })}
        </div>
        <div className={styles.orderInfo}>
          <span className={styles.info}>{`#${order.paymentId}`}</span>
          <div>
            <span>결제 상태</span>
            <span>{order?.complete ? "결제 성공" : "결제 실패"}</span>
          </div>
          <div>
            <span>주문 상태</span>
            <span>{order?.shipping}</span>
          </div>
          {order?.refund && (
            <div className={styles.refund}>
              <span>반품 상태</span>
              <span>반품 완료</span>
            </div>
          )}
          <div>
            <span>주문 날짜</span>
            <span>{dayjs(Number(order.orderDate)).format("YYYY.M.D")}</span>
          </div>
          <div>
            <span>총 결제금액</span>
            <span>{order?.total}</span>
          </div>
          <span className={styles.delivery}>배송 정보</span>
          <div>
            <span>이름</span>
            <span>{order?.name}</span>
          </div>
          <div>
            <span>휴대폰 번호</span>
            <span>{order?.phone}</span>
          </div>
          <div>
            <span>우편번호</span>
            <span>{order?.zipcode}</span>
          </div>
          <div className={styles.address}>
            <span>{`${order?.address1} ${order?.address2}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
