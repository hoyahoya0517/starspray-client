import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";
import Product from "./pages/Product/Product";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import RegisterComplete from "./pages/RegisterComplete/RegisterComplete";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import ResetPasswordComplete from "./pages/ResetPasswordComplete/ResetPasswordComplete";
import { Provider } from "react-redux";
import { store } from "./redux/redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Profile from "./pages/Profile/Profile";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Cart from "./pages/Cart/Cart";
import SettingPassword from "./pages/SettingPassword/SettingPassword";

const root = ReactDOM.createRoot(document.getElementById("root"));
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60 * 24,
      retry: 1,
      throwOnError: (error) => {
        console.log(error.message);
      },
    },
  },
});
root.render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Routes>
          <Route path="/*" element={<App />}>
            <Route index element={<Home />} />
            <Route path="product" element={<Product />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="register/complete" element={<RegisterComplete />} />
            <Route path="resetPassword" element={<ResetPassword />} />
            <Route
              path="resetPassword/complete"
              element={<ResetPasswordComplete />}
            />
            <Route
              path="settingPassword/:token"
              element={<SettingPassword />}
            />
            <Route path="profile" element={<Profile />} />
            <Route path="cart" element={<Cart />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Provider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </BrowserRouter>
);
