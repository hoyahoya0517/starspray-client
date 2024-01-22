import styles from "./Home.module.css";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { navOff } from "../../redux/redux";

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(navOff());
  }, []);
  return (
    <div className={styles.home}>
      <div className={styles.mainVideo}>
        <video autoPlay muted loop playsInline className={styles.video}>
          <source src="https://res.cloudinary.com/hoyahoya/video/upload/v1703048422/letter/videoplayback.CUT.05_16-05_30_oexws3.mp4"></source>
        </video>
      </div>
    </div>
  );
}
