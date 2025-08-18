<?php
/**
 * Displays the wizard
 *
 * @package Linguator
 *
 * @since 1.0.0
 *
 * @var array[]    $steps {
 *   List of steps.
 *
 *     @type array {
 *         List of step properties.
 *
 *         @type string   $name    I18n string which names the step.
 *         @type callable $view    The callback function use to display the step content.
 *         @type callable $handler The callback function use to process the step after it is submitted.
 *         @type array    $scripts List of script handles needed by the step.
 *         @type array    $styles  The list of style handles needed by the step.
 *     }
 * }
 * @var string   $current_step Current step.
 * @var string[] $styles       List of wizard page styles.
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

$admin_body_class = array( 'lmat-wizard', 'wp-core-ui' );
if ( is_rtl() ) {
	$admin_body_class[] = 'rtl';
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
	<head>
		<meta name="viewport" content="width=device-width" />
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>
		<?php
		printf(
			/* translators: %s is the plugin name */
			esc_html__( '%s &rsaquo; Setup', 'linguator-multilingual-ai-translation' ),
			esc_html( LINGUATOR )
		);
		?>
		</title>
		<script>
			var ajaxurl = '<?php echo esc_url( admin_url( 'admin-ajax.php', 'relative' ) ); ?>';
		</script>
		<?php wp_print_scripts( 'lmat_setup' ); ?>
		<?php wp_print_styles( 'lmat_setup' ); ?>
		<?php do_action( 'admin_head' ); ?>
	</head>
	<body class="<?php echo join( ' ', array_map( 'sanitize_key', $admin_body_class ) ); ?>">
	<div class="wrap lmat-styles">
	<div id="lmat-setup"></div>
	</div>
	</body>
</html>
