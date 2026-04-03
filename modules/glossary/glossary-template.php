<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- Template variables used for rendering.

if(!isset($languages) && !is_array($languages) && empty($languages)){
    $languages = [];
}

$glossary_data = get_option('lmat_glossary_data', []);

if (!is_array($glossary_data)) {
    $glossary_data = [];
}

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

<div class="lmat-glossary">
    <div class="lmat-glossary-container">
        <?php wp_nonce_field('lmat_glossary_nonce', 'lmat_glossary_nonce'); ?>
        <header class="lmat-header">
            <h1><?php esc_html_e('Glossary', 'linguator-multilingual-ai-translation'); ?></h1>
            <p><?php esc_html_e('Define how you want to translate – or not translate – important words and phrases.', 'linguator-multilingual-ai-translation'); ?></p>
            <ul>
                <li><?php esc_html_e('Specific translations you want to use;', 'linguator-multilingual-ai-translation'); ?></li>
                <li><?php esc_html_e('Terms you want to exclude from being translated;', 'linguator-multilingual-ai-translation'); ?></li>
                <li><?php esc_html_e('Additional context for each term.', 'linguator-multilingual-ai-translation'); ?></li>
            </ul>
            <a href="<?php echo esc_url( 'https://linguator.com/docs/add-glossary-feature-linguator/?utm_source=lmat_plugin&utm_medium=inside&utm_campaign=docs&utm_content=glossary_management_free' ); ?>" target="_blank"><?php esc_html_e('Learn more about adding and managing glossary terms.', 'linguator-multilingual-ai-translation'); ?></a>
        </header>

        <div class="lmat-controls">
            <input type="text" class="lmat-search" placeholder="<?php esc_attr_e('Search', 'linguator-multilingual-ai-translation'); ?>" />

            <select class="lmat-glossary-type" name="glossary_type">
                <option value=""><?php esc_html_e('Glossary Type', 'linguator-multilingual-ai-translation'); ?></option>
                <option value="name"><?php esc_html_e('Name', 'linguator-multilingual-ai-translation'); ?></option>
                <option value="general"><?php esc_html_e('General', 'linguator-multilingual-ai-translation'); ?></option>
            </select>

            <button class="lmat-add-btn button button-primary">
                <?php esc_html_e('Add glossary entry', 'linguator-multilingual-ai-translation'); ?>
            </button>
            <button class="lmat-import-btn button button-primary">
                <?php esc_html_e('Import glossary', 'linguator-multilingual-ai-translation'); ?>
            </button>
            <button class="lmat-export-btn button button-primary">
                <?php esc_html_e('Export glossary', 'linguator-multilingual-ai-translation'); ?>
            </button>

            <!-- Modal -->
            <div id="lmat-glossary-modal-add" class="lmat-glossary-modal lmat-hidden">
                <div class="lmat-glossary-modal-content-wrapper">
                    <button type="button" class="lmat-modal-close-btn" aria-label="Close">&times;</button>
                    <div class="lmat-glossary-modal-content">
                        <h2><?php esc_html_e('Add New Glossary Term', 'linguator-multilingual-ai-translation'); ?></h2>
                        <form id="lmat-add-glossary-form">
                            <label for="lmat-add-term"><?php esc_html_e('Term', 'linguator-multilingual-ai-translation'); ?></label>
                            <textarea id="lmat-add-term" name="term" class="lmat-add-term" required placeholder="<?php esc_attr_e('Enter the term to be translated', 'linguator-multilingual-ai-translation'); ?>"></textarea>
                            <div class="lmat-translation-error"></div>

                            <label for="lmat-add-desc"><?php esc_html_e('Description', 'linguator-multilingual-ai-translation'); ?></label>
                            <textarea id="lmat-add-desc" name="description" class="lmat-add-desc" rows="3" placeholder="<?php esc_attr_e('Add a description to provide context for translators', 'linguator-multilingual-ai-translation'); ?>"></textarea>
                            <div class="lmat-translation-error"></div>

                            <label for="lmat-add-source-lang"><?php esc_html_e('Original Language', 'linguator-multilingual-ai-translation'); ?></label>
                            <select id="lmat-add-source-lang" name="source_lang" class="lmat-add-source-lang" required>
                                <option value=""><?php esc_html_e('Select language', 'linguator-multilingual-ai-translation'); ?></option>
                                <?php foreach ($languages as $lang): ?>
                                    <option value="<?php echo esc_attr($lang['code']); ?>">
                                        <?php echo esc_html($lang['alt']); ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>

                            <label for="lmat-add-type"><?php esc_html_e('Type', 'linguator-multilingual-ai-translation'); ?></label>
                            <select id="lmat-add-type" name="type" class="lmat-add-type" required>
                                <option value="general"><?php esc_html_e('General', 'linguator-multilingual-ai-translation'); ?></option>
                                <option value="name"><?php esc_html_e('Name', 'linguator-multilingual-ai-translation'); ?></option>
                            </select>
                            <div class="lmat-add-translations lmat-translations-grid">
                                <?php foreach ($languages as $lang): ?>
                                    <div class="lmat-translation-field lmat-translation-field-<?php echo esc_attr($lang['code']); ?>">
                                        <label>
                                            <div class="lmat-translation-label-row">
                                                <?php if (!empty($lang['img'])): ?>
                                                    <img src="<?php echo esc_url($lang['img']); ?>" alt="<?php echo esc_attr($lang['alt']); ?>" class="lmat-lang-flag">
                                                <?php endif; ?>
                                                <span class="lmat-lang-name"><?php echo esc_html($lang['alt']); ?></span>
                                                <span class="lmat-lang-translation-label"><?php esc_html_e('Translation', 'linguator-multilingual-ai-translation'); ?></span>
                                            </div>
                                            <textarea name="translation_<?php echo esc_attr($lang['code']); ?>" class="lmat-add-translation" rows="2" placeholder="<?php esc_attr_e('Custom Translation', 'linguator-multilingual-ai-translation'); ?>"></textarea>
                                            <div class="lmat-translation-error"><?php esc_html_e('Too long, must be less than 240 characters', 'linguator-multilingual-ai-translation'); ?></div>
                                        </label>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                            <div class="lmat-glossary-modal-actions" style="margin-top: 18px;">
                                <span class="lmat-glossary-modal-actions-left" style="cursor:pointer;"><?php esc_html_e('Cancel', 'linguator-multilingual-ai-translation'); ?></span>
                                <button type="submit" id="add-glossary-term-btn"  class="button button-primary"><?php esc_html_e('Add Term', 'linguator-multilingual-ai-translation'); ?></button>
                            </div>
                        </form>
                        <div id="add-glossary-success" class="lmat-import-success lmat-hidden">
                            <div class="import-success-icon">
                                <?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- plugins_url() returns a safe URL. ?>
                                <img src="<?php echo esc_url(plugins_url('assets/images/success.svg', LINGUATOR_ROOT_FILE)); ?>" alt="Success Icon" />
                            </div>
                            <div class="lmat-import-success-message">
                                <?php esc_html_e('Glossary term added successfully!', 'linguator-multilingual-ai-translation'); ?>
                            </div>
                            <button id="lmat-glossary-success-close" class="lmat-close-button" type="button"><?php esc_html_e('Close', 'linguator-multilingual-ai-translation'); ?></button>
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
                            <h2 class="lmat-title"><?php esc_html_e( 'Import glossary', 'linguator-multilingual-ai-translation' ); ?></h2>

                            <label class="lmat-upload-box" id="upload-label">
                                <input type="file" accept=".csv" id="lmat-csv-upload" hidden>
                                <div class="lmat-upload-area">
                                    <?php 
                                    // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- plugins_url() returns a safe URL. ?>
                                    <img src="<?php echo esc_url(plugins_url('assets/images/csv.svg', LINGUATOR_ROOT_FILE)); ?>" alt="CSV Icon" />
                                    <span id="file-name-display"><?php esc_html_e( 'Select a CSV file to upload', 'linguator-multilingual-ai-translation' ); ?></span>
                                </div>
                            </label>
                            <a
                                href="<?php echo esc_url( plugins_url('assets/sample-glossary.csv', LINGUATOR_ROOT_FILE) ); ?>"
                                class="lmat-download-link"
                                download="sample-glossary.csv">
                                <?php esc_html_e( 'Download sample glossary CSV file', 'linguator-multilingual-ai-translation' ); ?>
                            </a>
                        </div>
                        <!-- Success UI (hidden by default) -->
                        <div id="lmat-import-success-ui" class="lmat-hidden">
                            <div id="lmat-import-success" class="lmat-import-success">
                                <div class="import-success-icon">
                                    <?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- plugins_url() returns a safe URL. ?>
                                    <img src="<?php echo esc_url(plugins_url('assets/images/success.svg', LINGUATOR_ROOT_FILE)); ?>" alt="Success Icon" />
                                </div>
                                <div class="import-success-file">
                                    <span id="importing-file-label"><?php esc_html_e('Importing:', 'linguator-multilingual-ai-translation'); ?></span>
                                    <span id="importing-file-name"></span>
                                </div>
                                <div class="lmat-import-success-message">
                                    <?php esc_html_e('Glossary terms imported successfully', 'linguator-multilingual-ai-translation'); ?>
                                </div>
                                <button class="lmat-import-close-btn lmat-close-button" type="button"><?php esc_html_e('Close', 'linguator-multilingual-ai-translation'); ?></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <nav class="lmat-alphabet" aria-label="<?php esc_attr_e('Glossary Alphabet Navigation', 'linguator-multilingual-ai-translation'); ?>">
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
                    esc_attr($active),
                    esc_attr($enabled),
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
                    <button class="lmat-lang-filter-btn<?php echo esc_attr( 0 === $i ? ' active' : '' ); ?>" data-lang="<?php echo esc_attr( $code ); ?>">
                        <?php if (!empty($lang['img'])): ?>
                            <img src="<?php echo esc_url($lang['img']); ?>" alt="<?php echo esc_attr($lang['alt']); ?>" />
                        <?php endif; ?>
                         <?php
                        printf(
                            '%s %s',
                            esc_html( $lang['alt'] ),
                            esc_html__( 'Terms', 'linguator-multilingual-ai-translation' )
                        );
                        ?>
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
                                        ? wp_kses_post( $lang['flag'] )
                                        : '<img src="' . esc_url($lang['img']) . '" alt="' . esc_attr($lang['alt']) . '" />';
                                    ?>
                                </th>
                            <?php endforeach; ?>
                            <th class="lmat-actions-cell">
                                <div class="lmat-action-buttons-header">
                                    <button class="lmat-actions-header-btn" id="lmat-actions-header-btn-left" title="<?php esc_attr_e( 'Scroll left', 'linguator-multilingual-ai-translation' ); ?>">
                                        <?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- plugins_url() returns a safe URL. ?>
                                        <img src="<?php echo esc_url(plugins_url('assets/images/arrow-left.svg', LINGUATOR_ROOT_FILE)); ?>" />
                                    </button>
                                    <button class="lmat-actions-header-btn" id="lmat-actions-header-btn-right" title="<?php esc_attr_e( 'Scroll right', 'linguator-multilingual-ai-translation' ); ?>">
                                        <?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- plugins_url() returns a safe URL. ?>
                                        <img src="<?php echo esc_url(plugins_url('assets/images/arrow-right.svg', LINGUATOR_ROOT_FILE)); ?>" />
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
                        if ( ! function_exists('linguator_glossary_truncate')) {
                            function linguator_glossary_truncate( $str, $limit = 10 ) {
                                $str = (string) $str;
                                if (mb_strlen($str, 'UTF-8') > $limit) {
                                    return mb_substr($str, 0, $limit, 'UTF-8') . '…';
                                }
                                return $str;
                            }
                        }
                        // phpcs:ignore WordPress.Security.NonceVerification.Recommended
                        $editing_term = isset($_GET['edit']) ? sanitize_text_field(wp_unslash($_GET['edit'])) : null;
                        
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
                                        data-is-source="<?php echo esc_attr( $is_source ? 'true' : 'false' ); ?>">
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
                                                <?php $truncated = linguator_glossary_truncate($translation, 7); ?>
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
                                                        <?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- plugins_url() returns a safe URL. ?>
                                                        <img src="<?php echo esc_url(plugins_url('assets/images/file.svg', LINGUATOR_ROOT_FILE)); ?>" 
                                                            alt="<?php esc_attr_e('No translation', 'linguator-multilingual-ai-translation'); ?>" />
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
                                            <?php esc_html_e('Edit', 'linguator-multilingual-ai-translation'); ?>
                                        </button>
                                        <button type="button" class="lmat-delete-btn" 
                                                data-term="<?php echo esc_attr(sanitize_text_field($term)); ?>"
                                                data-source-lang="<?php echo esc_attr(sanitize_key($original_language_code)); ?>">
                                            <?php esc_html_e('Delete', 'linguator-multilingual-ai-translation'); ?>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <div id="lmat-no-results"><?php esc_html_e('No glossary entries found.', 'linguator-multilingual-ai-translation'); ?></div>
            <?php endif; ?>
        </div>
    </div>
</div>
<?php
// phpcs:enable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
