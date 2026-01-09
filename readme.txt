=== Clipboard Upload for Media Library ===
Contributors: huilang
Tags: media, upload, clipboard, paste, images, crop, resize
Requires at least: 5.0
Tested up to: 6.9
Stable tag: 1.0.3
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Paste images from your clipboard directly into the WordPress Media Library. Seamlessly upload, crop, and resize screenshots using Ctrl+V.

== Description ==

Stop the tedious "Save Image As..." and "Upload" workflow. **Clipboard Upload for Media Library** streamlines your content creation process by allowing you to paste images directly into WordPress.

Whether you are using a screenshot tool, copying an image from the web, or using a design tool like Figma or Photoshop, you can now simply press `Ctrl+V` (or `Cmd+V` on Mac) to instantly upload and attach images to your site.

**Key Features:**

* **Instant Paste-to-Upload:** Works in the Media Library (Grid view), "Add New" screen, and featured image modals.
* **Smart Image Processing (New):** Set rules to automatically crop or resize images upon pasting (e.g., center crop to 300x300, or limit max width).
* **Batch Uploading:** Support for pasting and uploading multiple images simultaneously with individual progress tracking.
* **Privacy-Friendly (EXIF Cleaning):** Automatically strips sensitive EXIF metadata (like GPS location) from pasted images.
* **Smart Auto-Selection:** The pasted image is automatically uploaded, processed, and selected in the media modal.
* **Elegant Feedback:** Native-style floating notifications and multi-task progress bars.

== Installation ==

1. Upload the `wp-clipboard-media-upload` folder to the `/wp-content/plugins/` directory.
2. Activate the plugin through the 'Plugins' menu in WordPress.
3. Go to the Media Library or any post editor and press `Ctrl+V` to start uploading.
4. Click the floating hint at the top to set custom crop/resize rules.

== Frequently Asked Questions ==

= Does it support multiple images at once? =
Yes, as of version 1.0.2, you can paste multiple images simultaneously, and each will have its own progress bar.

= How do I set the crop or resize size? =
Simply click the red "Paste image here..." hint at the top of the media page. You can enter values like '300x300' for cropping or '800' for limiting width.

= Does it work with the Gutenberg editor? =
Yes, it works within the media modals and featured image sections of the block editor.

== Screenshots ==

1. The paste hint and crop settings interface.
2. Multi-image upload progress bars in action.

== Changelog ==

= 1.0.3 =
* **Feature Update:** Added client-side image processing.
* **Feature Update:** Support for center cropping and proportional scaling (Max Width/Height).
* **I18n:** Improved multilingual support for all interactive elements.

= 1.0.2 =
* **UI/UX:** Added support for multi-image simultaneous pasting.
* **UI/UX:** Implemented a stacked feedback system with independent progress bars for each upload.

= 1.0.1 =
* **Improvement:** Major UI/UX overhaul for better integration with WordPress admin styles.
* **Code Quality:** Refactored JavaScript for better performance and standard compliance.

= 1.0.0 =
* Initial release.
* Support for Media Library and Featured Image modals.
* EXIF data cleaning for privacy.