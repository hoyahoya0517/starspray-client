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
            <FaBars style={{ color: "black" }} size={20} />
          </span>
          <div
            onClick={() => {
              navigate("/cart");
            }}
            className={styles.menu_cart}
          >
            <span className={styles.menu_Cartbutton}>
              <FaShoppingBag style={{ color: "black" }} size={18} />
            </span>
            {user?.cart && user?.cart?.length !== 0 && (
              <span className={styles.cart_icon}>{user?.cart?.length}</span>
            )}
          </div>
        </div>
        <div
          className={styles.logo}
          onClick={() => {
            navigate("/");
          }}
        >
          <img src="https://res.cloudinary.com/hoyahoya/image/upload/v1710141096/letter/logo/logo_144_sjjqqr.png" />
        </div>
        <div className={styles.add}>
          <div className={styles.add_margin}></div>
          <div className={styles.insta}>
            <span className={styles.menu_instaButton}>
              <FaInstagram style={{ color: "black" }} size={22} />
            </span>
          </div>
        </div>
      </div>
      {navState && <NavMenu />}
    </header>
  );
}
