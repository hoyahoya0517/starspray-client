import { useNavigate, useParams } from "react-router-dom";
import styles from "./SettingPassword.module.css";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { navOff } from "../../redux/redux";
import { settingPassword } from "../../api/auth";

export default function SettingPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [change, setChange] = useState(false);
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSetting = async (e) => {
    e.preventDefault();
    try {
      await settingPassword(password, token);
      setErrorMessage("비밀번호가 변경되었습니다");
      setChange(true);
      return setError(true);
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
  useEffect(() => {
    if (!token) navigate("/");
  }, [token]);
  return (
    <div className={styles.login}>
      <div className={styles.loginWrap}>
        <form className={styles.main} onSubmit={handleSetting}>
          <div className={styles.mainInput}>
            <div>
              <label htmlFor="password">New Password*</label>
              <input
                readOnly={change ? true : false}
                value={password}
                onChange={handlePassword}
                maxLength="20"
                type="password"
                id="password"
              />
            </div>
          </div>
          <div className={styles.mainButton}>
            <button type="submit">CHANGE PASSWORD</button>
            {error && (
              <div className={styles.error}>
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        </form>
        {change && (
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
        )}
      </div>
    </div>
  );
}
