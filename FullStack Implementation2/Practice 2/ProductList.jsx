import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cartSlice';

const products = [
  { name: 'Laptop', price: 1200 },
  { name: 'Mouse', price: 25 },
  { name: 'Keyboard', price: 45 },
];

export default function ProductList() {
  const dispatch = useDispatch();

  return (
    <div>
      <h2>Products</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px' }}>
        {products.map((p) => (
          <div
            key={p.name}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <h3>{p.name}</h3>
            <p>${p.price}</p>
            <button onClick={() => dispatch(addToCart(p))}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}
