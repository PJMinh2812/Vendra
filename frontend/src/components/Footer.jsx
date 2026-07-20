import './Footer.css';

const columns = [
  {
    title: 'CHĂM SÓC KHÁCH HÀNG',
    links: ['Trung tâm trợ giúp', 'Hướng dẫn Mua hàng', 'Hướng dẫn Trả hàng', 'Liên hệ'],
  },
  {
    title: 'VỀ VENDRA',
    links: ['Giới thiệu', 'Tuyển dụng', 'Điều khoản', 'Chính sách bảo mật'],
  },
  {
    title: 'THANH TOÁN',
    links: ['Visa', 'Mastercard', 'COD', 'Ví điện tử'],
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        {columns.map((col) => (
          <div key={col.title} className="footer__col">
            <p className="footer__col-title">{col.title}</p>
            <ul>
              {col.links.map((link) => (
                <li key={link}>{link}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container footer__bottom">
        <p>© 2026 Vendra — Dự án học tập, không phải sản phẩm thương mại.</p>
      </div>
    </footer>
  );
}
