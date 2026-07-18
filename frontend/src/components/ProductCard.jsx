import { Link } from 'react-router-dom';
import Rating from './Rating';
import { formatPrice, formatSold } from '../utils/format';
import './ProductCard.css';

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="product-card card">
      <div className="product-card__image-wrap">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.discount > 0 && <span className="product-card__badge">-{product.discount}%</span>}
      </div>
      <div className="product-card__body">
        <p className="product-card__name">{product.name}</p>
        <p className="product-card__price price">{formatPrice(product.price)}</p>
        <div className="product-card__meta">
          <Rating value={product.rating} size={10} />
          <span className="text-muted">{formatSold(product.sold)}</span>
        </div>
      </div>
    </Link>
  );
}
