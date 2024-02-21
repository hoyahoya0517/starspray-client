import styles from "./Cart.module.css";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { navOff } from "../../redux/redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserInfo, mongoCompleteCart, mongoMe } from "../../api/auth";
import DaumPostcodeEmbed from "react-daum-postcode";
import { useNavigate } from "react-router-dom";
import { getProductByCart } from "../../api/product";
import CartCard from "../../components/CartCard/CartCard";
import { pay } from "../../iamport/iamport";
import { motion } from "framer-motion";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";

export default function Cart() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    isLoading,
    data: userInfo,
    isError,
  } = useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
      const data = await getUserInfo();
      return data;
    },
  });
  const {
    isLoading: isLoading2,
    data: cart,
    isError: isError2,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const data = await getProductByCart();
      return data;
    },
  });
  const {
    isLoading: isLoading3,
    data: user,
    isError3,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const data = await mongoMe();
      return data;
    },
  });
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [firstInfo, setFirstInfo] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [onSearch, setOnSearch] = useState(false);
  const [zipcode, setZipcode] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [cartLength, setCartLength] = useState(0);
  const [sum, setSum] = useState(0);
  const [delivery, setDelivery] = useState(3000);
  const [total, setTotal] = useState(0);
  const [agree, setAgree] = useState(false);
  const userInfoMutate = useMutation({
    mutationFn: () => mongoCompleteCart(),
    onSuccess() {
      queryClient.invalidateQueries();
    },
    onError(error) {
      const message = error.message;
      setErrorMessage(message);
      return setError(true);
    },
  });
  const handleName = (e) => {
    setName(e.target.value);
  };
  const handlePhone = (e) => {
    setPhone(e.target.value);
  };
  const handleAddress2 = (e) => {
    setAddress2(e.target.value);
  };
  const handleSearchAddress = () => {
    setOnSearch((prev) => !prev);
  };
  const handleAgree = () => {
    setAgree((prev) => !prev);
  };
  const handlePay = async () => {
    setError(false);
    if (!userInfo?.cart || cartLength === 0) {
      setErrorMessage("장바구니에 상품을 담아주세요");
      return setError(true);
    }
    if (!name || !phone || !email || !zipcode || !address1 || !address2) {
      setErrorMessage("결제정보를 입력해 주세요");
      return setError(true);
    }
    if (!agree) {
      setErrorMessage("약관에 동의해주세요");
      return setError(true);
    }
    const customerId = userInfo?.id;
    if (!customerId) return;
    const userCart = userInfo?.cart;
    if (!userCart) return;
    try {
      await pay(
        userCart,
        name,
        phone,
        email,
        zipcode,
        address1,
        address2,
        delivery,
        total,
        customerId
      );
      userInfoMutate.mutate();
      navigate("./complete", { state: { payComplete: true, name, cart } });
    } catch (error) {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      const message = error.message;
      if (message) setErrorMessage(message);
      else setErrorMessage("결제에 문제가 발생했습니다");
      return setError(true);
    }
  };
  function SearchAddress() {
    const handleComplete = (data) => {
      let fullAddress = data.address;
      let extraAddress = "";

      if (data.addressType === "R") {
        if (data.bname !== "") {
          extraAddress += data.bname;
        }
        if (data.buildingName !== "") {
          extraAddress +=
            extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
        }
        fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
      }
      setZipcode(data.zonecode);
      setAddress1(fullAddress);
      setOnSearch(false);
    };

    return <DaumPostcodeEmbed onComplete={handleComplete} />;
  }
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(navOff());
  }, []);
  useEffect(() => {
    if (userInfo && firstInfo) {
      setName(userInfo.name);
      setPhone(userInfo.phone);
      setEmail(userInfo.email);
      setZipcode(userInfo.zipcode ? userInfo.zipcode : "");
      setAddress1(userInfo.address1 ? userInfo.address1 : "");
      setAddress2(userInfo.address2 ? userInfo.address2 : "");
      setFirstInfo(false);
    }
    if (userInfo?.cart) {
      let tmpSum = 0;
      userInfo.cart.forEach((product) => {
        tmpSum += product.price * product.qty;
      });
      setSum(tmpSum);
    }
  }, [userInfo]);
  useEffect(() => {
    if (sum >= 30000) setDelivery(0);
    else setDelivery(3000);
  }, [sum]);
  useEffect(() => {
    setTotal(sum + delivery);
  }, [sum, delivery]);
  useEffect(() => {
    if (cart) setCartLength(cart.length);
  }, [cart]);

  if (isLoading || isLoading2) {
    return (
      <div className={styles.cart}>
        <span></span>
      </div>
    );
  }
  if (isError || isError2) {
    return (
      <div className={styles.errorPage}>
        <div className={styles.errorPage_left}>
          <h1>로그인이 필요합니다</h1>
        </div>
        <div className={styles.errorPage_right}>
          <span
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </span>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.cart}>
      {cartLength === 0 ? (
        <div className={styles.cartEmpty}>
          <h1>담긴 상품이 없습니다</h1>
        </div>
      ) : (
        <div className={styles.left}>
          <div className={styles.cartMain}>
            {cart.map((product) => {
              return <CartCard product={product} key={product.id} />;
            })}
          </div>
          {cartLength === 0 ? null : (
            <div className={styles.left_info}>
              <div>
                <span>상품금액</span>
                <span>{`₩${sum}`}</span>
              </div>
              <div>
                <span>배송비</span>
                <span>{`₩${delivery}`}</span>
              </div>
              <div>
                <span>총 주문금액</span>
                <span>{`₩${total}`}</span>
              </div>
            </div>
          )}
        </div>
      )}
      <div className={styles.right}>
        <div className={styles.profileWrap}>
          <div className={styles.title}>
            <span>BILLING INFORMATION</span>
          </div>
          <div className={styles.main}>
            <div className={styles.mainInput}>
              <div>
                <label htmlFor="name">Name*</label>
                <input
                  value={name}
                  onChange={handleName}
                  maxLength="10"
                  type="name"
                  id="name"
                />
              </div>
              <div>
                <label htmlFor="phone">Phone*</label>
                <input
                  value={phone}
                  onChange={handlePhone}
                  maxLength="11"
                  type="phone"
                  id="phone"
                />
              </div>
              <div>
                <label htmlFor="email">Email*</label>
                <input
                  readOnly
                  value={email}
                  maxLength="40"
                  type="email"
                  id="email"
                />
              </div>
              <div className={styles.zipcode}>
                <label htmlFor="zipcode">우편번호*</label>
                <div className={styles.zipcodeInput}>
                  <input
                    readOnly
                    value={zipcode}
                    maxLength="10"
                    type="zipcode"
                    id="zipcode"
                  />
                  <div className={styles.search}>
                    <button type="button" onClick={handleSearchAddress}>
                      {onSearch ? "닫기" : "검색"}
                    </button>
                  </div>
                </div>
              </div>
              <div className={styles.address}>
                <label htmlFor="address1">주소*</label>
                <input
                  readOnly
                  value={address1}
                  maxLength="40"
                  type="address"
                  id="address1"
                />
                <div className={styles.searchAddress}>
                  {onSearch && (
                    <div>
                      <SearchAddress />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="address2">상세주소*</label>
                <input
                  readOnly={zipcode ? false : true}
                  value={address2}
                  onChange={handleAddress2}
                  maxLength="40"
                  type="address"
                  id="address2"
                />
              </div>
              <div className={styles.agree} onClick={handleAgree}>
                {agree ? (
                  <span className={styles.agreeButton} style={{ color: "red" }}>
                    <IoIosHeart size={22} />
                  </span>
                ) : (
                  <span className={styles.agreeButton}>
                    <IoIosHeartEmpty size={22} />
                  </span>
                )}
                <span>
                  주문 내용을 확인하였으며 교환 환불 규정을 확인했습니다.
                </span>
              </div>
            </div>
            <div className={styles.mainButton}>
              <button type="button" onClick={handlePay}>
                PAY
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
          </div>
        </div>
      </div>
    </div>
  );
}
