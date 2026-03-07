import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartData, ShippingAddress } from "@/types";

interface CheckoutState {
  cartData: CartData | null;
  shippingAddress: ShippingAddress | null;
  orderId: string | null;
  setCartData: (data: CartData) => void;
  setShippingAddress: (address: ShippingAddress) => void;
  updateItemQuantity: (productId: number, quantity: number) => void;
  placeOrder: () => void;
  resetCheckout: () => void;
  getSubtotal: () => number;
  getGrandTotal: () => number;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      cartData: null,
      shippingAddress: null,
      orderId: null,

      setCartData: (data) => set({ cartData: data }),

      setShippingAddress: (address) => set({ shippingAddress: address }),

      updateItemQuantity: (productId, quantity) =>
        set((state) => ({
          cartData: state.cartData
            ? {
                ...state.cartData,
                cartItems:
                  quantity === 0
                    ? state.cartData.cartItems.filter(
                        (item) => item.product_id !== productId
                      )
                    : state.cartData.cartItems.map((item) =>
                        item.product_id === productId
                          ? { ...item, quantity }
                          : item
                      ),
              }
            : null,
        })),

      placeOrder: () => {
        const orderId = `ECO-${Date.now().toString(36).toUpperCase()}`;
        set({ orderId });
      },

      resetCheckout: () =>
        set({ cartData: null, shippingAddress: null, orderId: null }),

      getSubtotal: () => {
        const { cartData } = get();
        if (!cartData) return 0;
        return cartData.cartItems.reduce(
          (acc, item) => acc + item.product_price * item.quantity,
          0
        );
      },

      getGrandTotal: () => {
        const { cartData } = get();
        if (!cartData) return 0;
        const subtotal = get().getSubtotal();
        return subtotal + cartData.shipping_fee - cartData.discount_applied;
      },
    }),
    {
      name: "ecoyaan-checkout",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? sessionStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
    }
  )
);
