import axios from "axios";

export async function getProducts() {
  try {
    const json = await axios.get("/product");
    return json.data;
  } catch (error) {
    throw Error(error.response.data.message);
  }
}

export async function getProduct(id) {
  try {
    const json = await axios.get(`/product/${id}`);
    return json.data;
  } catch (error) {
    throw Error(error.response.data.message);
  }
}

export async function getProductByCart() {
  try {
    const json = await axios.get("/product/cart");
    return json.data;
  } catch (error) {
    throw Error(error.response.data.message);
  }
}

export async function getProductByOrder(id) {
  try {
    const json = await axios.get(`/product/order/${id}`);
    return json.data;
  } catch (error) {
    throw Error(error.response.data.message);
  }
}

export async function checkCart(cart) {
  try {
    await axios.get("/product/cart/check", { cart });
  } catch (error) {
    throw Error(error.response.data.message);
  }
}

export async function payCompleteCart(cart) {
  try {
    await axios.post("/product/cart/complete", { cart });
  } catch (error) {
    throw Error(error.response.data.message);
  }
}
