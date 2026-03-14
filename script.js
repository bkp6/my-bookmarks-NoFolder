const FOLDER_KEY = "my_folders";

const folderList = document.getElementById("folderList");
const folderView = document.getElementById("folderView");
const linkView = document.getElementById("linkView");

const currentFolderTitle = document.getElementById("currentFolderTitle");

const newFolderInput = document.getElementById("newFolder");
const addFolderBtn = document.getElementById("addFolderBtn");

const renameFolderInput = document.getElementById("renameFolder");
const renameFolderBtn = document.getElementById("renameFolderBtn");
const deleteFolderBtn = document.getElementById("deleteFolderBtn");
const backBtn = document.getElementById("backBtn");

const nameInput = document.getElementById("name");
const urlInput = document.getElementById("url");
const addBtn = document.getElementById("addBtn");
const listEl = document.getElementById("list");

let currentFolder = null;


// 讀取資料夾
function loadFolders() {
    const raw = localStorage.getItem(FOLDER_KEY);
    if (!raw) return [];
    try { return JSON.parse(raw); } catch { return []; }
}

// 儲存資料夾
function saveFolders(folders) {
    localStorage.setItem(FOLDER_KEY, JSON.stringify(folders));
}

// 讀取網址
function loadLinks(folder) {
    const raw = localStorage.getItem("my_links_" + folder);
    if (!raw) return [];
    try { return JSON.parse(raw); } catch { return []; }
}

// 儲存網址
function saveLinks(folder, links) {
    localStorage.setItem("my_links_" + folder, JSON.stringify(links));
}


// 顯示資料夾列表
function renderFolders() {
    const folders = loadFolders();
    folderList.innerHTML = "";

    folders.forEach(folder => {
        const li = document.createElement("li");
        li.className = "folder-item";

        const span = document.createElement("span");
        span.className = "folder-name";
        span.textContent = folder;
        span.onclick = () => openFolder(folder);

        li.appendChild(span);
        folderList.appendChild(li);
    });
}


// 打開資料夾
function openFolder(folder) {
    currentFolder = folder;
    currentFolderTitle.textContent = "目前位置：" + folder;

    folderView.style.display = "none";
    linkView.style.display = "block";

    renderLinks();
}


// 返回資料夾列表
backBtn.onclick = () => {
    currentFolder = null;
    linkView.style.display = "none";
    folderView.style.display = "block";
};


// 渲染網址列表
function renderLinks() {
    const links = loadLinks(currentFolder);
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
            const updated = loadLinks(currentFolder);
            updated.splice(index, 1);
            saveLinks(currentFolder, updated);
            renderLinks();
        };

        li.appendChild(a);
        li.appendChild(delBtn);
        listEl.appendChild(li);
    });
}


// 新增資料夾
addFolderBtn.onclick = () => {
    const name = newFolderInput.value.trim();
    if (!name) return alert("請輸入資料夾名稱");

    const folders = loadFolders();
    if (folders.includes(name)) return alert("資料夾已存在");

    folders.push(name);
    saveFolders(folders);

    newFolderInput.value = "";
    renderFolders();
};


// 重新命名資料夾
renameFolderBtn.onclick = () => {
    const newName = renameFolderInput.value.trim();
    if (!newName) return alert("請輸入新名稱");

    const folders = loadFolders();
    if (folders.includes(newName)) return alert("已有相同名稱");

    const index = folders.indexOf(currentFolder);
    folders[index] = newName;
    saveFolders(folders);

    const oldLinks = loadLinks(currentFolder);
    localStorage.removeItem("my_links_" + currentFolder);
    saveLinks(newName, oldLinks);

    currentFolder = newName;
    renameFolderInput.value = "";

    currentFolderTitle.textContent = "目前位置：" + newName;
    renderFolders();
};


// 刪除資料夾
deleteFolderBtn.onclick = () => {
    if (!confirm(`確定要刪除資料夾「${currentFolder}」嗎？`)) return;

    const folders = loadFolders().filter(f => f !== currentFolder);
    saveFolders(folders);

    localStorage.removeItem("my_links_" + currentFolder);

    backBtn.onclick();
    renderFolders();
};


// 新增網址
addBtn.onclick = () => {
    let name = nameInput.value.trim();
    let url = urlInput.value.trim();

    if (!url) return alert("請輸入網址");
    if (!url.startsWith("http")) url = "https://" + url;

    const links = loadLinks(currentFolder);

    if (links.some(item => item.name === name)) {
        return alert("名稱重複");
    }

    links.push({ name: name || url, url });
    saveLinks(currentFolder, links);

    nameInput.value = "";
    urlInput.value = "";

    renderLinks();
};


// 初始化
renderFolders();
