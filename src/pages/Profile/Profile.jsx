import styles from "./Profile.module.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { navOff } from "../../redux/redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getUserInfo,
  mongoDelete,
  mongoGetOrders,
  mongoLogout,
  mongoUpdateProfile,
} from "../../api/auth";
import DaumPostcodeEmbed from "react-daum-postcode";
import OrderCard from "../../components/OrderCard/OrderCard";
import { motion } from "framer-motion";

export default function Profile() {
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
    isLoading2,
    data: orders,
    isError2,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const data = await mongoGetOrders();
      return data;
    },
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [timeOut, setTimeOut] = useState();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [onSearch, setOnSearch] = useState(false);
  const [zipcode, setZipcode] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [orderLength, setOrderLength] = useState(0);
  const logoutMutate = useMutation({
    mutationFn: () => mongoLogout(),
    onSuccess() {
      queryClient.resetQueries({ queryKey: ["user"] });
      queryClient.removeQueries({ queryKey: ["userInfo"] });
      queryClient.removeQueries({ queryKey: ["cart"] });
      queryClient.removeQueries({ queryKey: ["orders"] });
      queryClient.removeQueries({ queryKey: ["order"] });
      navigate("/");
    },
    onError(error) {
      setErrorMessage("로그아웃에 실패했습니다");
      setError(true);
      return setTimeOut(
        setTimeout(() => {
          setError(false);
          setErrorMessage("");
        }, 2000)
      );
    },
  });
  const updateMutate = useMutation({
    mutationFn: (user) => mongoUpdateProfile(user),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      setOldPassword("");
      setNewPassword("");
      setErrorMessage("사용자 정보가 변경되었습니다");
      setError(true);
      return setTimeOut(
        setTimeout(() => {
          setError(false);
          setErrorMessage("");
        }, 2000)
      );
    },
    onError(error) {
      setErrorMessage(error.message);
      setError(true);
      return setTimeOut(
        setTimeout(() => {
          setError(false);
          setErrorMessage("");
        }, 2000)
      );
    },
  });
  const deleteMutate = useMutation({
    mutationFn: () => mongoDelete(),
    onSuccess() {
      queryClient.removeQueries();
      navigate("/");
    },
    onError(error) {
      setErrorMessage(error.message);
      setError(true);
      return setTimeOut(
        setTimeout(() => {
          setError(false);
          setErrorMessage("");
        }, 2000)
      );
    },
  });
  const handleName = (e) => {
    setName(e.target.value);
  };
  const handlePhone = (e) => {
    setPhone(e.target.value);
  };
  const handleOldPassword = (e) => {
    setOldPassword(e.target.value);
  };
  const handleNewPassword = (e) => {
    setNewPassword(e.target.value);
  };
  const handleAddress2 = (e) => {
    setAddress2(e.target.value);
  };
  const handleSearchAddress = () => {
    setOnSearch((prev) => !prev);
  };
  const handleLogout = async () => {
    logoutMutate.mutate();
  };
  const handleUpdate = async (e) => {
    clearTimeout(timeOut);
    await setError(false);
    e.preventDefault();
    if (zipcode && !address2) {
      setErrorMessage("상세주소를 입력하세요");
      setError(true);
      return setTimeOut(
        setTimeout(() => {
          setError(false);
          setErrorMessage("");
        }, 2000)
      );
    }
    if ((oldPassword && !newPassword) || (!oldPassword && newPassword)) {
      setErrorMessage(
        "비밀번호 변경 시 원래 비밀번호와 변경할 비밀번호를 입력하세요"
      );
      setError(true);
      return setTimeOut(
        setTimeout(() => {
          setError(false);
          setErrorMessage("");
        }, 2000)
      );
    }
    try {
      const user = {
        name,
        phone,
        zipcode,
        address1,
        address2,
        oldPassword,
        newPassword,
      };
      updateMutate.mutate(user);
    } catch (error) {
      setErrorMessage(error.message);
      setError(true);
      return setTimeOut(
        setTimeout(() => {
          setError(false);
          setErrorMessage("");
        }, 2000)
      );
    }
  };
  const handleDelete = () => {
    if (window.confirm("정말 탈퇴하시겠습니까? (데이터 복구 불가)")) {
      deleteMutate.mutate();
    } else {
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
    if (orders) setOrderLength(orders ? orders.length : 0);
  }, [orders]);
  useEffect(() => {
    if (isError) navigate("/");
  }, [isError]);
  if (isLoading || isLoading2) {
    return <div className={styles.profile}></div>;
  }
  return (
    <div className={styles.profile}>
      {orderLength === 0 ? (
        <div className={styles.orderEmpty}>
          <h1>주문내역이 없습니다</h1>
        </div>
      ) : (
        <div className={styles.left}>
          <div className={styles.orderMain}>
            <div className={styles.title}>
              <span>ORDERS</span>
            </div>
            <div className={styles.main}>
              {orders.map((order) => {
                return <OrderCard order={order} key={order.paymentId} />;
              })}
            </div>
          </div>
        </div>
      )}
      <div className={styles.right}>
        <div className={styles.profileWrap}>
          <div className={styles.title}>
            <span>ACCOUNT INFORMATION</span>
          </div>
          <form className={styles.main} onSubmit={handleUpdate}>
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
              <div>
                <label htmlFor="oldPassword">Old password*</label>
                <input
                  value={oldPassword}
                  onChange={handleOldPassword}
                  maxLength="20"
                  type="password"
                  id="oldPassword"
                  autoComplete="off"
                  placeholder="비밀번호 변경 시에만 입력"
                />
              </div>
              <div>
                <label htmlFor="newPassword">New password*</label>
                <input
                  value={newPassword}
                  onChange={handleNewPassword}
                  maxLength="20"
                  type="password"
                  id="newPassword"
                  autoComplete="off"
                  placeholder="비밀번호 변경 시에만 입력"
                />
              </div>
            </div>
            <div className={styles.mainButton}>
              <button type="submit">UPDATE ACCOUNT</button>
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
          </form>
          <div className={styles.logout}>
            <span onClick={handleLogout}>Logout</span>
          </div>
          <div className={styles.delete}>
            <span onClick={handleDelete}>회원탈퇴</span>
          </div>
        </div>
      </div>
    </div>
  );
}
