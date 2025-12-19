jQuery(function ($) {
    const i18n = ClipboardUpload.i18n;

    function injectUploadHint() {
        $('.media-frame-content .uploader-inline:not(.has-clipboard-hint)').each(function () {
            applyStyle($(this), i18n.hint);
        });

        $('#drag-drop-area:not(.has-clipboard-hint)').each(function () {
            applyStyle($(this), i18n.hint_full);
        });
    }

    function applyStyle($el, text) {
        const $hint = $('<div class="clipboard-upload-hint">' + text + '</div>');
        $el.prepend($hint);
        $el.addClass('has-clipboard-hint');
    }

    const observer = new MutationObserver(injectUploadHint);
    observer.observe(document.body, { childList: true, subtree: true });
    injectUploadHint();

    function updateFeedback($area, percent, message, type = 'info') {
        let $wrap = $area.find('.clipboard-feedback-wrap');
        if ($wrap.length === 0) {
            $wrap = $('<div class="clipboard-feedback-wrap"><div class="cb-bar-bg"><div class="cb-bar"></div></div><div class="cb-msg"></div></div>').appendTo($area);
        }

        $wrap.find('.cb-bar').css('width', Math.max(0, percent) + '%');
        
        // 根据状态切换颜色类或直接设置颜色
        const color = type === 'error' ? '#e74c3c' : (type === 'success' ? '#46c46c' : '#333');
        $wrap.find('.cb-msg').text(message).css('color', color);

        if (percent === 100 || type === 'error') {
            setTimeout(() => $wrap.fadeOut(400, function() { $(this).remove(); }), 3000);
        }
    }

    $(document).on('paste', function (event) {
        const $activeArea = $('.media-modal:visible .uploader-inline, .media-frame-content .uploader-inline, #drag-drop-area').filter(':visible').first();
        if ($activeArea.length === 0) return;

        const clipboardData = event.originalEvent.clipboardData;
        if (!clipboardData || !clipboardData.items) return;

        for (let i = 0; i < clipboardData.items.length; i++) {
            const item = clipboardData.items[i];
            if (item.type.indexOf('image') === -1) continue;

            event.preventDefault();
            
            const file = item.getAsFile();
            
            // 获取扩展名：从 "image/jpeg" 提取 "jpeg"，从 "image/png" 提取 "png"
            let extension = item.type.split('/')[1] || 'png';
            // 规范化 jpg 扩展名
            if (extension === 'jpeg') extension = 'jpg';
            
            const fileName = "pasted-" + Date.now() + "." + extension;
            
            const formData = new FormData();
            formData.append('action', 'clipboard_image_upload');
            formData.append('nonce', ClipboardUpload.nonce);
            // 使用动态生成的文件名
            formData.append('file', file, fileName);

            updateFeedback($activeArea, 10, i18n.uploading);

            $.ajax({
                url: ClipboardUpload.ajax_url,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success(response) {
                    if (response.success) {
                        updateFeedback($activeArea, 100, i18n.success, 'success');
                        
                        if ($('#drag-drop-area').length > 0) {
                             window.location.href = response.data.edit_url;
                             return;
                        }

                        if (window.wp && wp.media && wp.media.frame) {
                            const attachment = wp.media.model.Attachment.get(response.data.id);
                            attachment.fetch().done(function() {
                                let frame = wp.media.frame;
                                const library = frame.state().get('library');
                                if (library) library.add(attachment, { at: 0 });
                                const selection = frame.state().get('selection');
                                if (selection) selection.add(attachment);
                            });
                        }
                    } else {
                        updateFeedback($activeArea, 0, i18n.error + response.data, 'error');
                    }
                },
                error() {
                    updateFeedback($activeArea, 0, i18n.net_error, 'error');
                }
            });
        }
    });
});