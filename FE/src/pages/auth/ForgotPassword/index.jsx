import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '@services/authService';

/**
 * ForgotPassword page component - Modern split layout design
 */
const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.forgotPassword(email);
      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.message || 'Không thể gửi email khôi phục');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đã xảy ra lỗi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4 lg:p-0">
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-xl overflow-hidden flex flex-col md:flex-row">
        {/* Hero Image Side */}
        <div className="hidden md:block w-1/2 relative min-h-[600px] bg-neutral-200">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=2000&auto=format&fit=crop')`,
            }}
          />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-accent-orange text-3xl">
                eyeglasses
              </span>
              <h2 className="text-2xl font-bold tracking-tight">
                Lily Eyewear
              </h2>
            </div>
            <h1 className="text-4xl font-black leading-tight mb-4 drop-shadow-md">
              Tìm lại phong cách của bạn
            </h1>
            <p className="text-lg font-medium opacity-90">
              Chúng tôi sẽ giúp bạn khôi phục quyền truy cập vào tài khoản.
            </p>
          </div>
        </div>

        {/* Form Side */}
        <div className="w-full md:w-1/2 flex flex-col bg-white">
          <header className="flex items-center justify-between px-8 py-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-3xl">
                eyeglasses
              </span>
              <span className="font-bold text-xl text-neutral-900 tracking-tight">
                Lily Eyewear
              </span>
            </Link>
            <div className="text-sm">
              <Link
                to="#"
                className="text-neutral-500 hover:text-primary transition-colors"
              >
                Hỗ trợ
              </Link>
            </div>
          </header>

          <div className="flex-1 flex flex-col justify-center px-8 lg:px-24 py-12">
            {success ? (
              // Success state
              <div className="text-center md:text-left">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-8 mx-auto md:mx-0">
                  <span className="material-symbols-outlined text-green-600 text-5xl">
                    mark_email_read
                  </span>
                </div>
                <h2 className="text-neutral-900 text-3xl font-bold leading-tight tracking-tight mb-4">
                  Email đã được gửi!
                </h2>
                <p className="text-neutral-500 text-lg mb-8">
                  Vui lòng kiểm tra hộp thư{' '}
                  <span className="font-semibold text-neutral-700">{email}</span>{' '}
                  để nhận liên kết khôi phục mật khẩu.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors group"
                >
                  <span className="material-symbols-outlined text-xl transition-transform group-hover:-translate-x-1">
                    arrow_back
                  </span>
                  <span>Quay lại đăng nhập</span>
                </Link>
              </div>
            ) : (
              // Form state
              <>
                <div className="mb-10 text-center md:text-left">
                  <h2 className="text-neutral-900 text-4xl font-bold leading-tight tracking-tight">
                    Quên mật khẩu?
                  </h2>
                  <p className="text-neutral-500 mt-4 text-lg">
                    Nhập email của bạn để nhận liên kết khôi phục mật khẩu.
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-neutral-900 text-sm font-semibold uppercase tracking-wider">
                      Email
                    </label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors">
                        mail
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full rounded-lg border border-neutral-200 bg-white pl-12 pr-4 py-4 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="yourname@email.com"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-accent-orange hover:bg-[#e65c00] text-white font-bold py-4 rounded-lg shadow-lg shadow-accent-orange/20 transition-all mt-4 flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-xl">
                          progress_activity
                        </span>
                        <span>Đang gửi...</span>
                      </>
                    ) : (
                      <>
                        <span>Gửi yêu cầu</span>
                        <span className="material-symbols-outlined">send</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 text-center md:text-left">
                  <Link
                    to="/login"
                    className="text-primary hover:text-primary/80 font-semibold flex items-center justify-center md:justify-start gap-2 transition-colors group"
                  >
                    <span className="material-symbols-outlined text-xl transition-transform group-hover:-translate-x-1">
                      arrow_back
                    </span>
                    <span>Quay lại đăng nhập</span>
                  </Link>
                </div>
              </>
            )}
          </div>

          <footer className="mt-auto px-8 py-8 border-t border-neutral-100">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-400 uppercase tracking-widest font-medium">
              <p>© 2024 Lily Eyewear</p>
              <div className="flex gap-6">
                <Link to="#" className="hover:text-primary transition-colors">
                  Điều khoản
                </Link>
                <Link to="#" className="hover:text-primary transition-colors">
                  Bảo mật
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
