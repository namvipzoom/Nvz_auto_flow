/* global chrome */
const statusEl = document.getElementById("status");
const promptsEl = document.getElementById("prompts");
const ratioEl = document.getElementById("ratio");
const waitTimeEl = document.getElementById("waitTime");
const autoDownloadEl = document.getElementById("autoDownload");
const selectorInputs = {
  promptBox: document.getElementById("selector-prompt"),
  addButton: document.getElementById("selector-add"),
  startButton: document.getElementById("selector-start"),
  ratioSelect: document.getElementById("selector-ratio"),
  waitTimeInput: document.getElementById("selector-wait"),
  autoDownloadCheckbox: document.getElementById("selector-auto"),
  statusContainer: document.getElementById("selector-status"),
};

function showStatus(message, type = "info") {
  statusEl.textContent = message;
  statusEl.dataset.type = type;
  if (message) {
    setTimeout(() => {
      statusEl.textContent = "";
      delete statusEl.dataset.type;
    }, 2000);
  }
}

function populateSelectors(selectors) {
  Object.entries(selectorInputs).forEach(([key, input]) => {
    input.value = selectors?.[key] || "";
  });
}

function parsePrompts(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

async function restore() {
  const data = await chrome.storage.sync.get({
    prompts: ["Nhập prompt của bạn ở đây"],
    ratio: "16:9",
    waitTime: 60,
    autoDownload: true,
    selectors: {
      promptBox: "textarea[data-testid='prompt-input']",
      addButton: "button:contains('Add'), button.add",
      startButton: "button:contains('START'), button.start",
      ratioSelect: "select#ratio",
      waitTimeInput: "input#waitTime",
      autoDownloadCheckbox: "input#autoDownload",
      statusContainer: ".log-window, .status",
    },
  });

  promptsEl.value = data.prompts.join("\n");
  ratioEl.value = data.ratio || "";
  waitTimeEl.value = data.waitTime ?? "";
  autoDownloadEl.checked = Boolean(data.autoDownload);
  populateSelectors(data.selectors);
}

async function save() {
  const prompts = parsePrompts(promptsEl.value);
  if (prompts.length === 0) {
    showStatus("Hãy nhập ít nhất 1 prompt", "error");
    return;
  }

  const selectors = {};
  Object.entries(selectorInputs).forEach(([key, input]) => {
    if (input.value.trim()) selectors[key] = input.value.trim();
  });

  const payload = {
    prompts,
    ratio: ratioEl.value.trim() || "",
    waitTime: Number(waitTimeEl.value) || 0,
    autoDownload: autoDownloadEl.checked,
    selectors,
  };

  await chrome.storage.sync.set(payload);
  showStatus("Đã lưu", "success");
}

document.getElementById("save").addEventListener("click", save);
restore();
