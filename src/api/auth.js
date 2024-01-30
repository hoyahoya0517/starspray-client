import axios from "axios";

export async function mongoSignup(user) {
  try {
    await axios.post("/auth/signup", user);
  } catch (error) {
    throw Error(error.response.data.message);
  }
}

export async function mongoLogin(user) {
  try {
    const json = await axios.post("/auth/login", user);
    return json.data;
  } catch (error) {
    throw Error(error.response.data.message);
  }
}

export async function mongoLogout() {
  await axios.post("/auth/logout");
}

/*----------------------------------*/

export async function getUserInfo() {
  try {
    const json = await axios.get("/auth/getUserInfo");
    return json.data;
  } catch (error) {
    throw Error(error.response.data.message);
  }
}

export async function mongoUpdateProfile(user) {
  try {
    await axios.put("/auth/updateProfile", user);
  } catch (error) {
    throw Error(error.response.data.message);
  }
}

export async function resetPassword(email) {
  try {
    await axios.post("/auth/resetPassword", { email });
  } catch (error) {
    throw Error(error.response.data.message);
  }
}

export async function settingPassword(password, token) {
  try {
    await axios.post(`/auth/settingPassword/${token}`, { password });
  } catch (error) {
    throw Error(error.response.data.message);
  }
}

export async function sendMoon(name, email, paymentId, moon) {
  try {
    await axios.post("/auth/moon", { name, email, paymentId, moon });
  } catch (error) {
    throw Error(error.response.data.message);
  }
}

/*----------------------------------*/

export async function mongoAddCart(id) {
  try {
    await axios.post("/auth/cart", { productId: id });
  } catch (error) {
    throw Error(error.response.data.message);
  }
}
export async function mongoUpdateCart(productId, su) {
  try {
    await axios.post("/auth/cart/qty", { productId, su });
  } catch (error) {
    throw Error(error.response.data.message);
  }
}

export async function mongoCompleteCart() {
  try {
    await axios.get("/auth/cart/complete");
  } catch (error) {
    throw Error(error.response.data.message);
  }
}
/*----------------------------------*/
export async function mongoGetOrders() {
  try {
    const json = await axios.get("/auth/getOrders");
    return json.data;
  } catch (error) {
    throw Error(error.response.data.message);
  }
}

export async function mongoGetOrder(id) {
  try {
    const json = await axios.get(`/auth/getOrder/${id}`);
    return json.data;
  } catch (error) {
    throw Error(error.response.data.message);
  }
}
/*----------------------------------*/

export async function mongoMe() {
  try {
    const json = await axios.get("/auth/me");
    return json.data;
  } catch (error) {
    throw Error(error.response.data.message);
  }
}

export async function getCsrfToken() {
  try {
    const resp = await axios.get("/auth/csrf-token");
    return resp.data.csrfToken;
  } catch (error) {
    throw Error(error);
  }
}

/*----------------------------------*/
