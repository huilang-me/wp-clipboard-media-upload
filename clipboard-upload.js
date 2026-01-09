jQuery(function ($) {
    const i18n = ClipboardUpload.i18n;

    // --- 状态变量 ---
    let currentCropSize = null; 

    // 1. 注入提示文字
    function injectUploadHint() {
        const selectors = [
            '.media-frame-content .uploader-inline', 
            '.attachments-browser',
            '.upload-ui',
            '#drag-drop-area'
        ];

        $(selectors.join(', ')).each(function () {
            const $el = $(this);
            if (!$el.hasClass('wpcp-has-hint')) {
                const defaultText = i18n.hint; 
                // 使用翻译后的 title
                const $hint = $('<div class="wpcp-top-hint" title="' + i18n.setting_hint + '" style="cursor:pointer;">' + defaultText + '</div>');
                
                $el.prepend($hint);
                $el.addClass('wpcp-has-hint');
            }
        });
    }

    // --- 点击设置尺寸逻辑 ---
    $(document).on('click', '.wpcp-top-hint', function() {
        let defaultVal = "";
        if (currentCropSize) {
            defaultVal = currentCropSize.width + (currentCropSize.height ? "x" + currentCropSize.height : "");
        }

        // 使用翻译后的弹窗文字
        const input = prompt(
            i18n.prompt_title + "\n" + i18n.prompt_desc, 
            defaultVal
        );

        const $hints = $('.wpcp-top-hint');

        if (input) {
            let w = 0, h = 0;
            const cleanInput = input.trim().toLowerCase();

            if (cleanInput.indexOf('x') !== -1) {
                const parts = cleanInput.split('x');
                w = parseInt(parts[0]) || 0;
                h = parseInt(parts[1]) || 0;
            } else {
                w = parseInt(cleanInput) || 0;
                h = 0;
            }

            if (w > 0 || h > 0) {
                currentCropSize = { width: w, height: h };
                
                let statusText = "";
                if (w > 0 && h > 0) statusText = `${i18n.mode_crop}: ${w}x${h}`;
                else if (w > 0 && h === 0) statusText = `${i18n.mode_width}: ${w}px`;
                else if (w === 0 && h > 0) statusText = `${i18n.mode_height}: ${h}px`;

                $hints.html(`${i18n.hint} <span style="color:#d63638; font-weight:bold;">(${statusText})</span>`);
                return;
            }
        }
        
        currentCropSize = null;
        $hints.html(i18n.hint); 
    });

    const observer = new MutationObserver(injectUploadHint);
    observer.observe(document.body, { childList: true, subtree: true });
    injectUploadHint();

    // 2. 进度反馈
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

    // --- 图片处理逻辑 ---
    function cropImage(file, targetW, targetH) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(file);

            img.onload = () => {
                URL.revokeObjectURL(url);
                
                let finalW, finalH;
                let sourceX = 0, sourceY = 0, sourceW = img.width, sourceH = img.height;
                let drawW, drawH; 

                if (targetW > 0 && targetH > 0) {
                    finalW = targetW;
                    finalH = targetH;
                    drawW = targetW;
                    drawH = targetH;
                    const targetRatio = targetW / targetH;
                    const sourceRatio = img.width / img.height;
                    if (sourceRatio > targetRatio) {
                        sourceW = img.height * targetRatio;
                        sourceX = (img.width - sourceW) / 2;
                    } else {
                        sourceH = img.width / targetRatio;
                        sourceY = (img.height - sourceH) / 2;
                    }
                } else {
                    let scale = 1;
                    if (targetW > 0 && targetH === 0) {
                        if (img.width > targetW) scale = targetW / img.width;
                    } else if (targetW === 0 && targetH > 0) {
                        if (img.height > targetH) scale = targetH / img.height;
                    }

                    if (scale === 1) {
                        resolve(file); 
                        return;
                    }
                    finalW = Math.round(img.width * scale);
                    finalH = Math.round(img.height * scale);
                    sourceX = 0; sourceY = 0; sourceW = img.width; sourceH = img.height;
                    drawW = finalW; drawH = finalH;
                }

                const canvas = document.createElement('canvas');
                canvas.width = finalW;
                canvas.height = finalH;
                const ctx = canvas.getContext('2d');
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, 0, 0, drawW, drawH);

                canvas.toBlob((blob) => {
                    if (blob) resolve(blob); else resolve(file);
                }, file.type, 0.92);
            };
            img.onerror = () => { resolve(file); };
            img.src = url;
        });
    }

    // 3. 监听粘贴事件
    $(document).on('paste', function (event) {
        const $activeArea = $('.media-modal:visible .uploader-inline, .media-frame-content .uploader-inline, #drag-drop-area, .attachments-browser').filter(':visible').first();
        if ($activeArea.length === 0) return;

        const clipboardData = event.originalEvent.clipboardData;
        if (!clipboardData || !clipboardData.items) return;

        const imageItems = Array.from(clipboardData.items).filter(item => item.type.indexOf('image') !== -1);
        if (imageItems.length === 0) return;

        event.preventDefault();

        imageItems.forEach((item, index) => {
            const currentBatchIndex = index + 1; 

            const originalFile = item.getAsFile();
            if (!originalFile) return;

            let extension = item.type.split('/')[1] || 'png';
            if (extension === 'jpeg') extension = 'jpg';
            
            const fileName = "pasted-" + Date.now() + "-" + currentBatchIndex + "." + extension;
            
            const processPromise = currentCropSize 
                ? cropImage(originalFile, currentCropSize.width, currentCropSize.height) 
                : Promise.resolve(originalFile);

            processPromise.then((finalFile) => {
                // 使用翻译后的处理文字
                let actionText = '';
                if (currentCropSize) {
                    if (currentCropSize.width > 0 && currentCropSize.height > 0) actionText = i18n.cropping;
                    else actionText = i18n.scaling;
                }

                const feedback = createFeedbackItem(i18n.uploading + ` (${currentBatchIndex})${actionText}`);
                
                const formData = new FormData();
                formData.append('action', 'clipboard_image_upload');
                formData.append('nonce', ClipboardUpload.nonce);
                formData.append('file', finalFile, fileName); 

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
                                const percentComplete = (evt.loaded / evt.total) * 90;
                                feedback.update(percentComplete);
                            }
                        }, false);
                        return xhr;
                    },
                    success(response) {
                        if (response.success) {
                            feedback.update(100, i18n.success, 'success');
                            
                            if ($('#drag-drop-area').length > 0 && $('.media-frame').length === 0) {
                                const $uploadResult = $('#media-items');
                                if ($uploadResult.length > 0) {
                                    $uploadResult.removeClass('hide-if-no-js');
                                    const cleanName = fileName.replace(/\.[^/.]+$/, "");
                                    const itemHtml = `<div class="media-item child-of-0" id="media-item-${response.data.id}"><div class="media-item-wrapper"><div class="attachment-details"><img class="pinkynail" src="${response.data.url}" alt=""><div class="filename new"><span class="media-list-title"><strong>${cleanName}</strong></span><div class="attachment-tools"><a class="edit-attachment" href="${response.data.edit_url}" target="_blank">${wp.i18n.__('Edit')}</a></div></div></div></div></div>`;
                                    $(itemHtml).hide().prependTo($uploadResult).fadeIn(400);
                                }
                            }
                    
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
                            feedback.update(0, i18n.error + (response.data || ''), 'error');
                        }
                    },
                    error() {
                        feedback.update(0, i18n.net_error, 'error');
                    }
                });
            });
        });
    });
});