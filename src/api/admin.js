import axios from "axios";

export async function mongoAdminAddProduct(newProduct) {
  try {
    await axios.post("/admin/products", newProduct);
  } catch (error) {
    throw Error(error.response.data.message);
  }
}

export async function mongoAdminUpdateProduct(updateProduct) {
  try {
    await axios.put("/admin/updateProduct", updateProduct);
  } catch (error) {
    throw Error(error.response.data.message);
  }
}

export async function mongoAdminDeleteProduct(productId) {
  try {
    await axios.delete(`/admin/product/${productId}`);
  } catch (error) {
    throw Error(error.response.data.message);
  }
}

export async function mongoGetAllOrders() {
  try {
    const json = await axios.get(`/admin/orders`);
    return json.data;
  } catch (error) {
    throw Error(error.response.data.message);
  }
}

export async function mongoAdminUpdateOrder(updateOrder) {
  try {
    await axios.put("/admin/updateOrder", updateOrder);
  } catch (error) {
    throw Error(error.response.data.message);
  }
}

export async function mongoAdminDeleteOrder(orderId) {
  try {
    await axios.delete(`/admin/order/${orderId}`);
  } catch (error) {
    throw Error(error.response.data.message);
  }
}

export async function mongoAdminRefundOrder(paymentId) {
  try {
    await axios.post(`/admin/order/refund`, { paymentId });
  } catch (error) {
    throw Error(error.response.data.message);
  }
}

export async function mongoGetAllAuth() {
  try {
    const json = await axios.get(`/admin/auth`);
    return json.data;
  } catch (error) {
    throw Error(error.response.data.message);
  }
}

export async function mongoAdminUpdateAuth(updateAuth) {
  try {
    await axios.put("/admin/updateAuth", updateAuth);
  } catch (error) {
    throw Error(error.response.data.message);
  }
}

export async function mongoAdminDeleteAuth(authId) {
  try {
    await axios.delete(`/admin/auth/${authId}`);
  } catch (error) {
    throw Error(error.response.data.message);
  }
}
