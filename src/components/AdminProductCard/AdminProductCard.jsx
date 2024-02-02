import { useEffect, useState } from "react";
import styles from "./AdminProductCard.module.css";
import dayjs from "dayjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  mongoAdminDeleteProduct,
  mongoAdminUpdateProduct,
} from "../../api/admin";
import { motion } from "framer-motion";

export default function AdminProductCard({ product }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [img, setImg] = useState(product.img.join(","));
  const [info, setInfo] = useState(product.info);
  const [qty, setQty] = useState(product.qty);
  const [size, setSize] = useState(product.size);
  const [category, setCategory] = useState(product.category);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const productAddMutate = useMutation({
    mutationFn: (updateProduct) => mongoAdminUpdateProduct(updateProduct),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      setErrorMessage("업데이트 완료");
      return setError(true);
    },
    onError(error) {
      setErrorMessage(error.message);
      return setError(true);
    },
  });
  const productDeleteMutate = useMutation({
    mutationFn: (productID) => mongoAdminDeleteProduct(productID),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
    onError(error) {
      setErrorMessage(error.message);
      return setError(true);
    },
  });
  const handleUpdateProduct = async (dateUpdate) => {
    if (!String(price).trim()) {
      setErrorMessage("수정할 물건의 가격을 입력하세요");
      return setError(true);
    }
    if (!String(qty).trim()) {
      setErrorMessage("수정할 물건의 수량을 입력하세요");
      return setError(true);
    }
    const uploaded = dateUpdate ? Date.now().toString() : product.uploadedAt;
    const updateProduct = {
      id: product.id,
      name,
      price: Number(price),
      img: img.split(","),
      info,
      qty: Number(qty),
      size,
      category,
      uploadedAt: uploaded,
    };
    productAddMutate.mutate(updateProduct);
  };
  const handleDeleteProduct = () => {
    const go = window.confirm("물건을 삭제합니까?");
    if (go) productDeleteMutate.mutate(product.id);
    return;
  };
  const handleName = (e) => {
    setName(e.target.value);
  };
  const handlePrice = (e) => {
    setPrice(e.target.value);
  };
  const handleImg = (e) => {
    setImg(e.target.value);
  };
  const handleInfo = (e) => {
    setInfo(e.target.value);
  };
  const handleQty = (e) => {
    setQty(e.target.value);
  };
  const handleSize = (e) => {
    setSize(e.target.value);
  };
  const handleCategory = (e) => {
    setCategory(e.target.value);
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
    <div className={styles.adminProductCard}>
      <div className={styles.main}>
        <div className={styles.main_div}>
          <span>id</span>
          <span>{product.id}</span>
        </div>
        <div className={styles.main_div}>
          <span>name</span>
          <input value={name} onChange={handleName} />
        </div>
        <div className={styles.main_div}>
          <span>price</span>
          <input value={price} onChange={handlePrice} />
        </div>
        <div className={styles.main_div}>
          <span>img</span>
          <textarea
            placeholder=",로 사진 분류"
            value={img}
            onChange={handleImg}
          ></textarea>
        </div>
        <div className={styles.main_div}>
          <span>info</span>
          <textarea value={info} onChange={handleInfo}></textarea>
        </div>
        <div className={styles.main_div}>
          <span>qty</span>
          <input value={qty} onChange={handleQty} />
        </div>
        <div className={styles.main_div}>
          <span>size</span>
          <input value={size} onChange={handleSize} />
        </div>
        <div className={styles.main_div}>
          <span>category</span>
          <input value={category} onChange={handleCategory} />
        </div>
        <div className={styles.main_div}>
          <span>uploadedAt</span>
          <span>
            {dayjs(Number(product.uploadedAt)).format("YYYY.M.D / HH:mm")}
          </span>
        </div>
      </div>
      <div className={styles.right}>
        <button
          onClick={() => {
            handleUpdateProduct(false);
          }}
        >
          업데이트
        </button>
        <button
          onClick={() => {
            handleUpdateProduct(true);
          }}
        >
          (날짜 최신으로) 업데이트
        </button>
        <button onClick={handleDeleteProduct}>삭제</button>
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
