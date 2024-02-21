import styles from "./Login.module.css";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { navOff } from "../../redux/redux";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mongoLogin, mongoMe } from "../../api/auth";
import { motion } from "framer-motion";

export default function Login() {
  const { isLoading, data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const data = await mongoMe();
      return data;
    },
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const loginMutate = useMutation({
    mutationFn: async (user) => await mongoLogin(user),
    onSuccess(data) {
      queryClient.setQueryData(["user"], data);
      queryClient.removeQueries({ queryKey: ["userInfo"] });
      queryClient.removeQueries({ queryKey: ["cart"] });
      queryClient.removeQueries({ queryKey: ["orders"] });
      queryClient.removeQueries({ queryKey: ["order"] });
      navigate("/");
    },
    onError(error) {
      setErrorMessage(error.message);
      return setError(true);
    },
  });
  const handleLogin = async (e) => {
    setError(false);
    e.preventDefault();
    try {
      const user = {
        email,
        password,
      };
      loginMutate.mutate(user);
    } catch (error) {
      setErrorMessage(error.message);
      return setError(true);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(navOff());
  }, []);
  // useEffect(() => {
  //   if (error) {
  //     setTimeout(() => {
  //       setError(false);
  //       setErrorMessage("");
  //     }, 2000);
  //   }
  // }, [error]);
  useEffect(() => {
    if (user) navigate("/");
  }, [user]);
  if (isLoading) {
    return <div className={styles.login}></div>;
  }
  return (
    <div className={styles.login}>
      <div className={styles.loginWrap}>
        <form onSubmit={handleLogin} className={styles.main}>
          <div className={styles.mainInput}>
            <div>
              <label htmlFor="email">Email*</label>
              <input
                value={email}
                onChange={handleEmail}
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
              />
            </div>
          </div>
          <div className={styles.mainButton}>
            <button type="submit">LOGIN</button>
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
          <div className={styles.register}>
            <span
              onClick={() => {
                navigate("/register");
              }}
            >
              Register new account
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
