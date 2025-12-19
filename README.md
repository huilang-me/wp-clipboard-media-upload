# Clipboard Upload for Media Library (剪贴板媒体上传助手)

[![WordPress Version](https://img.shields.io/badge/WordPress-5.0+-21759b.svg)](https://wordpress.org/)
[![License](https://img.shields.io/badge/License-GPLv2-green.svg)](https://www.gnu.org/licenses/gpl-2.0.html)

> [English Version](#english) | [中文版本](#chinese)

---

<a name="english"></a>
## 🇬🇧 English Version

**Clipboard Upload for Media Library** is a lightweight yet powerful WordPress plugin designed to streamline your media upload workflow. Stop the tedious cycle of "Save Image -> Find Folder -> Drag & Drop". Just copy an image from any source and paste it directly into your WordPress backend.

### ✨ Key Features
- **🚀 Paste to Upload**: Supports `Ctrl+V` (or `Cmd+V`) in the Media Library, Post Editor, and Featured Image modal.
- **✅ Smart Auto-Selection**: Automatically selects the uploaded image in the media modal—one click to set as featured image.
- **🛡️ Privacy First**: Automatically strips EXIF/Metadata (GPS, camera info) upon upload to protect your privacy.
- **📊 Real-time Feedback**: Includes a stylish progress bar and status notifications.
- **🖼️ Modern Formats**: Full support for JPG, PNG, GIF, and WEBP.
- **🌐 Fully Translatable**: Built-in support for English and Chinese.

### 🛠️ Installation
1. **Download**: Download the latest ZIP from the [Releases](../../releases) page.
2. **Upload**: In your WordPress admin, go to **Plugins > Add New > Upload Plugin** and select the ZIP file.
3. **Activate**: Click **Activate** and you are ready to go!

### 📖 Usage Guide
- **Media Library**: Go to the Grid View and press `Ctrl+V` anywhere.
- **Featured Image**: Click "Set featured image" and paste inside the pop-up modal.
- **Native Upload Page**: Paste on the `/wp-admin/media-new.php` page; it will redirect to the edit screen after a successful upload.

---

<a name="chinese"></a>
## 🇨🇳 中文版本

**剪贴板媒体上传助手 (Clipboard Upload for Media Library)** 是一款极简且高效的 WordPress 插件。它旨在彻底优化您的媒体上传流程，终结“保存图片 -> 寻找文件夹 -> 拖拽上传”的繁琐步骤。无论图片来自截图、设计软件还是网页，直接粘贴即可上传。

### ✨ 核心功能
- **🚀 粘贴即上传**: 支持在媒体库列表、文章编辑器、特色图片弹窗等位置直接按 `Ctrl+V` (或 `Cmd+V`) 上传。
- **✅ 智能自动选中**: 在“设置特色图片”弹窗上传后，插件会自动勾选该图片，点击确认即可，一气呵成。
- **🛡️ 隐私保护**: 上传时自动清洗图片的 EXIF/元数据（如地理位置、拍摄设备信息），保护您的隐私安全。
- **📊 实时进度**: 内置优雅的进度条与状态提示，上传过程清晰可见。
- **🖼️ 格式支持**: 完美支持 JPG, PNG, GIF 以及现代化的 WEBP 格式。
- **🌐 双语支持**: 原生内置中英文语言包，完美适配中文环境。

### 🛠️ 安装方法
1. **下载**: 从 GitHub 的 [Releases](../../releases) 页面下载最新的 ZIP 压缩包。
2. **上传**: 在 WordPress 后台，前往 **插件 > 安装插件 > 上传插件**，选择该 ZIP 文件。
3. **启用**: 点击 **启用** 插件即可开始使用。

### 📖 使用指南
- **媒体库**: 进入媒体库网格视图，在页面任意位置粘贴即可。
- **特色图片**: 点击文章右侧的“设置特色图片”，在弹出的窗口中直接粘贴。
- **原生上传页**: 在 `/wp-admin/media-new.php` 页面粘贴，上传成功后会自动跳转至该图片的编辑页面。

---

## ⚙️ Technical Details / 技术细节
- **Frontend**: Uses `MutationObserver` to ensure the paste listener attaches even to dynamically loaded modals.
- **Backend**: Uses `media_handle_upload` for secure processing and `WP_Image_Editor` for metadata stripping.

## 📄 License / 开源协议
This project is licensed under the [GPLv2 or later](https://www.gnu.org/licenses/gpl-2.0.html).

## 👤 Author / 作者
**Huilang**
- **Website**: [huilang.me](https://huilang.me)
- **Plugin URI**: [https://huilang.me/wp-clipboard-media-upload/](https://huilang.me/wp-clipboard-media-upload/)