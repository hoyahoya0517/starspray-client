import { useNavigate } from "react-router-dom";
import styles from "./ResetPasswordComplete.module.css";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { navOff } from "../../redux/redux";

export default function ResetPasswordComplete() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(navOff());
  }, []);
  return (
    <div className={styles.resetPasswordComplete}>
      <div>
        <span>이메일로 전송된 비밀번호 재설정 메일을 확인하세요</span>
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
