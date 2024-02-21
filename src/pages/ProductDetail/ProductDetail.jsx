import { useNavigate, useParams } from "react-router-dom";
import styles from "./ProductDetail.module.css";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { navOff } from "../../redux/redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProduct } from "../../api/product";
import { mongoAddCart } from "../../api/auth";
import { motion } from "framer-motion";
import NotFoundComponent from "../../components/NotFoundComponent/NotFoundComponent";

export default function ProductDetail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { id } = useParams();
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const data = await getProduct(id);
      return data;
    },
    staleTime: 1000 * 60 * 60,
  });
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const cartMutate = useMutation({
    mutationFn: (id) => mongoAddCart(id),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      queryClient.resetQueries({ queryKey: ["cart"] });
      setErrorMessage("장바구니에 상품을 담았습니다");
      return setError(true);
    },
    onError(error) {
      if (error.message === "Authentication Error") {
        setErrorMessage("로그인이 필요합니다");
        return setError(true);
      }
      setErrorMessage(error.message);
      return setError(true);
    },
  });
  const handleAddCart = () => {
    setError(false);
    try {
      cartMutate.mutate(id);
    } catch (error) {
      if (error.message === "Authentication Error") {
        setErrorMessage("로그인이 필요합니다");
        return setError(true);
      }
      setErrorMessage(error.message);
      return setError(true);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(navOff());
  }, []);
  if (isLoading) {
    return <div className={styles.productDetail}></div>;
  }
  if (isError) {
    return <NotFoundComponent />;
  }
  if (!product) {
    return <NotFoundComponent />;
  }
  return (
    <div className={styles.productDetail}>
      <div className={styles.leftWrap}>
        <div className={styles.left}>
          <div className={styles.info}>
            <span>{product.name}</span>
            <span
              className={Number(product.qty) <= 0 ? `${styles.soldout}` : ""}
            >
              {Number(product.qty) <= 0 ? "SOLD OUT" : `₩${product.price}`}
            </span>
          </div>
          <div className={styles.size}>
            <span>{product.size}</span>
          </div>
          <div className={styles.addCart}>
            <button type="button" onClick={handleAddCart}>
              ADD TO CART
            </button>
            {error && (
              <motion.div
                onClick={() => {
                  setError(false);
                  setErrorMessage("");
                }}
                onTap={() => {
                  setError(false);
                  setErrorMessage("");
                }}
                className={styles.error}
                animate={{ transform: "translate(-50%,-50%) scale(1.75)" }}
                transition={{
                  duration: 0.5,
                }}
              >
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </div>
          <div className={styles.addInfo}>
            <div className={styles.detailInfo}>
              <div className={styles.info_title}>
                <span>상세정보</span>
              </div>
              <div className={styles.info_main}>
                <span>{product.info}</span>
              </div>
            </div>
            <div className={styles.deliveryInfo}>
              <div className={styles.info_title}>
                <span>배송 안내</span>
              </div>
              <div className={styles.info_main}>
                <p>배송 지역 : 전국 (일부 지역 제외)</p>
                <p>배송비 : 30,000원 미만 결제 시 배송비 3000원</p>
                <p>배송 기간 : 배송은 1~3일 정도 소요됩니다.</p>
              </div>
            </div>
            <div className={styles.refundInfo}>
              <div className={styles.info_title}>
                <span>반품 안내</span>
              </div>
              <div className={styles.info_main}>
                <p>반품 요청은 7일 이내에 가능합니다.</p>
                <p>
                  단순 변심으로 인한 교환/반품 신청 시 택배비용은 고객님
                  부담이오니 이점 양해 바랍니다.
                </p>
                <p>빈티지 상품은 교환/반품이 불가능합니다.</p>
                <p>
                  단, 가품이거나 사진상으로 보이지 않는 심각한 손상이 있는
                  경우에는 상품을 공급받으신 날로부터 7일 이내에 반품이
                  가능합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.right}>
        {product.img.map((url, index) => {
          return (
            <div key={index} className={styles.right_img}>
              <img src={url} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
