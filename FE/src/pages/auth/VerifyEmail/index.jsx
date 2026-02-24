import { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { authService } from '@services/authService';

/**
 * VerifyEmail page component - Modern split layout design
 * Handles both:
 * 1. Waiting for email verification (after registration)
 * 2. Processing verification token (when user clicks link in email)
 */
const VerifyEmailPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const emailFromState = location.state?.email;

  const [email, setEmail] = useState(emailFromState || '');
  const [isVerifying, setIsVerifying] = useState(!!token);
  const [isVerified, setIsVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false);

  // Verify token if present
  useEffect(() => {
    if (token) {
      verifyToken(token);
    }
  }, [token]);

  const verifyToken = async (verificationToken) => {
    setIsVerifying(true);
    setError('');

    try {
      const response = await authService.verifyEmail(verificationToken);
      if (response.success) {
        setIsVerified(true);
      } else {
        setError(response.message || 'Xác thực thất bại');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Liên kết xác thực không hợp lệ hoặc đã hết hạn'
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      setError('Vui lòng nhập email');
      return;
    }

    setIsResending(true);
    setError('');
    setResendSuccess(false);

    try {
      const response = await authService.resendVerificationEmail(email);
      if (response.success) {
        setResendSuccess(true);
      } else {
        setError(response.message || 'Không thể gửi lại email');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đã xảy ra lỗi');
    } finally {
      setIsResending(false);
    }
  };

  // Verification processing state
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-primary text-6xl animate-spin">
            progress_activity
          </span>
          <p className="mt-4 text-neutral-600 text-lg">
            Đang xác thực email của bạn...
          </p>
        </div>
      </div>
    );
  }

  // Verification success state
  if (isVerified) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="material-symbols-outlined text-green-600 text-6xl">
              check_circle
            </span>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">
            Xác thực thành công!
          </h1>
          <p className="text-neutral-500 text-lg mb-8">
            Tài khoản của bạn đã được kích hoạt. Bây giờ bạn có thể đăng nhập.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 w-full bg-accent-orange hover:bg-[#e65c00] text-white font-bold py-4 rounded-lg shadow-lg transition-all uppercase tracking-widest text-sm"
          >
            <span>Đăng nhập ngay</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </div>
    );
  }

  // Main waiting state
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white border-b border-neutral-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl">
            eyeglasses
          </span>
          <span className="font-extrabold text-xl tracking-tighter uppercase">
            Lily Eyewear
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/frames" className="hover:text-primary transition-colors">
            Gọng kính
          </Link>
          <Link to="/lenses" className="hover:text-primary transition-colors">
            Tròng kính
          </Link>
          <Link
            to="/accessories"
            className="hover:text-primary transition-colors"
          >
            Phụ kiện
          </Link>
        </nav>
        <div className="flex items-center gap-5">
          <span className="material-symbols-outlined cursor-pointer hover:text-primary">
            search
          </span>
          <span className="material-symbols-outlined cursor-pointer hover:text-primary">
            shopping_bag
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-6xl bg-white shadow-sm rounded-2xl overflow-hidden flex flex-col md:flex-row border border-neutral-100">
          {/* Hero Image Side */}
          <div className="hidden md:block w-1/2 relative min-h-[600px]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=2000&auto=format&fit=crop')`,
              }}
            />
            <div className="absolute inset-0 bg-black/5" />
            <div className="absolute bottom-10 left-10 right-10 text-white drop-shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] font-bold mb-2 text-white/80">
                Bộ sưu tập Hè 2024
              </p>
              <h2 className="text-4xl font-bold leading-tight">
                Sự rõ nét kết hợp <br />
                cùng phong cách thời thượng.
              </h2>
            </div>
          </div>

          {/* Content Side */}
          <div className="w-full md:w-1/2 flex flex-col relative">
            {/* Step indicator */}
            <div className="absolute top-8 right-8 text-xs font-bold tracking-widest text-neutral-400 uppercase">
              Bước 02 / 02
            </div>

            <div className="flex-1 flex flex-col justify-center items-center px-8 lg:px-20 py-20 text-center">
              <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-10">
                <span className="material-symbols-outlined text-primary text-6xl">
                  mark_email_unread
                </span>
              </div>

              <h1 className="text-neutral-900 text-4xl font-black leading-tight tracking-tight mb-6">
                Xác thực Email của bạn
              </h1>

              <p className="text-neutral-500 text-lg leading-relaxed max-w-md mb-12">
                Chúng tôi đã gửi một liên kết xác thực an toàn đến hộp thư của
                bạn. Vui lòng nhấn vào liên kết để kích hoạt tài khoản Lily
                Eyewear cao cấp của bạn.
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm w-full max-w-sm">
                  {error}
                </div>
              )}

              {resendSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm w-full max-w-sm">
                  Email xác thực đã được gửi lại!
                </div>
              )}

              <a
                href="mailto:"
                className="w-full max-w-sm bg-accent-orange hover:bg-[#e65c00] text-white font-black py-5 rounded-lg shadow-xl shadow-accent-orange/10 transition-all flex items-center justify-center gap-3 mb-10 uppercase tracking-wider text-sm"
              >
                <span>Mở ứng dụng Mail</span>
                <span className="material-symbols-outlined text-xl">
                  arrow_forward
                </span>
              </a>

              <div className="space-y-4">
                <p className="text-sm text-neutral-500">
                  Bạn không nhận được email?
                  <button
                    onClick={handleResendEmail}
                    disabled={isResending}
                    className="text-primary hover:underline font-bold ml-1 transition-colors disabled:opacity-50"
                  >
                    {isResending ? 'Đang gửi...' : 'Gửi lại liên kết'}
                  </button>
                </p>
                <p className="text-xs text-neutral-400">
                  Cần hỗ trợ?{' '}
                  <Link to="#" className="underline">
                    Liên hệ với đội ngũ chăm sóc khách hàng
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-100 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-400 uppercase tracking-widest">
          <p>© 2024 Lily Eyewear. Bảo lưu mọi quyền.</p>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-neutral-900">
              Chính sách bảo mật
            </Link>
            <Link to="#" className="hover:text-neutral-900">
              Điều khoản dịch vụ
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VerifyEmailPage;
