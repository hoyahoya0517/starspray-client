import styles from "./Home.module.css";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { navOff } from "../../redux/redux";
import Footer from "../../components/Footer/Footer";

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(navOff());
  }, []);
  return (
    <div className={styles.home}>
      <div className={styles.mainWrap}>
        <div className={styles.main}>
          <div className={styles.videoWrap}>
            <div className={styles.starSpray}>
              <span>STARSPRAY</span>
            </div>
            <video autoPlay muted loop playsInline className={styles.video}>
              <source src="https://res.cloudinary.com/hoyahoya/video/upload/v1707918941/letter/star4_alwwl0.mp4"></source>
            </video>
          </div>
          <div className={styles.videoWrap}>
            <div className={styles.info}>
              <span>PRODUCT</span>
            </div>
            <video autoPlay muted loop playsInline className={styles.video}>
              <source src="https://res.cloudinary.com/hoyahoya/video/upload/v1708057452/video2_zrfgzb.mp4"></source>
            </video>
          </div>
          <div className={styles.videoWrap}>
            <div className={styles.info}>
              <span>VINTAGE</span>
            </div>
            <video autoPlay muted loop playsInline className={styles.video}>
              <source src="https://res.cloudinary.com/hoyahoya/video/upload/v1708060375/video33_dosgbd.mp4"></source>
            </video>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
