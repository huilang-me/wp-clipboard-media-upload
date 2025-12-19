=== Clipboard Upload for Media Library ===
Contributors: huilang
Tags: media, upload, clipboard, paste, images
Requires at least: 5.0
Tested up to: 6.9
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Paste images from your clipboard directly into the WordPress Media Library. Seamlessly upload screenshots and copied images using Ctrl+V.

== Description ==

Stop the tedious "Save Image As..." and "Upload" workflow. **Clipboard Upload for Media Library** streamlines your content creation process by allowing you to paste images directly into WordPress.

Whether you are using a screenshot tool, copying an image from the web, or using a design tool like Figma or Photoshop, you can now simply press `Ctrl+V` (or `Cmd+V` on Mac) to instantly upload and attach images to your site.

**Key Features:**

* **Instant Paste-to-Upload:** Works in the Media Library (Grid view) and "Add New" screen.
* **Modal Support:** Full support for the "Featured Image" and "Insert Media" modals.
* **Privacy-Friendly (EXIF Cleaning):** Automatically strips sensitive EXIF metadata (like GPS location) from pasted images.
* **Smart Auto-Selection:** The pasted image is automatically uploaded, processed, and selected in the media modal.
* **User Feedback:** Includes a native-looking progress bar and success notifications.

== Installation ==

1. Upload the `wp-clipboard-media-upload` folder to the `/wp-content/plugins/` directory.
2. Activate the plugin through the 'Plugins' menu in WordPress.
3. Go to the Media Library or any post editor and press `Ctrl+V` to start uploading.

== Frequently Asked Questions ==

= Does it support multiple images at once? =
Currently, it supports pasting one image at a time from the clipboard.

= Does it work with the Gutenberg editor? =
Yes, it works within the media modals and featured image sections of the block editor.

== Screenshots ==

1. The paste hint in the Media Library grid view.
2. The upload progress bar when an image is pasted.

== Changelog ==

= 1.0.0 =
* Initial release.
* Support for Media Library and Featured Image modals.
* EXIF data cleaning for privacy.