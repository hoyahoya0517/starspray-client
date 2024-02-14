import { useDispatch } from "react-redux";
import styles from "./NavMenu.module.css";
import { navOff } from "../../redux/redux";
import { BsXLg } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
export default function NavMenu() {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(["user"]);
  const dispatch = useDispatch();
  const navStateOff = () => {
    dispatch(navOff());
  };
  const navStateKeep = (e) => {
    e.stopPropagation();
  };
  const navigate = useNavigate();
  return (
    <div className={styles.navMenu} onClick={navStateOff}>
      <div className={styles.menu} onClick={navStateKeep}>
        <div className={styles.x}>
          <BsXLg size={20} onClick={navStateOff} />
        </div>
        <div className={styles.top}>
          {user?.name || false ? (
            <span
              className={styles.menu_menu}
              onClick={() => {
                navigate("/profile");
              }}
            >
              ACCOUNT
            </span>
          ) : (
            <span
              className={styles.menu_menu}
              onClick={() => {
                navigate("/login");
              }}
            >
              LOGIN
            </span>
          )}
          <span
            onClick={() => {
              navigate("/");
            }}
            className={styles.menu_menu}
          >
            HOME
          </span>
          <span
            onClick={() => {
              navigate("/cart");
            }}
            className={styles.menu_menu}
          >
            CART
          </span>
          <span
            onClick={() => {
              navigate("/products/new");
            }}
            className={styles.menu_menu}
          >
            PRODUCT
          </span>
          <span
            onClick={() => {
              navigate("/products/vintage");
            }}
            className={styles.menu_menu}
          >
            VINTAGE
          </span>
        </div>
        <div className={styles.bottom}>
          <span
            className={styles.menu_menu}
            onClick={() => {
              navigate("/support");
            }}
          >
            SUPPORT
          </span>
        </div>
      </div>
      <div className={styles.right}>
        <img src="https://res.cloudinary.com/hoyahoya/image/upload/v1707919212/letter/back_ddkanu.webp" />
      </div>
    </div>
  );
}
