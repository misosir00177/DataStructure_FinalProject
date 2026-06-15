"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Repeat } from "lucide-react";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 模擬首頁加載畫面 2.5 秒
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    // 假登入，直接跳轉
    router.push("/upload");
  };

  if (isLoading) {
    return (
      <main className="page-container" style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
          <div style={{ background: "rgba(163, 230, 53, 0.2)", padding: "20px", borderRadius: "50%", marginBottom: "8px" }}>
            <Repeat size={64} color="var(--accent-secondary)" />
          </div>
          <h1 className="gradient-text" style={{ fontSize: "3rem", marginBottom: "16px", letterSpacing: "2px" }}>EWEW</h1>
          
          {/* 讀取條 */}
          <div style={{ width: "200px", height: "6px", background: "rgba(0,0,0,0.05)", borderRadius: "999px", overflow: "hidden" }}>
            <div style={{ 
              width: "100%", 
              height: "100%", 
              background: "var(--accent-secondary)",
              animation: "loadingBar 2.5s ease-in-out forwards",
              transformOrigin: "left"
            }}></div>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "8px" }}>載入中...</p>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes loadingBar {
            0% { transform: scaleX(0); }
            50% { transform: scaleX(0.6); }
            100% { transform: scaleX(1); }
          }
        `}} />
      </main>
    );
  }

  return (
    <main className="page-container" style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
      <div className="glass-panel animate-fade-in" style={{ padding: "40px", width: "100%", maxWidth: "340px", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
        
        <div style={{ background: "rgba(163, 230, 53, 0.2)", padding: "16px", borderRadius: "50%", marginBottom: "8px" }}>
          <Repeat size={48} color="var(--accent-secondary)" />
        </div>
        
        <div>
          <h1 className="gradient-text" style={{ fontSize: "2.5rem", marginBottom: "8px", letterSpacing: "2px" }}>EWEW</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.5" }}>
            無金錢交易的二手物品交換平台。<br />滑動配對，各取所需。
          </p>
        </div>

        <div style={{ width: "100%", marginTop: "16px" }}>
          <button onClick={handleLogin} className="btn-primary animate-pulse" style={{ width: "100%" }}>
            快速登入 <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </main>
  );
}
