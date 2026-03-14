const FOLDER_KEY = "my_folders";

// DOM
const nameInput = document.getElementById("name");
const urlInput = document.getElementById("url");
const addBtn = document.getElementById("addBtn");
const listEl = document.getElementById("list");

const newFolderInput = document.getElementById("newFolder");
const addFolderBtn = document.getElementById("addFolderBtn");
const folderSelect = document.getElementById("folderSelect");


// 讀取資料夾
function loadFolders() {
    const raw = localStorage.getItem(FOLDER_KEY);
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

// 儲存資料夾
function saveFolders(folders) {
    localStorage.setItem(FOLDER_KEY, JSON.stringify(folders));
}

// 讀取某資料夾的網址
function loadLinks(folder) {
    const raw = localStorage.getItem("my_links_" + folder);
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

// 儲存某資料夾的網址
function saveLinks(folder, links) {
    localStorage.setItem("my_links_" + folder, JSON.stringify(links));
}


// 渲染資料夾下拉選單
function renderFolders() {
    const folders = loadFolders();
    folderSelect.innerHTML = "";

    folders.forEach(folder => {
        const opt = document.createElement("option");
        opt.value = folder;
        opt.textContent = folder;
        folderSelect.appendChild(opt);
    });

    renderLinks();
}


// 渲染網址列表
function renderLinks() {
    const folder = folderSelect.value;
    if (!folder) {
        listEl.innerHTML = "<li>請先新增資料夾</li>";
        return;
    }

    const links = loadLinks(folder);
    listEl.innerHTML = "";

    links.forEach((item, index) => {
        const li = document.createElement("li");
        li.className = "item";

        const a = document.createElement("a");
        a.href = item.url;
        a.target = "_blank";
        a.textContent = item.name || item.url;

        const delBtn = document.createElement("button");
        delBtn.textContent = "刪除";
        delBtn.onclick = () => {
            const updated = loadLinks(folder);
            updated.splice(index, 1);
            saveLinks(folder, updated);
            renderLinks();
        };

        li.appendChild(a);
        li.appendChild(delBtn);
        listEl.appendChild(li);
    });
}


// 新增資料夾
addFolderBtn.addEventListener("click", () => {
    const folderName = newFolderInput.value.trim();
    if (!folderName) {
        alert("請輸入資料夾名稱");
        return;
    }

    const folders = loadFolders();

    if (folders.includes(folderName)) {
        alert("資料夾已存在");
        return;
    }

    folders.push(folderName);
    saveFolders(folders);

    newFolderInput.value = "";
    renderFolders();
});


// 新增網址
addBtn.addEventListener("click", () => {
    const folder = folderSelect.value;
    if (!folder) {
        alert("請先新增資料夾");
        return;
    }

    const name = nameInput.value.trim();
    let url = urlInput.value.trim();

    if (!url) {
        alert("請輸入網址");
        return;
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
    }

    const links = loadLinks(folder);
    links.push({ name: name || url, url });
    saveLinks(folder, links);

    nameInput.value = "";
    urlInput.value = "";
    renderLinks();
});


// 初始化
renderFolders();
