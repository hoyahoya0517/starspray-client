import styles from "./ResetPassword.module.css";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { navOff } from "../../redux/redux";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../../api/auth";

export default function ResetPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      navigate("/resetPassword/complete");
    } catch (error) {
      const message = error.message;
      setErrorMessage(message);
      return setError(true);
    }
  };
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
  return (
    <div className={styles.login}>
      <div className={styles.loginWrap}>
        <form className={styles.main} onSubmit={handleReset}>
          <div className={styles.mainInput}>
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
          </div>
          <div className={styles.mainButton}>
            <button type="submit">RESET PASSWORD</button>
            {error && (
              <div className={styles.error}>
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        </form>
        <div className={styles.buttomMenu}>
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
