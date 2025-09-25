// Improved error messages + explicit CORS mode
(function(){
  const API_BASE = (window.DOCGEN_API_BASE) || "http://localhost:8000";

  async function safeFetch(url, init) {
    try {
      return await fetch(url, { mode: "cors", ...init });
    } catch (e) {
      throw new Error("네트워크 오류(Fetch 단계): " + (e && e.message ? e.message : String(e)));
    }
  }

  async function fetchTemplates(){
    const res = await safeFetch(`${API_BASE}/templates`);
    if (!res.ok) throw new Error(`템플릿 목록 조회 실패 (HTTP ${res.status})`);
    return res.json();
  }

  async function generateDoc(template_id, fields, token){
    const res = await safeFetch(`${API_BASE}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template_id, fields, token })
    });
    if (!res.ok) {
      let msg = "";
      try { msg = await res.text(); } catch {}
      throw new Error(`문서 생성 실패 (HTTP ${res.status}) ${msg}`.trim());
    }
    return res.blob();
  }

  window.API = { fetchTemplates, generateDoc };
})();
