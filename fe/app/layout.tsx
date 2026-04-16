import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { LayoutWrapper } from "@/components/common/layout-wrapper";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: {
    default: "Stayzy - Đặt Phòng Khách Sạn Thông Minh",
    template: "%s | Stayzy",
  },
  description: "Stayzy - Nền tảng đặt phòng khách sạn thông minh hàng đầu Việt Nam.",
  icons: { icon: "/logo.png", shortcut: "/logo.png", apple: "/logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Providers>
            <LayoutWrapper>{children}</LayoutWrapper>
            <Toaster richColors position="bottom-right" />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
