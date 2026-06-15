"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, MessageCircle } from "lucide-react";

// 假資料
const ALL_TAGS = ["衣物", "盲盒", "家具", "3C", "公仔"];
const MOCK_CARDS = [
  { id: 1, name: "復古牛仔外套", tags: ["衣物", "復古"], image: "🧥", desc: "穿過兩次，保存良好，秋冬必備單品！" },
  { id: 2, name: "設計師盲盒 (全新)", tags: ["盲盒", "公仔"], image: "🎁", desc: "多買了一盒，未拆封，期待有緣人帶走", isTarget: true },
  { id: 3, name: "二手沙發", tags: ["家具"], image: "🛋️", desc: "搬家出清，極簡風沙發，需自取" },
  { id: 4, name: "微單眼相機", tags: ["3C", "相機"], image: "📷", desc: "功能正常，附兩顆電池及充電器，適合新手" },
];

// 卡片背景顏色（對應不同物品給予隨機的鮮豔漸層底色）
const CARD_GRADIENTS = [
  "linear-gradient(135deg, #fecaca, #fca5a5)",
  "linear-gradient(135deg, #bbf7d0, #86efac)",
  "linear-gradient(135deg, #bfdbfe, #93c5fd)",
  "linear-gradient(135deg, #fef08a, #fde047)",
];

export default function SwipePage() {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState<{name: string, desc?: string, tags: string[], image: string} | null>(null);
  
  const [filterSet, setFilterSet] = useState<Set<string>>(new Set());
  const [queue, setQueue] = useState<typeof MOCK_CARDS>([]);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedCard, setMatchedCard] = useState<typeof MOCK_CARDS[0] | null>(null);

  // Drag states
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);

  const applyFilters = (currentSet: Set<string>) => {
    if (currentSet.size === 0) {
      setQueue([...MOCK_CARDS]);
      return;
    }
    const filtered = MOCK_CARDS.filter(card => 
      card.tags.some(tag => currentSet.has(tag))
    );
    setQueue(filtered);
  };

  useEffect(() => {
    const stored = sessionStorage.getItem("activeItem");
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveItem(JSON.parse(stored));
    }
    applyFilters(new Set());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTag = (tag: string) => {
    const newSet = new Set(filterSet);
    if (newSet.has(tag)) {
      newSet.delete(tag);
    } else {
      newSet.add(tag);
    }
    setFilterSet(newSet);
    applyFilters(newSet);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    setOffsetX(currentX - startXRef.current);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (offsetX > 100) {
      handleSwipe("right");
    } else if (offsetX < -100) {
      handleSwipe("left");
    } else {
      setOffsetX(0); // 回彈
    }
  };

  const handleSwipe = (direction: "left" | "right") => {
    const currentCard = queue[0];
    if (!currentCard) return;

    if (direction === "right" && currentCard.isTarget) {
      setMatchedCard(currentCard);
      setShowMatch(true);
      setTimeout(() => {
        router.push("/chat");
      }, 3000);
      return;
    }

    setOffsetX(direction === "left" ? -500 : 500);
    setTimeout(() => {
      setQueue(prevQueue => {
        const newQueue = [...prevQueue];
        newQueue.shift();
        return newQueue;
      });
      setOffsetX(0);
    }, 300);
  };

  return (
    <main className="page-container" style={{ padding: 0, height: "100vh", overflow: "hidden" }}>
      {/* 沉浸式上方篩選器，浮動在上方 */}
      <header style={{ position: "absolute", top: 0, left: 0, width: "100%", zIndex: 20, padding: "20px", background: "linear-gradient(to bottom, rgba(255,255,255,0.9), transparent)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800 }}>探索物品</h2>
          {activeItem && (
            <div style={{ background: "var(--accent-primary)", color: "#1a1a1a", padding: "4px 12px", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 700, boxShadow: "0 2px 8px rgba(163, 230, 53, 0.4)" }}>
              出戰: {activeItem.name}
            </div>
          )}
        </div>
        
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", overflowX: "auto", paddingBottom: "4px" }}>
          {ALL_TAGS.map(tag => (
            <button 
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`tag ${filterSet.has(tag) ? "active" : ""}`}
              style={{ flexShrink: 0, boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
            >
              #{tag}
            </button>
          ))}
        </div>
      </header>

      {/* 全螢幕滑動卡片區 */}
      <div style={{ flex: 1, width: "100%", height: "100%", position: "relative", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {queue.length > 0 ? (
          <div 
            style={{ 
              width: "100%", 
              height: "100%", 
              position: "absolute",
              transform: `translateX(${offsetX}px) rotate(${offsetX * 0.05}deg)`,
              transition: isDragging ? "none" : "transform 0.3s ease",
              cursor: isDragging ? "grabbing" : "grab",
              zIndex: 10,
              background: CARD_GRADIENTS[queue[0].id % CARD_GRADIENTS.length],
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {/* 沉浸式圖片 (大尺寸 Emoji) */}
            <div style={{ fontSize: "12rem", filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.15))", transition: "transform 0.2s ease", transform: isDragging ? "scale(0.95)" : "scale(1)" }}>
              {queue[0].image}
            </div>

            {/* 文字描述：固定於視窗左下角，帶有漸層遮罩 */}
            <div style={{ 
              position: "absolute", 
              bottom: 0, 
              left: 0, 
              width: "100%", 
              padding: "40px 24px 100px 24px", /* 底部留白給 BottomNav */
              background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
              color: "#ffffff"
            }}>
              <h3 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px", textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>{queue[0].name}</h3>
              <p className="truncate-2-lines" style={{ color: "rgba(255,255,255,0.85)", fontSize: "1rem", marginBottom: "16px", textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>{queue[0].desc}</p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", overflow: "hidden" }}>
                {queue[0].tags.map(t => (
                  <span key={t} style={{ fontSize: "0.85rem", color: "#1a1a1a", background: "var(--accent-primary)", padding: "4px 12px", borderRadius: "999px", fontWeight: 700 }}>#{t}</span>
                ))}
              </div>
            </div>

            {/* 滑動提示圖示 */}
            {offsetX > 50 && (
              <div style={{ position: "absolute", top: "120px", left: "40px", border: "4px solid var(--accent-primary)", color: "var(--accent-primary)", padding: "8px 16px", borderRadius: "12px", fontSize: "1.5rem", fontWeight: 800, transform: "rotate(-15deg)", background: "rgba(255,255,255,0.9)" }}>
                想換 LIKE
              </div>
            )}
            {offsetX < -50 && (
              <div style={{ position: "absolute", top: "120px", right: "40px", border: "4px solid var(--danger-color)", color: "var(--danger-color)", padding: "8px 16px", borderRadius: "12px", fontSize: "1.5rem", fontWeight: 800, transform: "rotate(15deg)", background: "rgba(255,255,255,0.9)" }}>
                略過 NOPE
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: "center", color: "var(--text-secondary)" }}>
            <p style={{ fontSize: "1.1rem", marginBottom: "16px" }}>沒有更多卡片了</p>
            <button onClick={() => applyFilters(new Set())} className="btn-primary" style={{ padding: "12px 24px", margin: "0 auto", width: "auto" }}>重新載入探索</button>
          </div>
        )}

        {/* 底層預覽卡片 */}
        {queue.length > 1 && (
          <div style={{ 
            width: "100%", 
            height: "100%", 
            position: "absolute", 
            zIndex: 1, 
            background: CARD_GRADIENTS[queue[1].id % CARD_GRADIENTS.length],
            transform: "scale(0.95)",
            opacity: 0.5 
          }}></div>
        )}
      </div>

      {/* 配對成功全螢幕特效 */}
      {showMatch && (
        <div className="animate-fade-in" style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.95)", zIndex: 100, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "24px" }}>
          <h1 className="gradient-text animate-pulse" style={{ fontSize: "3.5rem", fontStyle: "italic", marginBottom: "40px", textAlign: "center" }}>
            It&apos;s a Match!
          </h1>
          
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "40px" }}>
            <div className="glass-panel" style={{ width: "120px", height: "160px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px", background: "rgba(163, 230, 53, 0.2)", border: "2px solid var(--accent-primary)" }}>
              <span style={{ fontSize: "3rem" }}>{activeItem?.image || "📦"}</span>
              <span style={{ fontSize: "0.85rem", marginTop: "8px", textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{activeItem?.name || "我的物品"}</span>
            </div>
            
            <div style={{ display: "flex", gap: "8px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-secondary)", animation: "pulse 1s infinite 0s" }}></div>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-secondary)", animation: "pulse 1s infinite 0.2s" }}></div>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-secondary)", animation: "pulse 1s infinite 0.4s" }}></div>
            </div>

            <div className="glass-panel" style={{ width: "120px", height: "160px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px", background: "rgba(163, 230, 53, 0.2)", border: "2px solid var(--accent-secondary)" }}>
              <span style={{ fontSize: "3rem" }}>{matchedCard?.image}</span>
              <span style={{ fontSize: "0.85rem", marginTop: "8px", textAlign: "center" }}>{matchedCard?.name}</span>
            </div>
          </div>

          <p style={{ color: "var(--text-secondary)", marginBottom: "32px", textAlign: "center", fontWeight: 600 }}>
            恭喜！您與對方都喜歡彼此的物品。<br/>正在為您建立聊天室...
          </p>

          <button className="btn-primary" onClick={() => router.push("/chat")} style={{ width: "auto", padding: "16px 48px" }}>
            <MessageCircle size={20} /> 立即傳送訊息
          </button>
        </div>
      )}
    </main>
  );
}
