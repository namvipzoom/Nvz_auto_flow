# NVZ Auto Flow Chrome Extension

Extension Manifest V3 giúp tự động điền prompt và kích hoạt render video trên Google Flow.

## Thư mục
- `extension/manifest.json`: cấu hình extension.
- `extension/background.js`: service worker inject `content.js` khi click icon extension.
- `extension/content.js`: script chạy trên trang Google Flow, đọc cấu hình từ `chrome.storage.sync`, điền prompt, bật Auto Download, set Ratio/Wait Time và bấm START.
- `extension/options.html|js|styles.css`: trang cấu hình (chrome-extension://.../options.html) cho phép nhập danh sách prompt, tỷ lệ, thời gian chờ và tuỳ chỉnh selector nếu DOM đổi.

## Cách cài đặt & sử dụng
1. Mở Chrome → `chrome://extensions` → bật **Developer mode**.
2. Chọn **Load unpacked** và trỏ tới thư mục `extension/` trong repo này.
3. Mở trang Google Flow (đúng domain đã khai báo trong `host_permissions`).
4. Bấm icon extension (hoặc gán phím tắt trong Chrome) để tự động điền queue và bấm START.
5. Nếu DOM trang khác selector mặc định, mở `Options` của extension để chỉnh.

## Cấu hình mặc định
- Prompts mẫu: `"Nhập prompt của bạn ở đây"`
- Ratio: `16:9`
- Wait Time: `60` giây
- Auto Download: bật
- Selector mặc định:
  - Prompt: `textarea[data-testid='prompt-input']`
  - Nút Add: `button:contains('Add'), button.add`
  - Nút START: `button:contains('START'), button.start`
  - Ratio: `select#ratio`
  - Wait Time: `input#waitTime`
  - Auto Download: `input#autoDownload`
- Vùng trạng thái: `.log-window, .status`

## Xuất gói extension (.zip)
Bạn có thể đóng gói thư mục `extension/` thành file zip để cài đặt hoặc chia sẻ:

```bash
./package_extension.sh
```

Script sẽ tạo thư mục `dist/` (nếu chưa có) và sinh file `auto-flow-extension.zip` chứa toàn bộ nội dung trong `extension/`.

## Lưu ý
- Chỉnh `host_permissions` trong `manifest.json` đúng domain Google Flow thực tế.
- Nếu cần nhiều prompt, nhập mỗi dòng một prompt trong Options; content script sẽ thêm lần lượt rồi bấm START.
- Quan sát console DevTools để xem log “Auto Flow” hoặc thông báo lỗi alert.
