const { invoke, send, receive } = utils;

const listElement = document.getElementById("list");
const inputElement = document.getElementById("input");
const buttonElement = document.getElementById("exec");
let fileList = [];
let keywordList = [];

const MIN_KEY_COUNT_RATE = 0.5;

function getKeywordList() {
  const seen = {};

  for (const file of fileList) {
    for (const word of file.words) {
      if (!seen[word]) {
        seen[word] = 0;
      }
      seen[word] += 1;
    }
  }

  return Object.entries(seen)
    .map(function(item) {
      return {
        count: item[1],
        value: item[0],
      }
    })
    .sort(function(a, b) {
      return b.count - a.count;
    });
}

function getItems(basename) {
  return basename
    .split(/([0-9]+)|[-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+|\s+/)
    .filter(Boolean);
}

function rename(file) {
  const items = inputElement.value.split(/(\{[^\{\}]*\})/).filter(Boolean);

  if (items.length === 0) {
    return file.basename + file.extname;
  }

  let result = "";
  for (const item of items) {
    if (/\{.*\}/.test(item)) {
      const str = item.replace(/\{|\}|\s/g, "");
      const key = str.split(":")[0];
      let value = strJs.isNumber(str.split(":").pop()) ? parseInt(str.split(":").pop()) : 0;
      if (key === "index") {
        result += String(file.index+1).padStart(value, "0");
      } else if (key === "w") {
        // word
        if (value < 0) {
          value += file.words.length;
        }
        if (value >= 0 && value < file.words.length) {
          result += file.words[value];
        }
      } else if (key === "n") {
        // number
        if (value < 0) {
          value += file.numbers.length;
        }
        if (value >= 0 && value < file.numbers.length) {
          result += file.numbers[value];
        }
      } else if (key === "i") {
        // item
        if (value < 0) {
          value += file.items.length;
        }
        if (value >= 0 && value < file.items.length) {
          result += file.items[value];
        }
      } else if (key === "k") {
        // keyword
        if (value < 0) {
          value += keywordList.length;
        }
        if (value >= 0 && value < keywordList.length) {
          result += keywordList[value].value;
        }
      }
    } else {
      result += item;
    }
  }

  return result + file.extname;
}

async function renderFileList() {
  // clear
  listElement.innerHTML = "";

  // check dupe
  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];

    // get new filename
    file.newFilename = rename(file);
    file.newPath = file.path.substring(0, file.path.lastIndexOf(file.filename)) +
      file.newFilename;

    // check dupe
    file.isDupe = false;
    for (let j = 0; j < i; j++) {
      if (fileList[j].newFilename === file.newFilename) {
        file.isDupe = true;
        break;
      }
    }

    // check exists
    file.isExists = false;
    if (file.filename !== file.newFilename) {
      const isExists = await invoke("isExists", file.newPath);
      file.isExists = isExists === 1 || isExists === -1;
    }
  }

  let hasErrors = false;
  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];
    const wrapper = document.createElement("div");
    wrapper.className = "d-f fd-r bb-1";
    const before = document.createElement("div");
    before.className = "f-1 br-1 pl-02";
    const after = document.createElement("div");
    after.className = "f-1 pl-02";

    if (file.isDupe || file.isExists) {
      after.style.color = "red";
      hasErrors = true;
    }

    before.innerHTML = file.filename;
    after.innerHTML = file.newFilename;

    wrapper.appendChild(before);
    wrapper.appendChild(after);
    listElement.appendChild(wrapper);
  }

  buttonElement.disabled = hasErrors;
}

function inputHandler(e) {
  renderFileList();
}

async function buttonHandler(e) {
  const response = await invoke("execute", fileList.map(function(file) {
    return {
      oldPath: file.path,
      newPath: file.newPath,
    }
  }));

  if (response === 1) {
    console.log("Succeeded");
  } else {
    console.error("Failed");
  }
}

function preventDefault(e) {
  e.preventDefault();
}

async function dropHandler(e) {
  const files = e.dataTransfer.files;
  if (files.length < 1) {
    return;
  }

  // debug
  console.log("drop:",files);

  const newFiles = [];
  for (const file of files) {
    // check dupe
    if (!!fileList.find(function(_file) {return _file.path === file.path;})) {
      continue;
    }

    const isDirectory = await invoke("isDirectory", file.path);
    if (isDirectory === -1) {
      console.error("File not supported.");
      continue;
    }

    const basename = isDirectory === 1 ? file.name : file.name.substring(0, file.name.lastIndexOf("."));
    const extname = isDirectory === 1 ? "" : file.name.substring(file.name.lastIndexOf("."));

    const items = getItems(basename);

    const words = items.filter(function(item) {
      return !strJs.isNumber(item);
    });

    const numbers = items.map(function(item) {
      return strJs.width(item, false); // to half width
    }).filter(function(item) {
      return strJs.isNumber(item);
    });
    
    const newFile = {
      isDirectory: isDirectory === 1,
      isFile: isDirectory === 0,
      isDupe: false,
      isExists: false,
      path: file.path,
      type: file.type,
      size: file.size,
      extname: extname,
      basename: basename,
      filename: file.name,
      newFilename: file.name,
      newPath: file.path,
      items: items,
      words: words,
      numbers: numbers,
    }

    newFiles.push(newFile);
  }

  // debug
  console.log("newFiles:",newFiles);

  fileList = fileList.concat(newFiles)
    .sort(function(a, b) {
      return strJs.compare(a.filename, b.filename);
    })
    .map(function(file, index) {
      file.index = index; // set index
      return file;
    });

  keywordList = getKeywordList();

  renderFileList();
}

window.addEventListener("dragover", preventDefault);
window.addEventListener("dragleave", preventDefault);
window.addEventListener("dragend", preventDefault);
window.addEventListener("drop", preventDefault);
window.addEventListener("drop", dropHandler);
inputElement.addEventListener("input", inputHandler);
buttonElement.addEventListener("click", buttonHandler);