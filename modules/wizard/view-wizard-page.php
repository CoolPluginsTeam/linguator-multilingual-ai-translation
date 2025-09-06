<?php
/**
 * Wizard page rendered inside wp-admin chrome (not full screen)
 *
 * @package Linguator
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Load standard admin header so the page appears within the wp-admin layout
require_once ABSPATH . 'wp-admin/admin-header.php';
?>

<div class="wrap lmat-styles">
	<div id="lmat-setup"></div>
</div>



<?php
// Ensure scripts/styles are printed
wp_print_scripts( 'lmat_setup' );
wp_print_styles( 'lmat_setup' );

// Load standard admin footer
require_once ABSPATH . 'wp-admin/admin-footer.php';
?>
