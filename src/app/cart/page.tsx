'use client';

import withAuth from '@/src/lib/with-auth';
import { useCart } from '@/src/lib/cart-store';

const CartPage = () => {
  const { items, removeFromCart, clearCart } = useCart();

  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <div className="grid grid-cols-1 gap-4 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center border p-4 rounded">
                <div>
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p>Price: ${item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:underline">
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="text-right text-2xl font-bold mb-4">
            Total: ${totalPrice.toFixed(2)}
          </div>
          <div className="flex justify-end">
            <button onClick={clearCart} className="bg-red-500 text-white px-4 py-2 rounded mr-2">
              Clear Cart
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              Checkout (Coming Soon)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(CartPage, ['buyer']);
