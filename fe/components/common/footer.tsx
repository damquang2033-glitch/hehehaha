import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white mt-auto relative overflow-hidden">
      {/* Subtle decorative gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                Stayzy
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Nền tảng đặt phòng khách sạn thông minh hàng đầu Việt Nam. Trải
              nghiệm kỳ nghỉ hoàn hảo với dịch vụ tận tâm.
            </p>
            <div className="flex items-center gap-2.5">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Instagram, label: "Instagram" },
                { icon: Twitter, label: "Twitter" },
                { icon: Youtube, label: "Youtube" },
              ].map(({ icon: Icon, label }) => (
                <Link
                  key={label}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-gradient-to-br hover:from-orange-500 hover:to-amber-500 flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110 hover:shadow-lg hover:shadow-orange-500/20"
                  aria-label={label}
                >
                  <Icon size={16} />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm tracking-wide uppercase">
              Khám phá
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              {[
                { href: "/", label: "Trang chủ" },
                { href: "/rooms", label: "Danh sách phòng" },
                { href: "/services", label: "Dịch vụ" },
                { href: "/about", label: "Về chúng tôi" },
                { href: "/contact", label: "Liên hệ" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="hover:text-orange-400 transition-colors duration-200 cursor-pointer inline-flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-orange-400 transition-all duration-200" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm tracking-wide uppercase">
              Hỗ trợ
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              {[
                { href: "/help", label: "Trung tâm trợ giúp" },
                { href: "/terms", label: "Điều khoản sử dụng" },
                { href: "/privacy", label: "Chính sách bảo mật" },
                { href: "/cancellation", label: "Chính sách hủy phòng" },
                { href: "/faq", label: "Câu hỏi thường gặp" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="hover:text-orange-400 transition-colors duration-200 cursor-pointer inline-flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-orange-400 transition-all duration-200" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm tracking-wide uppercase">
              Liên hệ
            </h4>
            <ul className="space-y-3.5 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={14} className="text-orange-400" />
                </div>
                <span className="leading-relaxed">
                  123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh, Việt Nam
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center shrink-0">
                  <Phone size={14} className="text-orange-400" />
                </div>
                <span>1900 1234 56</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center shrink-0">
                  <Mail size={14} className="text-orange-400" />
                </div>
                <span>support@stayzy.vn</span>
              </li>
            </ul>

            {/* Payment Methods */}
            <div className="mt-6">
              <h5 className="text-xs font-medium text-slate-500 mb-3 tracking-wide uppercase">
                Phương thức thanh toán
              </h5>
              <div className="flex flex-wrap gap-2">
                {["Visa", "Mastercard", "MoMo", "ZaloPay"].map((method) => (
                  <div
                    key={method}
                    className="bg-slate-800/80 rounded-lg px-3 py-1.5 text-xs text-slate-300 font-medium border border-slate-700/50"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800/80">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} Stayzy. Bảo lưu mọi quyền.</p>
            <div className="flex items-center gap-6">
              {[
                { href: "/privacy", label: "Bảo mật" },
                { href: "/terms", label: "Điều khoản" },
                { href: "/sitemap", label: "Sitemap" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="hover:text-orange-400 transition-colors duration-200 cursor-pointer"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
