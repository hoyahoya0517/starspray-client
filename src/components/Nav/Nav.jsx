import { useDispatch, useSelector } from "react-redux";
import styles from "./Nav.module.css";
import { useEffect } from "react";
import { navOff, navOn } from "../../redux/redux";
import NavMenu from "../NavMenu/NavMenu";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { FaShoppingBag, FaBars, FaInstagram } from "react-icons/fa";

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
    window.scrollTo(0, 0);
    dispatch(navOff());
  }, []);
  return (
    <header className={styles.nav}>
      <div className={styles.navWrapper}>
        <div className={styles.menu}>
          <span className={styles.menu_listButton} onClick={navStateOn}>
            <FaBars style={{ color: "black" }} size={18} />
          </span>
          <div
            onClick={() => {
              navigate("/cart");
            }}
            className={styles.menu_cart}
          >
            <span className={styles.menu_Cartbutton}>
              <FaShoppingBag style={{ color: "black" }} size={16} />
            </span>
            {user ? (
              user.cart.length === 0 ? null : (
                <span className={styles.cart_icon}>{user.cart.length}</span>
              )
            ) : null}
          </div>
        </div>
        <div
          className={styles.logo}
          onClick={() => {
            navigate("/");
          }}
        >
          <span>로고넣어야됨</span>
        </div>
        <div className={styles.add}>
          <div className={styles.add_margin}></div>
          <div className={styles.insta}>
            <span className={styles.menu_instaButton}>
              <FaInstagram style={{ color: "black" }} size={20} />
            </span>
          </div>
        </div>
      </div>
      {navState && <NavMenu />}
    </header>
  );
}
