<?php
/**
 * Displays the Languages admin panel
 *
 * @package Linguator
 *
 * @var string $active_tab Active Linguator settings page.
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// retrieve errors from transient
// add them back to settings errors
$transient_errors = get_transient( 'lmat_settings_errors' );
if ( ! empty( $transient_errors ) && is_array( $transient_errors ) ) {
	foreach ( $transient_errors as $error ) {
		add_settings_error(
			$error['setting'] ?? 'linguator-multilingual-ai-translation',
			$error['code'] ?? 'error',
			$error['message'] ?? '',
			$error['type'] ?? 'error'
		);
	}
	delete_transient( 'lmat_settings_errors' );
	// delete the transient errors
}

require ABSPATH . 'wp-admin/options-head.php'; 


// display the errors 
?>
<div class="wrap">
	<?php
	switch ( $active_tab ) {
		case 'lang':     // Languages tab
		case 'strings':  // String translations tab
			include __DIR__ . '/view-tab-' . $active_tab . '.php';
			break;

		default:
			/**
			 * Fires when loading the active Linguator settings tab
			 * Allows plugins to add their own tab
			 *
			 *  
			 */
			do_action( 'lmat_settings_active_tab_' . $active_tab );
			break;
	}
	?>
</div>



<!-- wrap end -->
<!-- used for showing the errors -->


