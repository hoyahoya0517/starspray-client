import { useDispatch } from "react-redux";
import styles from "./NavMenu.module.css";
import { navOff } from "../../redux/redux";
import { BsXLg } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PiPersonSimpleRunBold } from "react-icons/pi";

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
            <div
              className={styles.navMenuPerson}
              onClick={() => {
                navigate("/profile");
              }}
            >
              {/* <div className={styles.navMenuPersonSvg}>
                <PiPersonSimpleRunBold size={19} />
              </div> */}
              <span>{user.name}</span>
            </div>
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
              navigate("/product");
            }}
            className={styles.menu_menu}
          >
            PRODUCT
          </span>
        </div>
        <div className={styles.bottom}>
          <div className={styles.menu_menu}>
            <span>CUSTOMER SERVICE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
