import { app as h } from "../../../scripts/app.js";
import { api as v } from "../../../scripts/api.js";
const R = h;
R.registerExtension({
  name: "Comfy.FetchApi",
  async nodeCreated(o) {
    var m, b, w;
    if (o.constructor.comfyClass !== "FetchApi") return;
    const f = o.onExecuted, p = async (e, i, a) => {
      try {
        const d = `/view?${[
          "filename=" + encodeURIComponent(a),
          "type=" + encodeURIComponent(e),
          "subfolder=" + encodeURIComponent(i),
          h.getRandParam().substring(1)
        ].join("&")}`, t = await v.fetchApi(d);
        if (!t.ok)
          return console.error(t), console.error("Unable to fetch file"), alert("Unable to fetch file"), !1;
        const u = await t.blob(), U = a, y = window.URL.createObjectURL(u), n = document.createElement("a");
        return n.style.display = "none", n.href = y, n.download = U, document.body.appendChild(n), n.click(), document.body.removeChild(n), window.URL.revokeObjectURL(y), !0;
      } catch (l) {
        return console.error(l), console.error("Unable to fetch file"), alert("Unable to fetch file"), !1;
      }
    }, r = (m = o.widgets) == null ? void 0 : m.find((e) => e.name === "type"), c = (b = o.widgets) == null ? void 0 : b.find((e) => e.name === "subfolder"), s = (w = o.widgets) == null ? void 0 : w.find((e) => e.name === "filename");
    o.onExecuted = function(e) {
      var t;
      f == null || f.apply(this, arguments);
      const i = e.result[0], a = e.result[1], l = e.result[2], d = (t = o.widgets) == null ? void 0 : t.find((u) => u.name === "auto_download");
      r && c && s && (r.value = i, c.value = a, s.value = l, d && d.value && p(i, a, l));
    }, o.addWidget("button", "download", "download", async () => {
      r && c && s ? await p(
        r.value,
        c.value,
        s.value
      ) : (console.error("Unable to fetch file"), alert("Unable to fetch file"));
    });
  }
});
