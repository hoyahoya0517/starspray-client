import axios from "axios";

export async function mongoNewOrder(order) {
  try {
    await axios.post("/payment/newOrder", order);
  } catch (error) {
    throw Error(error.response.data.message);
  }
}

export async function orderComplete(paymentId, success) {
  try {
    await axios.get(
      `/payment/complete?paymentId=${paymentId}&success=${success}`
    );
  } catch (error) {
    throw Error(error.response.data.message);
  }
}
