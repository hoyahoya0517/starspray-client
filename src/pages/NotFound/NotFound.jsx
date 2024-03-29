import styles from "./NotFound.module.css";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { navOff } from "../../redux/redux";

export default function NotFound() {
  const dispatch = useDispatch();
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(navOff());
  }, []);
  return (
    <div className={styles.notFound}>
      <div className={styles.notFoundImg}>
        <img src="https://res.cloudinary.com/hoyahoya/image/upload/v1703133861/letter/basic-html-404-error_b0ch5d.webp" />
      </div>
    </div>
  );
}
