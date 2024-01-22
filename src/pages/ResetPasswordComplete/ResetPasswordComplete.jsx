import { useNavigate } from "react-router-dom";
import styles from "./ResetPasswordComplete.module.css";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { navOff } from "../../redux/redux";

export default function ResetPasswordComplete() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(navOff());
  }, []);
  return (
    <div className={styles.resetPasswordComplete}>
      <div className={styles.left}>
        <h1>이메일로 전송된</h1>
        <h1>비밀번호 재설정 메일을</h1>
        <h1>확인하세요</h1>
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
