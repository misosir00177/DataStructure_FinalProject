"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Camera, Plus, Package, Loader2, CheckCircle2 } from "lucide-react";

export default function UploadPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedTags, setGeneratedTags] = useState<string[]>([]);

  const handleUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    // 模擬進度條
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 400);

    // 模擬 AI 分析完成 (2秒)
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      
      const tags = ["#木製家具", "#書桌", "#電腦桌"];
      
      // 將出戰物品存入 global state (這裡用 sessionStorage 模擬)
      if (typeof window !== "undefined") {
        sessionStorage.setItem("activeItem", JSON.stringify({
          name: "實木書桌",
          desc: "", // 新增空白描述，等使用者在 /edit 填寫
          tags: tags,
          image: "🪑"
        }));
      }

      // 掃描完直接跳轉至補充敘述頁面
      router.push("/edit");

    }, 2000);
  };

  return (
    <main className="page-container">
      <header style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>我的物品庫</h2>
        <div className="btn-icon" style={{ width: "40px", height: "40px" }}>
          <Package size={20} />
        </div>
      </header>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* 模擬的現有物品 */}
        <div className="glass-panel" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "16px", opacity: 0.6 }}>
          <div style={{ width: "60px", height: "60px", borderRadius: "12px", background: "rgba(0,0,0,0.05)", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.5rem" }}>
            👕
          </div>
          <div>
            <h3 style={{ fontSize: "1.1rem" }}>舊大學T</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "4px" }}>#衣物 #長袖</p>
          </div>
        </div>

        {/* 上傳區域 */}
        {!isUploading && !isSuccess && (
          <div 
            onClick={handleUpload}
            className="glass-panel" 
            style={{ 
              border: "2px dashed var(--accent-primary)", 
              padding: "40px 20px", 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              justifyContent: "center",
              gap: "16px",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(163, 230, 53, 0.1)"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "var(--card-bg)"}
          >
            <div style={{ background: "rgba(163, 230, 53, 0.2)", padding: "16px", borderRadius: "50%" }}>
              <Camera size={32} color="var(--accent-primary)" />
            </div>
            <div style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "8px" }}>新增交換物品</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>點擊模擬拍攝或上傳照片</p>
            </div>
            <div className="btn-primary" style={{ padding: "10px 20px", width: "auto", fontSize: "0.95rem", marginTop: "8px" }}>
              <Plus size={18} /> 模擬拍攝
            </div>
          </div>
        )}

        {/* 掃描進度狀態 */}
        {isUploading && (
          <div className="glass-panel animate-fade-in" style={{ padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
            <Loader2 size={48} className="animate-pulse" color="var(--accent-primary)" style={{ animation: "spin 2s linear infinite" }} />
            <div style={{ textAlign: "center", width: "100%" }}>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "16px" }}>AI 正在分析物品特徵...</h3>
              <div style={{ width: "100%", height: "8px", background: "rgba(0,0,0,0.05)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ 
                  width: `${uploadProgress}%`, 
                  height: "100%", 
                  background: "linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))",
                  transition: "width 0.3s ease"
                }}></div>
              </div>
            </div>
          </div>
        )}

        {/* 成功與標籤生成狀態 */}
        {isSuccess && (
          <div className="glass-panel animate-fade-in" style={{ padding: "32px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", border: "1px solid var(--success-color)" }}>
            <CheckCircle2 size={48} color="var(--success-color)" />
            <div style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: "1.2rem", color: "var(--success-color)", marginBottom: "8px" }}>辨識成功！</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>系統已為您的物品產生標籤：</p>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginTop: "8px" }}>
              {generatedTags.map((tag, idx) => (
                <span key={idx} className="tag active" style={{ animationDelay: `${idx * 0.1}s` }}>
                  {tag}
                </span>
              ))}
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--accent-secondary)", marginTop: "16px" }} className="animate-pulse">
              即將進入補充敘述頁面...
            </p>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </main>
  );
}
