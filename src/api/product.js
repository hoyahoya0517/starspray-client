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
