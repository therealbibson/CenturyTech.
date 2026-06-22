import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMinus, FaPlus, FaShoppingCart, FaTrash } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, itemCount, total, removeFromCart, updateQuantity, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white border border-gray-100 rounded-2xl p-10 text-center shadow-sm">
          <div className="mx-auto h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center text-[#2563EB] mb-5">
            <FaShoppingCart size={26} />
          </div>
          <h1 className="text-3xl font-bold text-[#0F172A] mb-3">Your cart is empty</h1>
          <p className="text-gray-600 mb-7">Add products you like, then review them here before checkout.</p>
          <Link to="/products" className="inline-block bg-[#2563EB] text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#0F172A] mb-2">Shopping Cart</h1>
            <p className="text-gray-600">{itemCount} item{itemCount !== 1 ? 's' : ''} ready for review.</p>
          </div>
          <button
            type="button"
            onClick={clearCart}
            className="inline-flex items-center justify-center gap-2 border border-red-200 text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-red-50 transition-colors"
          >
            <FaTrash /> Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
          <div className="space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm grid sm:grid-cols-[120px_1fr_auto] gap-4 items-center"
              >
                <Link to={`/products/${item.product.id}`} className="block rounded-xl overflow-hidden bg-gray-100">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-28 object-cover" />
                </Link>

                <div>
                  <Link to={`/products/${item.product.id}`} className="text-xl font-bold text-[#0F172A] hover:text-[#2563EB] transition-colors">
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-gray-500 mb-2">{item.product.category}</p>
                  <p className="text-lg font-bold text-[#2563EB]">NGN {item.product.price.toLocaleString()}</p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-3">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="h-10 w-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      aria-label={`Decrease ${item.product.name} quantity`}
                    >
                      <FaMinus size={12} />
                    </button>
                    <span className="h-10 w-12 flex items-center justify-center border-x border-gray-200 font-bold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="h-10 w-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      aria-label={`Increase ${item.product.name} quantity`}
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    aria-label={`Remove ${item.product.name} from cart`}
                  >
                    <FaTrash />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <aside className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="text-2xl font-bold text-[#0F172A] mb-5">Order Summary</h2>
            <div className="border-b border-gray-200 pb-5 mb-5">
              <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">Items</h3>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.product.id} className="flex justify-between gap-3 text-sm text-gray-600">
                    <span className="font-medium text-[#0F172A]">{item.product.name}</span>
                    <span className="shrink-0 text-right">
                      x{item.quantity} - NGN {(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3 text-gray-600 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#0F172A]">NGN {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="font-bold text-[#0F172A]">Contact store</span>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-5 flex justify-between text-xl font-bold text-[#0F172A] mb-6">
              <span>Total</span>
              <span>NGN {total.toLocaleString()}</span>
            </div>
            <Link to="/contact" className="block text-center bg-[#2563EB] text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors">
              Contact to Checkout
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
