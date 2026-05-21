<?php
/**
 * Plugin Name:      Multilingual AI Translator
 * Plugin URI:        https://linguator.com/
 * Description:       Create a multilingual WordPress website in minutes with Multilingual AI Translator.
 * Version:           1.1.1
 * Requires at least: 6.2
 * Requires PHP:      7.2
 * Author:            Cool Plugins
 * Author URI:        https://coolplugins.net/?utm_source=lmat_plugin&utm_medium=inside&utm_campaign=author_page&utm_content=plugins_list
 * Text Domain:       linguator-multilingual-ai-translation
 * License:           GPL2
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Early check: If Translate Words is active, stop loading Linguator completely
 * This prevents duplicate menus and conflicts
 */
// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
$active_plugins = get_option( 'active_plugins', array() );
if ( in_array( 'translate-words/translate-wp-words.php', $active_plugins, true ) && file_exists( WP_PLUGIN_DIR . '/translate-words/includes/core/linguator.php' ) ) {
	// Translate Words is active and has Linguator functionality bundled, stop loading this plugin
	return;
}

use Linguator\Includes\Core\Linguator;
use Linguator\Install\Linguator_Activate;
use Linguator\Install\Linguator_Deactivate;
use Linguator\Install\Linguator_Usable;



// Linguator constants - wrapped in checks to prevent redeclaration
if ( ! defined( 'LINGUATOR_VERSION' ) ) {
	define( 'LINGUATOR_VERSION', '1.1.1' );
}
if ( ! defined( 'LMAT_MIN_WP_VERSION' ) ) {
	define( 'LMAT_MIN_WP_VERSION', '6.2' );
}
if ( ! defined( 'LMAT_MIN_PHP_VERSION' ) ) {
	define( 'LMAT_MIN_PHP_VERSION', '7.2' );
}
if ( ! defined( 'LINGUATOR_FILE' ) ) {
	define( 'LINGUATOR_FILE', __FILE__ );
}
if ( ! defined( 'LINGUATOR_DIR' ) ) {
	define( 'LINGUATOR_DIR', __DIR__ );
}
if ( ! defined( 'LINGUATOR_URL' ) ) {
	define( 'LINGUATOR_URL', plugin_dir_url( LINGUATOR_FILE ) );
}
if ( ! defined( 'LINGUATOR_FEEDBACK_API' ) ) {
	define( 'LINGUATOR_FEEDBACK_API', 'https://feedback.coolplugins.net/' );
}
// Whether we are using Linguator, get the filename of the plugin in use.
if ( ! defined( 'LINGUATOR_ROOT_FILE' ) ) {
	define( 'LINGUATOR_ROOT_FILE', __FILE__ );
}

if ( ! defined( 'LINGUATOR_BASENAME' ) ) {
	define( 'LINGUATOR_BASENAME', plugin_basename( __FILE__ ) ); // Plugin name as known by WP.
	require __DIR__ . '/vendor/autoload.php';
}

if ( ! defined( 'LINGUATOR' ) ) {
	define( 'LINGUATOR', ucwords( str_replace( '-', ' ', dirname( LINGUATOR_BASENAME ) ) ) );
}

// Load legacy Translate Words functionality only for legacy users
add_action( 'init', function() {

	if(!get_option('linguator_install_date')){
		add_option('linguator_install_date', gmdate('Y-m-d h:i:s'));
	}

	if(!get_option('linguator_initial_version')){
		add_option('linguator_initial_version', LINGUATOR_VERSION);
	}

	if(get_option('linguator_initial_version')>'1.2.6'){
		update_option('linguator_initial_version', '1.2.6');
	}
}, 1 );

// Handle redirect after activation and language switcher visibility
add_action('admin_init', function() {
	// Don't redirect to wizard if Polylang is detected
	if ( defined( 'POLYLANG_VERSION' ) ) {
		return;
	}
	// Only run for users who can manage options
	if ( ! current_user_can( 'manage_options' ) ) {
        return;
	}
	// Only check setup flag on plugins page to avoid unnecessary database queries
	$is_plugins_page = false;
	if ( isset( $_SERVER['REQUEST_URI'] ) ) {
        $request_uri = sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) );
        $is_plugins_page = strpos( $request_uri, 'plugins.php' ) !== false;
    }
	// Only run on plugins page
	if ( $is_plugins_page ) {
		if ( get_option( 'lmat_needs_setup' ) === 'yes' ) {

            // phpcs:ignore WordPress.Security.NonceVerification.Recommended
            if ( ! is_network_admin() && ! isset( $_GET['activate-multi'] ) ) {

                delete_option( 'lmat_needs_setup' );

                wp_safe_redirect( admin_url( 'admin.php?page=lmat_wizard' ) );
                exit;
            }
        }
	}
	
	// Ensure language switcher is visible on nav-menus page for new installations
	$install_date = get_option('lmat_install_date');
	
	if ($install_date) {
		// Check if this is a recent installation (within last 24 hours)
		$install_timestamp = strtotime($install_date);
		$time_since_install = time() - $install_timestamp;
		
		// If installed within last 24 hours, ensure language switcher is visible
		if ($time_since_install <= 86400) {
			// Hook into nav-menus page load
			add_action('load-nav-menus.php', function() {
				$user_id = get_current_user_id();
				if (!$user_id) {
					return;
				}
				
				// Get hidden meta boxes for current user
				$hidden_meta_boxes = get_user_meta($user_id, 'metaboxhidden_nav-menus', true);
				
				// Initialize as empty array if not set
				if (!is_array($hidden_meta_boxes)) {
					$hidden_meta_boxes = array();
				}
				
				// Remove language switcher from hidden meta boxes to make it visible
				$hidden_meta_boxes = array_diff($hidden_meta_boxes, array('lmat_lang_switch_box'));
				
				// Update user meta
				update_user_meta($user_id, 'metaboxhidden_nav-menus', $hidden_meta_boxes);
			});
		}
	}
});

if ( ! function_exists( 'lmat_has_constant' ) ) {
	require __DIR__ . '/includes/helpers/constant-functions.php';
}
if ( ! Linguator_Usable::can_activate() ) {
	// WP version or php version is too old.
	return;
}

if ( ! defined( 'LMAT_ACTIVE' ) ) {
	define( 'LMAT_ACTIVE', true );
}

if ( Linguator_Deactivate::is_deactivation() ) {
	// Stopping here if we are going to deactivate the plugin (avoids breaking rewrite rules).
	Linguator_Deactivate::add_hooks();
	return;
}

Linguator_Activate::add_hooks();

new Linguator();

