import { useNavigate } from "react-router-dom";
import styles from "./Footer.module.css";

export default function Footer() {
  const navigate = useNavigate();
  return (
    <div className={styles.footer}>
      <div className={styles.content}>
        STAR SPRAY BUSINESS LICENSE: 568-03-02882 ADDRESS: 43, SONGPA-DAERO
        28-GIL, SONGPA-GU, SEOUL, REPUBLIC OF KOREA
        <br />
        CEO : LEEGEONHO CAll : 02-6486-6828 EMAIL : info.starspray.gmail@com{" "}
        <span
          className={styles.agree}
          onClick={() => {
            navigate("/personal");
          }}
        >
          이용약관
        </span>{" "}
        <span
          className={styles.agree}
          onClick={() => {
            navigate("/terms");
          }}
        >
          개인정보취급방침
        </span>{" "}
        <span
          className={styles.agree}
          onClick={() => {
            window.open(
              "",
              "KB_AUTHMARK",
              "height=604, width=648, status=yes, toolbar=no, menubar=no,location=no"
            );
            document.KB_AUTHMARK_FORM.action =
              "https://okbfex.kbstar.com/quics";
            document.KB_AUTHMARK_FORM.target = "KB_AUTHMARK";
            document.KB_AUTHMARK_FORM.submit();
          }}
        >
          구매안전(에스크로)
        </span>
        <form name="KB_AUTHMARK_FORM" method="get">
          <input type="hidden" name="page" value="C021590" />
          <input type="hidden" name="cc" value="b034066:b035526" />
          <input
            type="hidden"
            name="mHValue"
            value="b844d1bb91c80ab7cbc49bfbe146a8f7"
          />
        </form>
      </div>
    </div>
  );
}
