// 單元頁共用行為：測驗互動、英文朗讀、完成打勾、上一篇/下一篇
// 元件用法見 AGENTS.md 第 8 節，頁面本身不需要寫任何 JS
(function () {
  var lessonId = document.body.dataset.lesson;

  /* ---------- 測驗 ---------- */
  var quizzes = Array.prototype.slice.call(document.querySelectorAll(".quiz"));
  var scoreEl = document.getElementById("score");

  function updateScore() {
    if (!scoreEl) return;
    var answered = quizzes.filter(function (q) { return q.classList.contains("answered"); });
    var right = answered.filter(function (q) { return q.dataset.result === "ok"; }).length;
    scoreEl.textContent = "已作答 " + answered.length + " / " + quizzes.length + "，答對 " + right + " 題";
  }

  function reveal(quiz, picked) {
    var answer = quiz.dataset.answer.split("").sort().join("");
    var got = picked.slice().sort().join("");
    var ok = answer === got;
    quiz.classList.add("answered");
    quiz.dataset.result = ok ? "ok" : "bad";
    quiz.querySelectorAll(".opt").forEach(function (b) {
      b.disabled = true;
      var k = b.dataset.key;
      if (answer.indexOf(k) > -1) b.classList.add("correct");
      else if (picked.indexOf(k) > -1) b.classList.add("wrong");
    });
    var exp = quiz.querySelector(".explain");
    if (exp && !exp.querySelector(".verdict")) {
      var v = document.createElement("span");
      v.className = "verdict " + (ok ? "ok" : "bad");
      v.textContent = ok ? "答對了！" : "答錯了，正解是 " + answer.split("").join("、") + "。";
      exp.insertBefore(v, exp.firstChild);
    }
    var btn = quiz.querySelector(".check-btn");
    if (btn) btn.remove();
    updateScore();
  }

  quizzes.forEach(function (quiz) {
    var multi = quiz.hasAttribute("data-multi");
    var opts = quiz.querySelectorAll(".opt");
    if (multi) {
      var need = quiz.dataset.answer.length;
      var btn = document.createElement("button");
      btn.className = "check-btn";
      btn.textContent = "確認答案（選 " + need + " 個）";
      quiz.querySelector(".options").after(btn);
      btn.addEventListener("click", function () {
        var picked = [];
        quiz.querySelectorAll(".opt.selected").forEach(function (b) { picked.push(b.dataset.key); });
        if (picked.length !== need) { btn.textContent = "請剛好選 " + need + " 個"; return; }
        reveal(quiz, picked);
      });
    }
    opts.forEach(function (b) {
      b.addEventListener("click", function () {
        if (multi) b.classList.toggle("selected");
        else reveal(quiz, [b.dataset.key]);
      });
    });
  });

  var resetBtn = document.getElementById("reset");
  if (resetBtn) resetBtn.addEventListener("click", function () { location.reload(); });
  updateScore();

  /* ---------- 英文朗讀 ---------- */
  var synth = window.speechSynthesis;
  function pickVoice() {
    if (!synth) return null;
    var voices = synth.getVoices();
    return voices.filter(function (v) { return v.lang === "en-US"; })[0] ||
      voices.filter(function (v) { return /^en/.test(v.lang); })[0] || null;
  }
  document.querySelectorAll(".speak").forEach(function (b) {
    b.addEventListener("click", function () {
      if (!synth) { b.textContent = "此瀏覽器不支援朗讀"; return; }
      synth.cancel();
      var u = new SpeechSynthesisUtterance(b.dataset.text);
      var voice = pickVoice();
      if (voice) u.voice = voice;
      u.lang = "en-US";
      u.rate = 0.95;
      synth.speak(u);
    });
  });

  /* ---------- 完成打勾 ---------- */
  var key = "bestep-done:" + lessonId;
  var toggle = document.querySelector(".done-toggle");
  function getDone() { try { return localStorage.getItem(key) === "1"; } catch (e) { return false; } }
  function paint() {
    if (!toggle) return;
    var on = getDone();
    toggle.classList.toggle("on", on);
    toggle.textContent = on ? "✓ 已完成這個單元" : "標記為已完成";
  }
  if (toggle) {
    toggle.addEventListener("click", function () {
      try { localStorage.setItem(key, getDone() ? "0" : "1"); } catch (e) {}
      paint();
    });
    paint();
  }

  /* ---------- 上一篇／下一篇 ---------- */
  var pager = document.getElementById("pager");
  if (!pager) return;
  fetch("../data/lessons.json")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var list = data.lessons;
      var i = list.findIndex(function (l) { return l.id === lessonId; });
      if (i < 0) return;
      function link(l, cls, label) {
        var a = document.createElement("a");
        a.className = cls;
        a.href = "../" + l.file;
        var s = document.createElement("small");
        s.textContent = label;
        a.appendChild(s);
        a.appendChild(document.createTextNode(l.title));
        return a;
      }
      if (i > 0) pager.appendChild(link(list[i - 1], "prev", "← 上一篇"));
      if (i < list.length - 1) pager.appendChild(link(list[i + 1], "next", "下一篇 →"));
    })
    .catch(function () {});
})();
