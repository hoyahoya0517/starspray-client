import styles from "./Home.module.css";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { navOff } from "../../redux/redux";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(navOff());
  }, []);
  return (
    <div className={styles.home}>
      <div className={styles.main}>
        <div className={styles.videoWrap}>
          <div className={styles.starSpray}>
            <span>STARSPRAY</span>
          </div>
          <video autoPlay muted loop playsInline className={styles.video}>
            <source src="https://res.cloudinary.com/hoyahoya/video/upload/v1708061272/letter/star4_zkdhdg.mp4"></source>
          </video>
        </div>
        <div className={styles.videoWrap}>
          <div className={styles.info}>
            <span
              onClick={() => {
                navigate("/products/new");
              }}
            >
              PRODUCT
            </span>
          </div>
          <video autoPlay muted loop playsInline className={styles.video}>
            <source src="https://res.cloudinary.com/hoyahoya/video/upload/v1708061295/letter/video22_vhm7v7.mp4"></source>
          </video>
        </div>
        <div className={styles.videoWrap}>
          <div className={styles.info}>
            <span
              onClick={() => {
                navigate("/products/vintage");
              }}
            >
              VINTAGE
            </span>
          </div>
          <video autoPlay muted loop playsInline className={styles.video}>
            <source src="https://res.cloudinary.com/hoyahoya/video/upload/v1708061293/letter/video33_rsqybd.mp4"></source>
          </video>
        </div>
      </div>
    </div>
  );
}
