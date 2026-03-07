import { CartData } from "@/types";

export const mockCartData: CartData = {
  cartItems: [
    {
      product_id: 101,
      product_name: "Bamboo Toothbrush (Pack of 4)",
      product_price: 299,
      quantity: 2,
      image: "/images/tootbrush.jpg",
    },
    {
      product_id: 102,
      product_name: "Reusable Cotton Produce Bags",
      product_price: 450,
      quantity: 1,
      image: "/images/reusablecottonimagebag.jpg",
    },
  ],
  shipping_fee: 50,
  discount_applied: 0,
};
