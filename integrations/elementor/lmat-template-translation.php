<?php
/**
 * Elementor Template Translation
 *
 * @package           Linguator
 * @wordpress-plugin
 */

namespace Linguator\Integrations\elementor;

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class LMAT_Template_Translation
 *
 * Handles the template translation for Elementor.
 */
class LMAT_Template_Translation {
	/**
	 * Template ID for current template
	 *
	 * @var int
	 */
	private $template_id;



	/**
	 * Constructor
	 *
	 *  
	 */
	public function __construct() {
		add_filter('lmat_get_post_types', [$this, 'lmat_register_supported_post_types'], 10, 2);
        add_filter('elementor/theme/get_location_templates/template_id', [$this, 'lmat_translate_template_id']);
        add_filter('elementor/theme/get_location_templates/condition_sub_id', [$this, 'lmat_translate_condition_sub_id'], 10, 2);
        add_filter('pre_do_shortcode_tag', [$this, 'lmat_handle_shortcode_translation'], 10, 3);
        add_action('elementor/frontend/widget/before_render', [$this, 'lmat_translate_widget_template_id']);
        add_action('elementor/documents/register_controls', [$this, 'lmat_add_language_panel_controls']);

        if (lmat_is_plugin_active('elementor-pro/elementor-pro.php')) {
            add_action('set_object_terms', [$this, 'lmat_update_conditions_on_translation_change'], 10, 4);
        }

        // Auto-assign existing Elementor templates to default language after Linguator is ready
        add_action('lmat_init', [$this, 'lmat_assign_templates_to_default_language']);
	}

    /**
     * Registers supported post types for Linguator translation.
     *
     *  
     *
     * @param array $types        Array of post types.
     * @param bool  $is_settings  Whether this is called from settings page.
     * @return array Modified array of post types.
     */
    public function lmat_register_supported_post_types($types, $is_settings) {
        $custom_post_types = ['elementor_library'];
        return array_merge($types, array_combine($custom_post_types, $custom_post_types));
    }

    /**
     * Assigns existing Elementor templates to the default language using Linguator's mass assignment.
     * Uses the built-in set_language_in_mass method for efficient bulk processing.
     * Runs only once to avoid duplicate assignments.
     *
     *  
     *
     * @return void
     */
    public function lmat_assign_templates_to_default_language() {
        // Check if we've already run this process
        if (get_option('lmat_elementor_templates_assigned', false)) {
            return;
        }

        // Ensure Linguator is properly initialized
        if (!function_exists('LMAT') || empty(LMAT()->model)) {
            return;
        }

        // Get the default language
        $default_lang = LMAT()->model->get_default_language();
        if (!$default_lang) {
            return;
        }

        // Use Linguator's efficient mass assignment for post type
        // This will find all elementor_library posts without language and assign the default language
        LMAT()->model->set_language_in_mass($default_lang, ['post']);

        // Mark the process as completed
        update_option('lmat_elementor_templates_assigned', true);
    }

    /**
     * Translates template ID based on current language.
     *
     *  
     *
     * @param int $post_id The template post ID.
     * @return int Translated template ID.
     */
    public function lmat_translate_template_id($post_id) {
        // Get the language of the current page
        $page_lang = lmat_get_post_language(get_the_ID());
        
        // Get the translated template in current page's language (if exists)
        $translated_post_id = lmat_get_post($post_id, $page_lang);
    
        // If translated template exists, use it. Otherwise, fallback to default language template
        if ($translated_post_id) {
            $post_id = $translated_post_id;
        } else {
            // Fallback: get the template in the default language
            $default_lang = lmat_default_language();
            $default_template_id = lmat_get_post($post_id, $default_lang);
            
            if ($default_template_id) {
                $post_id = $default_template_id;
            }
            // Else fallback is original post_id (in case no default exists either)
        }
    
        $this->template_id = $post_id; // Save for later use
    
        return $post_id;
    }

    /**
     * Translates condition sub ID based on current language.
     *
     *  
     *
     * @param int   $sub_id     The sub ID to translate.
     * @param array $condition  The condition data.
     * @return int Translated sub ID.
     */
    public function lmat_translate_condition_sub_id($sub_id, $condition) {
        if (!$sub_id) {
            return $sub_id;
        }

        $default_lang = lmat_default_language();
        // Get current page/template ID from context
        $current_template_id = get_the_ID() ?: (is_singular() ? get_queried_object_id() : 0);
        $current_lang = $current_template_id ? lmat_get_post_language($current_template_id) : null;

        if ($current_lang && $current_lang !== $default_lang && $current_template_id && lmat_get_post($current_template_id, $default_lang)) {
            if (in_array($condition['sub_name'], get_post_types(), true)) {
                $sub_id = lmat_get_post($sub_id) ?: $sub_id;
            } else {
                $sub_id = lmat_get_term($sub_id) ?: $sub_id;
            }
        }

        return $sub_id;
    }

    /**
     * Handles translation of Elementor template shortcodes.
     *
     *  
     *
     * @param bool   $false  Whether to skip shortcode processing.
     * @param string $tag    Shortcode tag.
     * @param array  $attrs  Shortcode attributes.
     * @return string|bool Processed shortcode or false.
     */
    public function lmat_handle_shortcode_translation($false, $tag, $attrs) {
        if ('elementor-template' !== $tag || isset($attrs['skip'])) {
            return $false;
        }

        $attrs['id'] = lmat_get_post(absint($attrs['id'])) ?: $attrs['id'];
        $attrs['skip'] = 1;

        $output = '';
        foreach ($attrs as $key => $value) {
            $output .= " $key=\"" . esc_attr($value) . "\"";
        }

        return do_shortcode('[elementor-template' . $output . ']');
    }

    /**
     * Updates conditions when translations change.
     *
     *  
     *
     * @param int    $post_id  Post ID.
     * @param array  $terms    Terms.
     * @param array  $tt_ids   Term taxonomy IDs.
     * @param string $taxonomy Taxonomy name.
     */
    public function lmat_update_conditions_on_translation_change($post_id, $terms, $tt_ids, $taxonomy) {
        if ( 'post_translations' === $taxonomy && 'elementor_library' === get_post_type( $post_id ) ) {

			$theme_builder = \ElementorPro\Plugin::instance()->modules_manager->get_modules( 'theme-builder' );
			$theme_builder->get_conditions_manager()->get_cache()->regenerate();

		}
    }

    /**
     * Translates widget template ID.
     *
     *  
     *
     * @param \Elementor\Element_Base $element Element instance.
     */
    public function lmat_translate_widget_template_id($element) {
        if ('template' !== $element->get_name()) {
            return;
        }

        $template_id = lmat_get_post($element->get_settings('template_id')) ?: $element->get_settings('template_id');
        $element->set_settings('template_id', $template_id);
    }

    /**
     * Adds language panel controls to Elementor document.
     *
     *  
     *
     * @param \Elementor\Core\Base\Document $document Document instance.
     */
    public function lmat_add_language_panel_controls($document) {
        if (!method_exists($document, 'get_main_id')) {
            return;
        }

        // require_once LINGUATOR_DIR . 'helpers/lmat-helpers.php';

        $post_id = $document->get_main_id();
        $languages = lmat_languages_list(['fields' => '']);
        $translations = lmat_get_post_translations($post_id);
        $current_lang_name = lmat_get_post_language($post_id, 'name');

        $document->start_controls_section(
            'lmat_language_panel_controls',
            [
                'label' => esc_html__('Translations', 'linguator-multilingual-ai-translation'),
                'tab'   => \Elementor\Controls_Manager::TAB_SETTINGS,
            ]
        );

        foreach ($languages as $lang) {
            $lang_slug = $lang->slug;
            if (isset($translations[$lang_slug])) {
                $translated_post_id = $translations[$lang_slug];
                $edit_link = get_edit_post_link($translated_post_id, 'edit');
                
                $edit_link = add_query_arg('lang', $lang_slug, $edit_link);

                if (get_post_meta($translated_post_id, '_elementor_edit_mode', true)) {
                    $edit_link = add_query_arg('action', 'elementor', $edit_link);
                }

                $document->add_control(
                    "lmat_elementor_edit_lang_{$lang_slug}",
                    [
                        'type'            => \Elementor\Controls_Manager::RAW_HTML,
                        'raw'             => sprintf(
                            '<a href="%s" target="_blank"><i class="eicon-pencil"></i> %s — %s</a>',
                            esc_url($edit_link),
                            esc_html(get_the_title($translated_post_id)),
                            esc_html($lang->name)
                        ),
                        'content_classes' => 'elementor-control-field',
                    ]
                );
            } else {
                $create_link = add_query_arg([
                    'post_type' => get_post_type($post_id),
                    'from_post' => esc_attr($post_id),
                    'new_lang'  => esc_attr($lang_slug),
                    '_wpnonce'  => wp_create_nonce('new-post-translation'),
                ], admin_url('post-new.php'));

                $document->add_control(
                    "lmat_elementor_add_lang_{$lang_slug}",
                    [
                        'type'            => \Elementor\Controls_Manager::RAW_HTML,
                        'raw'             => sprintf(
                            '<a href="%s" target="_blank"><i class="eicon-plus"></i> %s</a>',
                            esc_url($create_link),
                            sprintf(
                                /* translators: %s: Language name */
                                __('Add translation — %s', 'linguator-multilingual-ai-translation'),
                                esc_html($lang->name)
                            )
                        ),
                        'content_classes' => 'elementor-control-field',
                    ]
                );
            }
        }

        $document->end_controls_section();
    }
}