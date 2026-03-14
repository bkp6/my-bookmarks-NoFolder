const FOLDER_KEY = "my_folders";

// DOM
const nameInput = document.getElementById("name");
const urlInput = document.getElementById("url");
const addBtn = document.getElementById("addBtn");
const listEl = document.getElementById("list");

const newFolderInput = document.getElementById("newFolder");
const addFolderBtn = document.getElementById("addFolderBtn");

const folderSelect = document.getElementById("folderSelect");

const renameFolderInput = document.getElementById("renameFolder");
const renameFolderBtn = document.getElementById("renameFolderBtn");
const deleteFolderBtn = document.getElementById("deleteFolderBtn");


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

    updateFolderButtons();
    renderLinks();
}


// 更新按鈕啟用狀態
function updateFolderButtons() {
    const hasFolder = folderSelect.value !== "";

    renameFolderBtn.disabled = !hasFolder;
    deleteFolderBtn.disabled = !hasFolder;
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


// 重新命名資料夾
renameFolderBtn.addEventListener("click", () => {
    const oldName = folderSelect.value;
    const newName = renameFolderInput.value.trim();

    if (!newName) {
        alert("請輸入新名稱");
        return;
    }

    const folders = loadFolders();

    if (folders.includes(newName)) {
        alert("已有相同名稱的資料夾");
        return;
    }

    // 修改資料夾名稱
    const index = folders.indexOf(oldName);
    folders[index] = newName;
    saveFolders(folders);

    // 搬移網址資料
    const oldLinks = loadLinks(oldName);
    localStorage.removeItem("my_links_" + oldName);
    saveLinks(newName, oldLinks);

    renameFolderInput.value = "";
    renderFolders();
});


// 刪除資料夾
deleteFolderBtn.addEventListener("click", () => {
    const folder = folderSelect.value;

    if (!confirm(`確定要刪除資料夾「${folder}」嗎？（裡面的網址也會一起刪除）`)) {
        return;
    }

    const folders = loadFolders();
    const updated = folders.filter(f => f !== folder);
    saveFolders(updated);

    localStorage.removeItem("my_links_" + folder);

    renderFolders();
});


// 當選擇資料夾時更新按鈕狀態
folderSelect.addEventListener("change", updateFolderButtons);


// 初始化
renderFolders();
