import styles from "./Register.module.css";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { navOff } from "../../redux/redux";
import { useNavigate } from "react-router-dom";
import { mongoSignup } from "../../api/auth";
import { motion } from "framer-motion";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [timeOut, setTimeOut] = useState();
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleName = (e) => {
    setName(e.target.value);
  };
  const handlePhone = (e) => {
    setPhone(e.target.value);
  };
  const handleRegister = async (e) => {
    clearTimeout(timeOut);
    await setError(false);
    e.preventDefault();
    try {
      const user = {
        name,
        phone,
        email,
        password,
      };
      await mongoSignup(user);
      return navigate("/register/complete");
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
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(navOff());
  }, []);
  return (
    <div className={styles.login}>
      <div className={styles.loginWrap}>
        <form className={styles.main} onSubmit={handleRegister}>
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
                value={email}
                onChange={handleEmail}
                maxLength="40"
                type="email"
                id="email"
              />
            </div>
            <div>
              <label htmlFor="password">Password*</label>
              <input
                value={password}
                onChange={handlePassword}
                maxLength="20"
                type="password"
                id="password"
                autoComplete="off"
              />
            </div>
          </div>
          <div className={styles.mainButton}>
            <button type="submit">REGISTER</button>
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
        <div className={styles.buttomMenu}>
          <div className={styles.reset}>
            <span
              onClick={() => {
                navigate("/resetPassword");
              }}
            >
              Reset password
            </span>
          </div>
          <div className={styles.signin}>
            <span
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
