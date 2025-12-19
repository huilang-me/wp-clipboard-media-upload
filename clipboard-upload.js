jQuery(function ($) {
    const i18n = ClipboardUpload.i18n;

    // 1. 注入提示文字
    function injectUploadHint() {
        // 匹配：1. 媒体库弹窗上传页 2. 独立媒体上传页 3. 文章内各种上传区域
        const selectors = [
            '.media-frame-content .uploader-inline', 
            '.attachments-browser',
            '#drag-drop-area',
            '.moxie-shim + .upload-ui' 
        ];

        $(selectors.join(', ')).each(function () {
            const $el = $(this);
            // 使用前缀 wpcp-has-hint 防止重复注入
            if (!$el.hasClass('wpcp-has-hint')) {
                const $hint = $('<div class="wpcp-top-hint">' + i18n.hint + '</div>');
                $el.prepend($hint);
                $el.addClass('wpcp-has-hint');
            }
        });
    }

    // 持续监听 DOM 变化以应对异步打开的弹窗
    const observer = new MutationObserver(injectUploadHint);
    observer.observe(document.body, { childList: true, subtree: true });
    injectUploadHint();

    // 2. 上传进度反馈
    function updateFeedback($area, percent, message, type = 'info') {
        let $wrap = $('#wpcp-feedback-wrap');
        if ($wrap.length === 0) {
            $wrap = $(`
                <div id="wpcp-feedback-wrap">
                    <div class="wpcp-feedback-content">
                        <div class="wpcp-msg"></div>
                        <div class="wpcp-bar-bg"><div class="wpcp-bar"></div></div>
                    </div>
                </div>
            `).appendTo('body');
        }

        const $bar = $wrap.find('.wpcp-bar');
        const $msg = $wrap.find('.wpcp-msg');
        const $content = $wrap.find('.wpcp-feedback-content');
        
        $wrap.show();
        $bar.css('width', Math.max(5, percent) + '%');
        // 状态类名也加上前缀
        $content.removeClass('wpcp-type-error wpcp-type-success wpcp-type-info')
                .addClass('wpcp-type-' + type);
        $msg.text(message);

        if (percent === 100 || type === 'error') {
            setTimeout(() => {
                $wrap.fadeOut(400, function() { $(this).remove(); });
            }, 3000);
        }
    }

    // 3. 监听粘贴事件
    $(document).on('paste', function (event) {
        const $activeArea = $('.media-modal:visible .uploader-inline, .media-frame-content .uploader-inline, #drag-drop-area, .attachments-browser').filter(':visible').first();
        
        if ($activeArea.length === 0) return;

        const clipboardData = event.originalEvent.clipboardData;
        if (!clipboardData || !clipboardData.items) return;

        for (let i = 0; i < clipboardData.items.length; i++) {
            const item = clipboardData.items[i];
            if (item.type.indexOf('image') === -1) continue;

            event.preventDefault();
            
            const file = item.getAsFile();
            let extension = item.type.split('/')[1] || 'png';
            if (extension === 'jpeg') extension = 'jpg';
            const fileName = "pasted-" + Date.now() + "." + extension;
            
            const formData = new FormData();
            formData.append('action', 'clipboard_image_upload');
            formData.append('nonce', ClipboardUpload.nonce);
            formData.append('file', file, fileName);

            updateFeedback($activeArea, 10, i18n.uploading, 'info');

            $.ajax({
                url: ClipboardUpload.ajax_url,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success(response) {
                    if (response.success) {
                        updateFeedback($activeArea, 100, i18n.success, 'success');
                        
                        // 逻辑：如果是独立媒体页
                        if ($('#drag-drop-area').length > 0 && $('.media-frame').length === 0) {
                            const $uploadResult = $('#media-items');
                            if ($uploadResult.length > 0) {
                                $uploadResult.removeClass('hide-if-no-js');
                                const itemHtml = `<div class="media-item child-of-0" id="media-item-${response.data.id}"><div class="media-item-wrapper"><div class="attachment-details"><img class="pinkynail" src="${response.data.url}" alt=""><div class="filename new"><span class="media-list-title"><strong>${fileName.split('.')[0]}</strong></span><div class="attachment-tools"><a class="edit-attachment" href="${response.data.edit_url}" target="_blank">${wp.i18n.__('Edit')}</a></div></div></div></div></div>`;
                                const $newItem = $(itemHtml).hide();
                                $uploadResult.prepend($newItem);
                                $newItem.fadeIn(400);
                                $(document).trigger('ready'); 
                            }
                        }
                
                        // 逻辑：如果是媒体库弹窗
                        if (window.wp && wp.media) {
                            const frame = wp.media.frame;
                            if (frame) {
                                const attachment = wp.media.model.Attachment.get(response.data.id);
                                attachment.fetch().done(function() {
                                    if (frame.content.mode() === 'upload') {
                                        frame.content.mode('browse');
                                    }
                                    const state = frame.state();
                                    const library = state.get('library');
                                    if (library) {
                                        library.add(attachment, { at: 0 });
                                    }
                                    const selection = state.get('selection');
                                    if (selection) {
                                        selection.add(attachment);
                                    }
                                });
                            }
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