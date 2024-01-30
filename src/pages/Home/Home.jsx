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
          <source src="https://res.cloudinary.com/hoyahoya/video/upload/v1706083875/letter/video3_a9qh6s.mp4"></source>
        </video>
      </div>
    </div>
  );
}
