import { useNavigate } from "react-router-dom";
import styles from "./RegisterComplete.module.css";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { navOff } from "../../redux/redux";

export default function RegisterComplete() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(navOff());
  }, []);
  return (
    <div className={styles.registerComplete}>
      <div>
        <span>회원가입이 완료되었습니다</span>
      </div>
      <div className={styles.goLogin}>
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
