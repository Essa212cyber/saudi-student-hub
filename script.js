const $ = (id) => document.getElementById(id);

// Header controls
$("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("ssh-theme", document.body.classList.contains("dark") ? "dark" : "light");
});
if (localStorage.getItem("ssh-theme") === "dark") document.body.classList.add("dark");
$("menuToggle").addEventListener("click", () => $("mainNav")?.classList.toggle("open"));
// The nav is selected below because it is the only navigation element.
const nav = document.querySelector(".topbar nav");
$("menuToggle").addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => nav.classList.remove("open")));

$("year").textContent = new Date().getFullYear();
$("todayDate").textContent = new Intl.DateTimeFormat(undefined, {weekday:"short", month:"short", day:"numeric"}).format(new Date());

// Attendance calculator
$("attendanceBtn").addEventListener("click", () => {
  const attended = Number($("attended").value);
  const total = Number($("totalClasses").value);
  const result = $("attendanceResult");
  if ($("attended").value === "" || $("totalClasses").value === "" || total <= 0 || attended < 0 || attended > total) {
    result.textContent = "Please enter valid numbers. Attended classes cannot be greater than total classes.";
    return;
  }
  const percent = attended / total * 100;
  result.textContent = `Your attendance is ${percent.toFixed(1)}% (${attended} out of ${total} classes).`;
});

// Marks calculator
$("marksBtn").addEventListener("click", () => {
  const scored = Number($("marksScored").value);
  const max = Number($("maxMarks").value);
  const result = $("marksResult");
  if ($("marksScored").value === "" || $("maxMarks").value === "" || max <= 0 || scored < 0 || scored > max) {
    result.textContent = "Please enter valid marks. Your score cannot be greater than the total marks.";
    return;
  }
  result.textContent = `Your percentage is ${(scored / max * 100).toFixed(2)}%.`;
});

// Daily task list — stored only in this browser.
let tasks = [];
try { tasks = JSON.parse(localStorage.getItem("ssh-tasks") || "[]"); } catch { tasks = []; }
function saveTasks() { localStorage.setItem("ssh-tasks", JSON.stringify(tasks)); renderTasks(); }
function renderTasks() {
  const list = $("taskList");
  list.innerHTML = "";
  if (!tasks.length) list.innerHTML = '<li class="empty-task">No tasks yet. Add one above to get started.</li>';
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.done) li.classList.add("done");
    const check = document.createElement("input");
    check.type = "checkbox"; check.checked = task.done; check.setAttribute("aria-label", "Mark task complete");
    check.addEventListener("change", () => { tasks[index].done = check.checked; saveTasks(); });
    const span = document.createElement("span"); span.textContent = task.text; span.style.flex = "1";
    const remove = document.createElement("button");
    remove.type = "button"; remove.textContent = "×"; remove.setAttribute("aria-label", "Delete task");
    remove.style.cssText = "border:0;background:transparent;color:#929bad;font-size:20px;cursor:pointer";
    remove.addEventListener("click", () => { tasks.splice(index, 1); saveTasks(); });
    li.append(check, span, remove); list.append(li);
  });
  const done = tasks.filter(t => t.done).length;
  $("taskSummary").textContent = `${done} of ${tasks.length} tasks completed · Saved in this browser`;
}
$("taskForm").addEventListener("submit", event => {
  event.preventDefault();
  const value = $("taskInput").value.trim();
  if (!value) return;
  tasks.push({text:value, done:false}); $("taskInput").value = ""; saveTasks();
});
renderTasks();

// Focus timer
let remaining = 25 * 60, isBreak = false, interval = null;
function showTimer() {
  $("timerDisplay").textContent = `${String(Math.floor(remaining / 60)).padStart(2,"0")}:${String(remaining % 60).padStart(2,"0")}`;
  $("timerMode").textContent = isBreak ? "BREAK TIME" : "FOCUS SESSION";
  $("timerModeToggle").textContent = isBreak ? "Focus: 25 min" : "Break: 5 min";
}
function stopTimer() { if (interval) clearInterval(interval); interval = null; $("timerStart").textContent = "Start"; }
$("timerStart").addEventListener("click", () => {
  if (interval) { stopTimer(); return; }
  $("timerStart").textContent = "Pause";
  interval = setInterval(() => {
    remaining--;
    if (remaining <= 0) {
      stopTimer();
      alert(isBreak ? "Break finished. Ready to focus?" : "Focus session complete. Time for a short break!");
    }
    showTimer();
  }, 1000);
});
$("timerReset").addEventListener("click", () => { stopTimer(); remaining = isBreak ? 5*60 : 25*60; showTimer(); });
$("timerModeToggle").addEventListener("click", () => { stopTimer(); isBreak = !isBreak; remaining = isBreak ? 5*60 : 25*60; showTimer(); });
showTimer();
