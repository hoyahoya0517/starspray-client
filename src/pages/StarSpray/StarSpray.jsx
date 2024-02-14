import { useEffect } from "react";
import styles from "./StarSpray.module.css";
import { useDispatch } from "react-redux";
import { navOff } from "../../redux/redux";

export default function StarSpray() {
  const dispatch = useDispatch();
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(navOff());
  }, []);
  return <div className={styles.starSpray}></div>;
}
