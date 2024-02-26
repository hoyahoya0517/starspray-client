import axios from "axios";

export async function getProducts(category) {
  try {
    const json = await axios.get(`/product/category/${category}`);
    return json.data;
  } catch (error) {
    throw Error(error.response.data.message);
  }
}

export async function getProduct(id) {
  try {
    const json = await axios.get(`/product/detail/${id}`);
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
    await axios.post("/product/cart/check", { cart });
  } catch (error) {
    throw Error(error.response.data.message);
  }
}
