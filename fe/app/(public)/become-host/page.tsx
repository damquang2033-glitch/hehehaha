"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaRegMoneyBillAlt,
  FaGlobeAmericas,
  FaRegCalendarAlt,
  FaShieldAlt,
  FaRegLightbulb,
  FaChevronRight,
  FaChevronDown,
  FaStar,
  FaCheck,
} from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { authApi } from "@/features/auth/api/authApi";
import { toast } from "sonner";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

export default function BecomeHostPage() {
  const router = useRouter();
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, user, updateUser } = useAuthStore();
  const queryClient = useQueryClient();

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.backgroundPositionY = `${window.scrollY * 0.5}px`;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Redirect if already a HOST or ADMIN
  useEffect(() => {
    if (user?.role === "HOST" || user?.role === "ADMIN") {
      router.push("/host/listings/new");
    }
  }, [user, router]);

  const { mutate: becomeHost, isPending } = useMutation({
    mutationFn: authApi.becomeHost,
    onSuccess: (updated) => {
      if (updated) {
        updateUser(updated);
        queryClient.invalidateQueries({ queryKey: ["users", "me"] });
        toast.success("Bạn đã trở thành Host! Hãy đăng chỗ ở đầu tiên.");
        router.push("/host/listings/new");
      }
    },
    onError: () => toast.error("Có lỗi xảy ra. Vui lòng thử lại."),
  });

  const handleCTA = () => {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/become-host");
      return;
    }
    becomeHost();
  };

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const faqs = [
    {
      question: "Tôi cần làm gì để trở thành Host?",
      answer:
        "Chỉ cần nhấn 'Bắt đầu ngay', xác nhận vai trò Host và đăng chỗ ở đầu tiên. Quy trình hoàn tất trong vòng 15 phút với hướng dẫn từng bước rõ ràng.",
    },
    {
      question: "Tôi có thể kiếm được bao nhiêu tiền?",
      answer:
        "Thu nhập phụ thuộc vào vị trí, loại hình chỗ ở và tỉ lệ lấp đầy. Trung bình Host tại Hà Nội kiếm 8–25 triệu VND/tháng cho mỗi phòng. Stayzy cung cấp công cụ gợi ý giá thông minh để tối ưu thu nhập.",
    },
    {
      question: "Tôi có được bảo vệ khi cho thuê không?",
      answer:
        "Có. Stayzy cung cấp bảo hiểm tài sản lên đến 1 tỷ đồng mỗi lượt đặt, hệ thống xác minh danh tính khách, và đội ngũ hỗ trợ 24/7.",
    },
    {
      question: "Tôi có thể từ chối hoặc hủy booking không?",
      answer:
        "Bạn hoàn toàn có quyền chấp nhận hoặc từ chối yêu cầu đặt phòng. Tỉ lệ từ chối cao có thể ảnh hưởng đến xếp hạng, nhưng bạn vẫn có toàn quyền kiểm soát lịch trống.",
    },
    {
      question: "Phí dịch vụ của Stayzy là bao nhiêu?",
      answer:
        "Stayzy thu phí 3% trên mỗi booking thành công. Không có phí đăng ký hay phí ẩn nào khác — bạn chỉ trả khi có thu nhập.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* ── Hero ── */}
      <div
        ref={heroRef}
        className="relative flex items-center justify-center min-h-screen bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=2070&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

        <motion.div
          className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.3 } } }}
        >
          <motion.span
            className="inline-block px-4 py-1 rounded-full bg-orange-500/30 backdrop-blur-sm border border-orange-400/40 text-sm font-medium mb-6"
            variants={fadeIn}
          >
            Hơn 12,000 Host đang kiếm thu nhập cùng Stayzy
          </motion.span>

          <motion.h1
            className="text-5xl md:text-7xl font-bold leading-tight"
            variants={fadeIn}
          >
            Biến không gian của bạn thành nguồn thu nhập
          </motion.h1>

          <motion.p
            className="mt-6 text-xl md:text-2xl font-light max-w-2xl mx-auto text-white/90"
            variants={fadeIn}
          >
            Tham gia cộng đồng Host Stayzy và bắt đầu kiếm thêm thu nhập từ không gian chưa được tận dụng.
          </motion.p>

          <motion.div className="mt-10 flex flex-col items-center gap-4" variants={fadeIn}>
            <button
              onClick={handleCTA}
              disabled={isPending}
              className="px-10 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-full font-semibold text-lg shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Bắt đầu hành trình"
              )}
            </button>
            <p className="text-sm text-white/70">Đăng ký làm Host chỉ mất 15 phút</p>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
          <p className="text-white text-sm font-medium mb-2">Cuộn xuống</p>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* ── Stats ── */}
      <section className="py-16 bg-gradient-to-r from-orange-50 via-white to-amber-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "12,000+", label: "Host đang hoạt động" },
              { value: "63+", label: "Tỉnh thành phủ sóng" },
              { value: "8–25tr", label: "Thu nhập trung bình/tháng (VND)" },
              { value: "4.8★", label: "Đánh giá trung bình" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-6 rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow border border-orange-100"
              >
                <p className="text-4xl md:text-5xl font-bold text-orange-500">{stat.value}</p>
                <p className="mt-2 text-gray-600 font-medium text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-4xl font-bold text-gray-900">Lý do nên trở thành Host</h2>
            <p className="mt-4 text-xl text-gray-600">
              Khám phá những lợi ích khi tham gia cộng đồng Host Stayzy
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
          >
            {[
              {
                icon: <FaRegMoneyBillAlt size={28} />,
                iconBg: "bg-orange-100 text-orange-500",
                title: "Thu nhập thụ động linh hoạt",
                desc: "Biến không gian dư thừa thành nguồn thu nhập ổn định. Host trung bình tại Hà Nội kiếm 8–25 triệu VND mỗi tháng.",
                checks: ["Tự quyết định giá cho thuê", "Thanh toán nhanh chóng, an toàn"],
              },
              {
                icon: <FaGlobeAmericas size={28} />,
                iconBg: "bg-amber-100 text-amber-500",
                title: "Tiếp cận hàng nghìn khách",
                desc: "Kết nối với du khách trong nước và quốc tế đang tìm kiếm chỗ lưu trú chất lượng trên Stayzy.",
                checks: ["Hệ thống tìm kiếm thông minh", "Bộ lọc khách hàng an toàn"],
              },
              {
                icon: <FaRegCalendarAlt size={28} />,
                iconBg: "bg-orange-100 text-orange-500",
                title: "Quyền tự chủ & Linh hoạt",
                desc: "Thiết lập lịch trống, quy tắc đặt phòng và giá cả hoàn toàn theo ý bạn.",
                checks: ["Quản lý lịch trống linh hoạt", "Hỗ trợ 24/7 từ đội ngũ Stayzy"],
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-orange-50"
                variants={fadeIn}
              >
                <div className={`w-14 h-14 rounded-full ${item.iconBg} flex items-center justify-center mb-6`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-3 text-gray-600 leading-relaxed">{item.desc}</p>
                <ul className="mt-5 space-y-2">
                  {item.checks.map((c) => (
                    <li key={c} className="flex items-center gap-2">
                      <FaCheck className="text-orange-500 shrink-0" />
                      <span className="text-gray-700 text-sm">{c}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 bg-orange-50/50">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-4xl font-bold text-gray-900">Làm Host dễ dàng chỉ với 4 bước</h2>
            <p className="mt-4 text-xl text-gray-600">Quy trình đơn giản giúp bạn bắt đầu nhanh chóng</p>
          </motion.div>

          <div className="max-w-5xl mx-auto relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400" />

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: 1,
                  title: "Kích hoạt vai trò Host",
                  desc: "Nhấn 'Bắt đầu ngay' để kích hoạt tài khoản Host ngay lập tức.",
                },
                {
                  step: 2,
                  title: "Đăng chỗ ở",
                  desc: "Thêm ảnh chụp, mô tả tiện nghi và thiết lập giá cho không gian của bạn.",
                },
                {
                  step: 3,
                  title: "Chờ duyệt",
                  desc: "Stayzy xem xét và phê duyệt listing trong vòng 24 giờ làm việc.",
                },
                {
                  step: 4,
                  title: "Nhận booking & tiền",
                  desc: "Tiền được chuyển vào tài khoản trong vòng 24 giờ sau khi khách nhận phòng.",
                },
              ].map((s, i) => (
                <motion.div
                  key={s.step}
                  className="relative z-10"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                >
                  <div className="w-16 h-16 bg-white rounded-full border-4 border-orange-500 mx-auto flex items-center justify-center mb-6 shadow-lg shadow-orange-100">
                    <span className="text-2xl font-bold text-orange-500">{s.step}</span>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-md">
                    <h3 className="text-base font-bold mb-2 text-center text-gray-900">{s.title}</h3>
                    <p className="text-gray-600 text-center text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-4xl font-bold text-gray-900">Câu chuyện từ Host Stayzy</h2>
            <p className="mt-4 text-xl text-gray-600">Trải nghiệm thực tế từ các Host đã thành công</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                gradient: "from-white to-orange-50",
                quote:
                  "Tôi trang trải được toàn bộ tiền thuê căn hộ mỗi tháng nhờ cho thuê phòng trống. Stayzy rất dễ dùng và khách đặt phòng qua đây đều rất văn minh.",
                name: "Nguyễn Thu Hà",
                role: "Host tại Hà Nội – 2 năm",
                avatar: "https://i.pravatar.cc/150?img=32",
              },
              {
                gradient: "from-white to-amber-50",
                quote:
                  "Cho thuê căn hộ khi đi công tác mang lại nguồn thu nhập bất ngờ. Dashboard của Stayzy giúp tôi quản lý booking cực kỳ thuận tiện.",
                name: "Trần Minh Tuấn",
                role: "Host tại Đà Nẵng – 3 năm",
                avatar: "https://i.pravatar.cc/150?img=68",
              },
              {
                gradient: "from-white to-orange-50",
                quote:
                  "Căn nhà nhỏ trong khu vườn của tôi giờ tạo ra đủ thu nhập cho một chuyến du lịch mỗi năm. Stayzy thực sự thay đổi cuộc sống của tôi.",
                name: "Lê Thanh Mai",
                role: "Host tại Hội An – 1 năm",
                avatar: "https://i.pravatar.cc/150?img=47",
              },
            ].map((t) => (
              <motion.div
                key={t.name}
                className={`bg-gradient-to-br ${t.gradient} p-8 rounded-2xl shadow-lg border border-orange-100`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex gap-1 mb-4 text-amber-400">
                  {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                </div>
                <p className="italic text-gray-700 mb-6 leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-semibold text-gray-900">{t.name}</h4>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Security & Support ── */}
      <section className="py-20 bg-gradient-to-r from-orange-50 via-white to-amber-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&w=2076&q=80"
                alt="Stayzy support team"
                className="rounded-2xl shadow-xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Stayzy luôn bảo vệ bạn</h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Với hệ thống bảo vệ toàn diện và đội ngũ hỗ trợ 24/7, bạn yên tâm tập trung vào việc đón khách.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                    <FaShieldAlt className="text-orange-500 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Bảo hiểm tài sản miễn phí</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Mỗi Host được bảo hiểm thiệt hại tài sản lên đến 1 tỷ đồng cho mỗi lượt đặt phòng.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                    <FaRegLightbulb className="text-amber-500 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Hỗ trợ 24/7 chuyên nghiệp</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Đội ngũ hỗ trợ Stayzy luôn sẵn sàng giúp bạn xử lý mọi tình huống, mọi lúc.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCTA}
                disabled={isPending}
                className="mt-8 inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Bắt đầu ngay
                <FaChevronRight />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-4xl font-bold text-gray-900">Câu hỏi thường gặp</h2>
            <p className="mt-4 text-xl text-gray-600">Tìm hiểu thêm về việc trở thành Host</p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="rounded-2xl overflow-hidden border border-orange-100">
                <button
                  className="w-full text-left p-6 bg-orange-50/50 hover:bg-orange-50 transition-colors"
                  onClick={() => toggleAccordion(index)}
                >
                  <div className="flex justify-between items-center gap-4">
                    <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                    <FaChevronDown
                      className={`shrink-0 text-orange-500 transition-transform duration-300 ${
                        activeAccordion === index ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    activeAccordion === index ? "max-h-60 py-4 px-6" : "max-h-0"
                  }`}
                >
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Sẵn sàng bắt đầu hành trình làm Host?
            </motion.h2>
            <motion.p
              className="text-xl md:text-2xl mb-10 text-white/90"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Tham gia cùng hơn 12,000 Host đang kiếm thu nhập mỗi ngày trên Stayzy
            </motion.p>

            <motion.div
              className="flex flex-col md:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <button
                onClick={handleCTA}
                disabled={isPending}
                className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-orange-600 hover:bg-orange-50 rounded-full font-semibold text-lg shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70"
              >
                {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                {isPending ? "Đang xử lý..." : "Đăng ký làm Host ngay"}
              </button>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-10 py-4 bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-full font-semibold text-lg transition-all duration-300"
              >
                Liên hệ với chúng tôi
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}