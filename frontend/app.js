let tasks = [
  {
    id: 1,
    title: "Redesign da página inicial",
    status: "todo",
    priority: "alta",
    tag: "Design",
    date: "17/03",
  },
  {
    id: 2,
    title: "Revisar proposta do cliente",
    status: "todo",
    priority: "media",
    tag: "Reunião",
    date: "18/03",
  },
  {
    id: 3,
    title: "Implementar autenticação OAuth",
    status: "doing",
    priority: "alta",
    tag: "Dev",
    date: "17/03",
  },
  {
    id: 4,
    title: "Criar campanha de e-mail marketing",
    status: "doing",
    priority: "media",
    tag: "Marketing",
    date: "19/03",
  },
  {
    id: 5,
    title: "Corrigir bug no formulário",
    status: "done",
    priority: "alta",
    tag: "Dev",
    date: "16/03",
  },
  {
    id: 6,
    title: "Apresentação trimestral",
    status: "done",
    priority: "media",
    tag: "Reunião",
    date: "15/03",
  },
];
let nextId = 7;
let currentView = "todas";

const avatarColors = {
  alta: { bg: "#FCEBEB", color: "#A32D2D" },
  media: { bg: "#FFF3E0", color: "#B25000" },
  baixa: { bg: "#E6F5EE", color: "#1A7A4A" },
};

function getTodayStr() {
  const d = new Date();
  return (
    String(d.getDate()).padStart(2, "0") +
    "/" +
    String(d.getMonth() + 1).padStart(2, "0")
  );
}

function initials(tag) {
  return tag.slice(0, 2).toUpperCase();
}

function renderCard(t) {
  const ac = avatarColors[t.priority] || avatarColors.media;
  const avatarHtml =
    t.status !== "done"
      ? `<div style="width:22px;height:22px;border-radius:50%;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;background:${ac.bg};color:${ac.color};flex-shrink:0;border:1.5px solid ${ac.color}22">${initials(t.tag)}</div>`
      : "";
  return `
    <div class="task-card${t.status === "done" ? " done" : ""}"
         id="task-${t.id}"
         draggable="true"
         ondragstart="onDragStart(event, ${t.id})"
         ondragend="onDragEnd(event)">
      <div class="drag-handle" title="Arrastar">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="4" cy="3" r="1.2" fill="currentColor"/>
          <circle cx="8" cy="3" r="1.2" fill="currentColor"/>
          <circle cx="4" cy="6" r="1.2" fill="currentColor"/>
          <circle cx="8" cy="6" r="1.2" fill="currentColor"/>
          <circle cx="4" cy="9" r="1.2" fill="currentColor"/>
          <circle cx="8" cy="9" r="1.2" fill="currentColor"/>
        </svg>
      </div>
      <div class="task-top">
        <span class="task-title">${t.title}</span>
        <div style="display:flex;align-items:center;gap:6px;flex-shrink:0">
          <div class="priority p-${t.priority}" title="Prioridade ${t.priority}"></div>
          <button class="delete-btn" onclick="deleteTask(${t.id})" title="Remover tarefa">×</button>
        </div>
      </div>
      <div class="task-meta">
        <span class="tag">${t.tag}</span>
        ${avatarHtml}
        <span class="due-date">${t.date}</span>
      </div>
    </div>`;
}

function render() {
  const cols = { todo: [], doing: [], done: [] };
  tasks.forEach((t) => cols[t.status].push(t));

  ["todo", "doing", "done"].forEach((s) => {
    document.getElementById("tasks-" + s).innerHTML = cols[s]
      .map(renderCard)
      .join("");
    document.getElementById("badge-" + s).textContent = cols[s].length;
  });

  const total = tasks.length;
  const done = cols.done.length;
  const todo = cols.todo.length;
  const doing = cols.doing.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  document.getElementById("stat-total").textContent = total;
  document.getElementById("stat-todo").textContent = todo;
  document.getElementById("stat-doing").textContent = doing;
  document.getElementById("stat-done").textContent = done;
  document.getElementById("progress-fill").style.width = pct + "%";
  document.getElementById("stat-completion").textContent = total
    ? pct + "% concluído"
    : "";

  const today = getTodayStr();
  const counts = {
    todas: total,
    hoje: tasks.filter((t) => t.date === today).length,
    pendentes: todo + doing,
    concluidas: done,
  };
  Object.entries(counts).forEach(([k, v]) => {
    const el = document.getElementById("count-" + k);
    if (el) el.textContent = v;
  });

  updateEmptyState();

  initDropZones();
}

function updateEmptyState() {
  const board = document.getElementById("board");
  const empty = document.getElementById("empty-state");
  const visibleCols = ["todo", "doing", "done"].filter(
    (s) => document.getElementById("col-" + s).style.display !== "none",
  );
  const hasCards = visibleCols.some((s) => {
    const col = document.getElementById("tasks-" + s);
    return col && col.children.length > 0;
  });

  const labels = {
    todas: {
      title: "Nenhuma tarefa criada",
      sub: 'Clique em "Nova Tarefa" para começar',
    },
    hoje: { title: "Nenhuma tarefa para hoje", sub: "Nada agendado para hoje" },
    pendentes: { title: "Tudo em dia!", sub: "Não há tarefas pendentes" },
    concluidas: {
      title: "Ainda sem tarefas concluídas",
      sub: "Conclua tarefas para vê-las aqui",
    },
  };

  if (!hasCards) {
    board.style.display = "none";
    empty.style.display = "flex";
    const l = labels[currentView] || labels.todas;
    document.getElementById("empty-title").textContent = l.title;
    document.getElementById("empty-sub").textContent = l.sub;
  } else {
    board.style.display = "";
    empty.style.display = "none";
  }
}

function openAdd(col) {
  document.getElementById("add-" + col).classList.add("open");
  document.getElementById("input-" + col).focus();
}
function closeAdd(col) {
  document.getElementById("add-" + col).classList.remove("open");
  document.getElementById("input-" + col).value = "";
}
function addTask(col) {
  const val = document.getElementById("input-" + col).value.trim();
  if (!val) return;
  tasks.push({
    id: nextId++,
    title: val,
    status: col,
    priority: document.getElementById("pri-" + col).value,
    tag: document.getElementById("tag-" + col).value,
    date: getTodayStr(),
  });
  closeAdd(col);
  render();
}
function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  render();
}

function setView(v, btn) {
  currentView = v;
  document
    .querySelectorAll(".nav-item")
    .forEach((el) => el.classList.remove("active"));
  btn.classList.add("active");

  const labels = {
    todas: "Quadro",
    hoje: "Hoje",
    pendentes: "Pendentes",
    concluidas: "Concluídas",
  };
  const eyebrows = {
    todas: "Visão geral",
    hoje: "Filtro por data",
    pendentes: "Em aberto",
    concluidas: "Histórico",
  };
  document.getElementById("page-title").textContent = labels[v];
  document.getElementById("page-eyebrow").textContent = eyebrows[v];
  if (document.getElementById("mobile-topbar-title")) {
    document.getElementById("mobile-topbar-title").textContent = labels[v];
  }

  const show = { todo: true, doing: true, done: true };
  if (v === "pendentes") show.done = false;
  if (v === "concluidas") {
    show.todo = false;
    show.doing = false;
  }
  if (v === "hoje") {
  }

  ["todo", "doing", "done"].forEach((s) => {
    document.getElementById("col-" + s).style.display = show[s] ? "" : "none";
  });
  render();
}

function openModal() {
  document.getElementById("modal-date").value = new Date()
    .toISOString()
    .split("T")[0];
  document.getElementById("modal-title-input").value = "";
  document.getElementById("modal-desc").value = "";
  document.getElementById("modal").classList.add("open");
  setTimeout(() => document.getElementById("modal-title-input").focus(), 50);
}
function closeModal() {
  document.getElementById("modal").classList.remove("open");
}
function handleOverlayClick(e) {
  if (e.target === document.getElementById("modal")) closeModal();
}
function saveModal() {
  const title = document.getElementById("modal-title-input").value.trim();
  if (!title) {
    document.getElementById("modal-title-input").focus();
    return;
  }

  const dateVal = document.getElementById("modal-date").value;
  let dateStr = getTodayStr();
  if (dateVal) {
    const [, m, dd] = dateVal.split("-");
    dateStr = dd + "/" + m;
  }
  tasks.push({
    id: nextId++,
    title,
    status: document.getElementById("modal-status").value,
    priority: document.getElementById("modal-priority").value,
    tag: document.getElementById("modal-tag").value,
    date: dateStr,
  });
  closeModal();
  render();
}

let draggedId = null;

function onDragStart(e, id) {
  draggedId = id;
  e.dataTransfer.effectAllowed = "move";
  setTimeout(() => {
    const el = document.getElementById("task-" + id);
    if (el) el.classList.add("dragging");
  }, 0);
}
function onDragEnd(e) {
  if (draggedId) {
    const el = document.getElementById("task-" + draggedId);
    if (el) el.classList.remove("dragging");
  }
  document
    .querySelectorAll(".drop-zone")
    .forEach((z) => z.classList.remove("drag-over"));
  draggedId = null;
}
function initDropZones() {
  ["todo", "doing", "done"].forEach((col) => {
    const zone = document.getElementById("tasks-" + col);
    if (!zone) return;
    zone.ondragover = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      document
        .querySelectorAll(".drop-zone")
        .forEach((z) => z.classList.remove("drag-over"));
      zone.classList.add("drag-over");
    };
    zone.ondragleave = (e) => {
      if (!zone.contains(e.relatedTarget)) zone.classList.remove("drag-over");
    };
    zone.ondrop = (e) => {
      e.preventDefault();
      zone.classList.remove("drag-over");
      if (draggedId === null) return;
      const task = tasks.find((t) => t.id === draggedId);
      if (task && task.status !== col) {
        task.status = col;
        render();
      }
    };
  });
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  const topbar = document.getElementById("mobile-topbar");
  const isOpen = sidebar.classList.toggle("open");
  overlay.classList.toggle("open", isOpen);
  if (topbar) topbar.style.visibility = isOpen ? "hidden" : "visible";
}
function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("sidebar-overlay").classList.remove("open");
  const topbar = document.getElementById("mobile-topbar");
  if (topbar) topbar.style.visibility = "visible";
}

function toggleProfileMenu() {
  const popup = document.getElementById("profile-popup");
  const btn = document.getElementById("profile-btn");
  const isOpen = popup.classList.toggle("open");
  btn.classList.toggle("active", isOpen);
}
function closeProfileMenu() {
  document.getElementById("profile-popup").classList.remove("open");
  document.getElementById("profile-btn").classList.remove("active");
}
document.addEventListener("click", (e) => {
  const popup = document.getElementById("profile-popup");
  const btn = document.getElementById("profile-btn");
  if (
    popup &&
    popup.classList.contains("open") &&
    !popup.contains(e.target) &&
    !btn.contains(e.target)
  ) {
    closeProfileMenu();
  }
});

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  const label = document.getElementById("theme-label");
  if (label) label.textContent = isDark ? "Tema escuro" : "Tema claro";
}
function initTheme() {
  const saved = localStorage.getItem("theme");
  const isDark =
    saved === "dark" ||
    (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
  if (isDark) {
    document.body.classList.add("dark");
    const label = document.getElementById("theme-label");
    if (label) label.textContent = "Tema escuro";
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
    ["todo", "doing", "done"].forEach((c) => closeAdd(c));
  }
  if (
    e.key === "Enter" &&
    !document.getElementById("modal").classList.contains("open")
  ) {
    ["todo", "doing", "done"].forEach((c) => {
      if (document.getElementById("add-" + c).classList.contains("open"))
        addTask(c);
    });
  }
  if (
    e.key === "n" &&
    !e.ctrlKey &&
    !e.metaKey &&
    document.activeElement.tagName === "BODY"
  ) {
    openModal();
  }
});

initTheme();
render();
