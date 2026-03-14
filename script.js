const FOLDER_KEY = "my_folders";
const UNCATEGORIZED = "_uncategorized_";

const folderList = document.getElementById("folderList");
const uncategorizedList = document.getElementById("uncategorizedList");

const folderView = document.getElementById("folderView");
const linkView = document.getElementById("linkView");

const currentFolderTitle = document.getElementById("currentFolderTitle");

const newFolderInput = document.getElementById("newFolder");
const addFolderBtn = document.getElementById("addFolderBtn");

const nameInput = document.getElementById("name");
const urlInput = document.getElementById("url");
const addBtn = document.getElementById("addBtn");

const listEl = document.getElementById("list");
const backBtn = document.getElementById("backBtn");

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

        const nameSpan = document.createElement("span");
        nameSpan.className = "folder-name";
        nameSpan.textContent = folder;
        nameSpan.onclick = () => openFolder(folder);

        const renameBtn = document.createElement("button");
        renameBtn.className = "action-btn";
        renameBtn.textContent = "改名";
        renameBtn.onclick = () => renameFolder(folder);

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "action-btn";
        deleteBtn.textContent = "刪除";
        deleteBtn.onclick = () => deleteFolder(folder);

        li.appendChild(nameSpan);
        li.appendChild(renameBtn);
        li.appendChild(deleteBtn);

        folderList.appendChild(li);
    });

    renderUncategorized();
}


// 顯示未分類網址
function renderUncategorized() {
    const links = loadLinks(UNCATEGORIZED);
    uncategorizedList.innerHTML = "";

    links.forEach((item, index) => {
        const li = document.createElement("li");
        li.className = "item";

        const a = document.createElement("a");
        a.href = item.url;
        a.target = "_blank";
        a.textContent = item.name || item.url;

        const delBtn = document.createElement("button");
        delBtn.className = "action-btn";
        delBtn.textContent = "刪除";
        delBtn.onclick = () => {
            const updated = loadLinks(UNCATEGORIZED);
            updated.splice(index, 1);
            saveLinks(UNCATEGORIZED, updated);
            renderUncategorized();
        };

        li.appendChild(a);
        li.appendChild(delBtn);
        uncategorizedList.appendChild(li);
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


// 渲染資料夾內網址
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
        delBtn.className = "action-btn";
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


// 改名資料夾
function renameFolder(folder) {
    const newName = prompt("輸入新資料夾名稱：", folder);
    if (!newName) return;

    const folders = loadFolders();
    if (folders.includes(newName)) return alert("已有相同名稱");

    const index = folders.indexOf(folder);
    folders[index] = newName;
    saveFolders(folders);

    const oldLinks = loadLinks(folder);
    localStorage.removeItem("my_links_" + folder);
    saveLinks(newName, oldLinks);

    renderFolders();
}


// 刪除資料夾
function deleteFolder(folder) {
    if (!confirm(`確定要刪除資料夾「${folder}」嗎？`)) return;

    const folders = loadFolders().filter(f => f !== folder);
    saveFolders(folders);

    localStorage.removeItem("my_links_" + folder);

    renderFolders();
}


// 新增網址（自動存到未分類）
addBtn.onclick = () => {
    let name = nameInput.value.trim();
    let url = urlInput.value.trim();

    if (!url) return alert("請輸入網址");
    if (!url.startsWith("http")) url = "https://" + url;

    const links = loadLinks(UNCATEGORIZED);

    if (links.some(item => item.name === name)) {
        return alert("名稱重複");
    }

    links.push({ name: name || url, url });
    saveLinks(UNCATEGORIZED, links);

    nameInput.value = "";
    urlInput.value = "";

    renderUncategorized();
};


// 初始化
renderFolders();
