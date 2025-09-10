<?php
/**
 * @package Linguator
 */
namespace Linguator\Admin\Controllers;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * A class to manage admin notices
 * displayed only to admin, based on 'manage_options' capability
 * and only on dashboard, plugins and Linguator admin pages
 *
 * @since 1.0.0
 * @since 1.0.0 Dismissed notices are stored in an option instead of a user meta
 */
class LMAT_Admin_Notices {
	/**
	 * Stores the plugin options.
	 *
	 * @var array
	 */
	protected $options;

	/**
	 * Stores custom notices.
	 *
	 * @var string[]
	 */
	private static $notices = array();

	/**
	 * Constructor
	 * Setup actions
	 *
	 * @since 1.0.0
	 *
	 * @param object $linguator The Linguator object.
	 */
	public function __construct( $linguator ) {
		$this->options = &$linguator->options;

		add_action( 'admin_init', array( $this, 'hide_notice' ) );
		add_action( 'admin_notices', array( $this, 'display_notices' ) );
	}

	/**
	 * Add a custom notice
	 *
	 * @since 1.0.0
	 *
	 * @param string $name Notice name
	 * @param string $html Content of the notice
	 * @return void
	 */
	public static function add_notice( $name, $html ) {
		self::$notices[ $name ] = $html;
	}

	/**
	 * Get custom notices.
	 *
	 * @since 1.0.0
	 *
	 * @return string[]
	 */
	public static function get_notices() {
		return self::$notices;
	}

	/**
	 * Has a notice been dismissed?
	 *
	 * @since 1.0.0
	 *
	 * @param string $notice Notice name
	 * @return bool
	 */
	public static function is_dismissed( $notice ) {
		$dismissed = get_option( 'lmat_dismissed_notices', array() );

		// Handle legacy user meta
		$dismissed_meta = get_user_meta( get_current_user_id(), 'lmat_dismissed_notices', true );
		if ( is_array( $dismissed_meta ) ) {
			if ( array_diff( $dismissed_meta, $dismissed ) ) {
				$dismissed = array_merge( $dismissed, $dismissed_meta );
				update_option( 'lmat_dismissed_notices', $dismissed );
			}
			if ( ! is_multisite() ) {
				// Don't delete on multisite to avoid the notices to appear in other sites.
				delete_user_meta( get_current_user_id(), 'lmat_dismissed_notices' );
			}
		}

		return in_array( $notice, $dismissed );
	}

	/**
	 * Should we display notices on this screen?
	 *
	 * @since 1.0.0
	 *
	 * @param string $notice          The notice name.
	 * @param array  $allowed_screens The screens allowed to display the notice.
	 *                                If empty, default screens are used, i.e. dashboard, plugins, languages, strings and settings.
	 *
	 * @return bool
	 */
	protected function can_display_notice( string $notice, array $allowed_screens = array() ) {
		$screen = get_current_screen();

		if ( empty( $screen ) ) {
			return false;
		}
		if ( empty( $allowed_screens ) ) {
			$screen_id       = sanitize_title( __( 'Languages', 'linguator-multilingual-ai-translation' ) );
			$allowed_screens = array(
				'dashboard',
				'plugins',
				$screen_id . '_page_lmat_strings',
				$screen_id . '_page_lmat_settings',
			);
		}

		/**
		 * Filters admin notices which can be displayed.
		 *
		 * @since 1.0.0
		 *
		 * @param bool   $display Whether the notice should be displayed or not.
		 * @param string $notice  The notice name.
		 */
		return apply_filters( 'lmat_can_display_notice', in_array( $screen->id, $allowed_screens, true ), $notice );
	}

	/**
	 * Stores a dismissed notice in the database.
	 *
	 * @since 1.0.0
	 *
	 * @param string $notice Notice name.
	 * @return void
	 */
	public static function dismiss( $notice ) {
		$dismissed = get_option( 'lmat_dismissed_notices', array() );

		if ( ! in_array( $notice, $dismissed ) ) {
			$dismissed[] = $notice;
			update_option( 'lmat_dismissed_notices', array_unique( $dismissed ) );
		}
	}

	/**
	 * Handle a click on the dismiss button
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function hide_notice() {
		if ( isset( $_GET['lmat-hide-notice'], $_GET['_lmat_notice_nonce'] ) ) {
			$notice = sanitize_key( $_GET['lmat-hide-notice'] );
			check_admin_referer( $notice, '_lmat_notice_nonce' );
			// Handle all review related notices
			if (in_array($notice, array('already-rated', 'not-interested'))) {
				self::dismiss('review'); 
			} else {
				self::dismiss( $notice );
			}
			wp_safe_redirect( remove_query_arg( array( 'lmat-hide-notice', '_lmat_notice_nonce' ), wp_get_referer() ) );
			exit;
		}
	}

	/**
	 * Displays notices
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function display_notices() {
		if ( current_user_can( 'manage_options' ) ) {
			if ( $this->can_display_notice( 'review' ) && ! static::is_dismissed( 'review' ) && ! empty( $this->options['first_activation'] ) && time() > $this->options['first_activation'] + 3 * DAY_IN_SECONDS ) {
				$html = $this->review_notice();
				printf('<div class="lmat-notice notice notice-info is-dismissible">%s</div>', wp_kses_post( $html ) );
				
			}
			// Custom notices
			foreach ( static::get_notices() as $notice => $html ) {
				if ( $this->can_display_notice( $notice ) && ! static::is_dismissed( $notice ) ) {
					?>
					<div class="lmat-notice notice notice-info">
						<?php
						$this->dismiss_button( $notice );
						echo wp_kses_post( $html );
						?>
					</div>
					<?php
				}
			}
		}
	}

	/**
	 * Displays a dismiss button
	 *
	 * @since 1.0.0
	 *
	 * @param string $name Notice name
	 * @return void
	 */
	public function dismiss_button( $name ) {
		printf(
			'<a class="notice-dismiss" href="%s"><span class="screen-reader-text">%s</span></a>',
			esc_url( wp_nonce_url( add_query_arg( 'lmat-hide-notice', $name ), $name, '_lmat_notice_nonce' ) ),
			/* translators: accessibility text */
			esc_html__( 'Dismiss this notice.', 'linguator-multilingual-ai-translation' )
		);
	}

	/**
	 * Displays a notice asking for a review
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	private function review_notice() {
		
				$already_rated_url = esc_url( wp_nonce_url( add_query_arg( 'lmat-hide-notice', 'already-rated' ), 'already-rated', '_lmat_notice_nonce' ) );
				$not_interested_url = esc_url( wp_nonce_url( add_query_arg( 'lmat-hide-notice', 'not-interested' ), 'not-interested', '_lmat_notice_nonce' ) );
				$like_it_text   = esc_html__( 'Rate Now! ★★★★★', 'linguator-multilingual-ai-translation' );
				$already_rated_text = esc_html__( 'I already rated it', 'linguator-multilingual-ai-translation' );
				$not_like_it_text   = esc_html__( 'Not Interested', 'linguator-multilingual-ai-translation' );
				$html = sprintf(
						/* translators: %1$s: Already rated URL, %2$s: Dismiss URL */
						__('<p>Thanks for using <b>Linguator – Multilingual AI Translation</b> - WordPress plugin. We hope you liked it ! <br/>Please give us a quick rating, it works as a boost for us to keep working on more <a href="https://coolplugins.net/?utm_source=ectbe_plugin&utm_medium=inside&utm_campaign=coolplugins&utm_content=review_notice" target="_blank"><strong>Cool Plugins</strong></a>!<br/></p>
						<div class="callto_action">
							<ul>
								<li class="love_it" style="float: left;"><a href="https://wordpress.org/support/plugin/linguator/reviews/?rate=5#new-post" class="like_it_btn button button-primary" target="_new" title="Rate it 5 stars">%3$s</a></li>
								<li class="already_rated" style="float: left;"><a href="%1$s" class="already_rated_btn button" title="I already rated it">%4$s</a></li>    
								<li class="not_interested"><a href="%2$s" class="not_interested_btn button" title="Not interested">%5$s</a></li>
							</ul>
						</div>', 'linguator-multilingual-ai-translation' ),
						$already_rated_url,
						$not_interested_url,
						$like_it_text,
						$already_rated_text,
						$not_like_it_text
						);
		return $html;
	}


}
