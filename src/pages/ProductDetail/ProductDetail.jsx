import { useNavigate, useParams } from "react-router-dom";
import styles from "./ProductDetail.module.css";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { navOff } from "../../redux/redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProduct } from "../../api/product";
import { mongoAddCart } from "../../api/auth";

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
  const priceSet = () => {
    if (Number(product.qty) <= 0) return "SOLD OUT";
    else return `${product.price}원`;
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(navOff());
  }, []);
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(false);
        setErrorMessage("");
      }, 3000);
    }
  }, [error]);
  useEffect(() => {
    if (isError) return navigate("/");
  }, [isError]);
  if (isLoading) {
    return <div className={styles.productDetail}></div>;
  }
  return (
    <div className={styles.productDetail}>
      <div className={styles.leftWrap}>
        <div className={styles.left}>
          <div className={styles.info}>
            <span>{product.name}</span>
            <span>{priceSet()}</span>
          </div>
          <div className={styles.size}>
            <span>{product.size}</span>
          </div>
          <div className={styles.addCart}>
            <button type="button" onClick={handleAddCart}>
              ADD TO CART
            </button>
            {error && (
              <div className={styles.error}>
                <span>{errorMessage}</span>
              </div>
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
                <span>
                  일본에서 1995년 10월부터 1996년 3월까지 총 26화로 방송된
                  오리지널 애니메이션과 이후 파생된 미디어 믹스. 보통 ‘신세기
                  에반게리온’이라고 하면 1995년작 애니메이션을 말한다. 통상
                  부르는 약칭은 '에바'.
                </span>
              </div>
            </div>
            <div className={styles.refundInfo}>
              <div className={styles.info_title}>
                <span>반품 안내</span>
              </div>
              <div className={styles.info_main}>
                <span>
                  일본에서 1995년 10월부터 1996년 3월까지 총 26화로 방송된
                  오리지널 애니메이션과 이후 파생된 미디어 믹스. 보통 ‘신세기
                  에반게리온’이라고 하면 1995년작 애니메이션을 말한다. 통상
                  부르는 약칭은 '에바'.
                </span>
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
