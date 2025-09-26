<?php
namespace Linguator\Admin\cpfm_feedback\cron;

if ( ! defined( 'ABSPATH' )) exit;

if (!class_exists('LMAT_cronjob')) {
    class LMAT_cronjob
    {

        public function __construct() {
          // Register cron jobs
            add_filter('cron_schedules', array($this, 'lmat_cron_schedules'));
            add_action('lmat_extra_data_update', array($this, 'lmat_cron_extra_data_autoupdater'));
        }
        
        function lmat_cron_extra_data_autoupdater() {
            if (class_exists('LMAT_cronjob')) {
                LMAT_cronjob::lmat_send_data();
            }
        }
           
        static public function lmat_send_data() {
                   
            $feedback_url = LINGUATOR_FEEDBACK_API . 'wp-json/coolplugins-feedback/v1/site';
            require_once LINGUATOR_DIR . '/admin/feedback/admin-feedback.php';
            
            $extra_data         = new \Linguator\Admin\Feedback\LMAT_Admin_Feedback();
            $extra_data_details = $extra_data->cpfm_get_user_info();
            
            $server_info    = $extra_data_details['server_info'];
            $extra_details  = $extra_data_details['extra_details'];
            $site_url       = esc_url( site_url() );
            $install_date   = get_option('lmat_install_date');
            $uni_id         = '53';
            $site_id        = $site_url . '-' . $install_date . '-' . $uni_id;
            $initial_version = defined('LINGUATOR_VERSION') ? LINGUATOR_VERSION : 'N/A';
            $initial_version = is_string($initial_version) ? sanitize_text_field($initial_version) : 'N/A';
            $plugin_version = defined('LINGUATOR_VERSION') ? LINGUATOR_VERSION : 'N/A';
            $admin_email    = sanitize_email(get_option('admin_email') ?: 'N/A');
            
            $post_data = array(

                'site_id'           => md5($site_id),
                'plugin_version'    => $plugin_version,
                'plugin_name'       => 'Linguator – Multilingual AI Translation',
                'plugin_initial'    => $initial_version,
                'email'             => $admin_email,
                'site_url'          => $site_url,
                'server_info'       => $server_info,
                'extra_details'     => $extra_details,
            );
            
            $response = wp_remote_post($feedback_url, array(

                'method'    => 'POST',
                'timeout'   => 30,
                'headers'   => array(
                    'Content-Type' => 'application/json',
                ),
                'body'      => wp_json_encode($post_data),
            ));
            
            if (is_wp_error($response)) {
                return;
            }
            
            $response_body  = wp_remote_retrieve_body($response);
            $decoded        = json_decode($response_body, true);
            
            // Schedule the cron job for future updates
            if (!wp_next_scheduled('lmat_extra_data_update')) {
                wp_schedule_event(time(), 'every_30_days', 'lmat_extra_data_update');
            }
        }
          
        /**
         * Cron status schedule(s).
         */
        public function lmat_cron_schedules($schedules)
        {
            // 30days schedule for update information
            if (!isset($schedules['every_30_days'])) {

                $schedules['every_30_days'] = array(
                    'interval' => 30 * 24 * 60 * 60, // 2,592,000 seconds
                    'display'  => __('Once every 30 days', 'linguator-multilingual-ai-translation'),
                );
            }

            return $schedules;
        }

    }
}
