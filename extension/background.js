chrome.action.onClicked.addListener(async (tab) => {
  if (!tab?.id) return;
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });
  } catch (error) {
    console.error("Không thể inject content script", error);
    await chrome.tabs.sendMessage(tab.id, { type: "AUTO_FLOW_ERROR", error: String(error) }).catch(() => {});
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(null, (data) => {
    if (Object.keys(data).length === 0) {
      chrome.storage.sync.set({
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
    }
  });
});

