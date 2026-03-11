import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartData, ShippingAddress, SavedAddress } from "@/types";

interface CheckoutState {
  cartData: CartData | null;
  shippingAddress: ShippingAddress | null;
  savedAddresses: SavedAddress[];
  orderId: string | null;
  setCartData: (data: CartData) => void;
  setShippingAddress: (address: ShippingAddress) => void;
  addSavedAddress: (address: ShippingAddress, label: string) => SavedAddress;
  updateSavedAddress: (id: string, address: Partial<SavedAddress>) => void;
  removeSavedAddress: (id: string) => void;
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
      savedAddresses: [],
      orderId: null,

      setCartData: (data) => set({ cartData: data }),

      setShippingAddress: (address) => set({ shippingAddress: address }),

      addSavedAddress: (address, label) => {
        const newAddress: SavedAddress = {
          ...address,
          id: `addr-${Date.now()}`,
          label,
        };
        set((state) => ({
          savedAddresses: [...state.savedAddresses, newAddress],
        }));
        return newAddress;
      },

      updateSavedAddress: (id, updated) =>
        set((state) => ({
          savedAddresses: state.savedAddresses.map((a) =>
            a.id === id ? { ...a, ...updated } : a
          ),
        })),

      removeSavedAddress: (id) =>
        set((state) => ({
          savedAddresses: state.savedAddresses.filter((a) => a.id !== id),
        })),

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
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
    }
  )
);
