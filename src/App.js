import { Outlet } from "react-router-dom";
import "./App.css";
import Nav from "./components/Nav/Nav";
import Footer from "./components/Footer/Footer";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCsrfToken, mongoMe } from "./api/auth";
import axios from "axios";
import { useEffect } from "react";

function App() {
  const queryClient = useQueryClient();
  const { data: user, error } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const data = await mongoMe();
      return data;
    },
  });
  const { data: csrfToken } = useQuery({
    queryKey: ["csrfToken"],
    queryFn: async () => {
      const data = await getCsrfToken();
      return data;
    },
  });
  axios.defaults.withCredentials = true;
  axios.defaults.headers.common["_csrf-token"] = csrfToken;
  useEffect(() => {
    if (error || !(user?.name || false))
      queryClient.setQueryData(["user"], null);
  }, [error]);
  return (
    <>
      <Nav />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
