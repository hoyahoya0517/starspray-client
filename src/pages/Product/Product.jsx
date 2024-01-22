import { useDispatch } from "react-redux";
import styles from "./Product.module.css";
import { useEffect } from "react";
import { navOff } from "../../redux/redux";
import ProductCard from "../../components/ProductCard/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../api/product";

export default function Product() {
  const dispatch = useDispatch();
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const data = await getProducts();
      return data;
    },
    staleTime: 1000 * 60 * 60,
  });
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(navOff());
  }, []);
  if (isLoading) {
    return <div className={styles.product}></div>;
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
