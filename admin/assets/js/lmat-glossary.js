jQuery(document).ready(function($) {
    // Utility function to escape HTML entities for safe display
    function escapeHtml(text) {
        if (typeof text !== 'string') return text;
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    // Utility: Reset modal to initial state
    function resetImportModalUI() {
        $('#lmat-import-success-ui').addClass('lmat-hidden');
        $('#lmat-import-glossary-ui').show();
        $('#file-name-display').text('Select a CSV file to upload');
        $('#importing-file-name').text('');
        $('#lmat-csv-upload').val('');
    }

    // Cache selectors used multiple times
    let $glossaryTable = $('.lmat-glossary-table');
    const $languageFilters = $('.lmat-language-filters');
    const $alphabet = $('.lmat-alphabet');    
    const $addGlossaryForm = $('#lmat-add-glossary-form');
    const $addBtn = $('.lmat-add-btn');
    const $importBtn = $('.lmat-import-btn');

    // Open modal
    $addBtn.on('click', function() {
        $('#lmat-glossary-modal-add').removeClass('lmat-hidden').addClass('active');
        $('body').addClass('lmat-modal-open');
        $('.lmat-glossary-modal-content h2').show();
        // Reset add form and translations section
        $addGlossaryForm.find('.lmat-add-translations').removeClass('lmat-show').css('display', 'none');
        $addGlossaryForm.find('.lmat-translation-field').show();
        $addGlossaryForm[0].reset();
    });
    $importBtn.on('click', function() {
        resetImportModalUI();
        $('#lmat-glossary-modal-import').removeClass('lmat-hidden').addClass('active');
    });

    // Close modal & reset
    $(document).on('click', '.lmat-modal-close-btn, .lmat-glossary-modal-actions-left', function() {
        $('.lmat-glossary-modal-content h2').show();
        const modal = $(this).closest('.lmat-glossary-modal');
        const importSuccessUI = modal.find('#lmat-import-success-ui');
        if ((importSuccessUI.length && !importSuccessUI.hasClass('lmat-hidden') && importSuccessUI.is(':visible'))) {
            window.location.reload();
        }
        modal.addClass('lmat-hidden').removeClass('active');
        modal.find('form').show();
        modal.find('#add-glossary-success').addClass('lmat-hidden');

        $('body').removeClass('lmat-modal-open');
        resetImportModalUI();
    });

    // File input change
    $('#lmat-csv-upload').on('change', function(e) {
        const file = e.target.files[0];

        if (!file || !file.name.toLowerCase().endsWith('.csv')) {
            alert('Please upload a valid CSV file.');
            $(this).val('');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            const text = event.target.result;
            const lines = text.trim().split('\n');
            const headers = lines[0].split(',').map(h => h.trim());

            const data = lines.slice(1).map(line => {
                const values = line.split(',').map(v => v.trim());
                const obj = {};
                headers.forEach((header, i) => {
                    obj[header] = values[i] || '';
                });
                return obj;
            });
        };
        reader.readAsText(file);

        // If valid file:
        $('#file-name-display').text(file.name);
        $('#importing-file-name').text(file.name);

        // Automatically import as soon as file is selected
        const formData = new FormData();
        formData.append('action', 'lmat_import_glossary');
        formData.append('csv_file', file);
        formData.append('overwrite', false);
        formData.append('_wpnonce', lmat_glossary.import_glossary_validate);

        if (!$('.lmat-glossary-loader').length) {
            $('.lmat-glossary-modal-content').append('<div class="lmat-glossary-loader"><div class="lmat-glossary-loader-spinner"></div></div>');
        }
        $.ajax({
            url: lmat_glossary.ajaxurl,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(resp) {
                if (resp.success) {
                    // Remove loader
                   $('.lmat-glossary-loader').remove();
                    $('#lmat-import-glossary-ui').hide();
                    $('#lmat-import-success-ui').removeClass('lmat-hidden');
                } else {
                    alert('Import failed: ' + (resp.data || 'Unknown error'));
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('An error occurred while importing the glossary. Please try again.');
            }
        });
    });

    // Modify the download link click handler
    $('.lmat-download-link').off('click').on('click', function(e) {
        e.preventDefault();
        // CSV content matching your image
        const csvContent = [
            [
                'original_language_code',
                'target_language_code',
                'original_term',
                'translated_term',
                'description',
                'kind'
            ],
            ['en', 'it', 'Page', 'Pagina', 'the page of a browser', 'general'],
            ['en', 'it', 'page', 'pagina', 'the page of a browser', 'general'],
            ['en', 'it', 'OnTheGoSystems', 'OnTheGoSystems', 'the name of my company', 'name']
        ].map(row => row.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'sample-glossary.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    $(document).off('click', '.lmat-edit-btn, .lmat-edit-btn-svg').on('click', '.lmat-edit-btn, .lmat-edit-btn-svg', function(e) {
        e.preventDefault();
        e.stopPropagation();

        // Handle any existing edit rows first
        const $existingEditRow = $('.lmat-glossary-edit-row');
        if ($existingEditRow.length) {
            // Show the original row that was being edited
            $existingEditRow.prev('tr').show();
            // Remove the edit row
            $existingEditRow.remove();
        }

        // Find the row being edited
        const $row = $(this).closest('tr');
        const term = $row.data('term') || '';
        const desc = $row.find('.lmat-entry-desc').text().trim() || '';
        const type = $row.data('type') || 'general';
        const source_lang = $row.data('original-language') || '';

        // Validate required data
        if (!source_lang) {
            console.warn('Missing source language for row');
            return;
        }

        // Safely build translations object
        const translations = {};
        if (typeof lmat_glossary !== 'undefined' && Array.isArray(lmat_glossary.lmat_languages)) {
            lmat_glossary.lmat_languages.forEach(function(lang) {
            if (!lang || !lang.code || lang.code === source_lang) return;
            const $cell = $row.find(`td.lmat-lang-col-${lang.code}`);
            const $term = $cell.find('.lmat-translated-term');
                let value = '';
                if ($term.length) {
                    // Try to get full text from data attribute first
                    value = $term.data('full-text') || $term.attr('data-full-text') || $term.text().trim();
                }
                translations[lang.code] = typeof value === 'string' ? value : (value ? String(value) : '');
            });
        }

        const safeTerm = typeof term === 'string' ? term : '';
        const safeDesc = typeof desc === 'string' ? desc : '';
        const safeType = typeof type === 'string' ? type : 'general';
        const safeSourceLang = typeof source_lang === 'string' ? source_lang : '';

        try {
            const $templateScript = $('#lmat-glossary-edit-row-template');
            const templateHtml = $templateScript.length ? $templateScript.html() : '';

            if (!templateHtml) {
                console.error('Template not found or empty');
                alert('Edit template not found. Please refresh the page.');
                return;
            }

            const templateFn = _.template(templateHtml);
            const editRowHtml = templateFn({
                term: safeTerm,
                desc: safeDesc,
                type: safeType,
                translations: translations,
                languages: lmat_glossary.lmat_languages.filter(lang => lang.code !== safeSourceLang),
                source_lang: safeSourceLang
            });
            
            $row.after(editRowHtml);
            $row.hide();
            $row.next('.lmat-glossary-edit-row').show();
            
        } catch (error) {
            console.error('Error generating edit row:', error, {
                safeTerm,
                safeDesc,
                safeType,
                translations,
                safeSourceLang
            });
            alert('An error occurred while trying to edit this entry. Please try again.');
        }
    });


    // Add input event handler for real-time validation
    $glossaryTable.on('input', '.lmat-edit-translation, .lmat-edit-term, .lmat-edit-desc', function() {
        const $textarea = $(this);
        const $error = $textarea.next('.lmat-translation-error');
        const value = $textarea.val().trim();
        const maxLength = $textarea.hasClass('lmat-edit-term') || $textarea.hasClass('lmat-edit-desc') ? 240 : 220;
        
        if (value.length > maxLength) {
            $textarea.addClass('error');
            $error.text(`Must be less than ${maxLength} characters`).show();
        } else {
            $textarea.removeClass('error');
            $error.hide();
        }
    });

    // Update the save handler to include validation
    $('.lmat-glossary-table-wrapper').off('click', '.lmat-save-edit-btn').on('click', '.lmat-save-edit-btn', function(e) {
        e.preventDefault();
        const $editRow = $(this).closest('tr');
        const $origRow = $editRow.prev('tr');

        // Validate required fields
        const $termField = $editRow.find('.lmat-edit-term');
        const $descField = $editRow.find('.lmat-edit-desc');
        const term = $termField.val().trim();
        const desc = $descField.val().trim();
        const type = $editRow.find('.lmat-edit-type').val();
        const source_lang = $origRow.data('original-language');

        let hasError = false;

        // Add validation for term and description length
        if (term.length > 240) {
            $termField.addClass('error');
            $termField.next('.lmat-translation-error').text('Term must be less than 240 characters.').show();
            hasError = true;
        }

        if (desc.length > 240) {
            $descField.addClass('error');
            $descField.next('.lmat-translation-error').text('Description must be less than 240 characters.').show();
            hasError = true;
        }

        // Check translation lengths
        $editRow.find('.lmat-edit-translation').each(function() {
            const $textarea = $(this);
            const value = $textarea.val().trim();
            if (value.length > 240) {
                $textarea.addClass('error');
                $textarea.next('.lmat-translation-error').text('Translation must be less than 240 characters.').show();
                hasError = true;
            }
        });

        if (hasError) {
            return;
        }

        const translations = {};
        $editRow.find('.lmat-edit-translation').each(function() {
            const lang = $(this).data('lang');
            if (lang) {
                const value = $(this).val().trim();
                // Only include non-empty translations
                if (value !== '') {
                    translations[lang] = value;
                }
            }
        });


        // Modified AJAX request
        $.ajax({
            url: lmat_glossary.ajaxurl,
            type: 'POST',
            data: {
                action: 'lmat_update_glossary',
                _wpnonce: lmat_glossary.update_glossary_validate,
                data: {
                    term: term,
                    description: desc,
                    type: type,
                    source_lang: source_lang,
                    translations: translations,
                    original_term: $origRow.data('term'),
                    original_type: $origRow.data('type'),
                    original_source_lang: source_lang
                }
            },
            success: function(resp) {
                if (resp.success && resp.data && resp.data.updated_entry) {
                    const updatedEntry = resp.data.updated_entry;
                    
                    // Update the original row with data from server response
                    $origRow.data('term', updatedEntry.original_term);
                    $origRow.data('type', updatedEntry.kind);
                    
                    // Update term and description from server data
                    $origRow.find('.lmat-entry-title').text(updatedEntry.original_term);
                    $origRow.find('.lmat-entry-desc').text(updatedEntry.description || '');
                    
                    // Update type badge from server data
                    $origRow.find('.lmat-type-badge')
                        .attr('class', 'lmat-type-badge ' + updatedEntry.kind)
                        .text(updatedEntry.kind.charAt(0).toUpperCase() + updatedEntry.kind.slice(1));

                    // Update translations from server data
                    if (updatedEntry.translations && Array.isArray(updatedEntry.translations)) {
                        // Create a map of translations from server - only include non-empty translations
                        const serverTranslations = {};
                        updatedEntry.translations.forEach(function(translation) {
                            if (translation.target_language_code && 
                                translation.translated_term && 
                                translation.translated_term.trim() !== '') {
                                serverTranslations[translation.target_language_code] = translation.translated_term.trim();
                            }
                        });
                        
                        // Update all language columns based on server data
                        $origRow.find('[class*="lmat-lang-col-"]').each(function() {
                            const $cell = $(this);
                            const langCode = $cell.attr('class').match(/lmat-lang-col-([a-zA-Z_-]+)/);
                            
                            if (langCode && langCode[1] && !$cell.data('is-source')) {
                                const lang = langCode[1];
                                const translatedTerm = serverTranslations[lang];
                                
                                if (translatedTerm && translatedTerm.trim() !== '') {
                                    // Has translation - show it
                                    const truncatedText = translatedTerm.length > 7 ? translatedTerm.substring(0, 7) + '…' : translatedTerm;
                                    const safeTranslation = escapeHtml(translatedTerm);
                                    const safeTruncated = escapeHtml(truncatedText);
                                    
                                    $cell.html(`
                                        <span class="lmat-translated-term" 
                                              data-full-text="${safeTranslation}"
                                              title="${safeTranslation}">
                                            ${safeTruncated}
                                        </span>
                                    `);
                                } else {
                                    // No translation - show add button
                                    $cell.html(`
                                        <button type="button" class="lmat-edit-btn-svg" data-term="${escapeHtml(updatedEntry.original_term)}" data-source-lang="${escapeHtml(updatedEntry.original_language_code)}">
                                            <img src="${lmat_glossary.url}assets/images/file.svg" alt="Add Translation" />
                                        </button>
                                    `);
                                }
                            }
                        });
                    }

                    // Show the updated row and remove edit row
                    $origRow.show();
                    $editRow.remove();

                    // Reapply filters and update UI
                    filterGlossaryRows();
                    updateGlossaryTableVisibility();
                    updateAlphabetButtonStates();
                    applyZebraStriping();
                } else {
                    alert('Update failed: ' + (resp.data?.message || resp.data || 'Unknown error'));
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', status, error);
                alert('An error occurred while saving. Please try again.');
            }
        });
    });

    function applyZebraStriping() {
        $('.lmat-glossary-table tbody tr').removeClass('lmat-row-striped');
        $('.lmat-glossary-table tbody tr:visible:not(.lmat-glossary-edit-row)').each(function(i) {
            if (i % 2 === 1) {
                $(this).addClass('lmat-row-striped');
            }
        });
    }

    function updateGlossaryTableVisibility() {
        var $tableWrapper = $('.lmat-glossary-table-wrapper');
        var $table = $tableWrapper.find('.lmat-glossary-table');
        var $visibleRows = $table.find('tbody tr:visible');
        if ($visibleRows.length === 0) {
            $tableWrapper.hide();
            if ($('#lmat-no-results').length === 0) {
                $tableWrapper.after('<div id="lmat-no-results" style="text-align:center; margin: 32px 0; color: #888; font-size: 1.2em;">No glossary entries found.</div>');
            }
        } else {
            $tableWrapper.show();
            $('#lmat-no-results').remove();
        }
        applyZebraStriping();
    }

    function updateAlphabetButtonStates() {
        $alphabet.find('.lmat-alphabet-btn').prop('disabled', false);
        var visibleLetters = {};
        $glossaryTable.find('tbody tr:visible').each(function() {
            var letter = $(this).data('letter');
            if (letter) visibleLetters[letter] = true;
        });
        $alphabet.find('.lmat-alphabet-btn').each(function() {
            var $btn = $(this);
            var letter = $btn.data('letter');
            if (!visibleLetters[letter]) {
                $btn.prop('disabled', true);
                $btn.removeClass('active');
            }
        });

        // After updating the table and language filter buttons
        var $alphabetBtns = $('.lmat-alphabet-btn');
        var $visibleRows = $glossaryTable.find('tbody tr:visible');

        // If there are no visible rows, remove active state from all alphabet buttons
        if ($visibleRows.length === 0) {
            $alphabetBtns.removeClass('active');
        }
    }

    // Language Filter Buttons
    $(document).off('click', '.lmat-lang-filter-btn').on('click', '.lmat-lang-filter-btn', function() {
        $('.lmat-glossary-table-wrapper').show();
        $('#lmat-no-results').remove();
        // Reset alphabet filter
        $('.lmat-alphabet-btn').removeClass('active');

        var $btn = $(this);
        var selectedLang = $btn.data('lang');
        var $table = $('.lmat-glossary-table');
        var defaultLang = $table.data('default-lang');
        var previousSelectedLang = $('.lmat-lang-filter-btn.active').data('lang');

        // Update active state
        $('.lmat-lang-filter-btn').removeClass('active');
        $btn.addClass('active');

        // First show all columns
        $table.find('th[data-lang], td[data-lang]').show();

        // Show the previously hidden default language column
        if (defaultLang) {
            $table.find(`th[data-lang="${defaultLang}"], td[data-lang="${defaultLang}"]`).show();
        }

        // Hide the newly selected language column when it's the source
        if (selectedLang) {
            $table.find(`td[data-lang="${selectedLang}"][data-is-source="true"]`).hide();
            $table.find(`th[data-lang="${selectedLang}"]`).hide();
        }

        // Apply filters to rows
        $('.lmat-glossary-table tbody tr').each(function() {
            var $row = $(this);
            var rowOriginalLang = $row.data('original-language');
            var rowType = $row.data('type');
            var show = true;

            // Show row if it matches the selected language
            if (selectedLang) {
                show = (rowOriginalLang === selectedLang);
                
                if (show) {
                    // For visible rows, ensure correct column visibility
                    $row.find('td[data-lang]').each(function() {
                        var $cell = $(this);
                        var cellLang = $cell.data('lang');
                        var isSource = $cell.data('is-source') === true;
                        
                        // Hide if this is the source language column
                        if (cellLang === selectedLang && isSource) {
                            $cell.hide();
                        } else {
                            $cell.show();
                        }
                    });
                }
            }

            // Apply type filter if active
            var currentType = $('.lmat-glossary-type').val();
            if (show && currentType) {
                show = (rowType === currentType);
            }

            // Handle edit rows
            if ($row.hasClass('lmat-glossary-edit-row')) {
                show = $row.prev('tr').is(':visible');
            }

            $row.toggle(show);
        });

        updateGlossaryTableVisibility();
        updateAlphabetButtonStates();
        applyZebraStriping();
    });

    // Update filterGlossaryRows function
    function filterGlossaryRows() {
        var selectedLang = $('.lmat-lang-filter-btn.active').data('lang') || '';
        var selectedType = $('.lmat-glossary-type').val() || '';
        var selectedLetter = $('.lmat-alphabet-btn.active:not([disabled])').data('letter') || '';
        var search = $('.lmat-search').val().toLowerCase();

        $('.lmat-glossary-table tbody tr').each(function() {
            var $row = $(this);
            var rowOriginalLang = $row.data('original-language');
            var rowType = $row.data('type');
            var rowLetter = $row.data('letter');
            var term = $row.find('.lmat-entry-title').text().toLowerCase();
            var desc = $row.find('.lmat-entry-desc').text().toLowerCase();

            // Start with strict language filter
            var show = (!selectedLang || rowOriginalLang === selectedLang);

            // Apply other filters only if row passes language filter
            if (show && selectedType) {
                show = (rowType === selectedType);
            }

            if (show && selectedLetter) {
                show = (rowLetter === selectedLetter);
            }

            if (show && search) {
                show = (term.indexOf(search) !== -1 || desc.indexOf(search) !== -1);
            }

            // Handle edit rows visibility
            if ($row.hasClass('lmat-glossary-edit-row')) {
                show = $row.prev('tr').is(':visible');
            }

            $row.toggle(show);
        });

        updateGlossaryTableVisibility();
        applyZebraStriping();
    }

    // On page load, if filter buttons exist, trigger click on the first one
    if ($languageFilters.length && $languageFilters.find('.lmat-lang-filter-btn').length > 0) {
        $languageFilters.find('.lmat-lang-filter-btn').first().trigger('click');
    }

    // Alphabet filter functionality
    $(document).off('click', '.lmat-alphabet-btn:not([disabled])').on('click', '.lmat-alphabet-btn:not([disabled])', function() {
        var $btn = $(this);
        if ($btn.hasClass('active')) {
            $btn.removeClass('active');
        } else {
            $(document).find('.lmat-alphabet-btn').removeClass('active');
            $btn.addClass('active');
        }
        filterGlossaryRows();
        applyZebraStriping();
    });

    // Handle Delete in glossary table
    $(document).off('click', '.lmat-delete-btn').on('click', '.lmat-delete-btn', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (!confirm('Are you sure you want to delete this glossary entry?')) return;
        
        const $deleteBtn = $(this);
        const $row = $deleteBtn.closest('tr');
        const term = $row.data('term');
        const source_lang = $row.data('original-language');

        // Store original button content
        const originalContent = $deleteBtn.html();
        
        // Show loading state only on the delete button
        $deleteBtn.addClass('lmat-delete-loading');
        $deleteBtn.html('<div class="lmat-delete-spinner"></div>');
        $deleteBtn.prop('disabled', true);

        $.post(lmat_glossary.ajaxurl, {
            action: 'lmat_delete_glossary',
            _wpnonce: lmat_glossary.delete_glossary_validate,
            term: term,
            source_lang: source_lang
        }, function(resp) {
            if (resp.success) {
                $row.fadeOut(300, function() {
                    $(this).remove();

                    // After row removal, check if any rows are visible
                    var $visibleRows = $glossaryTable.find('tbody tr:visible');
                    if ($visibleRows.length === 0) {
                        var $langBtns = $('.lmat-lang-filter-btn');
                        var $activeBtn = $langBtns.filter('.active');
                        var idx = $langBtns.index($activeBtn);

                        // Remove the filter button for the language with no data
                        $activeBtn.remove();
                        $langBtns = $('.lmat-lang-filter-btn'); // Refresh after removal

                        // Disable and deactivate all alphabet buttons if no data
                        var $alphabetBtns = $('.lmat-alphabet-btn');
                        $alphabetBtns.removeClass('active').prop('disabled', true);

                        // Hide language filter if only one button remains
                        if ($langBtns.length <= 1) {
                            $('.lmat-language-filters').hide();
                        }

                        // After removal, $langBtns is refreshed
                        if ($langBtns.length > 0) {
                            // Try to activate the button at the same index (which is now the next one)
                            var newIdx = Math.min(idx, $langBtns.length - 1);
                            $langBtns.eq(newIdx).trigger('click');
                        } else {
                            updateGlossaryTableVisibility();
                        }
                    } else {
                        updateGlossaryTableVisibility();
                    }
                });
            } else {
                // Reset button state on error
                $deleteBtn.removeClass('lmat-delete-loading');
                $deleteBtn.html(originalContent);
                $deleteBtn.prop('disabled', false);
                alert('Delete failed: ' + (resp.data || 'Unknown error'));
            }
        }).fail(function() {
            // Reset button state on AJAX failure
            $deleteBtn.removeClass('lmat-delete-loading');
            $deleteBtn.html(originalContent);
            $deleteBtn.prop('disabled', false);
            alert('An error occurred while deleting. Please try again.');
        });
    });

    // Show/hide translations section based on required fields
    function toggleTranslationsSection($form) {
        var $translations = $form.find('.lmat-add-translations');
        var sourceLang = $form.find('.lmat-add-source-lang').val() || '';
        var term = $form.find('.lmat-add-term').val() || '';
        var type = $form.find('.lmat-add-type').val() || '';

        // Remove hidden class from all fields first
        $translations.find('.lmat-translation-field').removeClass('lmat-hidden');

        // Hide the translation field for the selected original language
        if (sourceLang) {
            $translations.find('.lmat-translation-field-' + sourceLang).addClass('lmat-hidden');
        }

        if (
            term.trim() !== '' &&
            type.trim() !== '' &&
            sourceLang.trim() !== ''
        ) {
            $translations.addClass('lmat-show').css('display', 'flex');
        } else {
            $translations.removeClass('lmat-show').css('display', 'none');
        }
    }

    // Attach event listeners to required fields
    $addGlossaryForm.on('input', '.lmat-add-term, .lmat-add-type, .lmat-add-source-lang', function() {
        toggleTranslationsSection($addGlossaryForm);
    });

    // Ensure correct state on page load
    $(function() {
        toggleTranslationsSection($addGlossaryForm);
    });

    // Add input event handler for translation fields in add form
    $addGlossaryForm.on('input', '.lmat-add-translation', function() {
        const $textarea = $(this);
        const $error = $textarea.next('.lmat-translation-error');
        const value = $textarea.val().trim();
        const maxLength = 240;
        
        if (value.length > maxLength) {
            $textarea.addClass('error');
            $error.text(`Must be less than ${maxLength} characters`).show();
        } else {
            $textarea.removeClass('error');
            $error.hide();
        }
    });

    // Add this helper function at the top of the file
    function sanitizeInput(input) {
        return input.replace(/[<>]/g, ''); // Remove < and > characters
    }

    // Update the add glossary form submission handler
    $addGlossaryForm.off('submit').on('submit', function(e) {
        e.preventDefault();
        const $form = $(this);
        
        const $termField = $form.find('.lmat-add-term');
        const $descField = $form.find('.lmat-add-desc');
        const term = sanitizeInput($termField.val().trim());
        const desc = sanitizeInput($descField.val().trim());
        
        let hasError = false;

        // Check for script tags or other potentially harmful content
        if ($termField.val().trim() !== term || $descField.val().trim() !== desc) {
            alert('Invalid input');
            hasError = true;
        }

        // Check term and description length
        if (term.length > 240) {
            $termField.addClass('error');
            $termField.next('.lmat-translation-error').text('Term must be less than 240 characters.').show();
            hasError = true;
        }
        
        if (desc.length > 240) {
            $descField.addClass('error');
            $descField.next('.lmat-translation-error').text('Description must be less than 240 characters.').show();
            hasError = true;
        }

        // Check translation lengths and sanitize
        $form.find('.lmat-add-translation').each(function() {
            const $textarea = $(this);
            const originalValue = $textarea.val().trim();
            const sanitizedValue = sanitizeInput(originalValue);
            
            if (originalValue !== sanitizedValue) {
                $textarea.addClass('error');
                $textarea.next('.lmat-translation-error').text('Invalid input').show();
                hasError = true;
            }
            
            if (sanitizedValue.length > 240) {
                $textarea.addClass('error');
                $textarea.next('.lmat-translation-error').text('Translation must be less than 240 characters.').show();
                hasError = true;
            }
        });

        if (hasError) {
            return;
        }

        // Check for duplicate in the table
        var duplicate = false;
        $('.lmat-glossary-table tbody tr').each(function() {
            var rowTerm = $(this).data('term');
            var rowLang = $(this).data('original-language');
            rowTerm = rowTerm && '' !== rowTerm ? String(rowTerm) : rowTerm;
            if (rowTerm && rowLang && rowTerm.trim().toLowerCase() === term.toLowerCase() && rowLang === $form.find('.lmat-add-source-lang').val()) {
                duplicate = true;
                return false; // break loop
            }
        });
        if (duplicate) {
            alert('This term already exists in this language.');
            return;
        }

        if (!$('.lmat-glossary-loader').length) {
            const translations = $('#lmat-add-glossary-form').find('.lmat-add-translations')
            translations.removeClass('lmat-show').css('display', 'none');
            $('.lmat-glossary-modal-content').append('<div class="lmat-glossary-loader"><div class="lmat-glossary-loader-spinner"></div></div>');
        }

        const data = {
            action: 'lmat_add_glossary',
            _wpnonce: lmat_glossary.add_glossary_validate,
            type: $form.find('.lmat-add-type').val(),
            term: term,
            description: desc,
            source_lang: $form.find('.lmat-add-source-lang').val(),
            translations: {}
        };
        (lmat_glossary.lmat_languages || []).forEach(function(lang) {
            const langCode = lang.code;
            if (langCode === data.source_lang) return;
            const translationValue = sanitizeInput($form.find('[name="translation_' + langCode + '"]').val().trim());
            // Only include non-empty translations
            if (translationValue !== '' && translationValue.trim() !== '') {
                data.translations[langCode] = translationValue;
            }
        });

        $.post(lmat_glossary.ajaxurl, data, function(resp) {
            $('.lmat-glossary-loader').remove();
            if (resp.success) {
                // Check if we have the added entry data from server
                if (resp.data && resp.data.added_entry) {
                $form.hide();
                $('.lmat-glossary-modal-content h2').hide();
                $('#add-glossary-success').removeClass('lmat-hidden');

                // Use the data returned from the server
                const addedEntry = resp.data.added_entry;
                const savedTerm = addedEntry.original_term;
                const savedDesc = addedEntry.description || '';
                const savedType = addedEntry.kind;
                const savedSourceLang = addedEntry.original_language_code;

                // Create a map of saved translations - only include non-empty translations
                const savedTranslations = {};
                if (addedEntry.translations && Array.isArray(addedEntry.translations)) {
                    addedEntry.translations.forEach(function(translation) {
                        if (translation.target_language_code && 
                            translation.translated_term && 
                            translation.translated_term.trim() !== '') {
                            savedTranslations[translation.target_language_code] = translation.translated_term.trim();
                        }
                    });
                }

                // Determine the previous state before adding the new entry
                const existingRows = $('.lmat-glossary-table tbody tr');
                const uniqueLanguagesBeforeAdd = new Set();
                existingRows.each(function() {
                    const lang = $(this).data('original-language');
                    if (lang) uniqueLanguagesBeforeAdd.add(lang);
                });
                const wasSingleLanguageMode = uniqueLanguagesBeforeAdd.size <= 1;
                
                // Determine if we're in single language mode after adding (like PHP logic)
                const uniqueLanguagesAfterAdd = new Set(uniqueLanguagesBeforeAdd);
                uniqueLanguagesAfterAdd.add(savedSourceLang);
                const singleLanguageMode = uniqueLanguagesAfterAdd.size === 1;
                const singleLanguageCode = singleLanguageMode ? savedSourceLang : '';

                // Initialize translationsHtml
                let translationsHtml = '';

                // Generate columns for languages, respecting single language mode
                lmat_glossary.lmat_languages.forEach(lang => {
                    const langCode = lang.code;
                    
                    // Skip source language column if in single language mode
                    if (singleLanguageMode && langCode === singleLanguageCode) {
                        return;
                    }
                    
                    if (langCode === savedSourceLang) {
                        // Source language - show the original term (only when not in single language mode)
                        const safeTerm = escapeHtml(savedTerm);
                        translationsHtml += `
                            <td colspan="2" class="lmat-lang-col-${langCode}" data-lang="${langCode}" data-is-source="true">
                                <span class="lmat-source-term">
                                    ${safeTerm}
                                </span>
                            </td>
                        `;
                    } else {
                        // Translation languages - check if we have a saved translation
                        const savedTranslation = savedTranslations[langCode];
                        
                        if (!savedTranslation || savedTranslation.trim() === '') {
                            // No translation - show add button
                            translationsHtml += `
                                <td colspan="2" class="lmat-lang-col-${langCode}" data-lang="${langCode}">
                                    <button type="button" class="lmat-edit-btn-svg" data-term="${escapeHtml(savedTerm)}" data-source-lang="${escapeHtml(savedSourceLang)}">
                                        <img src="${lmat_glossary.url}assets/images/file.svg" alt="Add Translation" />
                                    </button>
                                </td>
                            `;
                        } else {
                            // Has translation - show it
                            const truncatedText = savedTranslation.length > 7 ? savedTranslation.substring(0, 7) + '…' : savedTranslation;
                            const safeTranslation = escapeHtml(savedTranslation);
                            const safeTruncated = escapeHtml(truncatedText);
                            translationsHtml += `
                                <td colspan="2" class="lmat-lang-col-${langCode}" data-lang="${langCode}">
                                    <span class="lmat-translated-term" 
                                          data-full-text="${safeTranslation}"
                                          title="${safeTranslation}">
                                        ${safeTruncated}
                                    </span>
                                </td>
                            `;
                        }
                    }
                });

                const firstLetter = savedTerm ? (isNaN(savedTerm[0]) ? savedTerm[0].toUpperCase() : '123') : '';
                const safeTerm = escapeHtml(savedTerm);
                const safeDesc = escapeHtml(savedDesc);
                const safeType = escapeHtml(savedType);
                const safeSourceLang = escapeHtml(savedSourceLang);
                
                const newEntryHtml = `
                    <tr data-term="${safeTerm}" data-original-language="${safeSourceLang}" data-type="${safeType}" data-letter="${firstLetter}">
                        <td>
                            <div class="lmat-entry-title">${safeTerm}</div>
                            <div class="lmat-entry-desc">${safeDesc}</div>
                        </td>
                        <td>
                            <span class="lmat-type-badge ${safeType}">${safeType.charAt(0).toUpperCase() + safeType.slice(1)}</span>
                        </td>
                        ${translationsHtml}
                        <td class="lmat-actions-cell">
                            <div class="lmat-action-buttons">
                                <button type="button" class="lmat-edit-btn" data-term="${safeTerm}" data-source-lang="${safeSourceLang}">Edit</button>
                                <button type="button" class="lmat-delete-btn" data-term="${safeTerm}" data-source-lang="${safeSourceLang}">Delete</button>
                            </div>
                        </td>
                    </tr>
                `;

                // Only recreate headers when transitioning from single to multi-language mode OR when no table exists
                const needsHeaderUpdate = wasSingleLanguageMode && !singleLanguageMode;

                // If the table does not exist, create it with headers
                // OR if we're transitioning from single to multi-language mode, recreate headers
                if ($('.lmat-glossary-table').length === 0 || needsHeaderUpdate) {
                    
                    // Save existing table body if updating headers
                    let existingTbody = '';
                    if (needsHeaderUpdate) {
                        existingTbody = $('.lmat-glossary-table tbody').html();
                    }
                    
                    let tableHeader = `
                        <table class="lmat-glossary-table" data-default-lang="${savedSourceLang}">
                            <thead>
                                <tr>
                                    <th colspan="2"></th>
                                    ${lmat_glossary.lmat_languages.filter(lang => 
                                        !(singleLanguageMode && lang.code === singleLanguageCode)
                                    ).map(lang => 
                                        `<th colspan="2" title="${lang.alt}" class="lmat-lang-header lmat-lang-col-${lang.code}" data-lang="${lang.code}">
                                            ${lang.flag ? lang.flag : `<img src="${lang.img}" alt="${lang.alt}" />`}
                                        </th>`
                                    ).join('')}
                                    <th class="lmat-actions-cell">
                                        <div class="lmat-action-buttons-header">
                                            <button class="lmat-actions-header-btn" id="lmat-actions-header-btn-left" title="Scroll Left">
                                                <img src="${lmat_glossary.url}assets/images/arrow-left.svg" />
                                            </button>
                                            <button class="lmat-actions-header-btn" id="lmat-actions-header-btn-right" title="Scroll Right">
                                                <img src="${lmat_glossary.url}assets/images/arrow-right.svg" />
                                            </button>
                                        </div>
                                    </th>
                                </tr>
                                <tr>
                                    <th>Glossary Entry</th>
                                    <th>Type</th>
                                    ${lmat_glossary.lmat_languages.filter(lang => 
                                        !(singleLanguageMode && lang.code === singleLanguageCode)
                                    ).map(lang => 
                                        `<th colspan="2" data-lang="${lang.code}">${lang.alt}</th>`
                                    ).join('')}
                                    <th colspan="2">Actions</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    `;
                    $('.lmat-glossary-table-wrapper').html(tableHeader);
                    
                    // Apply current language filter column hiding to headers
                    const currentActiveLang = $('.lmat-lang-filter-btn.active').data('lang');
                    if (currentActiveLang) {
                        $('.lmat-glossary-table').find(`th[data-lang="${currentActiveLang}"]`).hide();
                    }
                    
                    // Restore existing table body if we were updating headers
                    if (needsHeaderUpdate && existingTbody) {
                        $('.lmat-glossary-table tbody').html(existingTbody);
                        
                        // Need to update all existing rows to match new column structure
                        $('.lmat-glossary-table tbody tr').each(function() {
                            const $row = $(this);
                            const rowOriginalLang = $row.data('original-language');
                            const rowTerm = $row.data('term');
                            
                            // Skip edit rows
                            if ($row.hasClass('lmat-glossary-edit-row')) return;
                            
                             // Get existing translation data - EXCLUDE source terms to prevent mixing
                             const existingTranslations = {};
                             $row.find('[class*="lmat-lang-col-"]').each(function() {
                                 const $cell = $(this);
                                 const langMatch = $cell.attr('class').match(/lmat-lang-col-([a-zA-Z_-]+)/);
                                 if (langMatch && langMatch[1]) {
                                     const langCode = langMatch[1];
                                     
                                     // Check if this cell contains a source term - DON'T extract source terms as translations
                                     const hasSourceTerm = $cell.find('.lmat-source-term').length > 0;
                                     const isSourceByData = $cell.data('is-source') === true || $cell.data('is-source') === 'true';
                                     
                                     // Only get actual translations, NOT source terms
                                    if (!hasSourceTerm && !isSourceByData) {
                                        const $translatedTerm = $cell.find('.lmat-translated-term');
                                        if ($translatedTerm.length) {
                                            let translation = $translatedTerm.data('full-text') || $translatedTerm.text().trim();

                                            if(translation){
                                                translation=translation.toString();
                                            }

                                            if (translation && typeof translation === 'string' && translation.trim() !== '') {
                                                existingTranslations[langCode] = translation.trim();
                                            }
                                        }
                                    }
                                 }
                             });
                            
                            // Rebuild row HTML with all language columns
                            let newTranslationsHtml = '';
                            lmat_glossary.lmat_languages.forEach(lang => {
                                const langCode = lang.code;
                                
                                // Skip source language column if in single language mode
                                if (singleLanguageMode && langCode === singleLanguageCode) {
                                    return;
                                }
                                
                                if (langCode === rowOriginalLang) {
                                    // Source language - show original term
                                    newTranslationsHtml += `
                                        <td colspan="2" class="lmat-lang-col-${langCode}" data-lang="${langCode}" data-is-source="true">
                                            <span class="lmat-source-term">
                                                ${escapeHtml(rowTerm)}
                                            </span>
                                        </td>
                                    `;
                                } else {
                                    // Translation language
                                    const existingTranslation = existingTranslations[langCode];
                                    if (existingTranslation && existingTranslation.trim() !== '') {
                                        // Has translation
                                        const truncatedText = existingTranslation.length > 7 ? existingTranslation.substring(0, 7) + '…' : existingTranslation;
                                        newTranslationsHtml += `
                                            <td colspan="2" class="lmat-lang-col-${langCode}" data-lang="${langCode}">
                                                <span class="lmat-translated-term" 
                                                      data-full-text="${escapeHtml(existingTranslation)}"
                                                      title="${escapeHtml(existingTranslation)}">
                                                    ${escapeHtml(truncatedText)}
                                                </span>
                                            </td>
                                        `;
                                    } else {
                                        // No translation - show add button
                                        newTranslationsHtml += `
                                            <td colspan="2" class="lmat-lang-col-${langCode}" data-lang="${langCode}">
                                                <button type="button" class="lmat-edit-btn-svg" data-term="${escapeHtml(rowTerm)}" data-source-lang="${escapeHtml(rowOriginalLang)}">
                                                    <img src="${lmat_glossary.url}assets/images/file.svg" alt="Add Translation" />
                                                </button>
                                            </td>
                                        `;
                                    }
                                }
                            });
                            
                            // Update the row HTML
                            const $termCell = $row.find('td:first');
                            const $typeCell = $row.find('td:nth-child(2)');
                            const $actionsCell = $row.find('.lmat-actions-cell');
                            
                            $row.html(`
                                ${$termCell[0].outerHTML}
                                ${$typeCell[0].outerHTML}
                                ${newTranslationsHtml}
                                ${$actionsCell[0].outerHTML}
                            `);
                        });
                        
                        // Apply current language filter column hiding to restored rows
                        const currentActiveLang = $('.lmat-lang-filter-btn.active').data('lang');
                        if (currentActiveLang) {
                            $('.lmat-glossary-table tbody tr').each(function() {
                                $(this).find(`td[data-lang="${currentActiveLang}"][data-is-source="true"]`).hide();
                            });
                        }
                    }
                }

                // Append the new entry to the glossary table
                $('.lmat-glossary-table tbody').append(newEntryHtml);

                // Apply current language filter column hiding to the new row
                const currentActiveLang = $('.lmat-lang-filter-btn.active').data('lang');
                if (currentActiveLang) {
                    const $newRow = $('.lmat-glossary-table tbody tr:last');
                    // Hide the source language column for the new row
                    $newRow.find(`td[data-lang="${currentActiveLang}"][data-is-source="true"]`).hide();
                }

                // Re-select the new table
                $glossaryTable = $('.lmat-glossary-table');

                // Update the UI (show table, remove no-results, apply zebra striping, etc.)
                $('.lmat-glossary-table').show();
                $('.lmat-glossary-table-wrapper').show();
                $('#lmat-no-results').remove();
                updateGlossaryTableVisibility();
                applyZebraStriping();

                // Update scroll button visibility
                updateScrollButtonVisibility();

                // Update language filter buttons, passing the saved language
                updateLanguageFilterButtons(savedSourceLang);

                // After adding, check if there are now two or more unique original languages and show filter bar if needed
                const $rows = $('.lmat-glossary-table tbody tr');
                const uniqueLangs = {};
                $rows.each(function() {
                    const lang = $(this).data('original-language');
                    if (lang) uniqueLangs[lang] = true;
                });
                const langCodes = Object.keys(uniqueLangs);
                const $filterBar = $('.lmat-language-filters');
                
                // Remember the currently active filter before recreating buttons
                const currentlyActiveLang = $('.lmat-lang-filter-btn.active').data('lang');
                
                if (langCodes.length > 1) {
                    // If filter bar is empty, create buttons for all unique languages
                    if ($filterBar.length === 0) {
                        // Insert filter bar after controls if not present
                        $('<div class="lmat-language-filters"></div>').insertAfter('.lmat-alphabet');
                    }
                    const $newFilterBar = $('.lmat-language-filters');
                    $newFilterBar.empty();
                    langCodes.forEach(function(code, i) {
                        const langObj = (lmat_glossary.lmat_languages || []).find(l => l.code === code);
                        const label = langObj ? (langObj.alt + ' Terms') : (code + ' Terms');
                        const flag = langObj && langObj.img ? `<img src="${langObj.img}" alt="${langObj.alt}" /> ` : '';
                        
                        // Preserve the currently active filter, or default to the newly added language if no active filter
                        const shouldBeActive = currentlyActiveLang === code || (!currentlyActiveLang && code === savedSourceLang);
                        
                        $newFilterBar.append(`
                            <button class="lmat-lang-filter-btn${shouldBeActive ? ' active' : ''}" data-lang="${code}">
                                ${flag}${label}
                            </button>
                        `);
                    });
                    $newFilterBar.show();
                } else {
                    // If only one language, hide filter bar
                    $filterBar.empty().hide();
                }

                // Reapply the current language filter to ensure the new entry is visible
                const activeLang = $('.lmat-lang-filter-btn.active').data('lang');
                if (activeLang) {
                    // Trigger the language filter click to properly apply column hiding
                    $('.lmat-lang-filter-btn.active').trigger('click');
                }
                // Update alphabet buttons
                updateAlphabetButtonStates();
                } else {
                    // Fallback: Success but no server data - use original method with request data
                    console.warn('Success but no server data returned, using fallback method');
                    $form.hide();
                    $('#add-glossary-success').removeClass('lmat-hidden');
                    // Could add fallback logic here if needed, or just show success
                }
            } else {
                alert(resp.data?.message || resp.data || 'Unknown error');
            }
        });
    });

    // Function to update language filter buttons
    function updateLanguageFilterButtons(originalLang) {
        if (!originalLang) return;

        const $filters = $('.lmat-language-filters');
        // Check if a button for this language already exists in the filter
        if ($filters.find('.lmat-lang-filter-btn[data-lang="' + originalLang + '"]').length === 0) {
            // Find the language object for label and flag
            let langObj = (lmat_glossary.lmat_languages || []).find(l => l.code === originalLang);
            let label = langObj ? (langObj.alt + ' Terms') : (originalLang + ' Terms');
            let flag = langObj && langObj.img ? `<img src="${langObj.img}" alt="${langObj.alt}" /> ` : '';

            $filters.append(`
                <button class="lmat-lang-filter-btn" data-lang="${originalLang}">
                    ${flag}${label}
                </button>
            `);
        }

        // After append, check total number of filter buttons
        const totalBtns = $filters.find('.lmat-lang-filter-btn').length;
        if (totalBtns <= 1) {
            // If only one, remove all (hide filter bar)
            $filters.empty();
        }
    }

    // Add close button handler for success message
    $('#add-glossary-success').on('click', '#lmat-glossary-success-close', function() {
        $('#lmat-glossary-modal-add').addClass('lmat-hidden').removeClass('active');
        $('#lmat-glossary-modal-add').find('form').show();
        $('#add-glossary-success').addClass('lmat-hidden');
    });

    // --- GLOSSARY SEARCH FUNCTIONALITY ---
    $(document).on('input', '.lmat-search', function() {
        const search = $(this).val().toLowerCase().trim();
        
        // First apply search filter
        $glossaryTable.find('tbody tr').each(function() {
            const $row = $(this);
            const term = $row.find('.lmat-entry-title').text().toLowerCase();
            const desc = $row.find('.lmat-entry-desc').text().toLowerCase();
            const showBySearch = !search || term.indexOf(search) !== -1 || desc.indexOf(search) !== -1;
            $row.toggle(showBySearch);
        });

        if (search !== '') {
            $('.lmat-glossary-table-wrapper').show();
            $('#lmat-no-results').remove();
        }else{
            $('.lmat-glossary-table-wrapper').show();
            $('#lmat-no-results').remove();
        }
        applyZebraStriping();
        filterGlossaryRows();
        // Update UI visibility
        updateGlossaryTableVisibility();
    });

    // --- GLOSSARY TYPE FILTER FUNCTIONALITY ---
    $(document).on('change', '.lmat-glossary-type', function() {
        var selectedType = $(this).val();   
        if (selectedType) {
            $('.lmat-glossary-table-wrapper').show();
            $('#lmat-no-results').remove();
        }
        filterGlossaryRows();
        applyZebraStriping();
    });

    // Export Glossary Button - Fix double download issue
    $(document).off('click', '.lmat-export-btn').on('click', '.lmat-export-btn', function(e) {
        e.preventDefault();
        e.stopPropagation(); // Prevent event bubbling
        
        // Create a temporary link to trigger the download
        var url = lmat_glossary.ajaxurl + '?action=lmat_export_glossary';
        url += '&_wpnonce=' + lmat_glossary.export_glossary_validate;
        var link = document.createElement('a');
        link.href = url;
        link.download = 'glossary-export.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });


    // Optionally, also close on "Cancel" in the modal
    $(document).on('click', '.lmat-glossary-modal-actions-left', function() {
        $(this).closest('.lmat-glossary-modal').addClass('lmat-hidden').removeClass('active');
    });

    // Add cancel edit handler
    $glossaryTable.on('click', '.lmat-cancel-edit-btn', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const $editRow = $(this).closest('tr.lmat-glossary-edit-row');
        const $originalRow = $editRow.prev('tr');
        
        $originalRow.show();
        $editRow.remove();
    });

    // Add this function after the existing functions
    function updateActionsHeaderVisibility() {
        const $tableWrapper = $('.lmat-glossary-table-wrapper');
        const $table = $tableWrapper.find('.lmat-glossary-table');
        const $actionsHeader = $('.lmat-actions-header-btn').closest('th');
        
        // Only proceed if the table exists
        if ($table.length === 0 || !$table[0]) {
            $actionsHeader.hide();
            return;
        }

        // Check if table has horizontal scroll
        const hasHorizontalScroll = $table[0].scrollWidth > $tableWrapper[0].clientWidth;
        
        // Show/hide actions header based on scroll
        $actionsHeader.toggle(hasHorizontalScroll);
    }

    // Initial check for actions header visibility
    updateActionsHeaderVisibility();
    
    // Update on window resize
    $(window).on('resize', _.debounce(function() {
        updateActionsHeaderVisibility();
    }, 250));
    
    // Update after any content changes that might affect table width
    const observer = new MutationObserver(_.debounce(function() {
        updateActionsHeaderVisibility();
    }, 250));
    
    // Observe the table wrapper for changes
    const $tableWrapper = $('.lmat-glossary-table-wrapper');
    if ($tableWrapper.length) {
        observer.observe($tableWrapper[0], {
            childList: true,
            subtree: true,
            attributes: true
        });
    }

    // Function to update button visibility based on scroll position
    function updateScrollButtonVisibility() {
        const $wrapper = $('.lmat-glossary-table-wrapper');
        
        // Check if wrapper exists
        if (!$wrapper.length) {
            return;
        }

        // Check if wrapper has content
        if (!$wrapper[0]) {
            return;
        }

        const scrollLeft = $wrapper.scrollLeft();
        const scrollWidth = $wrapper[0].scrollWidth;
        const clientWidth = $wrapper[0].clientWidth;

        // Hide left button if at the leftmost position
        if (scrollLeft === 0) {
            $('#lmat-actions-header-btn-left').css('visibility', 'hidden');
        } else {
            $('#lmat-actions-header-btn-left').css('visibility', 'visible');
        }

        if (scrollLeft + clientWidth >= scrollWidth) {
            $('#lmat-actions-header-btn-right').css('visibility', 'hidden'); // Use hide() to remove from layout
        } else {
            $('#lmat-actions-header-btn-right').css('visibility', 'visible'); // Use show() to display
        }
    
    }

    // Call this function on page load
    $(document).ready(function() {
        updateScrollButtonVisibility();
    });

    // Call this function after scrolling
    $glossaryTable.on('scroll', function() {
        updateScrollButtonVisibility();
    });

    // Scroll table to the right when actions header button is clicked
    $('.lmat-glossary-table-wrapper').off('click', '#lmat-actions-header-btn-right').on('click', '#lmat-actions-header-btn-right', function(e) {
        e.preventDefault();
        const $wrapper = $(this).closest('.lmat-glossary-table-wrapper');
        const scrollAmount = 300;
        $wrapper.animate({
            scrollLeft: $wrapper.scrollLeft() + scrollAmount
        }, 400, updateScrollButtonVisibility);
    });

    // Scroll table to the left when actions header button is clicked
    $('.lmat-glossary-table-wrapper').off('click', '#lmat-actions-header-btn-left').on('click', '#lmat-actions-header-btn-left', function(e) {
        e.preventDefault();
        const $wrapper = $(this).closest('.lmat-glossary-table-wrapper');
        const scrollAmount = 300;
            $wrapper.animate({
            scrollLeft: $wrapper.scrollLeft() - scrollAmount
        }, 400, updateScrollButtonVisibility);
    });

    // Close handler for import success message
    $(document).on('click', '.lmat-import-close-btn', function() {
        // Hide the import success UI
        $('#lmat-import-success-ui').addClass('lmat-hidden');
        // Optionally, also close the modal
        $('#lmat-glossary-modal-import').addClass('lmat-hidden');

        window.location.reload();
    });

    // Add input event handler for add form fields
    $addGlossaryForm.on('input', '.lmat-add-term, .lmat-add-desc', function() {
        const $textarea = $(this);
        const $error = $textarea.next('.lmat-translation-error');
        const value = $textarea.val().trim();
        const maxLength = 240;
        
        // Check for invalid characters (like script tags)
        if (value.includes('<') || value.includes('>')) {
            $textarea.addClass('error');
            $error.text('Invalid input').show();
            return; // Stop further validation for this field
        }

        if (value.length > maxLength) {
            $textarea.addClass('error');
            $error.text(`Must be less than ${maxLength} characters`).show();
        } else {
            $textarea.removeClass('error');
            $error.hide();
        }
    });

});
