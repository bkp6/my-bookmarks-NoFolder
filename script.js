const STORAGE_KEY = "my_links";

const nameInput = document.getElementById("name");
const urlInput = document.getElementById("url");
const addBtn = document.getElementById("addBtn");
const listEl = document.getElementById("list");

function loadLinks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLinks(links) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
}

function render() {
  const links = loadLinks();
  listEl.innerHTML = "";

  links.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "item";

    const a = document.createElement("a");
    a.href = item.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = item.name;

    const delBtn = document.createElement("button");
    delBtn.textContent = "刪除";
    delBtn.onclick = () => {
      const updated = loadLinks();
      updated.splice(index, 1);
      saveLinks(updated);
      render();
    };

    li.appendChild(a);
    li.appendChild(delBtn);
    listEl.appendChild(li);
  });
}

addBtn.addEventListener("click", () => {
  let name = nameInput.value.trim();
  let url = urlInput.value.trim();

  // 🔥 名稱必填（否則永遠不會重複）
  if (!name) {
    alert("請輸入名稱！");
    return;
  }

  if (!url) {
    alert("請輸入網址！");
    return;
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  const links = loadLinks();

  // 🔥 名稱重複檢查（現在一定會生效）
  const exists = links.some(item => item.name === name);
  if (exists) {
    alert("這個名稱已經存在，請換一個名稱！");
    return;
  }

  links.push({ name, url });
  saveLinks(links);

  nameInput.value = "";
  urlInput.value = "";
  render();
});

render();
