(function(){
  const API_BASE = (window.DOCGEN_API_BASE) || "http://localhost:8000";

  async function fetchTemplates(){
    const res = await fetch(`${API_BASE}/templates`);
    if (!res.ok) throw new Error("템플릿 목록 조회 실패");
    return res.json();
  }

  async function verifyToken(code){
    const res = await fetch(`${API_BASE}/token/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });
    if (!res.ok) return { ok:false };
    return res.json();
  }

  async function generateDoc(template_id, fields, token){
    const res = await fetch(`${API_BASE}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template_id, fields, token })
    });
    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || "문서 생성 실패");
    }
    return res.blob();
  }

  window.API = { fetchTemplates, verifyToken, generateDoc };
})();
