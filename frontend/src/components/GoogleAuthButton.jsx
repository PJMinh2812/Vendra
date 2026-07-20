import { useEffect, useRef } from 'react';

let scriptPromise = null;

function loadGoogleScript() {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Không tải được Google Identity script'));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

// Google gọi callback qua closure lúc initialize() — dùng ref để luôn gọi đúng
// onSuccess/onError mới nhất mà không phải initialize lại (tránh nháy nút mỗi lần re-render).
export default function GoogleAuthButton({ onSuccess, onError }) {
  const containerRef = useRef(null);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;

  useEffect(() => {
    let cancelled = false;
    loadGoogleScript()
      .then(() => {
        if (cancelled || !containerRef.current) return;
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: (response) => onSuccessRef.current(response.credential),
        });
        window.google.accounts.id.renderButton(containerRef.current, {
          theme: 'outline',
          size: 'large',
          width: containerRef.current.offsetWidth,
          text: 'signin_with',
        });
      })
      .catch((err) => onErrorRef.current?.(err.message));
    return () => {
      cancelled = true;
    };
  }, []);

  return <div ref={containerRef} className="google-auth-btn" />;
}
