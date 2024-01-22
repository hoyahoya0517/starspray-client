import styles from "./Cart.module.css";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { navOff } from "../../redux/redux";
import PortOne from "@portone/browser-sdk/v2";
import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "../../api/auth";
import DaumPostcodeEmbed from "react-daum-postcode";
import { useNavigate } from "react-router-dom";
import { getProductByCart } from "../../api/product";
import CartCard from "../../components/CartCard/CartCard";

export default function Cart() {
  const navigate = useNavigate();
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
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [onSearch, setOnSearch] = useState(false);
  const [zipcode, setZipcode] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [cartLength, setCartLength] = useState(0);
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
    if (error) {
      setTimeout(() => {
        setError(false);
        setErrorMessage("");
      }, 3000);
    }
  }, [error]);
  const handlePay = () => {};
  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setPhone(userInfo.phone);
      setEmail(userInfo.email);
      setZipcode(userInfo.zipcode ? userInfo.zipcode : "");
      setAddress1(userInfo.address1 ? userInfo.address1 : "");
      setAddress2(userInfo.address2 ? userInfo.address2 : "");
    }
  }, [userInfo]);
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
      <div className={styles.left}>
        {cartLength === 0 ? (
          <div className={styles.cartEmpty}>
            <h1>담긴 상품이 없습니다</h1>
          </div>
        ) : (
          <div className={styles.cartMain}>
            {cart.map((product) => {
              return <CartCard product={product} key={product.id} />;
            })}
          </div>
        )}
      </div>
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
              <div className={styles.agree}>
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
                <div className={styles.error}>
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
