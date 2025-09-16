<?php
/**
 * Language Switcher Linguator Elementor Widget
 *
 * @package LanguageSwitcherLinguatorElementorWidget
 * @since 1.0.0
 */

namespace Linguator\Integrations\elementor;

use Elementor\Controls_Manager;
use Elementor\Widget_Base;

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Class LMAT_Widget
 *
 * Main widget class for the Language Switcher Linguator Elementor widget.
 *
 * @since 1.0.0
 */
class LMAT_Widget extends Widget_Base
{

    /**
     * Constructor for the widget.
     *
     * @param array $data Widget data.
     * @param array $args Widget arguments.
     */
    public function __construct($data = [], $args = null)
    {
        parent::__construct($data, $args);
        wp_register_style(
            'lmat-style',
            LINGUATOR_URL . '/admin/assets/css/build/language-switcher-style.css',
            [],
            LINGUATOR_VERSION
        );

        add_action('elementor/editor/after_enqueue_scripts', [$this, 'lmat_language_switcher_icon_css']);
    }

    public function lmat_language_switcher_icon_css()
    {
        wp_enqueue_style('lmat-style');

        $inline_css = "
        .lmat-widget-icon {
            display: inline-block;
            width: 25px;
            height: 25px;
            background-image: url('" . esc_url(LINGUATOR_URL . 'assets/logo/lang_switcher.svg') . "');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
        }
    ";

        wp_add_inline_style('lmat-style', $inline_css);
    }

    /**
     * Get widget name.
     *
     * @return string Widget name.
     */
    public function get_name()
    {
        return 'lmat_widget';
    }

    /**
     * Get widget title.
     *
     * @return string Widget title.
     */
    public function get_title()
    {
        return __('Language Switcher', 'linguator-multilingual-ai-translation');
    }

    /**
     * Get widget icon.
     *
     * @return string Widget icon.
     */
    public function get_icon()
    {
        return 'lmat-widget-icon';
    }

    /**
     * Get widget categories.
     *
     * @return array Widget categories.
     */
    public function get_categories()
    {
        return ['basic'];
    }

    /**
     * Get widget style dependencies.
     *
     * @return array Widget style dependencies.
     */
    public function get_style_depends()
    {
        return ['lmat-style'];
    }

    /**
     * Register widget controls.
     */
    protected function register_controls()
    {
        $this->start_controls_section(
            'section_content',
            [
                'label' => __('Language Switcher', 'linguator-multilingual-ai-translation'),
                'tab'   => Controls_Manager::TAB_CONTENT,
            ]
        );

        $this->add_control(
            'lmat_language_switcher_type',
            [
                'label'   => __('Language Switcher Type', 'linguator-multilingual-ai-translation'),
                'type'    => Controls_Manager::SELECT,
                'options' => [
                    'dropdown'   => __('Dropdown', 'linguator-multilingual-ai-translation'),
                    'vertical'   => __('Vertical', 'linguator-multilingual-ai-translation'),
                    'horizontal' => __('Horizontal', 'linguator-multilingual-ai-translation'),
                ],
                'default' => 'dropdown',
            ]
        );

        $this->add_control(
            'lmat_language_switcher_show_flags',
            [
                'label'   => __('Show Flags', 'linguator-multilingual-ai-translation'),
                'type'    => Controls_Manager::SWITCHER,
                'default' => 'yes',
            ]
        );

        $this->add_control(
            'lmat_language_switcher_show_names',
            [
                'label'   => __('Show Language Names', 'linguator-multilingual-ai-translation'),
                'type'    => Controls_Manager::SWITCHER,
                'default' => 'yes',
            ]
        );

        $this->add_control(
            'lmat_languages_switcher_show_code',
            [
                'label'   => __('Show Language Codes', 'linguator-multilingual-ai-translation'),
                'type'    => Controls_Manager::SWITCHER,
                'default' => 'yes',
            ]
        );

        $this->add_control(
            'lmat_language_switcher_hide_current_language',
            [
                'label'   => __('Hide Current Language', 'linguator-multilingual-ai-translation'),
                'type'    => Controls_Manager::SWITCHER,
                'default' => 'no',
            ]
        );

        $this->add_control(
            'lmat_language_hide_untranslated_languages',
            [
                'label'   => __('Hide Untranslated Languages', 'linguator-multilingual-ai-translation'),
                'type'    => Controls_Manager::SWITCHER,
                'default' => 'no',
            ]
        );

        $this->end_controls_section();

        $this->start_controls_section(
            'section_style',
            [
                'label' => __('Language Switcher Style', 'linguator-multilingual-ai-translation'),
                'tab'   => Controls_Manager::TAB_STYLE,
            ]
        );

        $this->add_control(
            'lmat_language_switcher_alignment',
            [
                'label'     => __('Switcher Alignment', 'linguator-multilingual-ai-translation'),
                'type'      => Controls_Manager::CHOOSE,
                'options'   => [
                    'left'   => [
                        'title' => esc_html__('Left', 'linguator-multilingual-ai-translation'),
                        'icon'  => 'eicon-h-align-left',
                    ],
                    'center' => [
                        'title' => esc_html__('Center', 'linguator-multilingual-ai-translation'),
                        'icon'  => 'eicon-h-align-center',
                    ],
                    'right'  => [
                        'title' => esc_html__('Right', 'linguator-multilingual-ai-translation'),
                        'icon'  => 'eicon-h-align-right',
                    ],
                ],
                'default'   => 'left',
                'condition' => [
                    'lmat_language_switcher_type' => 'dropdown',
                ],
                'selectors' => [
                    '{{WRAPPER}} .lmat-main-wrapper' => 'text-align: {{VALUE}};',
                ],
            ]
        );

        $this->add_control(
            'lmat_language_switcher_flag_ratio',
            [
                'label'        => __('Flag Ratio', 'linguator-multilingual-ai-translation'),
                'type'         => Controls_Manager::SELECT,
                'options'      => [
                    '11' => __('1/1', 'linguator-multilingual-ai-translation'),
                    '43' => __('4/3', 'linguator-multilingual-ai-translation'),
                ],
                'prefix_class' => 'lmat-switcher--aspect-ratio-',
                'default'      => '43',
                'selectors'    => [
                    '{{WRAPPER}} .lmat-lang-image' => '--lmat-flag-ratio: {{VALUE}};',
                ],
                'condition'    => [
                    'lmat_language_switcher_show_flags' => 'yes',
                ],
            ]
        );

        $this->add_control(
            'lmat_language_switcher_flag_width',
            [
                'label'      => __('Flag Width', 'linguator-multilingual-ai-translation'),
                'type'       => Controls_Manager::SLIDER,
                'size_units' => ['px'],
                'default'    => [
                    'unit' => 'px',
                    'size' => 20,
                ],
                'selectors'  => [
                    '{{WRAPPER}}.lmat-switcher--aspect-ratio-11 .lmat-lang-image img' => 'height: {{SIZE}}{{UNIT}} !important; width: {{SIZE}}{{UNIT}} !important;',
                    '{{WRAPPER}}.lmat-switcher--aspect-ratio-43 .lmat-lang-image img' => 'width: {{SIZE}}{{UNIT}}!important; height: calc({{SIZE}}{{UNIT}} * 0.75) !important;',
                ],
                'condition'  => [
                    'lmat_language_switcher_show_flags' => 'yes',
                ],
            ]
        );

        $this->add_control(
            'lmat_language_switcher_flag_radius',
            [
                'label'      => __('Flag Radius', 'linguator-multilingual-ai-translation'),
                'type'       => Controls_Manager::SLIDER,
                'size_units' => ['px', '%'],
                'range'      => [
                    'px' => [
                        'min'  => 0,
                        'max'  => 100,
                        'step' => 1,
                    ],
                    '%'  => [
                        'min'  => 0,
                        'max'  => 100,
                        'step' => 1,
                    ],
                ],
                'default'    => [
                    'unit' => '%',
                    'size' => 0,
                ],
                'selectors'  => [
                    '{{WRAPPER}} .lmat-lang-image img' => '--lmat-flag-radius: {{SIZE}}{{UNIT}};',
                ],
                'condition'  => [
                    'lmat_language_switcher_show_flags' => 'yes',
                ],
            ]
        );

        $this->add_control(
            'lmat_language_switcher_margin',
            [
                'label'      => esc_html__('Margin', 'linguator-multilingual-ai-translation'),
                'type'       => \Elementor\Controls_Manager::DIMENSIONS,
                'size_units' => ['px', '%', 'em', 'rem'],
                'default'    => [
                    'top'    => 0,
                    'right'  => 0,
                    'bottom' => 0,
                    'left'   => 0,
                ],
                'selectors'  => [
                    '{{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.dropdown'                     => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                    '{{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.horizontal .lmat-lang-item a' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                    '{{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.vertical .lmat-lang-item a'   => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                ],
            ]
        );

        $this->add_control(
            'lmat_language_switcher_padding',
            [
                'label'      => __('Padding', 'linguator-multilingual-ai-translation'),
                'type'       => Controls_Manager::DIMENSIONS,
                'size_units' => ['px', '%', 'em', 'rem'],
                'default'    => [
                    'top'    => 10,
                    'right'  => 10,
                    'bottom' => 10,
                    'left'   => 10,
                ],
                'selectors'  => [
                    '{{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.dropdown'                     => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                    '{{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.dropdown .lmat-lang-item'     => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                    '{{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.horizontal .lmat-lang-item a' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                    '{{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.vertical .lmat-lang-item a'   => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                ],
            ]
        );

        $this->add_group_control(
            \Elementor\Group_Control_Border::get_type(),
            [
                'name'     => 'lmat_language_switcher_border',
                'label'    => __('Border', 'linguator-multilingual-ai-translation'),
                'selector' => '{{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.dropdown, {{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.horizontal li a, {{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.vertical li a',
            ]
        );

        $this->add_control(
            'lmat_language_switcher_border_radius',
            [
                'label'      => __('Border Radius', 'linguator-multilingual-ai-translation'),
                'type'       => Controls_Manager::DIMENSIONS,
                'size_units' => ['px', '%', 'em', 'rem'],
                'default'    => [
                    'top'    => 0,
                    'right'  => 0,
                    'bottom' => 0,
                    'left'   => 0,
                ],
                'selectors'  => [
                    '{{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.dropdown'                     => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                    '{{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.dropdown .lmat-language-list' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                    '{{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.horizontal li a'              => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                    '{{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.vertical li a'                => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                ],

            ]
        );
        $this->start_controls_tabs('lmat_language_switcher_style_tabs');
        $this->start_controls_tab(
            'lmat_language_switcher_style_tab_normal',
            [
                'label' => __('Normal', 'linguator-multilingual-ai-translation'),
            ]
        );
        $this->add_group_control(
            \Elementor\Group_Control_Typography::get_type(),
            [
                'name'     => 'lmat_language_switcher_typography',
                'label'    => __('Typography', 'linguator-multilingual-ai-translation'),
                'selector' => '{{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.dropdown .lmat-active-language a div:not(.lmat-lang-image), {{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.dropdown .lmat-lang-item a, {{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.horizontal .lmat-lang-item a, {{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.vertical .lmat-lang-item a',
            ]
        );
        $this->add_control(
            'lmat_language_switcher_background_color',
            [
                'label'     => __('Switcher Background Color', 'linguator-multilingual-ai-translation'),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.dropdown'                     => '--lmat-normal-bg-color: {{VALUE}};',
                    '{{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.dropdown ul li'               => '--lmat-normal-bg-color: {{VALUE}};',
                    '{{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.horizontal .lmat-lang-item a' => '--lmat-normal-bg-color: {{VALUE}};',
                    '{{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.vertical .lmat-lang-item a'   => '--lmat-normal-bg-color: {{VALUE}};',
                ],
            ]
        );

        $this->add_control(
            'lmat_language_switcher_text_color',
            [
                'label'     => __('Switcher Text Color', 'linguator-multilingual-ai-translation'),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.dropdown .lmat-active-language,{{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.dropdown .lmat-lang-item a, {{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.horizontal .lmat-lang-item a, {{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.vertical .lmat-lang-item a' => '--lmat-normal-text-color: {{VALUE}};',
                ],
            ]
        );
        $this->end_controls_tab();

        $this->start_controls_tab(
            'lmat_language_switcher_style_tab_hover',
            [
                'label' => __('Hover', 'linguator-multilingual-ai-translation'),
            ]
        );
        $this->add_group_control(
            \Elementor\Group_Control_Typography::get_type(),
            [
                'name'     => 'lmat_language_switcher_typography_hover',
                'label'    => __('Typography', 'linguator-multilingual-ai-translation'),
                'selector' => '{{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.dropdown .lmat-active-language:hover,{{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.dropdown .lmat-lang-item a:hover, {{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.horizontal .lmat-lang-item a:hover, {{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.vertical .lmat-lang-item a:hover',
            ]
        );
        $this->add_control(
            'lmat_language_switcher_background_color_hover',
            [
                'label'     => __('Switcher Background Color', 'linguator-multilingual-ai-translation'),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.dropdown:hover'                     => '--lmat-normal-bg-color: {{VALUE}};',
                    '{{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.dropdown ul li:hover'               => '--lmat-normal-bg-color: {{VALUE}};',
                    '{{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.horizontal .lmat-lang-item a:hover' => '--lmat-normal-bg-color: {{VALUE}};',
                    '{{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.vertical .lmat-lang-item a:hover'   => '--lmat-normal-bg-color: {{VALUE}};',
                ],
            ]
        );

        $this->add_control(
            'lmat_language_switcher_text_color_hover',
            [
                'label'     => __('Switcher Text Color', 'linguator-multilingual-ai-translation'),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.dropdown:hover .lmat-active-language,{{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.dropdown .lmat-lang-item:hover a, {{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.horizontal .lmat-lang-item a:hover, {{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.vertical .lmat-lang-item a:hover' => '--lmat-normal-text-color: {{VALUE}};',
                ],
            ]
        );
        $this->end_controls_tab();

        $this->end_controls_tabs();

        $this->end_controls_section();

        $this->start_controls_section(
            'section_dropdown_style',
            [
                'label'     => __('Dropdown Style', 'linguator-multilingual-ai-translation'),
                'tab'       => Controls_Manager::TAB_STYLE,
                'condition' => [
                    'lmat_language_switcher_type' => 'dropdown',
                ],
            ]
        );

        $this->add_control(
            'lmat_language_switcher_dropown_direction',
            [
                'label'        => __('Dropdown Direction', 'linguator-multilingual-ai-translation'),
                'type'         => Controls_Manager::SELECT,
                'options'      => [
                    'up'   => __('Up', 'linguator-multilingual-ai-translation'),
                    'down' => __('Down', 'linguator-multilingual-ai-translation'),
                ],
                'default'      => 'down',
                'condition'    => [
                    'lmat_language_switcher_type' => 'dropdown',
                ],
                'prefix_class' => 'lmat-dropdown-direction-',
            ]
        );

        $this->add_control(
            'lmat_language_switcher_icon',
            [
                'label'                  => __('Switcher Icon', 'linguator-multilingual-ai-translation'),
                'type'                   => Controls_Manager::ICONS,
                'default'                => [
                    'value'   => 'fas fa-caret-down',
                    'library' => 'fa-solid',
                ],
                'include'                => ['fa-solid', 'fa-regular', 'fa-brands'],
                'exclude_inline_options' => 'svg',
                'label_block'            => false,
                'skin'                   => 'inline',
                'condition'              => [
                    'lmat_language_switcher_type' => 'dropdown',
                ],
            ]
        );

        $this->add_control(
            'lmat_language_switcher_icon_size',
            [
                'label'      => __('Icon Size', 'linguator-multilingual-ai-translation'),
                'type'       => Controls_Manager::SLIDER,
                'size_units' => ['px', '%'],
                'range'      => [
                    'px' => [
                        'min'  => 0,
                        'max'  => 100,
                        'step' => 1,
                    ],
                    '%'  => [
                        'min'  => 0,
                        'max'  => 100,
                        'step' => 1,
                    ],
                ],
                'condition'  => [
                    'lmat_language_switcher_type' => 'dropdown',
                ],
                'selectors'  => [
                    '{{WRAPPER}} .lmat-dropdown-icon' => 'font-size: {{SIZE}}{{UNIT}};',
                ],
            ]
        );

        $this->add_control(
            'lmat_language_switcher_icon_color',
            [
                'label'     => __('Icon Color', 'linguator-multilingual-ai-translation'),
                'type'      => Controls_Manager::COLOR,
                'condition' => [
                    'lmat_language_switcher_type' => 'dropdown',
                ],
                'selectors' => [
                    '{{WRAPPER}} .lmat-dropdown-icon' => 'color: {{VALUE}};',
                ],
            ]
        );

        $this->add_control(
            'lmat_language_switcher_icon_spacing',
            [
                'label'      => __('Icon Spacing', 'linguator-multilingual-ai-translation'),
                'type'       => Controls_Manager::SLIDER,
                'size_units' => ['px', '%'],
                'range'      => [
                    'px' => [
                        'min'  => 0,
                        'max'  => 100,
                        'step' => 1,
                    ],
                ],
                'condition'  => [
                    'lmat_language_switcher_type' => 'dropdown',
                ],
                'selectors'  => [
                    '{{WRAPPER}} .lmat-dropdown-icon' => 'margin-left: {{SIZE}}{{UNIT}};',
                ],
            ]
        );

        $this->add_control(
            'lmat_language_switcher_dropdwon_spacing',
            [
                'label'      => __('Dropdown Spacing', 'linguator-multilingual-ai-translation'),
                'type'       => Controls_Manager::SLIDER,
                'size_units' => ['px'],
                'range'      => [
                    'px' => [
                        'min'  => 0,
                        'max'  => 50,
                        'step' => 1,
                    ],
                ],
                'default'    => [
                    'unit' => 'px',
                    'size' => 0,
                ],
                'selectors'  => [
                    '{{WRAPPER}}.lmat-dropdown-direction-down .lmat-wrapper.dropdown ul' => 'margin-top: {{SIZE}}{{UNIT}};',
                    '{{WRAPPER}}.lmat-dropdown-direction-up .lmat-wrapper.dropdown ul'   => 'margin-bottom: {{SIZE}}{{UNIT}};',
                ],
            ]
        );

        $this->add_group_control(
            \Elementor\Group_Control_Border::get_type(),
            [
                'name'           => 'lmat_language_switcher_dropdown_list_border',
                'label'          => __('Dropdown List Border', 'linguator-multilingual-ai-translation'),
                'separator'      => 'before',
                'selector'       => '{{WRAPPER}} .lmat-main-wrapper .lmat-wrapper.dropdown ul',
                'fields_options' => [
                    'border' => [
                        'label' => __('Dropdown List Border', 'linguator-multilingual-ai-translation'),
                    ],
                    'width'  => [
                        'label' => __('Border Width', 'linguator-multilingual-ai-translation'),
                    ],
                    'color'  => [
                        'label' => __('Border Color', 'linguator-multilingual-ai-translation'),
                    ],
                ],
            ]
        );

        $this->add_control(
            'lmat_language_switcher_dropdown_language_item_separator',
            [
                'label'      => __('Language Item Separator', 'linguator-multilingual-ai-translation'),
                'type'       => Controls_Manager::SLIDER,
                'size_units' => ['px'],
                'range'      => [
                    'px' => [
                        'min'  => 0,
                        'max'  => 50,
                        'step' => 1,
                    ],
                ],
                'selectors'  => [
                    '{{WRAPPER}} .lmat-wrapper.dropdown ul.lmat-language-list li.lmat-lang-item:not(:last-child)' => 'border-bottom: {{SIZE}}{{UNIT}} solid;',
                ],
            ]
        );

        $this->add_control(
            'lmat_language_switcher_dropdown_language_item_separator_color',
            [
                'label'     => __('Separator Color', 'linguator-multilingual-ai-translation'),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .lmat-wrapper.dropdown ul.lmat-language-list li.lmat-lang-item:not(:last-child)' => 'border-bottom-color: {{VALUE}};',
                ],
            ]
        );
        $this->end_controls_section();
    }

    /**
     * Localize Linguator data for the widget.
     *
     * @param array $data Data to be localized.
     * @return array Localized data.
     */
    public function lmat_localize_lmat_data($data)
    {
        try {
                // Try different approach - get languages without show_flags first
                $languages_raw = lmat_the_languages(['raw' => 1, 'show_flags' => 0]);
                if (empty($languages_raw)) {
                    return $data; // If no languages, exit early
                }
                $lang_curr = strtolower(lmat_current_language());
                if (empty($lang_curr)) {
                    $lang_curr = strtolower(lmat_default_language());
                }

                
                $languages = array_map(
                    function ($language) {
                        // Get flag HTML directly from language object if available
                        $flag_html = '';
                        if (function_exists('LMAT') && !empty(LMAT()->model)) {
                            $lang_objects = LMAT()->model->get_languages_list();
                            foreach ($lang_objects as $lang_obj) {
                                if ($lang_obj->slug === $language['slug']) {
                                    $flag_html = $lang_obj->get_display_flag();
                                    break;
                                }
                            }
                        }
                        
                        // Fallback to original flag if available
                        if (empty($flag_html) && !empty($language['flag'])) {
                            $flag_html = $language['flag'];
                        }
                        

                        
                        return $language['name'] = [
                            'slug'           => esc_html($language['slug']),
                            'name'           => esc_html($language['name']),
                            'no_translation' => esc_html($language['no_translation']),
                            'url'            => esc_url($language['url']),
                            'flag'           => $flag_html, // Use our generated flag HTML
                        ];
                    },
                    $languages_raw
                );
                $custom_data = [
                    'lmatLanguageData' => $languages,
                    'lmatCurrentLang'  => esc_html($lang_curr),
                    'lmatPluginUrl'    => esc_url(LINGUATOR_URL),
                ];
                $custom_data_json = $custom_data;
                $data['lmatGlobalObj'] = $custom_data_json;
        } catch (Exception $e) {
            // Handle exception if needed
        }
        return $data;
    }
    /**
     * Render the widget output on the frontend.
     */
    protected function render()
    {
        $settings = $this->get_active_settings();

        // Get the localized data
        $data      = $this->lmat_localize_lmat_data([]);
        $lmat_data = isset($data['lmatGlobalObj']) ? $data['lmatGlobalObj'] : [];
        if (empty($lmat_data)) {
            return;
        }
        if ($settings['lmat_language_switcher_show_flags'] !== 'yes' && $settings['lmat_language_switcher_show_names'] !== 'yes' && $settings['lmat_languages_switcher_show_code'] !== 'yes') {
            return;
        }
        $switcher_html = '';
        $switcher_html .= '<div class="lmat-main-wrapper">';
        if ($settings['lmat_language_switcher_type'] == 'dropdown') {
            $switcher_html .= '<div class="lmat-wrapper dropdown">';
            $switcher_html .= $this->lmat_render_dropdown_switcher($settings, $lmat_data);
            $switcher_html .= '</div>';
        } else {
            $switcher_html .= '<div class="lmat-wrapper ' . esc_attr($settings['lmat_language_switcher_type']) . '">';
            $switcher_html .= $this->lmat_render_switcher($settings, $lmat_data);
            $switcher_html .= '</div>';
        }
        $switcher_html .= '</div>';
        echo wp_kses( 
            $switcher_html, 
            array( 
                'div' => array( 'class' => true, 'id' => true ),
                'ul' => array( 'class' => true ),
                'li' => array( 'class' => true ),
                'a' => array( 'href' => true, 'class' => true, 'lang' => true, 'hreflang' => true, 'aria-current' => true ),
                'span' => array( 'class' => true ),
                'img' => array( 'src' => true, 'alt' => true, 'class' => true, 'width' => true, 'height' => true, 'style' => true, 'decoding' => true, 'title' => true ),
                'i' => array( 'class' => true )
            ), 
            array_merge( wp_allowed_protocols(), array( 'data' ) ) 
        );
    }

    /**
     * Render dropdown switcher.
     *
     * @param array $settings Widget settings.
     * @param array $lmat_data Language data.
     * @return string HTML output.
     */
    public function lmat_render_dropdown_switcher($settings, $lmat_data)
    {
        $languages    = $lmat_data['lmatLanguageData'];
        $current_lang = $lmat_data['lmatCurrentLang'];

        // If current language should be shown, use it as active language
        if ($settings['lmat_language_switcher_hide_current_language'] !== 'yes') {
            $active_language = isset($languages[$current_lang]) ? $languages[$current_lang] : null;
        } else {
            // Find first available language that's not the current language
            $active_language = null;
            foreach ($languages as $lang) {
                if ($current_lang !== $lang['slug'] &&
                    ! ($lang['no_translation'] && $settings['lmat_language_hide_untranslated_languages'] === 'yes')) {
                    $active_language = $lang;
                    break;
                }
            }
        }

        // If no language found, return empty
        if (! $active_language) {
            return '';
        }

        $active_html    = self::lmat_get_active_language_html($active_language, $settings);
        $languages_html = '';

        foreach ($languages as $lang) {
            
            // Skip if it's the current language (when hidden), active language, or untranslated language
            if (($current_lang === $lang['slug'] && $settings['lmat_language_switcher_hide_current_language'] === 'yes') ||
                $active_language['slug'] === $lang['slug'] ||
                ($lang['no_translation'] && $settings['lmat_language_hide_untranslated_languages'] === 'yes')) {
                continue;
            }

            $languages_html .= '<li class="lmat-lang-item">';
            $languages_html .= '<a href="' . esc_url($lang['url']) . '">';
            if (! empty($settings['lmat_language_switcher_show_flags']) && $settings['lmat_language_switcher_show_flags'] === 'yes') {
                $languages_html .= '<div class="lmat-lang-image">' . $lang['flag'] . '</div>';
            }
            if (! empty($settings['lmat_language_switcher_show_names']) && $settings['lmat_language_switcher_show_names'] === 'yes') {
                $languages_html .= '<div class="lmat-lang-name">' . esc_html($lang['name']) . '</div>';
            }
            if (! empty($settings['lmat_languages_switcher_show_code']) && $settings['lmat_languages_switcher_show_code'] === 'yes') {
                $languages_html .= '<div class="lmat-lang-code">' . esc_html($lang['slug']) . '</div>';
            }
            $languages_html .= '</a></li>';
        }

        return $active_html . '<ul class="lmat-language-list">' . $languages_html . '</ul>';
    }

    /**
     * Get active language HTML.
     *
     * @param array  $language Language data.
     * @param array  $settings Widget settings.
     * @return string HTML output.
     */
    public static function lmat_get_active_language_html($language, $settings)
    {
        $html = '<span class="lmat-active-language">';
        $html .= '<a href="' . esc_url($language['url']) . '">';
        if (! empty($settings['lmat_language_switcher_show_flags']) && $settings['lmat_language_switcher_show_flags'] === 'yes') {
            $html .= '<div class="lmat-lang-image">' . $language['flag'] . '</div>';
        }
        if (! empty($settings['lmat_language_switcher_show_names']) && $settings['lmat_language_switcher_show_names'] === 'yes') {
            $html .= '<div class="lmat-lang-name">' . esc_html($language['name']) . '</div>';
        }
        if (! empty($settings['lmat_languages_switcher_show_code']) && $settings['lmat_languages_switcher_show_code'] === 'yes') {
            $html .= '<div class="lmat-lang-code">' . esc_html($language['slug']) . '</div>';
        }
        if (! empty($settings['lmat_language_switcher_icon'])) {
            $html .= '<i class="lmat-dropdown-icon ' . esc_attr($settings['lmat_language_switcher_icon']['value']) . '"></i>';
        }
        $html .= '</a></span>';
        return $html;
    }

    /**
     * Render Vertcal and Horizontal switcher.
     *
     * @param array $settings Widget settings.
     * @param array $lmat_data Language data.
     * @return string HTML output.
     */
    public static function lmat_render_switcher($settings, $lmat_data)
    {
        $html         = '';
        $languages    = $lmat_data['lmatLanguageData'];
        $current_lang = $lmat_data['lmatCurrentLang'];
        foreach ($languages as $lang) {
            if (($current_lang === $lang['slug'] && $settings['lmat_language_switcher_hide_current_language'] === 'yes') ||
                ($lang['no_translation'] && $settings['lmat_language_hide_untranslated_languages'] === 'yes')) {
                continue;
            }

            $anchor_open  = '<a href="' . esc_url($lang['url']) . '">';
            $anchor_close = '</a>';

            $html .= '<li class="lmat-lang-item">';
            $html .= $anchor_open;
            if (! empty($settings['lmat_language_switcher_show_flags']) && $settings['lmat_language_switcher_show_flags'] === 'yes') {
                $html .= '<div class="lmat-lang-image">' . $lang['flag'] . '</div>';
            }
            if (! empty($settings['lmat_language_switcher_show_names']) && $settings['lmat_language_switcher_show_names'] === 'yes') {
                $html .= '<div class="lmat-lang-name">' . esc_html($lang['name']) . '</div>';
            }
            if (! empty($settings['lmat_languages_switcher_show_code']) && $settings['lmat_languages_switcher_show_code'] === 'yes') {
                $html .= '<div class="lmat-lang-code">' . esc_html($lang['slug']) . '</div>';
            }
            $html .= $anchor_close;
            $html .= '</li>';
        }
        return $html;
    }
}
