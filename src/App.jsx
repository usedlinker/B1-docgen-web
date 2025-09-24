import React, { useEffect, useState } from "react";
import { fetchTemplates, generateDoc } from "./api";

export default function App() {
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected] = useState("");
  const [fields, setFields] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTemplates().then(setTemplates).catch((e) => setError(e.message));
  }, []);

  const schema = templates.find((t) => t.id === selected);

  function onFieldChange(key, val) {
    setFields((prev) => ({ ...prev, [key]: val }));
  }

  async function onGenerate() {
    setBusy(true); setError("");
    try {
      const blob = await generateDoc(selected, fields);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selected}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto", padding: 20, maxWidth: 720, margin: "0 auto" }}>
      <h1>📄 DocGen — 문서 자동 생성기</h1>
      <p>템플릿을 선택하고 필드를 채운 뒤 <b>생성</b>을 누르면 .docx 파일이 다운로드됩니다.</p>

      {error && <div style={{ color: "#b91c1c", marginBottom: 12 }}>⚠️ {error}</div>}

      <label>
        템플릿 선택
        <select value={selected} onChange={(e) => { setSelected(e.target.value); setFields({}); }} style={{ marginLeft: 8 }}>
          <option value="">-- 선택 --</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
      </label>

      {schema && (
        <div style={{ marginTop: 16 }}>
          <h3>필드 입력</h3>
          {schema.fields.map((f) => (
            <div key={f.key} style={{ marginBottom: 10 }}>
              <label>
                {f.label} {f.required && <span style={{ color: "#ef4444" }}>*</span>}
                <br />
                {f.key === "body" || f.key === "summary" || f.key === "experiences" || f.key === "education" ? (
                  <textarea rows={5} style={{ width: "100%" }} value={fields[f.key] || ""} onChange={(e) => onFieldChange(f.key, e.target.value)} />
                ) : (
                  <input style={{ width: "100%" }} value={fields[f.key] || ""} onChange={(e) => onFieldChange(f.key, e.target.value)} />
                )}
              </label>
            </div>
          ))}

          <button onClick={onGenerate} disabled={!selected || busy} style={{ padding: "10px 16px", borderRadius: 8 }}>
            {busy ? "생성 중..." : "문서 생성"}
          </button>
        </div>
      )}
    </div>
  );
}
