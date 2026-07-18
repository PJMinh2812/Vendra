import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById } from '../api/products';
import { getShopById } from '../api/shops';
import { useCart } from '../context/CartContext';
import Rating from '../components/Rating';
import QuantityInput from '../components/QuantityInput';
import ProductDetailSkeleton from '../components/ProductDetailSkeleton';
import { formatPrice, formatSold } from '../utils/format';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [shop, setShop] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedMessage, setAddedMessage] = useState('');

  useEffect(() => {
    setLoading(true);
    getProductById(id).then((p) => {
      setProduct(p);
      setActiveImage(0);
      setQuantity(1);
      setLoading(false);
      if (p) getShopById(p.shopId).then(setShop);
    });
  }, [id]);

  if (loading) return <div className="skeleton-page"><ProductDetailSkeleton /></div>;
  if (!product) return <div className="skeleton-page container">Không tìm thấy sản phẩm.</div>;

  function handleAddToCart() {
    addItem(product.id, quantity);
    setAddedMessage(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
    setTimeout(() => setAddedMessage(''), 2000);
  }

  function handleBuyNow() {
    addItem(product.id, quantity);
    navigate('/cart');
  }

  return (
    <div className="skeleton-page">
      <div className="container">
        <div className="product-detail card">
          <div className="product-detail__gallery">
            <img className="product-detail__main-image" src={product.images[activeImage]} alt={product.name} />
            <div className="product-detail__thumbs">
              {product.images.map((img, i) => (
                <img
                  key={img}
                  src={img}
                  alt=""
                  className={i === activeImage ? 'active' : ''}
                  onClick={() => setActiveImage(i)}
                />
              ))}
            </div>
          </div>

          <div className="product-detail__info">
            <h1>{product.name}</h1>
            <div className="product-detail__meta">
              <Rating value={product.rating} size={14} />
              <span>{product.ratingCount} đánh giá</span>
              <span className="text-muted">|</span>
              <span>{formatSold(product.sold)}</span>
            </div>

            <div className="product-detail__price-box">
              {product.discount > 0 && (
                <span className="product-detail__original-price">{formatPrice(product.originalPrice)}</span>
              )}
              <span className="product-detail__price price">{formatPrice(product.price)}</span>
              {product.discount > 0 && <span className="product-detail__discount">-{product.discount}%</span>}
            </div>

            <div className="product-detail__quantity-row">
              <span>Số lượng</span>
              <QuantityInput value={quantity} onChange={setQuantity} max={product.stock} />
              <span className="text-muted">{product.stock} sản phẩm có sẵn</span>
            </div>

            <div className="product-detail__actions">
              <button className="btn btn-outline" onClick={handleAddToCart}>
                🛒 Thêm Vào Giỏ Hàng
              </button>
              <button className="btn btn-primary" onClick={handleBuyNow}>
                Mua Ngay
              </button>
            </div>
            {addedMessage && <p className="product-detail__added-msg">{addedMessage}</p>}

            {shop && (
              <div className="product-detail__shop card">
                <img src={shop.avatar} alt={shop.name} />
                <div>
                  <p className="product-detail__shop-name">{shop.name}</p>
                  <p className="text-muted">{shop.location} · {shop.followers.toLocaleString('vi-VN')} người theo dõi</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="product-detail__description card">
          <h2>Mô Tả Sản Phẩm</h2>
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
}
