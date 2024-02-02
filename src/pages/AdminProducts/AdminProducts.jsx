import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./AdminProducts.module.css";
import { mongoMe } from "../../api/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../../api/product";
import AdminProductCard from "../../components/AdminProductCard/AdminProductCard";
import { mongoAdminAddProduct } from "../../api/admin";
import { motion } from "framer-motion";

export default function AdminProducts() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
  const { data: products, isLoading2 } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const data = await getProducts();
      return data;
    },
  });
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [img, setImg] = useState("");
  const [info, setInfo] = useState("");
  const [qty, setQty] = useState("");
  const [size, setSize] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const productAddMutate = useMutation({
    mutationFn: (newProduct) => mongoAdminAddProduct(newProduct),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError(error) {
      setErrorMessage(error.message);
      return setError(true);
    },
  });
  const handleAddProduct = async () => {
    if (!price.trim()) {
      setErrorMessage("추가할 물건의 가격을 입력하세요");
      return setError(true);
    }
    if (!qty.trim()) {
      setErrorMessage("추가할 물건의 수량을 입력하세요");
      return setError(true);
    }
    const newProduct = {
      name,
      price: Number(price),
      img: img.split(","),
      info,
      qty: Number(qty),
      size,
      category,
    };
    productAddMutate.mutate(newProduct);
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
  useEffect(() => {
    if (!isLoading) {
      if (!(user?.isAdmin ? user.isAdmin : false)) navigate("/");
    }
  }, [isLoading]);
  useEffect(() => {
    if (isError) navigate("/");
  }, [isError]);
  if (isLoading || isLoading2) {
    return <div className={styles.adminProducts}></div>;
  }
  return (
    <div className={styles.adminProducts}>
      <div className={styles.addProduct}>
        <div className={styles.main}>
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
        </div>
        <div className={styles.right}>
          <button type="button" onClick={handleAddProduct}>
            물건 추가
          </button>
        </div>
      </div>
      <div className={styles.adminProductsMap}>
        {products &&
          products.map((product) => {
            return <AdminProductCard product={product} key={product.id} />;
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
