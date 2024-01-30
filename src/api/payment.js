import axios from "axios";

export async function mongoNewOrder(order) {
  try {
    await axios.post("/payment/newOrder", order);
  } catch (error) {
    throw Error(error.response.data.message);
  }
}

export async function orderComplete(paymentId) {
  try {
    await axios.post("/payment/complete", { paymentId });
  } catch (error) {
    throw Error(error.response.data.message);
  }
}
