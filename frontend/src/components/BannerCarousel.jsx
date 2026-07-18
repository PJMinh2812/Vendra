import { useEffect, useState } from 'react';
import './BannerCarousel.css';

const slides = [
  {
    title: 'Vendra — Mua sắm thả ga',
    subtitle: 'Freeship mọi đơn · Giảm giá đến 50% · Giao hàng siêu tốc',
    gradient: 'linear-gradient(120deg, #1a94ff, #38c6ff)',
  },
  {
    title: 'Săn Sale Cuối Tuần',
    subtitle: 'Giảm thêm 15% cho đơn từ 200.000₫',
    gradient: 'linear-gradient(120deg, #7b2ff7, #f107a3)',
  },
  {
    title: 'Hàng Mới Về Mỗi Ngày',
    subtitle: 'Cập nhật xu hướng công nghệ & thời trang',
    gradient: 'linear-gradient(120deg, #0f9b8e, #38ef7d)',
  },
];

export default function BannerCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="banner-carousel">
      {slides.map((slide, i) => (
        <div
          key={slide.title}
          className={`banner-carousel__slide ${i === index ? 'active' : ''}`}
          style={{ background: slide.gradient }}
        >
          <h1>{slide.title}</h1>
          <p>{slide.subtitle}</p>
        </div>
      ))}
      <div className="banner-carousel__dots">
        {slides.map((slide, i) => (
          <button
            key={slide.title}
            type="button"
            className={i === index ? 'active' : ''}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
