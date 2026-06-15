"use client";

import { usePathname, useRouter } from "next/navigation";
import { Compass, Zap, User, MessageCircle } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  // 在登入頁與掃描頁隱藏導覽列
  if (pathname === "/" || pathname === "/upload") {
    return null;
  }

  const navItems = [
    { path: "/swipe", icon: <Compass size={24} />, label: "探索" },
    { path: "/edit", icon: <Zap size={24} />, label: "出戰" },
    { path: "/chat", icon: <MessageCircle size={24} />, label: "訊息" },
    { path: "/profile", icon: <User size={24} />, label: "個人" },
  ];

  return (
    <nav style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100%",
      background: "var(--card-bg)",
      backdropFilter: "var(--glass-blur)",
      WebkitBackdropFilter: "var(--glass-blur)",
      borderTop: "1px solid var(--card-border)",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      padding: "12px 0",
      paddingBottom: "env(safe-area-inset-bottom, 12px)",
      zIndex: 50
    }}>
      {navItems.map((item) => {
        const isActive = pathname === item.path || (pathname.startsWith("/chat") && item.path === "/chat");
        return (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            style={{
              background: "none",
              border: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              color: isActive ? "var(--accent-secondary)" : "var(--text-secondary)",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            {item.icon}
            <span style={{ fontSize: "0.7rem", fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
