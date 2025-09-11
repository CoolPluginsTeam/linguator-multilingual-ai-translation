<?php
/**
 * Displays the strings translations tab in Linguator settings
 *
 * @package Linguator
 *
 * @var \Linguator\Settings\Header\Header $header An object representing the header.
 * @var LMAT_Table_String $string_table An object representing the translations list table.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
?>
<div class="form-wrap">
	<?php $header && $header instanceof \Linguator\Settings\Header\Header && $header->header(); ?>
	<form id="string-translation" method="post" action="<?php echo esc_url( add_query_arg( 'noheader', 'true' ) ); ?>">
		<input type="hidden" name="lmat_action" value="string-translation" />
		<?php
		$string_table->search_box( __( 'Search translations', 'linguator-multilingual-ai-translation' ), 'translations' );
		wp_nonce_field( 'string-translation', '_wpnonce_string-translation' );
		$string_table->display();
		printf( '<br /><label><input name="clean" type="checkbox" value="1" /> %s</label>', esc_html__( 'Clean strings translation database', 'linguator-multilingual-ai-translation' ) );
		?>
		<p><?php esc_html_e( 'Use this to remove unused strings from database, for example after a plugin has been uninstalled.', 'linguator-multilingual-ai-translation' ); ?></p>
		<?php
		submit_button(); // Since WP 3.1
		?>
	</form>
	<div class="metabox-holder">
		<?php
		wp_nonce_field( 'closedpostboxes', 'closedpostboxesnonce', false );
		do_meta_boxes( 'languages_page_lmat_strings', 'normal', array() );
		?>
	</div>

</div>
