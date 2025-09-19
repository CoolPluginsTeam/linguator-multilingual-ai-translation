<?php
/**
 * Displays the wizard notice content
 *
 * @package Linguator
 *
 *  
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Don't access directly.
}

$wizard_url = add_query_arg(
	array(
		'page' => 'lmat_wizard',
	),
	admin_url( 'admin.php' )
);
?>
<p>
	<strong>
	<?php
	printf(
		/* translators: %s is the plugin name */
		esc_html__( 'Welcome to %s', 'linguator-multilingual-ai-translation' ),
		esc_html( LINGUATOR )
	);
	?>
	</strong>
	<?php
	echo ' &#8211; ';
	esc_html_e( 'You&lsquo;re almost ready to translate your contents!', 'linguator-multilingual-ai-translation' );
	?>
</p>
<p class="buttons">
	<a
		href="<?php echo esc_url( $wizard_url ); ?>"
		class="button button-primary"
	>
		<?php esc_html_e( 'Run the Setup Wizard', 'linguator-multilingual-ai-translation' ); ?>
	</a>
	<a
		class="button button-secondary skip"
		href="<?php echo esc_url( wp_nonce_url( add_query_arg( 'lmat-hide-notice', 'wizard' ), 'wizard', '_lmat_notice_nonce' ) ); ?>"
	>
		<?php esc_html_e( 'Skip setup', 'linguator-multilingual-ai-translation' ); ?>
	</a>
</p>
