import { app as g } from "../../../scripts/app.js";
import { api as I } from "../../../scripts/api.js";
const F = g;
F.registerExtension({
  name: "Comfy.FetchApi",
  async nodeCreated(n) {
    var m, b, w;
    if (n.constructor.comfyClass !== "FetchApi") return;
    const f = n.onExecuted, u = async (e, a, t) => {
      try {
        let o = a, l = t;
        const c = t.lastIndexOf("/");
        if (c !== -1) {
          const U = t.substring(0, c);
          l = t.substring(c + 1), a && a.trim() !== "" ? o = a + "/" + U : o = U;
        }
        o = o.replace(/\/+/g, "/").replace(/^\/|\/$/g, "");
        const v = `/view?${[
          "filename=" + encodeURIComponent(l),
          "type=" + encodeURIComponent(e),
          "subfolder=" + encodeURIComponent(o),
          g.getRandParam().substring(1)
        ].join("&")}`, p = await I.fetchApi(v);
        if (!p.ok)
          return console.error(p), console.error("Unable to fetch file"), alert("Unable to fetch file"), !1;
        const R = await p.blob(), C = t.includes("/") ? t.replace(/\//g, "_") : (
          // 将路径分隔符替换为下划线
          t
        ), y = window.URL.createObjectURL(R), r = document.createElement("a");
        return r.style.display = "none", r.href = y, r.download = C, document.body.appendChild(r), r.click(), document.body.removeChild(r), window.URL.revokeObjectURL(y), !0;
      } catch (o) {
        return console.error(o), console.error("Unable to fetch file"), alert("Unable to fetch file"), !1;
      }
    }, s = (m = n.widgets) == null ? void 0 : m.find((e) => e.name === "type"), i = (b = n.widgets) == null ? void 0 : b.find((e) => e.name === "subfolder"), d = (w = n.widgets) == null ? void 0 : w.find((e) => e.name === "filename");
    n.onExecuted = function(e) {
      var c;
      f == null || f.apply(this, arguments);
      const a = e.result[0], t = e.result[1], o = e.result[2], l = (c = n.widgets) == null ? void 0 : c.find((h) => h.name === "auto_download");
      s && i && d && (s.value = a, i.value = t, d.value = o, l && l.value && u(a, t, o));
    }, n.addWidget("button", "download", "download", async () => {
      s && i && d ? await u(
        s.value,
        i.value,
        d.value
      ) : (console.error("Unable to fetch file"), alert("Unable to fetch file"));
    });
  }
});
