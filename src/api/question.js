import axios from "axios";

export async function mongoGetQuestions(cart) {
  try {
    const json = await axios.get("/question");
    return json.data;
  } catch (error) {
    throw Error(error.response.data.message);
  }
}
