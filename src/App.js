import { Outlet } from "react-router-dom";
import "./App.css";
import Nav from "./components/Nav/Nav";
import Footer from "./components/Footer/Footer";
import { useQuery } from "@tanstack/react-query";
import { getCsrfToken, mongoMe } from "./api/auth";
import axios from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

function App() {
  const navState = useSelector((state) => state.nav);
  const { data: user, isError } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const data = await mongoMe();
      return data;
    },
  });
  const { data: csrfToken, isError2 } = useQuery({
    queryKey: ["csrfToken"],
    queryFn: async () => {
      const data = await getCsrfToken();
      return data;
    },
  });

  axios.defaults.baseURL = "https://server.star-spray.com";
  axios.defaults.withCredentials = true;
  axios.defaults.headers.common["startoken"] = csrfToken;

  const body = document.querySelector("body");
  useEffect(() => {
    if (navState) disableBodyScroll(body, { reserveScrollBarGap: true });
    else enableBodyScroll(body);
  }, [navState]);
  return (
    <>
      <Nav />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
