jQuery(function ($) {
    const i18n = ClipboardUpload.i18n;

    // 1. 注入提示文字
    function injectUploadHint() {
        const selectors = [
            '.media-frame-content .uploader-inline', 
            '.attachments-browser',
            '#drag-drop-area',
            '.moxie-shim + .upload-ui' 
        ];

        $(selectors.join(', ')).each(function () {
            const $el = $(this);
            if (!$el.hasClass('wpcp-has-hint')) {
                const $hint = $('<div class="wpcp-top-hint">' + i18n.hint + '</div>');
                $el.prepend($hint);
                $el.addClass('wpcp-has-hint');
            }
        });
    }

    const observer = new MutationObserver(injectUploadHint);
    observer.observe(document.body, { childList: true, subtree: true });
    injectUploadHint();

    // 2. 改进的进度反馈：支持多实例
    function createFeedbackItem(message) {
        let $container = $('#wpcp-feedback-container');
        if ($container.length === 0) {
            $container = $('<div id="wpcp-feedback-container"></div>').appendTo('body');
        }

        const $item = $(`
            <div class="wpcp-feedback-item">
                <div class="wpcp-feedback-content wpcp-type-info">
                    <div class="wpcp-msg">${message}</div>
                    <div class="wpcp-bar-bg"><div class="wpcp-bar" style="width: 10%"></div></div>
                </div>
            </div>
        `).appendTo($container);

        return {
            update: (percent, msg, type = 'info') => {
                const $content = $item.find('.wpcp-feedback-content');
                $content.removeClass('wpcp-type-error wpcp-type-success wpcp-type-info').addClass('wpcp-type-' + type);
                $item.find('.wpcp-bar').css('width', Math.max(5, percent) + '%');
                if (msg) $item.find('.wpcp-msg').text(msg);
                
                if (percent === 100 || type === 'error') {
                    setTimeout(() => {
                        $item.fadeOut(400, function() { $(this).remove(); });
                    }, 3000);
                }
            }
        };
    }

    // 3. 监听粘贴事件
    $(document).on('paste', function (event) {
        const $activeArea = $('.media-modal:visible .uploader-inline, .media-frame-content .uploader-inline, #drag-drop-area, .attachments-browser').filter(':visible').first();
        if ($activeArea.length === 0) return;

        const clipboardData = event.originalEvent.clipboardData;
        if (!clipboardData || !clipboardData.items) return;

        // 遍历所有剪贴板项（处理多图粘贴）
        for (let i = 0; i < clipboardData.items.length; i++) {
            const item = clipboardData.items[i];
            if (item.type.indexOf('image') === -1) continue;

            event.preventDefault();
            
            const file = item.getAsFile();
            let extension = item.type.split('/')[1] || 'png';
            if (extension === 'jpeg') extension = 'jpg';
            const fileName = "pasted-" + Date.now() + "-" + i + "." + extension;
            
            // 为每个文件创建独立的进度条
            const feedback = createFeedbackItem(i18n.uploading + ` (${i+1})`);
            
            const formData = new FormData();
            formData.append('action', 'clipboard_image_upload');
            formData.append('nonce', ClipboardUpload.nonce);
            formData.append('file', file, fileName);

            $.ajax({
                url: ClipboardUpload.ajax_url,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                xhr: function() {
                    const xhr = new window.XMLHttpRequest();
                    xhr.upload.addEventListener("progress", function(evt) {
                        if (evt.lengthComputable) {
                            const percentComplete = (evt.loaded / evt.total) * 90; // 留10%给服务器处理
                            feedback.update(percentComplete);
                        }
                    }, false);
                    return xhr;
                },
                success(response) {
                    if (response.success) {
                        feedback.update(100, i18n.success, 'success');
                        
                        // 逻辑：独立媒体页刷新
                        if ($('#drag-drop-area').length > 0 && $('.media-frame').length === 0) {
                            const $uploadResult = $('#media-items');
                            if ($uploadResult.length > 0) {
                                $uploadResult.removeClass('hide-if-no-js');
                                const itemHtml = `<div class="media-item child-of-0" id="media-item-${response.data.id}"><div class="media-item-wrapper"><div class="attachment-details"><img class="pinkynail" src="${response.data.url}" alt=""><div class="filename new"><span class="media-list-title"><strong>${fileName.split('.')[0]}</strong></span><div class="attachment-tools"><a class="edit-attachment" href="${response.data.edit_url}" target="_blank">${wp.i18n.__('Edit')}</a></div></div></div></div></div>`;
                                $(itemHtml).hide().prependTo($uploadResult).fadeIn(400);
                            }
                        }
                
                        // 逻辑：媒体库弹窗刷新
                        if (window.wp && wp.media) {
                            const frame = wp.media.frame;
                            if (frame) {
                                const attachment = wp.media.model.Attachment.get(response.data.id);
                                attachment.fetch().done(function() {
                                    if (frame.content.mode() === 'upload') frame.content.mode('browse');
                                    const state = frame.state();
                                    const library = state.get('library');
                                    if (library) library.add(attachment, { at: 0 });
                                    const selection = state.get('selection');
                                    if (selection) selection.add(attachment);
                                });
                            }
                        }
                    } else {
                        feedback.update(0, i18n.error + response.data, 'error');
                    }
                },
                error() {
                    feedback.update(0, i18n.net_error, 'error');
                }
            });
        }
    });
});