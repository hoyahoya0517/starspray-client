import PortOne from "@portone/browser-sdk/v2";
import { mongoNewOrder, orderComplete } from "../api/payment";
import { checkCart, payCompleteCart } from "../api/product";
import dayjs from "dayjs";

export async function pay(
  cart,
  name,
  phone,
  email,
  zipcode,
  address1,
  address2,
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
    total,
    customerId,
    complete: false,
    shipping: "주문 확인 중",
    refund: false,
  };
  await checkCart(cart);
  await mongoNewOrder(order);
  const response = await PortOne.requestPayment({
    // 고객사 storeId로 변경해주세요.
    storeId: "store-d53f97da-1eb8-4d33-b8a5-f835292f5668",
    paymentId: paymentId,
    orderName: "오테가미",
    totalAmount: total,
    currency: "CURRENCY_KRW",
    channelKey: "channel-key-60d5c782-671f-4231-90e6-633d5361bede",
    pgProvider: "KSNET",
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
  });
  if (response.code != null) {
    throw Error("결제에 문제가 발생했습니다");
  }
  await orderComplete(paymentId);
  order.complete = true;
  await payCompleteCart(cart);
}
