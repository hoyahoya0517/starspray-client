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
        <div className={styles.xWrap}>
          <div className={styles.x}>
            <span className={styles.menu_button} onClick={navStateOff}>
              <BsXLg style={{ color: "black" }} size={20} />
            </span>
          </div>
        </div>
        <div className={styles.top}>
          <div>
            <span
              className={styles.starSpray}
              onClick={() => {
                navigate("/");
              }}
            >
              STARSPRAY
            </span>
          </div>
          <div className={styles.air}></div>
          {user?.name || false ? (
            <div>
              <span
                className={styles.menu_menu}
                onClick={() => {
                  navigate("/profile");
                }}
              >
                ACCOUNT
              </span>
            </div>
          ) : (
            <div>
              <span
                className={styles.menu_menu}
                onClick={() => {
                  navigate("/login");
                }}
              >
                LOGIN
              </span>
            </div>
          )}
          <div>
            <span
              onClick={() => {
                navigate("/cart");
              }}
              className={styles.menu_menu}
            >
              CART
            </span>
          </div>
          <div>
            <span
              onClick={() => {
                navigate("/products/new");
              }}
              className={styles.menu_menu}
            >
              PRODUCT
            </span>
          </div>
          <div>
            <span
              onClick={() => {
                navigate("/products/vintage");
              }}
              className={styles.menu_menu}
            >
              VINTAGE
            </span>
          </div>
          <div className={styles.air}></div>
          <div>
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
      </div>
    </div>
  );
}
