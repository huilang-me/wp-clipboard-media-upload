<?php
/**
 * Plugin Name: Clipboard Upload for Media Library
 * Plugin URI:  https://huilang.me/wp-clipboard-media-upload
 * Description: Allows users to paste images (Ctrl+V) directly into the Media Library, post editors, and the featured image modal. Supports EXIF cleaning and automatic selection.
 * Version:     1.0.0
 * Author:      Huilang
 * Author URI:  https://huilang.me
 * Text Domain: wp-clipboard-media-upload
 * Domain Path: /languages
 * License:     GPLv2 or later
 */

if ( ! defined( 'ABSPATH' ) ) exit;

class WP_Clipboard_Media_Upload {

    public function __construct() {
        // 加载语言包
        add_action( 'init', [ $this, 'load_textdomain' ] );
        add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
        add_action( 'wp_ajax_clipboard_image_upload', [ $this, 'handle_upload' ] );
    }

    public function load_textdomain() {
        load_plugin_textdomain( 'wp-clipboard-media-upload', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
    }

    public function enqueue_scripts( $hook ) {
        $allowed_hooks = [ 'upload.php', 'post.php', 'post-new.php', 'media-new.php' ];
        if ( ! in_array( $hook, $allowed_hooks ) ) return;

        wp_enqueue_style(
            'wp-clipboard-media-upload',
            plugin_dir_url( __FILE__ ) . 'clipboard-upload.css',
            [],
            '1.0.0'
        );
        wp_enqueue_script(
            'wp-clipboard-media-upload',
            plugin_dir_url( __FILE__ ) . 'clipboard-upload.js',
            [ 'jquery', 'wp-i18n' ],
            '1.0.0',
            true
        );

        // 使用 WordPress 原生 JS 翻译功能
        wp_localize_script('wp-clipboard-media-upload', 'ClipboardUpload', [
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce'    => wp_create_nonce('clipboard_upload_nonce'),
            'i18n'     => [
                'hint'    => __( 'Paste image here (Ctrl+V) to upload', 'wp-clipboard-media-upload' ),
                'hint_full' => __( 'Press Ctrl+V anywhere on this page to upload', 'wp-clipboard-media-upload' ),
                'uploading' => __( 'Uploading from clipboard...', 'wp-clipboard-media-upload' ),
                'success'   => __( 'Upload successful!', 'wp-clipboard-media-upload' ),
                'error'     => __( 'Upload failed: ', 'wp-clipboard-media-upload' ),
                'net_error' => __( 'Network or server error', 'wp-clipboard-media-upload' ),
            ]
        ]);
    }
    
    public function handle_upload() {
        check_ajax_referer('clipboard_upload_nonce', 'nonce');

        if ( ! current_user_can( 'upload_files' ) ) {
            wp_send_json_error( __( 'Permission denied.', 'wp-clipboard-media-upload' ) );
        }

        if ( empty($_FILES['file']) ) {
            wp_send_json_error( __( 'No file received.', 'wp-clipboard-media-upload' ) );
        }
        
        // 规范化文件名，防止恶意构造路径

        $_FILES['file']['name'] = sanitize_file_name($_FILES['file']['name']);
        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/media.php';
        require_once ABSPATH . 'wp-admin/includes/image.php';

        // 验证文件类型
        $file = $_FILES['file'];
        
        // 使用 wp_check_filetype 进行更安全的检查
        $file_info = wp_check_filetype($file['name']);
        $allowed_mimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

        // 检查 MIME 类型是否在允许列表中
        if ( ! in_array($file_info['type'], $allowed_mimes) ) {
            wp_send_json_error( __( 'Only image files (JPG, PNG, GIF, WEBP) are allowed.', 'wp-clipboard-media-upload' ) );
        }

        // 执行上传
        $attachment_id = media_handle_upload('file', 0);

        if ( is_wp_error($attachment_id) ) {
            wp_send_json_error($attachment_id->get_error_message());
        }

        // 清洗 EXIF 并保存
        $full_path = get_attached_file($attachment_id);
        $editor = wp_get_image_editor($full_path);
        if ( ! is_wp_error($editor) ) {
            // 这步会根据原文件后缀名自动保存为对应格式
            $editor->save($full_path);
        }

        wp_send_json_success([
            'id'       => $attachment_id,
            'url'      => wp_get_attachment_url($attachment_id),
            'edit_url' => admin_url('post.php?post=' . $attachment_id . '&action=edit')
        ]);
    }
}

new WP_Clipboard_Media_Upload();