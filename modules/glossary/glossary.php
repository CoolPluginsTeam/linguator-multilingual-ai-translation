<?php

namespace Linguator\Modules\Glossary;

use Linguator\Settings\Header\Header;

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// use Linguator\Utils\Sanitize;

if (!class_exists('Glossary')) {
    class Glossary {

        /**
         * Init
         * @var object
         */
        private static $init;

        /**
         * Instance
         * @return object
         */
        public static function instance() {
            if (!isset(self::$init)) {
                self::$init = new self();
            }
            return self::$init;
        }

        /**
         * Constructor
         */
        public function __construct() {
            add_filter('lmat_frontend_settings_assets', array($this, 'stop_frontend_setting_assets'), 10, 3);
			add_filter('lmat_admin_settings_assets', array($this, 'lmat_supported_blocks_assets'), 10, 3);
			add_filter('lmat_render_languages_page', array($this, 'lmat_render_supported_blocks_page'), 10, 3);

            // Add AJAX hooks here
            add_action('wp_ajax_lmat_import_glossary', array($this, 'import_glossary_ajax'));
            add_action('wp_ajax_lmat_update_glossary', array($this, 'update_glossary_ajax'));
            add_action('wp_ajax_lmat_delete_glossary', array($this, 'delete_glossary_ajax'));
            add_action('wp_ajax_lmat_add_glossary', array($this, 'add_glossary_ajax'));
            add_action('wp_ajax_lmat_export_glossary', array($this, 'export_glossary_ajax'));
            add_action('wp_ajax_lmat_get_glossary', array($this, 'get_glossary_ajax'));
        }

        /*
		Filter to enqueue the admin supported blocks assets
		@param bool $status
		@param string $tab
		@param bool $is_settings_tab
		@return bool
		*/
		public function lmat_supported_blocks_assets($status, $tab, $is_settings_tab){
			if($is_settings_tab && $tab === 'glossary' && function_exists('LMAT')){

				$header = Header::get_instance('glossary', LMAT()->model);
				$header->header_assets();

				wp_enqueue_style( 'lmat-glossary-style', plugins_url( 'admin/assets/css/lmat-glossary.css', LINGUATOR_ROOT_FILE ), array(), LINGUATOR_VERSION );
				wp_enqueue_script( 'lmat-glossary-script', plugins_url( 'admin/assets/js/lmat-glossary.js', LINGUATOR_ROOT_FILE ), array(), LINGUATOR_VERSION, true );

                wp_localize_script('lmat-glossary-script', 'lmat_glossary', array(
                    'ajaxurl' => admin_url('admin-ajax.php'),
                    'lmat_languages' => self::get_lmat_languages_list(),
                    'url' => plugins_url( '', LINGUATOR_ROOT_FILE ).'/',
                    'file' => 'file.svg',
                    'import_glossary_validate' => wp_create_nonce('lmat_import_glossary_nonce'),
                    'update_glossary_validate' => wp_create_nonce('lmat_update_glossary_nonce'),
                    'delete_glossary_validate' => wp_create_nonce('lmat_delete_glossary_nonce'),
                    'add_glossary_validate' => wp_create_nonce('lmat_add_glossary_nonce'),
                    'export_glossary_validate' => wp_create_nonce('lmat_export_glossary_nonce'),
                ));
				
				return false;
			}

			return $status;
		}

		/*
		Filter to stop the admin assets on frontend settings page
		@param bool $status
		@param string $tab
		@param bool $is_settings_tab
		@return bool
		*/
		public function stop_frontend_setting_assets($status, $tab, $is_settings_tab){
			if($is_settings_tab && $tab === 'glossary'){
				return false;
			}

			return $status;
		}

		/*
		Filter to render the supported blocks page
		@param bool $status
		@param string $selected_tab
		@param string $active_tab
		@return bool
		*/
		public function lmat_render_supported_blocks_page($status, $selected_tab, $active_tab) {
			if($selected_tab === 'glossary' && $active_tab === 'settings'){

				$header = Header::get_instance('glossary', LMAT()->model);

				$header->header();

                $languages = self::get_lmat_languages_list();
                require_once 'glossary-template.php';
				return false;
			}

			return $status;
		}

        /**
         * Store glossary entry 
         */
        public static function store_glossary_data($glossary_data = array()) {
            $glossary_type = sanitize_text_field($glossary_data['type'] ?? '');
            $glossary_term = sanitize_text_field($glossary_data['term'] ?? '');
            $glossary_desc = sanitize_textarea_field($glossary_data['description'] ?? '');
            $source_language_code = sanitize_text_field($glossary_data['source_lang'] ?? '');

            // Support single or multiple translations
            $target_langs = (array) ($glossary_data['target_lang'] ?? []);
            $translated_terms = (array) ($glossary_data['translated_term'] ?? []);

            $all_glossaries = get_option('lmat_glossary_data', array());
            $found = false;

            foreach ($all_glossaries as &$entry) {
                if (
                ($entry['original_term'] ?? '') === $glossary_term &&
                ($entry['original_language_code'] ?? '') === $source_language_code
                ) {
                    // Entry exists, add new translations if not duplicates
                    if (!isset($entry['translations']) || !is_array($entry['translations'])) {
                        $entry['translations'] = array();
                    }
                    $existing_langs = array_column($entry['translations'], 'target_language_code');
                    foreach ($target_langs as $idx => $lang) {
                        $lang = sanitize_text_field($lang);
                        // SKIP if $lang is the same as $source_language_code
                        if ($lang === $source_language_code) continue;
                        $term = sanitize_text_field($translated_terms[$idx] ?? '');
                        
                        // Only add non-empty translations
                        if (!empty(trim($term)) && !in_array($lang, $existing_langs, true)) {
                            $entry['translations'][] = array(
                                'target_language_code' => $lang,
                                'translated_term' => $term
                            );
                            $found = true;
                        }
                    }
                    // If no new translation was added, return false
                    if (!$found) {
                        return false;
                    }
                    break;
                }
            }
            unset($entry);

            if (!$found) {
                // New entry
                $translations = [];
                foreach ($target_langs as $idx => $lang) {
                    $lang = sanitize_text_field($lang);
                    if ($lang === $source_language_code) continue;
                    
                    $translated_term = sanitize_text_field($translated_terms[$idx] ?? '');
                    // Only save non-empty translations
                    if (!empty(trim($translated_term))) {
                        $translations[] = array(
                            'target_language_code' => $lang,
                            'translated_term' => $translated_term
                        );
                    }
                }
                $all_glossaries[] = array(
                    'description' => $glossary_desc,
                    'kind' => sanitize_text_field($glossary_data['type'] ?? 'general'),
                    'original_language_code' => $source_language_code,
                    'original_term' => $glossary_term,
                    'translations' => $translations,
                );
            }

            update_option('lmat_glossary_data', $all_glossaries);

            return true;
        }

        /**
         * Optional: Get all glossary entries (for debugging or display)
         */
        public static function get_all_glossaries() {
            return get_option('lmat_glossary_data', array());
        }

        // Add this function to handle CSV import
        public static function import_glossary_csv($csv_path) {
            if (!file_exists($csv_path) || !is_readable($csv_path)) {
                return false;
            }

            $header = null;
            if (($handle = fopen($csv_path, 'r')) !== false) {
                while (($row = fgetcsv($handle, 1000, ',')) !== false) {
                    if (!$header) {
                        $header = $row;
                    } else {
                        $row_data = array_combine($header, $row);

                        // Create glossary entry with proper mapping
                        $glossary_entry = array(
                            'type' => $row_data['type'] ?? 'general', // Get type from CSV
                            'term' => $row_data['original_term'] ?? '',
                            'description' => $row_data['description'] ?? '',
                            'source_lang' => $row_data['original_language_code'] ?? '',
                            'target_lang' => array($row_data['target_language_code'] ?? ''),
                            'translated_term' => array($row_data['translated_term'] ?? '')
                        );

                        // Map 'type' to 'kind' when storing
                        $glossary_entry['kind'] = $glossary_entry['type'];
                        
                        if ($row_data['target_language_code'] !== $row_data['original_language_code']) {
                            self::store_glossary_data($glossary_entry);
                        }
                    }
                }
                fclose($handle);
            }
            return true;
        }

        public function import_glossary_ajax() {
            check_ajax_referer('lmat_import_glossary_nonce', '_wpnonce');
            if (!current_user_can('manage_options')) {
                wp_send_json_error('Permission denied');
            }
            if (empty($_FILES['csv_file']['tmp_name'])) {
                wp_send_json_error('No file uploaded');
            }
            if ($_FILES['csv_file']['type'] !== 'text/csv' && pathinfo($_FILES['csv_file']['name'], PATHINFO_EXTENSION) !== 'csv') {
                wp_send_json_error('Invalid file type');
            }
            if ($_FILES['csv_file']['size'] > 2 * 1024 * 1024) { // 2MB limit
                wp_send_json_error('File too large');
            }
            $csv_path = $_FILES['csv_file']['tmp_name'];
            $result = self::import_glossary_csv($csv_path);

            if ($result) {
                wp_send_json_success('Glossary imported');
            } else {
                wp_send_json_error('Import failed');
            }
        }

        /**
         * Update glossary entry
         */
        public static function update_glossary_data($glossary_data = array()) {
            $glossary_type = sanitize_text_field($glossary_data['type'] ?? '');
            $glossary_term = sanitize_text_field($glossary_data['term'] ?? '');
            $glossary_desc = sanitize_textarea_field($glossary_data['description'] ?? '');
            $source_language_code = sanitize_text_field($glossary_data['source_lang'] ?? '');
            $translations = $glossary_data['translations'] ?? [];

            $all_glossaries = get_option('lmat_glossary_data', array());
            $updated = false;

            foreach ($all_glossaries as $i => &$entry) {
                $existing_name = sanitize_text_field($entry['original_term'] ?? '');
                $existing_source = sanitize_text_field($entry['original_language_code'] ?? '');

                if (
                    $existing_name === $glossary_data['original_term'] &&
                    $existing_source === $glossary_data['original_source_lang']
                ) {
                    // Check if term or language changed
                    if (
                        $glossary_term !== $existing_name ||
                        $source_language_code !== $existing_source
                    ) {
                        // Remove just this entry
                        unset($all_glossaries[$i]);

                        // ✅ Add the updated entry now
                        $translations_arr = [];
                        foreach ($translations as $lang => $translated_term) {
                            if ($lang === $source_language_code) continue;
                            $sanitized_term = sanitize_text_field($translated_term);
                            // Only save non-empty translations
                            if (!empty(trim($sanitized_term))) {
                                $translations_arr[] = array(
                                    'target_language_code' => $lang,
                                    'translated_term' => $sanitized_term
                                );
                            }
                        }

                        $all_glossaries[] = array(
                            'description' => $glossary_desc,
                            'kind' => $glossary_type,
                            'original_language_code' => $source_language_code,
                            'original_term' => $glossary_term,
                            'translations' => $translations_arr,
                        );

                        $updated = true;
                        break;
                    } else {
                        // Only description or translations changed — update in place
                        $entry['description'] = $glossary_desc;
                        $entry['kind'] = $glossary_type;
                        $entry['original_term'] = $glossary_term;
                        $entry['original_language_code'] = $source_language_code;
                        $entry['translations'] = [];

                        foreach ($translations as $lang => $translated_term) {
                            if ($lang === $source_language_code) continue;
                            $sanitized_term = sanitize_text_field($translated_term);
                            // Only save non-empty translations
                            if (!empty(trim($sanitized_term))) {
                                $entry['translations'][] = array(
                                    'target_language_code' => $lang,
                                    'translated_term' => $sanitized_term
                                );
                            }
                        }

                        $updated = true;
                        break;
                    }
                }

            }
            unset($entry);

            if ($updated) {
                // Reindex array to avoid gaps
                $all_glossaries = array_values($all_glossaries);
                update_option('lmat_glossary_data', $all_glossaries);
                return true;
            }
            return false;
        }

        public function update_glossary_ajax() {
            check_ajax_referer('lmat_update_glossary_nonce', '_wpnonce');

            if (!current_user_can('manage_options')) {
                wp_send_json_error('Permission denied');
            }

            $data = $_POST['data'] ?? [];
            $source_lang = sanitize_text_field($data['source_lang'] ?? '');
            $translations = isset($data['translations']) && is_array($data['translations']) ? $data['translations'] : [];
            // Remove translation for original language if present
            if (isset($translations[$source_lang])) {
                unset($translations[$source_lang]);
            }
            $result = self::update_glossary_data($data);

            if ($result) {
                // Get the updated entry from database
                $updated_entry = self::get_updated_glossary_entry(
                    sanitize_text_field($data['term'] ?? ''), 
                    $source_lang
                );
                
                wp_send_json_success([
                    'message' => 'Glossary updated',
                    'updated_entry' => $updated_entry
                ]);
            } else {
                wp_send_json_error('Update failed');
            }
        }

        /**
         * Get updated glossary entry after update
         */
        private static function get_updated_glossary_entry($term, $source_lang) {
            $all_glossaries = get_option('lmat_glossary_data', array());
            
            foreach ($all_glossaries as $entry) {
                if (
                    ($entry['original_term'] ?? '') === $term &&
                    ($entry['original_language_code'] ?? '') === $source_lang
                ) {
                    return $entry;
                }
            }
            
            return null;
        }

        /**
         * Delete glossary entry
         */
        public static function delete_glossary_data($term, $source_lang) {
            $all_glossaries = get_option('lmat_glossary_data', array());
            $updated = false;
            foreach ($all_glossaries as $i => $entry) {
                if (
                    strtolower(trim($entry['original_term'])) === strtolower(trim($term)) &&
                    strtolower(trim($entry['original_language_code'])) === strtolower(trim($source_lang))
                ) {
                    unset($all_glossaries[$i]);
                    $updated = true;
                    break;
                }
            }
            if ($updated) {
                $all_glossaries = array_values($all_glossaries);
                update_option('lmat_glossary_data', $all_glossaries);
                return true;
            }
            return false;
        }

        public function delete_glossary_ajax() {
            check_ajax_referer('lmat_delete_glossary_nonce', '_wpnonce');
            if (!current_user_can('manage_options')) {
                wp_send_json_error('Permission denied');
            }
            $term = sanitize_text_field($_POST['term'] ?? '');
            $source_lang = sanitize_text_field($_POST['source_lang'] ?? '');
            if (empty($term) || empty($source_lang)) {
                wp_send_json_error('Missing data');
            }
            $result = self::delete_glossary_data($term, $source_lang);
            if ($result) {
                wp_send_json_success('Glossary entry deleted');
            } else {
                wp_send_json_error('Delete failed');
            }
        }

        public static function get_lmat_languages_list(){
            // --- ADD THIS BLOCK: Fetch Linguator languages for use everywhere ---
            $lmat_languages = [];

            if(function_exists('LMAT') && property_exists(LMAT(), 'model')) {
                $lmat_languages_list = LMAT()->model->get_languages_list();
                
                if(is_array($lmat_languages_list) && count($lmat_languages_list) > 0){
                    foreach($lmat_languages_list as $lmat_lang){
                        $lmat_languages[] = $lmat_lang->to_array();
                    }
                }
            }

            if(empty($lmat_languages)){
                $lmat_languages_serialized = get_option('_transient_lmat_languages_list');

                if($lmat_languages_serialized){
                    $lmat_languages = maybe_unserialize($lmat_languages_serialized);
                }
            }

            // Build $languages array for use in modal and table
            $languages = [];
            if (is_array($lmat_languages)) {
                foreach ($lmat_languages as $lmat_lang) {
                    $languages[] = [
                        'code' => $lmat_lang['slug'],
                        'img'  => $lmat_lang['flag_url'],
                        'alt'  => $lmat_lang['name'],
                        'flag' => isset($lmat_lang['flag']) ? $lmat_lang['flag'] : '',
                    ];
                }
            }

            return $languages;
        }

        public function add_glossary_ajax() {
            check_ajax_referer('lmat_add_glossary_nonce', '_wpnonce');
            if (!current_user_can('manage_options')) {
                wp_send_json_error('Permission denied');
            }
            $type = sanitize_text_field($_POST['type'] ?? '');
            $term = sanitize_text_field($_POST['term'] ?? '');
            $description = sanitize_textarea_field($_POST['description'] ?? '');
            $source_lang = sanitize_text_field($_POST['source_lang'] ?? '');
            $translations = isset($_POST['translations']) && is_array($_POST['translations']) ? array_map('sanitize_text_field', $_POST['translations']) : [];
            // Remove translation for original language if present
            if (isset($translations[$source_lang])) {
                unset($translations[$source_lang]);
            }

            // Only require type, term, and source_lang
            if (empty($type) || empty($term) || empty($source_lang)) {
                wp_send_json_error('Type, Term, and Original Language are required.');
            }

            // Save the main term
            $main_entry = [
                'type' => $type,
                'term' => $term,
                'description' => $description,
                'source_lang' => $source_lang,
                'target_lang' => [],
                'translated_term' => []
            ];
            foreach ($translations as $code => $translated) {
                // Strict empty check - must have non-whitespace content
                if ($translated !== '' && trim($translated) !== '') {
                    $main_entry['target_lang'][] = $code;
                    $main_entry['translated_term'][] = trim($translated);
                }
            }

            $glossary_data = get_option('lmat_glossary_data', []);
            $duplicate = false;
            foreach ($glossary_data as $entry) {
                if (
                    isset($entry['original_term'], $entry['original_language_code']) &&
                    $entry['original_term'] === $term &&
                    $entry['original_language_code'] === $source_lang
                ) {
                    $duplicate = true;
                    break;
                }
            }
            if ($duplicate) {
                wp_send_json_error('This term already exists in this language.');
            }

            $result = self::store_glossary_data($main_entry);
            if ($result) {
                // Get the newly added entry from database
                $added_entry = self::get_updated_glossary_entry($term, $source_lang);
                
                wp_send_json_success([
                    'message' => 'Glossary term added successfully',
                    'added_entry' => $added_entry
                ]);
            } else {
                wp_send_json_error('Could not add glossary term (maybe duplicate?)');
            }
        }

        public function export_glossary_ajax() {
            check_ajax_referer('lmat_export_glossary_nonce', '_wpnonce');
            if (!current_user_can('manage_options')) {
                wp_die('Permission denied');
            }

            $glossary_data = get_option('lmat_glossary_data', []);
            if (!is_array($glossary_data)) {
                $glossary_data = [];
            }

            // Set headers for CSV download
            header('Content-Type: text/csv; charset=utf-8');
            header('Content-Disposition: attachment; filename=glossary-export-' . date('Y-m-d') . '.csv');

            $output = fopen('php://output', 'w');

            // CSV header
            fputcsv($output, [
                'type',
                'original_term',
                'description',
                'original_language_code',
                'target_language_code',
                'translated_term'
            ]);

            foreach ($glossary_data as $entry) {
                $type = $entry['kind'] ?? '';
                $term = $entry['original_term'] ?? '';
                $desc = $entry['description'] ?? '';
                $orig_lang = $entry['original_language_code'] ?? '';
                if (!empty($entry['translations']) && is_array($entry['translations'])) {
                    foreach ($entry['translations'] as $trans) {
                        $target_lang = $trans['target_language_code'] ?? '';
                        $translated = $trans['translated_term'] ?? '';
                        fputcsv($output, [
                            $type,
                            $term,
                            $desc,
                            $orig_lang,
                            $target_lang,
                            $translated
                        ]);
                    }
                } else {
                    // No translations, just output the main term
                    fputcsv($output, [
                        $type,
                        $term,
                        $desc,
                        $orig_lang,
                        '',
                        ''
                    ]);
                }
            }

            fclose($output);
            exit;
        }

        public function get_glossary_ajax() {
            check_ajax_referer('lmat_get_glossary_private', '_wpnonce');
            if (!current_user_can('read')) {
                wp_send_json_error('Permission denied');
            }

            $source_lang = isset($_POST['source_lang']) ? sanitize_text_field($_POST['source_lang']) : '';
            $target_langs = isset($_POST['target_lang']) ? sanitize_text_field($_POST['target_lang']) : '';

            $target_langs = explode(',', $target_langs);

            $glossary_data = self::get_all_glossaries();
            $filtered = [];

            foreach ($glossary_data as $entry) {

                // Filter by source_lang
                if (
                    $source_lang &&
                    (!isset($entry['original_language_code']) || $entry['original_language_code'] !== $source_lang)
                ) {
                    continue; // Skip if source_lang is provided and doesn't match
                }

                // Ensure the entry has a translations array and it's not empty
                if (!isset($entry['translations']) || !is_array($entry['translations']) || empty($entry['translations'])) {
                    continue; // Skip if no translations array or it's empty
                }

                if(!isset($entry['original_term']) || empty($entry['original_term'])){
                    continue;
                }

                $valid_translations=array();

                foreach($entry['translations'] as $translation) {
                    if(isset($translation['target_language_code']) && in_array($translation['target_language_code'], $target_langs)) {
                        $valid_translations[$translation['target_language_code']] = $translation['translated_term'];
                    }
                }

                if (empty($valid_translations) || count($valid_translations) < 1) {
                    continue; // Skip if no valid (non-empty) translations exist for this entry
                }

                if ($target_langs) {
                    $entry['translations'] = $valid_translations;
                    $filtered[] = $entry;
                } else {
                    // If target_lang is not provided, include the entry with all its valid_translations.
                    $entry['translations'] = array_values($valid_translations);
                    $filtered[] = $entry;
                }
            }

            usort($filtered, function($a, $b) {
                return strlen($a['original_term']) < strlen($b['original_term']);
            });

            wp_send_json_success(['terms' => $filtered]);
        }
    }
}
?>