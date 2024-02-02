import { useNavigate } from "react-router-dom";
import styles from "./Admin.module.css";
import { useQuery } from "@tanstack/react-query";
import { mongoMe } from "../../api/auth";
import { useEffect } from "react";

export default function Admin() {
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
  useEffect(() => {
    if (!isLoading) {
      if (!(user?.isAdmin ? user.isAdmin : false)) navigate("/");
    }
  }, [isLoading]);
  useEffect(() => {
    if (isError) navigate("/");
  }, [isError]);
  if (isLoading) {
    return <div className={styles.admin}></div>;
  }
  return (
    <div className={styles.admin}>
      <span
        onClick={() => {
          navigate("./products");
        }}
      >
        상품 관리
      </span>
      <span
        onClick={() => {
          navigate("./orders");
        }}
      >
        주문 관리
      </span>
      <span
        onClick={() => {
          navigate("./auth");
        }}
      >
        사용자 관리
      </span>
      <span></span>
    </div>
  );
}
