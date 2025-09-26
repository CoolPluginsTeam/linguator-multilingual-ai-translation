<?php
namespace Linguator\Includes\Other;

if(!defined('ABSPATH')){
    exit;
}

/**
 * Dashboard
 * 
 * example:
 * 
 * Dashbord initialize
 * if(!class_exists('LMAT_Translation_Dashboard')){
 * $dashboard=LMAT_Translation_Dashboard::get_instance();
 * }
 * 
 * Store options
 * if(class_exists('LMAT_Translation_Dashboard')){
 *  LMAT_Translation_Dashboard::store_options(
 *      'prefix', // Required plugin prefix
 *      'unique_key',// Optional unique key is used to update the data based on post/page id or plugin/themes name
 *      'update', // Optional preview string count or character count update or replace
 *      array(
 *           'post/page or theme/plugin name' => 'name or id',
 *          'post_title (optional)' => 'Post Title',
 *          'service_provider' => 'google', // don't change this key
 *          'source_language' => 'en', // don't change this key
 *          'target_language' => 'fr', // don't change this key
 *          'time_taken' => '10', // don't change this key
 *          'string_count'=>10, 
 *          'character_count'=>100, 
 *          'date_time' => date('Y-m-d H:i:s'),
 *      ) // Required data array
 *  );
 * }
 * 
 * Add Tabs
 * add_filter('LMAT_Translation_Dashboard_tabs', function($tabs){
 *  $tabs[]=array(
 *      'prefix'=>'tab_name', // Required
 *      'tab_name'=>'Tab Name', // Required
 *      'columns'=>array(
 *          'post_id or plugin_name'=>'Post Id or Plugin Name',
 *          'post_title (optional)'=>'Post Title',
 *          'string_count'=>'String Count',
 *           'character_count'=>'Character Count',
 *           'service_provider'=>'Service Provider',
 *           'time_taken'=>'Time Taken',
 *           'date_time'=>'Date Time',
 *      ) // columns Required
 *  );
 *  return $tabs;
 * });
 * 
 * Display review notice
 * if(class_exists('LMAT_Translation_Dashboard')){
 *  LMAT_Translation_Dashboard::review_notice(
 *      'prefix', // Required
 *      'plugin_name', // Required
 *      'url', // Required
 *      'icon' // Optional
 *  );
 * }
 * 
 * Get translation data
 * if(class_exists('LMAT_Translation_Dashboard')){
 *  LMAT_Translation_Dashboard::get_translation_data(
 *      'prefix', // Required
 *      array(
 *          'editor_type' => 'gutenberg', // optional return data based on editor type
 *          'post_id' => '123', // optional return data based on post id
 *      ) // Optional
 *  );
 * }
 */

if(!class_exists('LMAT_Translation_Dashboard')){
    class LMAT_Translation_Dashboard{

        /**
         * Init
         * @var object
         */
        private static $init;

        /**
         * Tabs data
         * @var array
         */
        private $tabs_data=array();

        /**
         * Instance
         * @return object
         */
        public static function get_instance(){
            if(!isset(self::$init)){
                self::$init = new self();
            }
            return self::$init;
        }

        public function __construct(){
            add_action('wp_ajax_lmat_hide_review_notice', array($this, 'lmat_hide_review_notice'));
        }

        /**
         * Sort column data
         * @param array $columns
         * @param array $value
         * @return array
         */
        public function sort_column_data($columns, $value){
            $result = array();
            foreach($columns as $key => $label) {
                $result[$key] = isset($value[$key]) ? sanitize_text_field($value[$key]) : '';
            }
            return $result;
        }

        /**
         * Store options
         * @param string $plugin_name
         * @param string $prefix
         * @param array $data
         * @return void
         */
        public static function store_options($prefix='', $unique_key='', $old_data='update', array $data = array()){
            if(!empty($prefix) && isset($data['string_count']) && isset($data['character_count'])){
                $prefix = sanitize_key($prefix);
                $all_data = get_option('cpt_dashboard_data', array());
                
                if(isset($all_data[$prefix])){
                    $data_update = false;
                    foreach($all_data[$prefix] as $key => $translate_data){
                        if(!empty($unique_key) && isset($translate_data[$unique_key]) && 
                        sanitize_text_field($translate_data[$unique_key]) === sanitize_text_field($data[$unique_key]) && 
                        sanitize_text_field($translate_data['service_provider']) === sanitize_text_field($data['service_provider']) &&
                        sanitize_text_field($translate_data['target_language']) === sanitize_text_field($data['target_language']) &&
                        sanitize_text_field($translate_data['source_language']) === sanitize_text_field($data['source_language'])
                        ){
                            
                            if($old_data=='update'){
                                $data['string_count'] = absint($data['string_count']) + absint($translate_data['string_count']);
                                $data['character_count'] = absint($data['character_count']) + absint($translate_data['character_count']);
                                $data['time_taken'] = absint($data['time_taken']) + absint($translate_data['time_taken']);
                            }
                            
                            foreach($data as $id => $value){
                                $all_data[$prefix][$key][sanitize_key($id)] = sanitize_text_field($value);
                            }
                            $data_update = true;
                        }
                    }

                    if(!$data_update){
                        $all_data[$prefix][] = array_map('sanitize_text_field', $data);
                    }
                }else{
                    $all_data[$prefix][] = array_map('sanitize_text_field', $data);
                }

                update_option('cpt_dashboard_data', $all_data);
            }
        }

        /**
         * Get translation data
         * @param string $prefix
         * @return array
         */
        public static function get_translation_data($prefix, $key_exists=array()){
            $prefix = sanitize_key($prefix);
            $all_data = get_option('cpt_dashboard_data', array());
            $data = array();
            $used_service_providers = array();

            if(isset($all_data[$prefix])){
                $total_string_count = 0;
                $total_character_count = 0;
                $total_time_taken = 0;

                foreach($all_data[$prefix] as $key => $value){

                    $continue=false;
                    foreach($key_exists as $key_exists_key => $key_exists_value){
                        if(!isset($value[$key_exists_key]) || (isset($value[$key_exists_key]) && $value[$key_exists_key] !== $key_exists_value)){
                            $continue=true;
                            break;
                        }
                    }

                    if($continue){
                        continue;
                    }

                    $total_string_count += isset($value['string_count']) ? absint($value['string_count']) : 0;
                    $total_character_count += isset($value['character_count']) ? absint($value['character_count']) : 0;
                    $total_time_taken += isset($value['time_taken']) ? absint($value['time_taken']) : 0;
                    if(!in_array(sanitize_text_field($value['service_provider']), $used_service_providers)){
                        $used_service_providers[] = isset($value['service_provider']) ? sanitize_text_field($value['service_provider']) : '';
                    }
                }

                $data = array(
                    'prefix' => $prefix,
                    'data' => array_map(function($item) {
                        return array_map('sanitize_text_field', $item);
                    }, $all_data[$prefix]),
                    'total_string_count' => $total_string_count,
                    'total_character_count' => $total_character_count,
                    'total_time_taken' => $total_time_taken,
                    'service_providers' => $used_service_providers,
                );
            }else{
                $data = array(
                    'prefix' => $prefix,
                    'total_string_count' => 0,
                    'total_character_count' => 0,
                    'total_time_taken' => 0,
                );
            }

            return $data;
        }

        public static function ctp_enqueue_assets(){
            if(function_exists('wp_style_is') && !wp_style_is('lmat-review-style', 'enqueued')){
                wp_enqueue_style('lmat-review-style', plugins_url('admin/assets/css/cpt-dashboard.css', LINGUATOR_ROOT_FILE), array(), LINGUATOR_VERSION, 'all');
                wp_enqueue_script('lmat-review-script', plugins_url('admin/assets/js/cpt-dashboard.js', LINGUATOR_ROOT_FILE), array('jquery'), LINGUATOR_VERSION, true);
            }
        }

        public static function format_number_count($number){
            if ($number >= 1000000) {
                return round($number / 1000000, 1) . 'M';
            } elseif ($number >= 1000) {
                return round($number / 1000, 1) . 'K';
            }
            return $number;
        }

        public static function review_notice($prefix, $plugin_name, $url){
            if(self::lmat_hide_review_notice_status($prefix)){
                return;
            }
            
            $translation_data = self::get_translation_data($prefix);
            
            $total_character_count = is_array($translation_data) && isset($translation_data['total_character_count']) ? $translation_data['total_character_count'] : 0;
            
            if($total_character_count < 50000){ 
                return;
            }
            
            $total_character_count = self::format_number_count($total_character_count);
            
            add_action('admin_enqueue_scripts', array(self::class, 'ctp_enqueue_assets'));

            $message = sprintf(
                '%s! %s <strong>%s</strong> %s <br>%s %s <br>',
                __('Thanks for using', 'cp-notice') . ' <b>' . $plugin_name . '</b>',
                __('You\'ve translated', 'cp-notice'),
                esc_html($total_character_count) . ' ' . __('characters', 'cp-notice'),
                __('so far using our plugin!', 'cp-notice'),
                __('If our plugin saves your time and effort, please support us with a review', 'cp-notice'),
                __('your feedback means everything!', 'cp-notice')
            );

            $prefix = sanitize_key($prefix);
            $message = wp_kses_post($message);
            $url = esc_url($url);
            $plugin_name = sanitize_text_field($plugin_name);

            $allowed = [
                'div' => [ 'class' => true, 'data-prefix' => true, 'data-nonce' => true ],
                'p' => [],
                'a' => [ 'href' => true, 'target' => true, 'class' => true ],
                'button' => [ 'class' => true ],
            ];

            add_action('admin_notices', function() use ($message, $prefix, $url, $allowed){
                $html= '<div class="notice notice-info is-dismissible cpt-review-notice">';
                
                $html .= '<div class="cpt-review-notice-content"><p>'.wp_kses_post($message).'</p><div class="lmat-review-notice-dismiss" data-prefix="'.esc_attr($prefix).'" data-nonce="'.esc_attr(wp_create_nonce('lmat_hide_review_notice')).'"><a href="'.esc_url($url).'" target="_blank" class="button button-primary">Rate Now! ★★★★★</a><button class="button cpt-already-reviewed">'.esc_html__('Already Reviewed', 'cp-notice').'</button><button class="button cpt-not-interested">'.esc_html__('Not Interested', 'cp-notice').'</button></div></div></div>';
                
                echo wp_kses($html, $allowed);
            });

            add_action('lmat_display_admin_notices', function() use ($message, $prefix, $url, $allowed){
                $html= '<div class="notice notice-info is-dismissible cpt-review-notice">';
                $html .= '<div class="cpt-review-notice-content"><p>'.$message.'</p><div class="lmat-review-notice-dismiss" data-prefix="'.$prefix.'" data-nonce="'.wp_create_nonce('lmat_hide_review_notice').'"><a href="'. $url .'" target="_blank" class="button button-primary">Rate Now! ★★★★★</a><button class="button cpt-not-interested">'.__('Not Interested', 'cp-notice').'</button><button class="button cpt-already-reviewed">'.__('Already Reviewed', 'cp-notice').'</button></div></div></div>';
                
                echo wp_kses($html, $allowed);
            });
        }

        public static function lmat_hide_review_notice_status($prefix){
            $review_notice_dismissed = get_option('cpt_review_notice_dismissed', array());
            return isset($review_notice_dismissed[$prefix]) ? $review_notice_dismissed[$prefix] : false;
        }

        public function lmat_hide_review_notice(){
            if(!current_user_can('manage_options')){
                wp_send_json_error( __( 'Unauthorized', 'autopoly-ai-translation-for-polylang-pro' ), 403 );
                wp_die( '0', 403 );
            }

            if(wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['nonce'])), 'lmat_hide_review_notice')){
                $prefix = sanitize_key(wp_unslash($_POST['prefix']));
                $review_notice_dismissed = get_option('cpt_review_notice_dismissed', array());
                $review_notice_dismissed[$prefix] = true;
                update_option('cpt_review_notice_dismissed', $review_notice_dismissed);
                wp_send_json_success();
            }else{
                wp_send_json_error( __( 'Invalid nonce', 'autopoly-ai-translation-for-polylang-pro' ), 400 );
                wp_die( '0', 400 );
            }
        }
    }
}
