"use client";

import { useState, useEffect } from "react";
import { User, X, Plus, Check } from "lucide-react";

export default function ProfilePage() {
  const [activeItem, setActiveItem] = useState<{name: string, desc?: string, tags: string[], image: string} | null>(null);
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [saved, setSaved] = useState(false);

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
    }
  }, []);

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
    setSaved(false);
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTag.trim();
    if (trimmed && tags.length < 10 && !tags.includes(trimmed) && !tags.includes(`#${trimmed}`)) {
      const formattedTag = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
      setTags([...tags, formattedTag]);
      setNewTag("");
      setSaved(false);
    }
  };

  const handleSave = () => {
    if (activeItem) {
      const updatedItem = { ...activeItem, desc, tags };
      sessionStorage.setItem("activeItem", JSON.stringify(updatedItem));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <main className="page-container" style={{ paddingBottom: "100px" }}>
      <header style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>個人主頁</h2>
        <div className="btn-icon" style={{ width: "40px", height: "40px" }}>
          <User size={20} />
        </div>
      </header>

      {!activeItem ? (
        <div className="glass-panel" style={{ padding: "40px 20px", textAlign: "center" }}>
          <p style={{ color: "var(--text-secondary)", marginBottom: "16px" }}>目前沒有出戰商品，請新增物品。</p>
          <button onClick={() => window.location.href = "/upload"} className="btn-primary" style={{ margin: "0 auto", width: "auto", padding: "12px 24px" }}>
            新增交換物品
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--card-border)", paddingBottom: "8px" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>目前出戰商品</h3>
            <button onClick={() => window.location.href = "/upload"} style={{ background: "none", border: "none", color: "var(--accent-primary)", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
              <Plus size={16} /> 上傳新物品
            </button>
          </div>
          
          <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "80px", height: "80px", borderRadius: "16px", background: "rgba(0,0,0,0.05)", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "3rem" }}>
                {activeItem.image}
              </div>
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>{activeItem.name}</h3>
              </div>
            </div>

            {/* 主觀描述輸入 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "0.95rem", fontWeight: 600 }}>修改商品描述</label>
              <textarea 
                value={desc}
                onChange={(e) => { setDesc(e.target.value); setSaved(false); }}
                placeholder="例如：保存良好，九成新，原價買 $1200..."
                style={{
                  width: "100%",
                  height: "100px",
                  padding: "16px",
                  borderRadius: "16px",
                  border: "1px solid var(--card-border)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  fontFamily: "inherit",
                  resize: "none",
                  outline: "none"
                }}
              />
            </div>

            {/* 標籤管理 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label style={{ fontSize: "0.95rem", fontWeight: 600 }}>編輯標籤</label>
                <span style={{ fontSize: "0.8rem", color: tags.length >= 10 ? "var(--danger-color)" : "var(--text-secondary)" }}>
                  {tags.length} / 10
                </span>
              </div>
              
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
                {tags.map((tag, idx) => (
                  <span key={idx} className="tag active" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    {tag}
                    <X size={14} style={{ cursor: "pointer" }} onClick={() => handleRemoveTag(tag)} />
                  </span>
                ))}
              </div>

              <form onSubmit={handleAddTag} style={{ display: "flex", gap: "8px" }}>
                <input 
                  type="text" 
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="新增標籤..."
                  disabled={tags.length >= 10}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: "999px",
                    border: "1px solid var(--card-border)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    outline: "none"
                  }}
                />
                <button 
                  type="submit" 
                  disabled={tags.length >= 10 || !newTag.trim()}
                  className="btn-primary"
                  style={{ width: "48px", height: "48px", padding: 0, opacity: (tags.length >= 10 || !newTag.trim()) ? 0.5 : 1 }}
                >
                  <Plus size={20} />
                </button>
              </form>
            </div>

            <button onClick={handleSave} className="btn-primary" style={{ marginTop: "16px", background: saved ? "var(--success-color)" : "" }}>
              {saved ? <><Check size={20} /> 已儲存</> : "儲存變更"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
