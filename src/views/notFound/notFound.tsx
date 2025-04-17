// src/views/error/NotFound.tsx
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404 - 页面不存在</h1>
      <p>您访问的页面可能已被移除或暂时不可用</p>
      <Link to="/">返回首页</Link>
    </div>
  );
}