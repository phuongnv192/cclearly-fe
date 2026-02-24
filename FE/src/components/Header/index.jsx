import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@stores/authStore';

/**
 * Header/Navbar component
 */
const Header = () => {
  const [cartCount] = useState(3);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuthStore();

  const navLinks = [
    { to: '/best-seller', label: 'Best seller' },
    { to: '/blog', label: 'Góc CClearly' },
    { to: '/stores', label: 'Hệ thống cửa hàng' },
  ];

  const productLinks = [
    { to: '/frames', label: 'Gọng kính' },
    { to: '/lenses', label: 'Tròng kính' },
    { to: '/accessories', label: 'Phụ kiện' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
    navigate('/');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.fullName) return 'U';
    const names = user.fullName.split(' ');
    return names.length > 1 
      ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      : names[0][0].toUpperCase();
  };

  // Get dashboard link based on role
  const getDashboardLink = () => {
    const role = user?.role?.name || user?.role;
    if (role === 'ADMIN') return '/admin';
    if (role === 'MANAGER') return '/manager';
    if (role === 'SALES_STAFF') return '/sales';
    if (role === 'OPERATION_STAFF') return '/operation';
    return '/dashboard';
  };

  // Check if user is customer or not logged in (can use cart)
  const isCustomerOrGuest = () => {
    if (!isAuthenticated) return true;
    const role = user?.role?.name || user?.role;
    return role === 'CUSTOMER';
  };

  return (
    <header className="border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md z-50">
      {/* Top bar */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-xs text-slate-500 hidden md:block">
          Lần đầu tiên ghé CClearly? Tìm kính phù hợp ngay →
        </div>

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-widest text-primary"
        >
          CCLEARLY
        </Link>

        {/* Actions */}
        <div className="flex items-center space-x-6">
          <button className="hover:text-primary transition-colors">
            <span className="material-icons">search</span>
          </button>
          
          {/* Cart - only show for customers or guests */}
          {isCustomerOrGuest() && (
            <Link to="/cart" className="relative group cursor-pointer">
              <span className="material-icons">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-primary text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {/* Auth Section */}
          {isAuthenticated ? (
            // User Avatar Dropdown
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">
                  {getUserInitials()}
                </div>
              </button>

              {/* User Dropdown Menu */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 shadow-lg border border-slate-100 dark:border-slate-800 rounded-lg py-2 z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">
                      {user?.fullName || 'Người dùng'}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    <p className="text-xs text-primary font-medium mt-1">
                      {user?.role?.name || user?.role || 'Khách hàng'}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <Link
                    to={getDashboardLink()}
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className="material-icons text-lg">dashboard</span>
                    <span>Bảng điều khiển</span>
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className="material-icons text-lg">person</span>
                    <span>Hồ sơ cá nhân</span>
                  </Link>
                  
                  {/* Orders - only show for customers */}
                  {(user?.role?.name || user?.role) === 'CUSTOMER' && (
                    <Link
                      to="/orders"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span className="material-icons text-lg">receipt_long</span>
                      <span>Đơn hàng của tôi</span>
                    </Link>
                  )}

                  {/* Divider */}
                  <div className="my-2 border-t border-slate-100 dark:border-slate-800"></div>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
                  >
                    <span className="material-icons text-lg">logout</span>
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Login Button
            <Link
              to="/login"
              className="flex items-center space-x-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              <span className="material-icons text-lg">login</span>
              <span className="hidden sm:inline">Đăng nhập</span>
            </Link>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-t border-slate-50 dark:border-slate-800">
        <div className="container mx-auto flex justify-center space-x-8 py-3 text-sm font-medium uppercase tracking-tight">
          {/* Products Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsProductsDropdownOpen(true)}
            onMouseLeave={() => setIsProductsDropdownOpen(false)}
          >
            <button className="flex items-center space-x-1 hover:text-primary transition-colors">
              <span>Sản phẩm</span>
              <span className="material-icons text-sm">
                {isProductsDropdownOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>
            
            {/* Dropdown Menu */}
            {isProductsDropdownOpen && (
              <div className="absolute top-full left-0 mt-0 w-48 bg-white dark:bg-slate-900 shadow-lg border border-slate-100 dark:border-slate-800 py-2 z-50">
                {productLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `block px-4 py-2 text-sm normal-case transition-colors ${
                        isActive
                          ? 'text-primary bg-slate-50 dark:bg-slate-800'
                          : 'text-slate-700 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Other Nav Links */}
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive
                  ? 'text-primary border-b-2 border-primary'
                  : 'hover:text-primary transition-colors'
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;
