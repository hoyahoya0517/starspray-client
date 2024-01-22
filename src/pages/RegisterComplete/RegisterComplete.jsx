import { useNavigate } from "react-router-dom";
import styles from "./RegisterComplete.module.css";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { navOff } from "../../redux/redux";

export default function RegisterComplete() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(navOff());
  }, []);
  return (
    <div className={styles.registerComplete}>
      <div className={styles.left}>
        <h1>회원가입이</h1>
        <h1>완료되었습니다</h1>
      </div>
      <div className={styles.right}>
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
