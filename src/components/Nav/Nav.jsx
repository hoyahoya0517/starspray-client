import { useDispatch, useSelector } from "react-redux";
import styles from "./Nav.module.css";
import { BsList } from "react-icons/bs";
import { useEffect } from "react";
import { navOff, navOn } from "../../redux/redux";
import NavMenu from "../NavMenu/NavMenu";
import { useNavigate } from "react-router-dom";
import { CiShoppingCart } from "react-icons/ci";
import { useQueryClient } from "@tanstack/react-query";

export default function Nav() {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(["user"]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const navState = useSelector((state) => state.nav);
  const navStateOn = () => {
    dispatch(navOn());
  };
  useEffect(() => {
    dispatch(navOff());
  }, []);
  return (
    <div className={styles.nav}>
      <div className={styles.menu}>
        <div className={styles.menu_list} onClick={navStateOn}>
          <BsList size={45} />
        </div>
        <div
          onClick={() => {
            navigate("/cart");
          }}
          className={styles.menu_cart}
        >
          <CiShoppingCart size={45} />
          <span>{user ? (user.cart ? user.cart.length : null) : null}</span>
        </div>
      </div>
      <div className={styles.logo}>
        <span
          onClick={() => {
            navigate("/");
          }}
        >
          logo
        </span>
      </div>
      {navState && <NavMenu />}
    </div>
  );
}
