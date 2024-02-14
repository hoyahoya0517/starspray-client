import { useDispatch } from "react-redux";
import styles from "./Product.module.css";
import { useEffect } from "react";
import { navOff } from "../../redux/redux";
import ProductCard from "../../components/ProductCard/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../api/product";
import { useParams } from "react-router-dom";
import NotFoundComponent from "../../components/NotFoundComponent/NotFoundComponent";

export default function Product() {
  const dispatch = useDispatch();
  const { category } = useParams();
  const {
    isLoading,
    data: products,
    isError,
  } = useQuery({
    queryKey: ["products", category],
    queryFn: async () => {
      const data = await getProducts(category);
      return data;
    },
    staleTime: 1000 * 60 * 60,
  });
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(navOff());
  }, [category]);
  if (isLoading) {
    return <div className={styles.product}></div>;
  }
  if (isError) {
    return <NotFoundComponent />;
  }
  if (products?.length === 0) {
    return <NotFoundComponent />;
  }
  return (
    <div className={styles.product}>
      <div className={styles.productWrap}>
        {products &&
          products.map((product) => {
            return <ProductCard key={product.id} product={product} />;
          })}
      </div>
    </div>
  );
}
