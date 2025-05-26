import { useCart } from './CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  return (
    <div className="bg-white rounded-xl shadow-lg transform hover:scale-105 transition">
      <div className="h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-primary">
            {product.price} €
          </span>
          <button
            onClick={() => addToCart(product)}
            className="bg-primary text-light px-3 py-1 rounded-full hover:bg-red-700 transition"
          >
            + Košík
          </button>
        </div>
      </div>
    </div>
  );
}
