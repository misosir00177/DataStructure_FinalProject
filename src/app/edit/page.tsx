"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, X, Plus } from "lucide-react";

export default function EditPage() {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState<{name: string, desc?: string, tags: string[], image: string} | null>(null);
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("activeItem");
    if (stored) {
      const item = JSON.parse(stored);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveItem(item);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDesc(item.desc || "");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTags(item.tags || []);
    } else {
      router.push("/upload");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTag.trim();
    if (trimmed && tags.length < 10 && !tags.includes(trimmed) && !tags.includes(`#${trimmed}`)) {
      const formattedTag = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
      setTags([...tags, formattedTag]);
      setNewTag("");
    }
  };

  const handleSave = () => {
    if (activeItem) {
      const updatedItem = { ...activeItem, desc, tags };
      sessionStorage.setItem("activeItem", JSON.stringify(updatedItem));
      router.push("/swipe");
    }
  };

  if (!activeItem) return <div style={{ padding: "40px", textAlign: "center" }}>載入中...</div>;

  return (
    <main className="page-container" style={{ paddingBottom: "120px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      
      {/* 圖片置中拉大 */}
      <div style={{ width: "160px", height: "160px", borderRadius: "32px", background: "var(--card-bg)", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "6rem", marginTop: "16px", marginBottom: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: "1px solid var(--card-border)" }}>
        {activeItem.image}
      </div>

      <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "32px", textAlign: "center" }}>{activeItem.name}</h2>

      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* 分類標籤管理 */}
        <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={{ fontSize: "1.05rem", fontWeight: 700 }}>分類標籤</label>
            <span style={{ fontSize: "0.85rem", color: tags.length >= 10 ? "var(--danger-color)" : "var(--text-secondary)" }}>
              {tags.length} / 10
            </span>
          </div>
          
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {tags.map((tag, idx) => (
              <span key={idx} className="tag active" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.9rem", padding: "8px 16px" }}>
                {tag}
                <X size={16} style={{ cursor: "pointer", opacity: 0.8 }} onClick={() => handleRemoveTag(tag)} />
              </span>
            ))}
          </div>

          <form onSubmit={handleAddTag} style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
            <input 
              type="text" 
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="新增標籤..."
              disabled={tags.length >= 10}
              style={{
                flex: 1,
                padding: "14px 20px",
                borderRadius: "999px",
                border: "1px solid var(--card-border)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                outline: "none",
                fontSize: "0.95rem"
              }}
            />
            <button 
              type="submit" 
              disabled={tags.length >= 10 || !newTag.trim()}
              className="btn-primary"
              style={{ width: "52px", height: "52px", padding: 0, opacity: (tags.length >= 10 || !newTag.trim()) ? 0.5 : 1, flexShrink: 0 }}
            >
              <Plus size={24} />
            </button>
          </form>
        </div>

        {/* 主觀描述輸入 */}
        <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <label style={{ fontSize: "1.05rem", fontWeight: 700 }}>主觀描述</label>
          <textarea 
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="例如：保存良好，九成新，原價買 $1200..."
            style={{
              width: "100%",
              height: "120px",
              padding: "16px",
              borderRadius: "16px",
              border: "1px solid var(--card-border)",
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              fontFamily: "inherit",
              resize: "none",
              outline: "none",
              fontSize: "0.95rem",
              lineHeight: "1.5"
            }}
          />
        </div>

        {/* 儲存按鈕 (不再使用 fixed，放在文件底部避免擋到) */}
        <button onClick={handleSave} className="btn-primary" style={{ marginTop: "8px", padding: "18px" }}>
          確認並開始配對 <ArrowRight size={22} />
        </button>

      </div>
    </main>
  );
}
