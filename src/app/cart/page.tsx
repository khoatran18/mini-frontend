'use client';

import { useCart } from '@/lib/cart-store';
import { OrderAPI, OrderInput } from '@/lib/endpoints';
import { useAuth } from '@/lib/auth-store';
import { useRouter } from 'next/navigation';

const CartPage = () => {
  const { items, removeItem, updateItemQuantity } = useCart();
  const { userId } = useAuth();
  const router = useRouter();

  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!userId) {
      alert('You must be logged in to checkout.');
      return;
    }

    const orderInput: OrderInput = {
      buyer_id: userId,
      order_items: items.map(item => ({ product_id: item.id, quantity: item.quantity })),
    };

    try {
      await OrderAPI.create(orderInput);
      router.push('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center border-b py-4">
              <div>
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-gray-600">Price: ${item.price}</p>
              </div>
              <div className="flex items-center">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value))}
                  className="w-16 px-2 py-1 border rounded-md mr-4"
                />
                <button onClick={() => removeItem(item.id)} className="text-red-500 hover:underline">Remove</button>
              </div>
            </div>
          ))}
          <div className="text-right mt-8">
            <p className="text-2xl font-semibold">Total: ${totalPrice.toFixed(2)}</p>
            <button onClick={handleCheckout} className="bg-blue-500 text-white px-6 py-2 rounded-md mt-4">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
