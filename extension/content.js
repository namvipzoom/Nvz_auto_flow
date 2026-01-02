/* global chrome */
const DEFAULT_TIMEOUT = 15000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitFor(selector, timeout = DEFAULT_TIMEOUT) {
  const start = performance.now();
  while (performance.now() - start < timeout) {
    const element = document.querySelector(selector);
    if (element) return element;
    await sleep(200);
  }
  throw new Error(`Không tìm thấy selector: ${selector}`);
}

async function clickElement(el) {
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  await sleep(100);
  el.click();
}

async function setInputValue(el, value) {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(el.__proto__, "value")?.set;
  nativeInputValueSetter?.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

async function runAutoFlow(config) {
  const { prompts, ratio, waitTime, autoDownload, selectors } = config;

  const promptBox = await waitFor(selectors.promptBox);
  const addButton = await waitFor(selectors.addButton);
  const startButton = await waitFor(selectors.startButton);
  const ratioSelect = selectors.ratioSelect ? document.querySelector(selectors.ratioSelect) : null;
  const waitTimeInput = selectors.waitTimeInput ? document.querySelector(selectors.waitTimeInput) : null;
  const autoDownloadCheckbox = selectors.autoDownloadCheckbox ? document.querySelector(selectors.autoDownloadCheckbox) : null;

  if (ratioSelect && ratio) {
    await setInputValue(ratioSelect, ratio);
  }
  if (waitTimeInput && Number.isFinite(waitTime)) {
    await setInputValue(waitTimeInput, waitTime);
  }
  if (autoDownloadCheckbox && autoDownload !== undefined) {
    const shouldCheck = Boolean(autoDownload);
    if (autoDownloadCheckbox.checked !== shouldCheck) {
      await clickElement(autoDownloadCheckbox);
    }
  }

  for (const prompt of prompts) {
    await setInputValue(promptBox, prompt);
    await clickElement(addButton);
    await sleep(150);
  }

  await clickElement(startButton);

  if (selectors.statusContainer) {
    const statusEl = await waitFor(selectors.statusContainer, 10000).catch(() => null);
    if (statusEl) {
      const observer = new MutationObserver(() => {
        const text = statusEl.innerText || "";
        if (/Ready|Done|Complete/i.test(text)) {
          console.log("Auto Flow: quá trình render đã hoàn tất hoặc quay về trạng thái sẵn sàng.");
          observer.disconnect();
        }
      });
      observer.observe(statusEl, { childList: true, subtree: true, characterData: true });
    }
  }
}

async function main() {
  try {
    const config = await chrome.storage.sync.get({
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

    if (!Array.isArray(config.prompts) || config.prompts.length === 0) {
      throw new Error("Danh sách prompt trống. Hãy thêm prompt trong trang Options của extension.");
    }

    await runAutoFlow(config);
  } catch (error) {
    console.error("Auto Flow gặp lỗi:", error);
    chrome.runtime.sendMessage({ type: "AUTO_FLOW_ERROR", error: String(error) }).catch(() => {});
    alert(`Auto Flow gặp lỗi: ${error.message || error}`);
  }
}

main();

