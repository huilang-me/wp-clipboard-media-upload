# Clipboard Upload for Media Library (剪贴板媒体上传助手)

> [English Version](#english) | [中文版本](#chinese)

---

<a name="english"></a>

## 🇬🇧 English Version

**Clipboard Upload for Media Library** is a professional tool to streamline your WordPress media workflow. Skip the "Save-Search-Upload" cycle—simply copy any image and paste it directly into your site.

### ✨ Key Features

* **🚀 Instant Paste**: Press `Ctrl+V` (or `Cmd+V`) in the Media Library, Post Editor, or Featured Image modal.
* **🎨 On-the-Fly Processing**: **(New!)** Click the top hint to set custom rules:
* **Center Crop**: e.g., `300x300` to square your image instantly.
* **Smart Scaling**: Limit max width (e.g., `800`) or height to optimize file size before upload.


* **✅ Auto-Selection**: Uploaded images are automatically selected in the media modal for one-click insertion.
* **🛡️ Privacy Protection**: Automatically strips EXIF/Metadata (GPS, Camera info) to keep your data safe.
* **📊 Queue & Progress**: Supports bulk pasting with a stacked real-time progress notification system.
* **🖼️ Full Format Support**: JPG, PNG, GIF, and WEBP.

### 📖 Usage Guide

1. **Basic Upload**: Just press `Ctrl+V` on any media-related page.
2. **Set Rules**: Click the **red hint text** at the top of the page.
* Enter `300x300` for a center crop.
* Enter `1200` to ensure no image exceeds 1200px width.
* Leave empty to upload the original file.


3. **Bulk Paste**: You can copy multiple images (from local folders) and paste them; the plugin will queue them automatically.

---

<a name="chinese"></a>

## 🇨🇳 中文版本

**剪贴板媒体上传助手 (Clipboard Upload for Media Library)** 是一款为专业创作者设计的媒体流优化工具。它消除了“保存-查找-上传”的繁琐步骤，让你能够直接将剪贴板中的图片“秒传”到 WordPress。

### ✨ 核心功能

* **🚀 粘贴即上传**: 支持在媒体库、文章编辑器、特色图片弹窗等位置按 `Ctrl+V` 直接上传。
* **🎨 实时图像处理**: **(新功能!)** 点击页面顶部提示可开启即时处理模式：
* **中心裁剪**: 输入如 `300x300`，上传前自动将图片裁切为正方形。
* **等比缩放**: 设置限宽（如 `800`）或限高，在浏览器端完成压缩，节省服务器空间。


* **✅ 智能自动选中**: 在特色图片弹窗上传后，插件会自动勾选该图片，点击确认即可。
* **🛡️ 隐私保护**: 自动清洗图片 EXIF/元数据（屏蔽 GPS 位置、拍摄器材等信息）。
* **📊 队列管理**: 支持多图批量粘贴，内置优雅的堆叠式进度条，状态清晰可见。
* **🌐 原生体验**: 完美支持中英文，UI 设计贴合 WordPress 原生风格。

### 📖 使用指南

1. **基础上传**: 在任何媒体管理页面直接粘贴即可。
2. **设置规则**: 点击页面顶部**红色文字提示**。
* 输入 `400x300`：执行中心裁剪。
* 输入 `1000`：限制最大宽度为 1000px，高度自动按比例缩小。
* 留空或取消：恢复原始尺寸上传。


3. **批量粘贴**: 支持同时复制多个本地文件并粘贴，插件会依次自动处理上传队列。

---

## ⚙️ Technical Details / 技术细节

* **Frontend**: Built with vanilla JS and jQuery. Uses HTML5 `Canvas` for client-side image processing to reduce server load.
* **Backend**: Securely handles uploads via `media_handle_upload` and enforces strict MIME-type validation.
* **Privacy**: Leverages `WP_Image_Editor` to ensure processed images are clean of sensitive metadata.

## 📄 License / 开源协议

This project is licensed under the [GPLv2 or later](https://www.gnu.org/licenses/gpl-2.0.html).

## 👤 Author / 作者

**Huilang** - **Website**: [huilang.me](https://huilang.me)

* **Plugin URI**: [https://huilang.me/wp-clipboard-media-upload/](https://huilang.me/wp-clipboard-media-upload/)