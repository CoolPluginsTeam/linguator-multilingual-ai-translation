<?php
/**
 * Plugin Name:       Linguator – Multilingual AI Translation
 * Plugin URI:        https://coolplugins.net/
 * Description:       A powerful multilingual plugin for WordPress that enables content synchronization, and seamless language management.
 * Version:           0.0.3
 * Requires at least: 6.2
 * Requires PHP:      7.2
 * Author:            Cool Plugins
 * Author URI:        https://profiles.wordpress.org/coolplugins/
 * Text Domain:       linguator-multilingual-ai-translation
 * License:           GPL2
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Don't access directly.
}

use Linguator\Includes\Core\Linguator;



define( 'LINGUATOR_VERSION', '0.0.3' );
define( 'LMAT_MIN_WP_VERSION', '6.2' );
define( 'LMAT_MIN_PHP_VERSION', '7.2' );
define( 'LINGUATOR_FILE', __FILE__ ); 
define( 'LINGUATOR_DIR', __DIR__ );
define('LINGUATOR_URL', plugin_dir_url(LINGUATOR_FILE));
define( 'LINGUATOR_FEEDBACK_API', 'https://feedback.coolplugins.net/' );

if ( defined( 'POLYLANG_VERSION' ) ) {
	// Show notice to deactivate Polylang before using Linguator
	add_action( 'admin_notices', 'lmat_polylang_conflict_notice' );
	add_action( 'network_admin_notices', 'lmat_polylang_conflict_notice' );
	return; // Prevent further plugin initialization
}

/**
 * Display admin notice when Polylang is detected
 */
function lmat_polylang_conflict_notice() {
	?>
	<div class="notice notice-error">
		<p>
			<strong><?php esc_html_e( 'Linguator – Multilingual AI Translation', 'linguator-multilingual-ai-translation' ); ?></strong>
		</p>
		<p>
			<?php 
			echo esc_html__( 'Linguator cannot run alongside Polylang. Please deactivate Polylang first.', 'linguator-multilingual-ai-translation' );
			?>
		</p>
	</div>
	<?php
}

// Whether we are using Linguator, get the filename of the plugin in use.
if ( ! defined( 'LINGUATOR_ROOT_FILE' ) ) {
	define( 'LINGUATOR_ROOT_FILE', __FILE__ );
}

if ( ! defined( 'LINGUATOR_BASENAME' ) ) {
	define( 'LINGUATOR_BASENAME', plugin_basename( __FILE__ ) ); // Plugin name as known by WP.
	require __DIR__ . '/vendor/autoload.php';
}

define( 'LINGUATOR', ucwords( str_replace( '-', ' ', dirname( LINGUATOR_BASENAME ) ) ) );

// Create installer instance
$installer = new \Linguator\Install\LMAT_Install( LINGUATOR_BASENAME );

// Register activation/deactivation hooks
register_activation_hook( __FILE__, array( $installer, 'activate' ) );
register_deactivation_hook( __FILE__, array( $installer, 'deactivate' ) );

// Initialize the plugin
if ( empty( $_GET['deactivate-linguator'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
	new Linguator();
}

// Handle redirect after activation and language switcher visibility
add_action('admin_init', function() {
	// Only proceed if we need setup and are in admin
	if (get_option('lmat_needs_setup') === 'yes' && is_admin()) {
		// Get install date
		$install_date = get_option('lmat_install_date');
		$current_time = current_time('timestamp');
			
		// Convert install date to timestamp if it's in string format
		$install_timestamp = is_numeric($install_date) ? $install_date : strtotime($install_date);
			
		// Only redirect if we're within 30 minutes of installation
		// This prevents redirect loops and unwanted redirects after the initial setup
		if ($install_timestamp && ($current_time - $install_timestamp) <= 1800) { // 1800 seconds = 30 minutes
			// Make sure this only runs on the admin side
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- WordPress activation parameter, nonce not needed
			if (!is_network_admin() && !isset($_GET['activate-multi'])) {
				// Remove the setup flag
				delete_option('lmat_needs_setup');
				// Redirect to the setup wizard
				wp_safe_redirect(admin_url('admin.php?page=lmat_wizard'));
				exit;
			}
		} else {
			// If more than 30 minutes have passed, just remove the setup flag
			delete_option('lmat_needs_setup');
		}
	}
	
	// Check if first activation and install time are the same
	$first_activation = gmdate('Y-m-d h:i:s');
	$install_date = get_option('lmat_install_date');
	
	if ($first_activation && $install_date) {
		// Convert both to timestamps for comparison
		$activation_timestamp = is_numeric($first_activation) ? $first_activation : strtotime($first_activation);
		$install_timestamp = is_numeric($install_date) ? $install_date : strtotime($install_date);
		
		// If activation and install times are the same (within 30 seconds tolerance)
		if (abs($activation_timestamp - $install_timestamp) <= 30) {
			// Remove language switcher from hidden meta boxes
			add_action('admin_head', function() {
				// Get current user ID
				$user_id = get_current_user_id();
				
				// Get hidden meta boxes for current user
				$hidden_meta_boxes = get_user_meta($user_id, 'metaboxhidden_nav-menus', true);
				if (is_array($hidden_meta_boxes)) {
					// Remove language switcher from hidden meta boxes
					$hidden_meta_boxes = array_diff($hidden_meta_boxes, array('lmat_lang_switch_box'));
					
					// Update user meta
					update_user_meta($user_id, 'metaboxhidden_nav-menus', $hidden_meta_boxes);
				}
			});
		}
	}
});





