import { useMutation, useQueryClient } from "@tanstack/react-query";
import styles from "./AdminAuthCard.module.css";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { mongoAdminDeleteAuth, mongoAdminUpdateAuth } from "../../api/admin";

export default function AdminAuthCard({ profile }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [zipcode, setZipcode] = useState(profile.zipcode || "");
  const [address1, setAddress1] = useState(profile.address1 || "");
  const [address2, setAddress2] = useState(profile.address2 || "");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(profile.isAdmin);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const authUpdateMutate = useMutation({
    mutationFn: (updateAuth) => mongoAdminUpdateAuth(updateAuth),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["adminAuth"] });
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setErrorMessage("업데이트 완료");
      return setError(true);
    },
    onError(error) {
      setErrorMessage(error.message);
      return setError(true);
    },
  });
  const authDeleteMutate = useMutation({
    mutationFn: (authId) => mongoAdminDeleteAuth(authId),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["adminAuth"] });
    },
    onError(error) {
      setErrorMessage(error.message);
      return setError(true);
    },
  });

  const handleUpdateAuth = async () => {
    setError(false);
    if (!String(isAdmin).trim()) {
      setErrorMessage("isAdmin을 입력하세요");
      return setError(true);
    }

    const newIsAdmin = String(isAdmin) === "true" ? true : false;
    const newPassword = password ? password : profile.password;

    const updateAuth = {
      id: profile.id,
      name,
      phone,
      password: newPassword,
      isAdmin: newIsAdmin,
      zipcode,
      address1,
      address2,
    };
    authUpdateMutate.mutate(updateAuth);
  };

  const handleDeleteAuth = () => {
    setError(false);
    const go = window.confirm("프로필을 삭제합니까?");
    if (go) authDeleteMutate.mutate(profile.id);
    return;
  };

  const handleName = (e) => {
    setName(e.target.value);
  };
  const handlePhone = (e) => {
    setPhone(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleZipcode = (e) => {
    setZipcode(e.target.value);
  };
  const handleAddress1 = (e) => {
    setAddress1(e.target.value);
  };
  const handleAddress2 = (e) => {
    setAddress2(e.target.value);
  };
  const handleAdmin = (e) => {
    setIsAdmin(e.target.value);
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
    <div className={styles.adminAuthCard}>
      <div className={styles.main}>
        <div className={styles.main_div}>
          <span>id</span>
          <span>{profile.id}</span>
        </div>
        <div className={styles.main_div}>
          <span>name</span>
          <input value={name} onChange={handleName} />
        </div>
        <div className={styles.main_div}>
          <span>phone</span>
          <input value={phone} onChange={handlePhone} />
        </div>
        <div className={styles.main_div}>
          <span>email</span>
          <span>{profile.email}</span>
        </div>
        <div className={styles.main_div}>
          <span>signupDate</span>
          <span>
            {dayjs(Number(profile.signupDate)).format("YYYY.M.D / HH:mm")}
          </span>
        </div>
        <div className={styles.main_div}>
          <span>password</span>
          <input
            placeholder="비밀번호 변경 시에만 입력"
            maxLength="20"
            autoComplete="off"
            value={password}
            onChange={handlePassword}
          />
        </div>
        <div className={styles.cart}>
          {profile.cart &&
            profile.cart.map((product) => (
              <div className={styles.main_div} key={product.id}>
                <span>{product.name}</span>
                <span>{`수량 : ${product.qty} / 정가 : ${product.price}`}</span>
              </div>
            ))}
        </div>
        <div className={styles.main_div}>
          <span>zipcode</span>
          <input value={zipcode} onChange={handleZipcode} />
        </div>
        <div className={styles.main_div}>
          <span>address1</span>
          <input value={address1} onChange={handleAddress1} />
        </div>
        <div className={styles.main_div}>
          <span>address2</span>
          <input value={address2} onChange={handleAddress2} />
        </div>
        <div className={styles.main_div}>
          <span>isAdmin</span>
          <input value={isAdmin} onChange={handleAdmin} />
        </div>
      </div>
      <div className={styles.right}>
        <button onClick={handleUpdateAuth}>업데이트</button>
        <button onClick={handleDeleteAuth}>삭제</button>
      </div>
      {error && (
        <motion.div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            fontSize: "2.5rem",
            zIndex: "2",
            color: "#fff54f",
            position: "fixed",
            top: "-20%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          animate={{ top: "20%", left: "50%" }}
          transition={{
            duration: 0.5,
          }}
        >
          <span>{errorMessage}</span>
        </motion.div>
      )}
    </div>
  );
}
