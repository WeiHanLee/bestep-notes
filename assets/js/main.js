// 首頁：讀取 data/lessons.json，產生單元卡片、篩選、倒數與完成狀態
(function () {
  var SKILL_LABEL = { overview: "總覽", reading: "閱讀", listening: "聽力", vocab: "單字", review: "複習" };

  function isDone(id) {
    try { return localStorage.getItem("bestep-done:" + id) === "1"; } catch (e) { return false; }
  }

  function daysUntil(dateStr) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var exam = new Date(dateStr + "T00:00:00");
    return Math.round((exam - today) / 86400000);
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function render(data) {
    var site = data.site, lessons = data.lessons;
    var d = daysUntil(site.examDate);
    document.getElementById("stat-days").textContent = d > 0 ? d : (d === 0 ? "今天" : "已結束");
    document.getElementById("stat-target").textContent = site.target;
    var done = lessons.filter(function (l) { return isDone(l.id); }).length;
    document.getElementById("stat-done").textContent = done + " / " + lessons.length;
    if (site.repo) {
      var repo = document.getElementById("repo-link");
      if (repo) { repo.href = site.repo; repo.hidden = false; }
    }

    var cards = document.getElementById("cards");
    var chips = document.querySelectorAll(".chip");

    function draw(filter) {
      cards.innerHTML = "";
      var list = lessons.filter(function (l) { return filter === "all" || l.skill === filter; });
      if (!list.length) { cards.appendChild(el("p", "empty", "這個分類還沒有單元。")); return; }
      list.forEach(function (l) {
        var a = el("a", "card");
        a.href = l.file;
        var row = el("div", "row");
        row.appendChild(el("span", "tag " + l.skill, SKILL_LABEL[l.skill] || l.skill));
        row.appendChild(el("span", null, l.part));
        row.appendChild(el("span", null, "· " + l.minutes + " 分鐘"));
        if (isDone(l.id)) row.appendChild(el("span", "check", "✓ 已完成"));
        a.appendChild(row);
        a.appendChild(el("h3", null, l.title));
        a.appendChild(el("p", null, l.summary));
        cards.appendChild(a);
      });
    }

    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        chips.forEach(function (x) { x.classList.remove("active"); });
        c.classList.add("active");
        draw(c.dataset.filter);
      });
    });
    draw("all");
  }

  fetch("data/lessons.json")
    .then(function (r) { return r.json(); })
    .then(render)
    .catch(function () {
      document.getElementById("cards").innerHTML =
        '<p class="empty">讀不到 data/lessons.json。若在本機預覽，請用 <code>python -m http.server</code> 開啟。</p>';
    });
})();
