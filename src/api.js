const API_BASE = (window.DOCGEN_API_BASE) || (typeof import !== 'undefined' && import.meta && import.meta.env && import.meta.env.VITE_API_BASE) || "http://localhost:8000";

export async function fetchTemplates() {
  const res = await fetch(`${API_BASE}/templates`);
  if (!res.ok) throw new Error("템플릿 목록 조회 실패");
  return res.json();
}

export async function generateDoc(template_id, fields) {
  const res = await fetch(`${API_BASE}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ template_id, fields })
  });
  if (!res.ok) throw new Error("문서 생성 실패");
  return res.blob();
}
