<?php

if(!isset($languages) && !is_array($languages) && empty($languages)){
    $languages = [];
}

$glossary_data = get_option('lmat_glossary_data', []);

if (!is_array($glossary_data)) {
    $glossary_data = [];
}

$text_domain = 'linguator-multilingual-ai-translation';


// Build a map for quick lookup by code
$language_map = [];
foreach ($languages as $lang) {
    $language_map[$lang['code']] = $lang;
}

$supported_languages = array_keys($language_map);
$grouped_entries = [];

foreach ($glossary_data as $entry) {
    $term = $entry['original_term'];
    $lang = $entry['original_language_code'];
    $key = $term . '||' . $lang; // Composite key

    if($lang && !in_array($lang, $supported_languages)){
        continue;
    }

    if (!isset($grouped_entries[$key])) {
        $grouped_entries[$key] = [
            'term' => $term,
            'original_language_code' => $lang,
            'desc' => $entry['description'],
            'type' => $entry['kind'],
            'type_label' => ucfirst($entry['kind']),
            'translations' => [],
        ];
    }

    if (!empty($entry['translations']) && is_array($entry['translations'])) {
        foreach ($entry['translations'] as $translation) {
            if (
                $translation['target_language_code'] !== $lang &&
                !empty($translation['translated_term']) &&
                trim($translation['translated_term']) !== ''
            ) {
                $grouped_entries[$key]['translations'][$translation['target_language_code']] = trim($translation['translated_term']);
            }
        }
    }
}

// Sort glossary entries alphabetically by term (case-insensitive)
uksort($grouped_entries, 'strnatcasecmp');

// Collect unique original_language_codes and their counts
$language_codes = [];
foreach ($glossary_data as $entry) {
    if (!empty($entry['original_language_code'])) {
        $code = $entry['original_language_code'];
        if (!isset($language_codes[$code])) {
            $language_codes[$code] = 0;
        }
        $language_codes[$code]++;
    }
}
$unique_language_codes = array_keys($language_codes);

// Compute the unique original language code
$unique_original_language_code = '';
if (count($unique_language_codes) === 1) {
    $unique_original_language_code = reset($unique_language_codes);
}

// Add this for default selected language (first in the list)
$default_selected_lang = $unique_language_codes[0] ?? '';

// --- ADD THIS BLOCK ---
$term_original_lang = [];
foreach ($glossary_data as $entry) {
    $term = $entry['original_term'];
    $lang = $entry['original_language_code'];

    // Initialize as array if not already
    if (!isset($term_original_lang[$term])) {
        $term_original_lang[$term] = [];
    }

    // Add only if not already present
    if (!in_array($lang, $term_original_lang[$term])) {
        $term_original_lang[$term][] = $lang;
    }
}
// --- END ADD ---

// Count how many languages have entries
$language_codes_with_entries = [];
foreach ($grouped_entries as $entry) {
    $code = $entry['original_language_code'];
    if (!in_array($code, $language_codes_with_entries, true)) {
        $language_codes_with_entries[] = $code;
    }
}
$single_language_mode = count($language_codes_with_entries) === 1;
$single_language_code = $single_language_mode ? $language_codes_with_entries[0] : '';
?>

<style>
<?php foreach ($languages as $lang): 
    $code = esc_attr($lang['code']);
?>
.lmat-glossary-table.lmat-hide-lang-<?php echo $code; ?> th[data-lang="<?php echo $code; ?>"],
.lmat-glossary-table.lmat-hide-lang-<?php echo $code; ?> td[data-lang="<?php echo $code; ?>"] {
    display: none !important;
}
<?php endforeach; ?>
</style>

<div class="lmat-glossary">
    <div class="lmat-glossary-container">
        <?php wp_nonce_field('lmat_glossary_nonce', 'lmat_glossary_nonce'); ?>
        <header class="lmat-header">
            <h1><?php esc_html_e('Glossary', $text_domain); ?></h1>
            <p><?php esc_html_e('Define how you want to translate – or not translate – important words and phrases.', $text_domain); ?></p>
            <ul>
                <li><?php esc_html_e('Specific translations you want to use;', $text_domain); ?></li>
                <li><?php esc_html_e('Terms you want to exclude from being translated;', $text_domain); ?></li>
                <li><?php esc_html_e('Additional context for each term.', $text_domain); ?></li>
            </ul>
            <a href="<?php echo esc_url( 'https://linguator.com/docs/add-glossary-feature-linguator/?utm_source=lmat_plugin&utm_medium=inside&utm_campaign=docs&utm_content=glossary_management_free' ); ?>" target="_blank"><?php esc_html_e('Learn more about adding and managing glossary terms.', $text_domain); ?></a>
        </header>

        <div class="lmat-controls">
            <input type="text" class="lmat-search" placeholder="<?php esc_attr_e('Search', $text_domain); ?>" />

            <select class="lmat-glossary-type" name="glossary_type">
                <option value=""><?php esc_html_e('Glossary Type', $text_domain); ?></option>
                <option value="name"><?php esc_html_e('Name', $text_domain); ?></option>
                <option value="general"><?php esc_html_e('General', $text_domain); ?></option>
            </select>

            <button class="lmat-add-btn button button-primary">
                <?php esc_html_e('Add glossary entry', $text_domain); ?>
            </button>
            <button class="lmat-import-btn button button-primary">
                <?php esc_html_e('Import glossary', $text_domain); ?>
            </button>
            <button class="lmat-export-btn button button-primary">
                <?php esc_html_e('Export glossary', $text_domain); ?>
            </button>

            <!-- Modal -->
            <div id="lmat-glossary-modal-add" class="lmat-glossary-modal lmat-hidden">
                <div class="lmat-glossary-modal-content-wrapper">
                    <button type="button" class="lmat-modal-close-btn" aria-label="Close">&times;</button>
                    <div class="lmat-glossary-modal-content">
                        <h2><?php esc_html_e('Add New Glossary Term', $text_domain); ?></h2>
                        <form id="lmat-add-glossary-form">
                            <label for="lmat-add-term"><?php esc_html_e('Term', $text_domain); ?></label>
                            <textarea id="lmat-add-term" name="term" class="lmat-add-term" required placeholder="<?php esc_attr_e('Enter the term to be translated', $text_domain); ?>"></textarea>
                            <div class="lmat-translation-error"></div>

                            <label for="lmat-add-desc"><?php esc_html_e('Description', $text_domain); ?></label>
                            <textarea id="lmat-add-desc" name="description" class="lmat-add-desc" rows="3" placeholder="<?php esc_attr_e('Add a description to provide context for translators', $text_domain); ?>"></textarea>
                            <div class="lmat-translation-error"></div>

                            <label for="lmat-add-source-lang"><?php esc_html_e('Original Language', $text_domain); ?></label>
                            <select id="lmat-add-source-lang" name="source_lang" class="lmat-add-source-lang" required>
                                <option value=""><?php esc_html_e('Select language', $text_domain); ?></option>
                                <?php foreach ($languages as $lang): ?>
                                    <option value="<?php echo esc_attr($lang['code']); ?>">
                                        <?php echo esc_html($lang['alt']); ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>

                            <label for="lmat-add-type"><?php esc_html_e('Type', $text_domain); ?></label>
                            <select id="lmat-add-type" name="type" class="lmat-add-type" required>
                                <option value="general"><?php esc_html_e('General', $text_domain); ?></option>
                                <option value="name"><?php esc_html_e('Name', $text_domain); ?></option>
                            </select>
                            <div class="lmat-add-translations lmat-translations-grid">
                                <?php foreach ($languages as $lang): ?>
                                    <div class="lmat-translation-field lmat-translation-field-<?php echo esc_attr($lang['code']); ?>">
                                        <label>
                                            <div class="lmat-translation-label-row">
                                                <?php if (!empty($lang['img'])): ?>
                                                    <img src="<?php echo esc_attr($lang['img']); ?>" alt="<?php echo esc_attr($lang['alt']); ?>" class="lmat-lang-flag">
                                                <?php endif; ?>
                                                <span class="lmat-lang-name"><?php echo esc_html($lang['alt']); ?></span>
                                                <span class="lmat-lang-translation-label"><?php esc_html_e('Translation', $text_domain); ?></span>
                                            </div>
                                            <textarea name="translation_<?php echo esc_attr($lang['code']); ?>" class="lmat-add-translation" rows="2" placeholder="<?php esc_attr_e('Custom Translation', $text_domain); ?>"></textarea>
                                            <div class="lmat-translation-error"><?php esc_html_e('Too long, must be less than 240 characters', $text_domain); ?></div>
                                        </label>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                            <div class="lmat-glossary-modal-actions" style="margin-top: 18px;">
                                <span class="lmat-glossary-modal-actions-left" style="cursor:pointer;"><?php esc_html_e('Cancel', $text_domain); ?></span>
                                <button type="submit" id="add-glossary-term-btn"  class="button button-primary"><?php esc_html_e('Add Term', $text_domain); ?></button>
                            </div>
                        </form>
                        <div id="add-glossary-success" class="lmat-import-success lmat-hidden">
                            <div class="import-success-icon">
                                <img src="<?php echo plugins_url('assets/images/success.svg', LINGUATOR_ROOT_FILE); ?>" alt="Success Icon" />
                            </div>
                            <div class="lmat-import-success-message">
                                <?php esc_html_e('Glossary term added successfully!', $text_domain); ?>
                            </div>
                            <button id="lmat-glossary-success-close" class="lmat-close-button" type="button"><?php esc_html_e('Close', $text_domain); ?></button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- End Modal -->

            <div id="lmat-glossary-modal-import" class="lmat-glossary-modal lmat-hidden">
                <div class="lmat-glossary-modal-content-wrapper">
                    <button type="button" class="lmat-modal-close-btn" aria-label="Close">&times;</button>
                    <div class="lmat-glossary-modal-content">
                        <div class="lmat-import-glossary" id="lmat-import-glossary-ui">
                            <h2 class="lmat-title"><?php esc_html_e( 'Import glossary', $text_domain ); ?></h2>

                            <label class="lmat-upload-box" id="upload-label">
                                <input type="file" accept=".csv" id="lmat-csv-upload" hidden>
                                <div class="lmat-upload-area">
                                    <img src="<?php echo plugins_url('assets/images/csv.svg', LINGUATOR_ROOT_FILE); ?>" alt="CSV Icon" />
                                    <span id="file-name-display"><?php esc_html_e( 'Select a CSV file to upload', $text_domain ); ?></span>
                                </div>
                            </label>
                            <a
                                href="<?php echo esc_url( plugins_url('assets/sample-glossary.csv', LINGUATOR_ROOT_FILE) ); ?>"
                                class="lmat-download-link"
                                download="sample-glossary.csv">
                                <?php esc_html_e( 'Download sample glossary CSV file', $text_domain ); ?>
                            </a>
                        </div>
                        <!-- Success UI (hidden by default) -->
                        <div id="lmat-import-success-ui" class="lmat-hidden">
                            <div id="lmat-import-success" class="lmat-import-success">
                                <div class="import-success-icon">
                                    <img src="<?php echo plugins_url('assets/images/success.svg', LINGUATOR_ROOT_FILE); ?>" alt="Success Icon" />
                                </div>
                                <div class="import-success-file">
                                    <span id="importing-file-label"><?php esc_html_e('Importing:', $text_domain); ?></span>
                                    <span id="importing-file-name"></span>
                                </div>
                                <div class="lmat-import-success-message">
                                    <?php esc_html_e('Glossary terms imported successfully', $text_domain); ?>
                                </div>
                                <button class="lmat-import-close-btn lmat-close-button" type="button">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <nav class="lmat-alphabet" aria-label="<?php esc_attr_e('Glossary Alphabet Navigation', $text_domain); ?>">
            <?php
            $alphabet = array_merge(['123'], range('A', 'Z'), ['#&à']);

            // Build a set of enabled letters based on $glossary_data
            $enabled_letters = [];
            foreach ($glossary_data as $entry) {
                if (!empty($entry['original_term'])) {
                    $first = mb_substr(trim($entry['original_term']), 0, 1, 'UTF-8');
                    if (is_numeric($first)) {
                        $enabled_letters['123'] = true;
                    } elseif (preg_match('/[A-Za-z]/u', $first)) {
                        $enabled_letters[strtoupper($first)] = true;
                    } else {
                        $enabled_letters['#&à'] = true;
                    }
                }
            }

            $first_active_set = false;
            foreach ($alphabet as $char) {
                $enabled = isset($enabled_letters[$char]) ? '' : 'disabled';
                $active = '';
                if ($enabled === '' && !$first_active_set) {
                    $first_active_set = true;
                }
                printf(
                    '<button class="lmat-alphabet-btn%s" %s data-letter="%s">%s</button>',
                    $active,
                    $enabled,
                    esc_attr($char),
                    esc_html($char)
                );
            }
            ?>
        </nav>

        <!-- Language Filter Buttons -->
        <?php
        if (count($language_codes_with_entries) > 1): ?>
            <div class="lmat-language-filters">
                <?php foreach ($language_codes_with_entries as $i => $code): ?>
                    <?php
                    // Skip if language code not in map
                    if (!isset($language_map[$code])) {
                        continue;
                    }
                    $lang = $language_map[$code];
                    ?>
                    <button class="lmat-lang-filter-btn<?php echo $i === 0 ? ' active' : ''; ?>" data-lang="<?php echo esc_attr($code); ?>">
                        <?php if (!empty($lang['img'])): ?>
                            <img src="<?php echo esc_url($lang['img']); ?>" alt="<?php echo esc_attr($lang['alt']); ?>" />
                        <?php endif; ?>
                        <?php echo esc_html($lang['alt']) . ' Terms'; ?>
                    </button>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
        
        <div class="lmat-glossary-table-wrapper">
            <?php if (!empty($grouped_entries)): ?>
                <table class="lmat-glossary-table" data-default-lang="<?php echo esc_attr($default_selected_lang); ?>">
                    <thead>
                        <tr>
                            <th colspan="2"></th>
                            <?php foreach ($languages as $lang): ?>
                                <?php if ($single_language_mode && $lang['code'] === $single_language_code) continue; ?>
                                <th colspan="2" title="<?php echo esc_attr($lang['alt']); ?>" 
                                    class="lmat-lang-header lmat-lang-col-<?php echo esc_attr($lang['code']); ?>" 
                                    data-lang="<?php echo esc_attr($lang['code']); ?>">
                                    <?php
                                    echo !empty($lang['flag'])
                                        ? $lang['flag']
                                        : '<img src="' . esc_attr($lang['img']) . '" alt="' . esc_attr($lang['alt']) . '" />';
                                    ?>
                                </th>
                            <?php endforeach; ?>
                            <th class="lmat-actions-cell">
                                <div class="lmat-action-buttons-header">
                                    <button class="lmat-actions-header-btn" id="lmat-actions-header-btn-left" title="Scroll Left">
                                        <img src="<?php echo plugins_url('assets/images/arrow-left.svg', LINGUATOR_ROOT_FILE); ?>" />
                                    </button>
                                    <button class="lmat-actions-header-btn" id="lmat-actions-header-btn-right" title="Scroll Right">
                                        <img src="<?php echo plugins_url('assets/images/arrow-right.svg', LINGUATOR_ROOT_FILE); ?>" />
                                    </button>
                                </div>
                            </th>
                        </tr>
                        <tr>
                            <th>Glossary Entry</th>
                            <th>Type</th>
                            <?php foreach ($languages as $lang): ?>
                                <?php if ($single_language_mode && $lang['code'] === $single_language_code) continue; ?>
                                <th colspan="2" data-lang="<?php echo esc_attr($lang['code']); ?>">
                                    <?php echo esc_html($lang['alt']); ?>
                                </th>
                            <?php endforeach; ?>
                            <th colspan="2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        // UTF-8 safe truncate helper
                        if ( ! function_exists('lmat_glossary_truncate')) {
                            function lmat_glossary_truncate( $str, $limit = 10 ) {
                                $str = (string) $str;
                                if (mb_strlen($str, 'UTF-8') > $limit) {
                                    return mb_substr($str, 0, $limit, 'UTF-8') . '…';
                                }
                                return $str;
                            }
                        }

                        $editing_term = isset($_GET['edit']) ? $_GET['edit'] : null;
                        
                        foreach ($grouped_entries as $composite_key => $data):
                            list($term, $original_language_code) = explode('||', $composite_key);
                            $first = mb_substr(trim($term), 0, 1, 'UTF-8');
                            $row_letter = is_numeric($first) ? '123' : 
                                        (preg_match('/[A-Za-z]/u', $first) ? strtoupper($first) : '#&à');
                        ?>
                            <tr data-type="<?php echo esc_attr($data['type']); ?>"
                                data-original-language="<?php echo esc_attr($original_language_code); ?>"
                                data-term="<?php echo esc_attr($term); ?>"
                                data-letter="<?php echo esc_attr($row_letter); ?>">
                                
                                <td>
                                    <div class="lmat-entry-title">
                                        <?php echo esc_html($term); ?>
                                    </div>
                                    <div class="lmat-entry-desc">
                                        <?php echo esc_html($data['desc']); ?>
                                    </div>
                                </td>
                                
                                <td>
                                    <span class="lmat-type-badge <?php echo esc_attr($data['type']); ?>">
                                        <?php echo esc_html(ucfirst($data['type'])); ?>
                                    </span>
                                </td>

                                <?php
                                foreach ($languages as $lang):
                                    if ($single_language_mode && $lang['code'] === $single_language_code) continue;
                                    $translation = '';
                                    $is_source = ($lang['code'] === $original_language_code);
                                ?>
                                    <td colspan="2" class="lmat-lang-col-<?php echo esc_attr($lang['code']); ?>" 
                                        data-lang="<?php echo esc_attr($lang['code']); ?>"
                                        data-is-source="<?php echo $is_source ? 'true' : 'false'; ?>">
                                        <?php if ($is_source): ?>
                                            <span class="lmat-source-term">
                                                <?php echo esc_html($term); ?>
                                            </span>
                                        <?php else: ?>
                                            <?php
                                            // Get translation from the new data structure
                                            $translation = isset($data['translations'][$lang['code']]) ? $data['translations'][$lang['code']] : '';
                                            ?>
                                            <?php if (!empty($translation) && trim($translation) !== ''): ?>
                                                <?php $truncated = lmat_glossary_truncate($translation, 7); ?>
                                                <span class="lmat-translated-term"
                                                    title="<?php echo esc_attr($translation); ?>"
                                                    data-full-text="<?php echo esc_attr($translation); ?>">
                                                    <?php echo esc_html($truncated); ?>
                                                </span>
                                            <?php else: ?>
                                                <span class="lmat-no-translation">
                                                    <button type="button" class="lmat-edit-btn-svg" 
                                                            data-term="<?php echo esc_attr(sanitize_text_field($term)); ?>"
                                                            data-source-lang="<?php echo esc_attr(sanitize_key($original_language_code)); ?>">
                                                        <img src="<?php echo plugins_url('assets/images/file.svg', LINGUATOR_ROOT_FILE); ?>" 
                                                            alt="<?php esc_attr_e('No translation', $text_domain); ?>" />
                                                    </button>
                                                </span>
                                            <?php endif; ?>
                                        <?php endif; ?>
                                    </td>
                                <?php endforeach; ?>

                                <td class="lmat-actions-cell">
                                    <div class="lmat-action-buttons">
                                        <button type="button" class="lmat-edit-btn" 
                                                data-term="<?php echo esc_attr(sanitize_text_field($term)); ?>"
                                                data-source-lang="<?php echo esc_attr(sanitize_key($original_language_code)); ?>">
                                            <?php esc_html_e('Edit', $text_domain); ?>
                                        </button>
                                        <button type="button" class="lmat-delete-btn" 
                                                data-term="<?php echo esc_attr(sanitize_text_field($term)); ?>"
                                                data-source-lang="<?php echo esc_attr(sanitize_key($original_language_code)); ?>">
                                            <?php esc_html_e('Delete', $text_domain); ?>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <div id="lmat-no-results">No glossary entries found.</div>
            <?php endif; ?>
        </div>
        <!-- Move the template outside the table wrapper so it is always present -->
        <script type="text/template" id="lmat-glossary-edit-row-template">
            <tr class="lmat-glossary-edit-row">
                <td>
                    <textarea class="lmat-edit-term" rows="3" placeholder="<?php esc_attr_e('String Translation', $text_domain); ?>"><%= term %></textarea>
                    <div class="lmat-translation-error"></div>
                    <textarea class="lmat-edit-desc" rows="4" placeholder="<?php esc_attr_e('Example: The name of the add-on that allows translating strings', $text_domain); ?>"><%= desc %></textarea>
                </td>
                <td>
                    <select class="lmat-edit-type">
                        <option value="general" <%= type === 'general' ? 'selected' : '' %>><?php esc_html_e('General', $text_domain); ?></option>
                        <option value="name" <%= type === 'name' ? 'selected' : '' %>><?php esc_html_e('Name', $text_domain); ?></option>
                    </select>
                </td>
                <% for (var i = 0; i < languages.length; i++) { 
                    if (languages[i].code === source_lang) continue;
                %>
                    <td colspan="2">
                        <textarea class="lmat-edit-translation" data-lang="<%= languages[i].code %>" placeholder="<?php esc_attr_e('Custom Translation', $text_domain); ?>" rows="9"><%= translations[languages[i].code] || '' %></textarea>
                        <div class="lmat-translation-error"><?php esc_html_e('Too long, must be less than 220 characters', $text_domain); ?></div>
                    </td>
                <% } %>
                <td colspan="2" class="lmat-actions-cell">
                    <div class="lmat-action-buttons">
                        <button type="button" class="lmat-save-edit-btn button button-primary">
                            <?php esc_html_e('Save', $text_domain); ?>
                        </button>
                        <button type="button" class="lmat-cancel-edit-btn">
                            <?php esc_html_e('Cancel', $text_domain); ?>
                        </button>
                    </div>
                </td>
            </tr>
        </script>
    </div>
</div>
