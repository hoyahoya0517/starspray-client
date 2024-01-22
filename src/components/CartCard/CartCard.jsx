import { useNavigate } from "react-router-dom";
import styles from "./CartCard.module.css";
import { FiMinus, FiPlus } from "react-icons/fi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { mongoMe, mongoUpdateCart } from "../../api/auth";

export default function CartCard({ product }) {
  const navigate = useNavigate();
  const queryClinet = useQueryClient();
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const data = await mongoMe();
      return data;
    },
  });
  const [qty, setQty] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [price, setPrice] = useState(
    Number(product.qty) === 0 ? "SOLD OUT" : product.price
  );
  const qtyMutate = useMutation({
    mutationFn: ({ productId, su }) => mongoUpdateCart(productId, su),
    onSuccess() {
      queryClinet.invalidateQueries({ queryKey: ["user"] });
      queryClinet.invalidateQueries({ queryKey: ["userInfo"] });
      queryClinet.invalidateQueries({ queryKey: ["cart"] });
    },
    onError(error) {
      console.log(error);
      setErrorMessage(error.message);
      return setError(true);
    },
  });
  const qtyHandle = async (su) => {
    setError(false);
    setErrorMessage("");
    try {
      const productId = product.id;
      qtyMutate.mutate({ productId, su });
    } catch (error) {
      setErrorMessage(error.message);
      return setError(true);
    }
  };
  useEffect(() => {
    if (user) {
      const foundCart = user.cart.find((cart) => cart.id === product.id);
      setQty(foundCart ? foundCart.qty : "");
    }
  }, [user]);
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(false);
        setErrorMessage("");
      }, 3000);
    }
  }, [error]);
  if (isLoading) {
    return <div className={styles.cartCard}></div>;
  }
  return (
    <div className={styles.cartCard}>
      <div className={styles.left}>
        <img
          alt="productImg"
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
        <p>{price}</p>
        <div className={styles.qty}>
          <span>{`수량 : ${qty}`}</span>
          <button
            onClick={() => {
              qtyHandle(-1);
            }}
            type="button"
          >
            <FiMinus size={12} />
          </button>
          <button
            onClick={() => {
              qtyHandle(1);
            }}
            type="button"
          >
            <FiPlus size={12} />
          </button>
        </div>
        <p
          className={styles.remove}
          onClick={() => {
            qtyHandle(0);
          }}
        >
          삭제
        </p>
        <p className={styles.error}>{error ? errorMessage : ""}</p>
      </div>
    </div>
  );
}
