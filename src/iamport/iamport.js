import PortOne from "@portone/browser-sdk/v2";
import { mongoNewOrder, orderComplete } from "../api/payment";
import { checkCart } from "../api/product";
import dayjs from "dayjs";

export async function pay(
  cart,
  name,
  phone,
  email,
  zipcode,
  address1,
  address2,
  delivery,
  total,
  customerId
) {
  const paymentId = `${dayjs(Date.now()).format("YYMMDD")}${String(
    Math.floor(Math.random() * 1000000)
  ).padStart(6, "0")}`;
  const order = {
    paymentId,
    orderDate: Date.now().toString(),
    cart,
    name,
    phone,
    email,
    zipcode,
    address1,
    address2,
    delivery,
    total,
    customerId,
    complete: false,
    refund: false,
    shipping: "주문 실패",
    traking: "",
  };
  await checkCart(cart);
  await mongoNewOrder(order);
  const response = await PortOne.requestPayment({
    // 고객사 storeId로 변경해주세요.
    storeId: "store-d53f97da-1eb8-4d33-b8a5-f835292f5668",
    paymentId: paymentId,
    orderName: "Star Spray",
    totalAmount: total,
    currency: "CURRENCY_KRW",
    channelKey: "channel-key-0f29f962-e095-4190-95bb-f329f44eca98",
    pgProvider: "NICE_V2",
    pg: "nice_v2.nictest00m",
    payMethod: "CARD",
    customer: {
      customerId: customerId,
      fullName: name,
      phoneNumber: phone,
      email: email,
      address: {
        country: "KR",
        addressLine1: address1,
        addressLine2: address2,
      },
      zipcode: zipcode,
    },
    redirectUrl: `https://star-spray.com/cart/complete`,
  });
  if (response.code != null) {
    await orderComplete(paymentId, false);
    throw Error("결제에 문제가 발생했습니다");
  }
  await orderComplete(paymentId, true);
}
