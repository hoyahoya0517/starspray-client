import styles from "./Cart.module.css";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { navOff } from "../../redux/redux";
import PortOne from "@portone/browser-sdk/v2";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserInfo } from "../../api/auth";
import DaumPostcodeEmbed from "react-daum-postcode";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(["user"]);
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
  const [payButton, setPayButton] = useState("Login Required");
  const [pleaseLogin, setPleaseLogin] = useState(false);
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
    if (pleaseLogin) return;
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
    dispatch(navOff());
  }, []);
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  }, [error]);
  const handlePay = () => {};
  const handleLoginRequired = () => {
    navigate("/login");
  };
  useEffect(() => {
    if (!user || !userInfo) {
      return setPleaseLogin(true);
    }
    if (userInfo) {
      setName(userInfo.name);
      setPhone(userInfo.phone);
      setEmail(userInfo.email);
      setZipcode(userInfo.zipcode ? userInfo.zipcode : "");
      setAddress1(userInfo.address1 ? userInfo.address1 : "");
      setAddress2(userInfo.address2 ? userInfo.address2 : "");
      setPayButton("PAY");
    }
  }, [userInfo]);
  useEffect(() => {
    if (isError) {
      return setPleaseLogin(true);
    }
  }, [isError]);
  if (isLoading) {
    return <div className={styles.cart}></div>;
  }
  return (
    <div className={styles.cart}>
      <div className={styles.left}></div>
      <div className={styles.right}>
        <div className={styles.profileWrap}>
          <div className={styles.main}>
            <div className={styles.mainInput}>
              <div>
                <label htmlFor="name">Name*</label>
                <input
                  readOnly={pleaseLogin ? true : false}
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
                  readOnly={pleaseLogin ? true : false}
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
                      검색
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
            </div>
            <div className={styles.mainButton}>
              <button
                type="button"
                onClick={pleaseLogin ? handleLoginRequired : handlePay}
              >
                {payButton}
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
