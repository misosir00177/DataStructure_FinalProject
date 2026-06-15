"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Send, MoreVertical, MapPin, Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function ChatPage() {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState<{name: string, tags: string[], image: string} | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("activeItem");
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveItem(JSON.parse(stored));
    }
  }, []);

  return (
    <main className="page-container" style={{ padding: 0, background: "var(--bg-color)" }}>
      {/* 頂部導航 */}
      <header className="glass-panel" style={{ borderRadius: "0 0 24px 24px", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button onClick={() => router.push("/swipe")} style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer" }}>
            <ArrowLeft size={24} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--accent-secondary)", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.2rem" }}>
              🎁
            </div>
            <div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 600 }}>對方 (盲盒擁有者)</h2>
              <p style={{ fontSize: "0.8rem", color: "var(--success-color)", display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--success-color)", display: "inline-block" }}></span> 上線中
              </p>
            </div>
          </div>
        </div>
        <button style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer" }}>
          <MoreVertical size={24} />
        </button>
      </header>

      {/* 交易物品狀態列 */}
      <div style={{ padding: "12px 24px", background: "rgba(255,255,255,0.03)", display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", borderBottom: "1px solid var(--card-border)" }}>
        <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>交換項目：</span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          <span style={{ fontSize: "1.2rem" }}>{activeItem?.image || "📦"}</span>
          <span style={{ fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{activeItem?.name || "您的物品"}</span>
        </div>
        <span style={{ fontSize: "0.8rem", color: "var(--accent-primary)" }}>&lt;-&gt;</span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "1.2rem" }}>🎁</span>
          <span style={{ fontSize: "0.9rem" }}>設計師盲盒</span>
        </div>
      </div>

      {/* 對話內容區 */}
      <div style={{ flex: 1, padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "24px" }}>
        
        <div style={{ textAlign: "center", margin: "16px 0" }}>
          <span style={{ background: "rgba(255,255,255,0.05)", padding: "4px 12px", borderRadius: "999px", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            今天 14:30 - 配對成功
          </span>
        </div>

        {/* 對方訊息 */}
        <div className="animate-fade-in" style={{ display: "flex", gap: "12px", maxWidth: "85%" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--accent-secondary)", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1rem", flexShrink: 0 }}>
            🎁
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", padding: "12px 16px", borderRadius: "0 16px 16px 16px", color: "var(--text-primary)", fontSize: "0.95rem", lineHeight: "1.5", wordBreak: "break-word" }}>
              你好！我對你的{activeItem?.name || "木製家具"}很有興趣，約捷運站面交嗎？
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px", marginLeft: "4px" }}>14:31</div>
          </div>
        </div>

        {/* 系統提示 (建議面交地點) */}
        <div className="animate-fade-in" style={{ alignSelf: "center", display: "flex", alignItems: "center", gap: "8px", background: "rgba(16, 185, 129, 0.1)", color: "var(--success-color)", padding: "8px 16px", borderRadius: "12px", fontSize: "0.85rem", animationDelay: "0.5s" }}>
          <MapPin size={16} /> 系統建議面交地點：台北車站 (居中)
        </div>

      </div>

      {/* 底部輸入框 */}
      <footer style={{ position: "fixed", bottom: "72px", left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: "480px", padding: "16px", background: "var(--bg-color)", borderTop: "1px solid var(--card-border)", zIndex: 10 }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>
            <Plus size={24} />
          </button>
          <input 
            type="text" 
            placeholder="輸入訊息..." 
            style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid var(--card-border)", borderRadius: "999px", padding: "12px 20px", color: "var(--text-primary)", fontSize: "0.95rem", outline: "none" }}
          />
          <button className="btn-primary" style={{ width: "48px", height: "48px", padding: 0, borderRadius: "50%", flexShrink: 0 }}>
            <Send size={20} />
          </button>
        </div>
      </footer>
    </main>
  );
}
