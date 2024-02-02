import styles from "./AdminAuth.module.css";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { mongoMe } from "../../api/auth";
import { useEffect, useState } from "react";
import { mongoGetAllAuth } from "../../api/admin";
import { motion } from "framer-motion";
import AdminAuthCard from "../../components/AdminAuthCard/AdminAuthCard";

export default function AdminAuth() {
  const navigate = useNavigate();
  const {
    isLoading,
    data: user,
    isError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const data = await mongoMe();
      return data;
    },
  });
  const { data: auth, isLoading2 } = useQuery({
    queryKey: ["adminAuth"],
    queryFn: async () => {
      const data = await mongoGetAllAuth();
      return data;
    },
  });
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    if (!isLoading) {
      if (!(user?.isAdmin ? user.isAdmin : false)) navigate("/");
    }
  }, [isLoading]);
  useEffect(() => {
    if (isError) navigate("/");
  }, [isError]);
  if (isLoading || isLoading2) {
    return <div className={styles.adminAuth}></div>;
  }
  return (
    <div className={styles.adminAuth}>
      <div className={styles.adminAuthMap}>
        {auth &&
          auth.map((profile) => {
            return <AdminAuthCard profile={profile} key={profile.id} />;
          })}
      </div>
      {error && (
        <motion.div
          style={{
            fontSize: "2rem",
            zIndex: "2",
            color: "#fff54f",
            transform: "translate(-50%, -50%)",
          }}
          initial={{
            position: "fixed",
            top: "-20%",
            left: "50%",
          }}
          animate={{
            position: "fixed",
            top: "50%",
            left: "50%",
          }}
          transition={{
            duration: 1.2,
          }}
        >
          <span>{errorMessage}</span>
        </motion.div>
      )}
    </div>
  );
}
