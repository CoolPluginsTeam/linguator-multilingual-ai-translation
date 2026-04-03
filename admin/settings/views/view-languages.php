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
// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
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

// Display settings errors.
settings_errors();
?>
<div class="wrap">
	<?php
	$lmat_languages_tab_views = array(
		'lang'    => __DIR__ . '/view-tab-lang.php',
		'strings' => __DIR__ . '/view-tab-strings.php',
	);

	if ( isset( $lmat_languages_tab_views[ $active_tab ] ) ) {
		include $lmat_languages_tab_views[ $active_tab ];
	} else {
		/**
		 * Fires when loading the active Linguator settings tab
		 * Allows plugins to add their own tab
		 *
		 *  
		 */
		do_action( 'lmat_settings_active_tab_' . sanitize_key( (string) $active_tab ) );
	}
	?>
</div>



<!-- wrap end -->
<!-- used for showing the errors -->


