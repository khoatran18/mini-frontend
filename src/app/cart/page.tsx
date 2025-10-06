
"use client";

import { useCart } from "@/lib/cart-store";
import { OrderAPI } from "@/lib/endpoints";
import { useRouter } from "next/navigation";
import { OrderInput } from "@/lib/endpoints";

const CartPage = () => {
  const { items, clearCart, removeItem, updateItemQuantity } = useCart();
  const router = useRouter();

  const handleCheckout = async () => {
    const orderInput: OrderInput = {
        order_items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
    };

    try {
      await OrderAPI.create(orderInput);
      alert("Order created successfully!");
      clearCart();
      router.push("/orders");
    } catch (error: any) {
      const errorResponse = error.response?.data;
      if (errorResponse && errorResponse.error) {
        alert(`Error: ${errorResponse.error}`);
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b py-2">
              <div>
                <h2 className="font-bold">{item.name}</h2>
                <p>Price: ${item.price}</p>
              </div>
              <div className="flex items-center">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value))}
                  className="w-16 text-center border mx-2"
                  min="1"
                />
                <button onClick={() => removeItem(item.id)} className="text-red-500">Remove</button>
              </div>
            </div>
          ))}
          <div className="text-right mt-4">
            <p className="font-bold text-xl">Total: ${items.reduce((acc, item) => acc + item.price * item.quantity, 0)}</p>
          </div>
          <button onClick={handleCheckout} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Checkout</button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
