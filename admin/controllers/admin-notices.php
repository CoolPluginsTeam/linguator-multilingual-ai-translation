<?php
/**
 * @package Linguator
 */
namespace Linguator\Admin\Controllers;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use Linguator\Includes\Other\LMAT_Translation_Dashboard;

/**
 * A class to manage admin notices
 * displayed only to admin, based on 'manage_options' capability
 * and only on dashboard, plugins and Linguator admin pages
 *
 *  
 *   Dismissed notices are stored in an option instead of a user meta
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
	 *  
	 *
	 * @param object $linguator The Linguator object.
	 */
	public function __construct( $linguator ) {
		$this->options = &$linguator->options;

		add_action( 'admin_init', array( $this, 'hide_notice' ) );
		add_action( 'admin_notices', array( $this, 'display_notices' ) );
		
		// Add inline CSS and JS for notice positioning on ?page=lmat
		add_action( 'admin_enqueue_scripts', array( $this, 'add_notice_positioning_inline' ) );

		if ( ! empty( $this->options['first_activation'] ) && time() > $this->options['first_activation'] + 3 * DAY_IN_SECONDS ) {
			$this->review_notice();
		}
	}

	/**
	 * Add a custom notice
	 *
	 *  
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
	 *  
	 *
	 * @return string[]
	 */
	public static function get_notices() {
		return self::$notices;
	}

	/**
	 * Has a notice been dismissed?
	 *
	 *  
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
	 *  
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
		 *  
		 *
		 * @param bool   $display Whether the notice should be displayed or not.
		 * @param string $notice  The notice name.
		 */
		return apply_filters( 'lmat_can_display_notice', in_array( $screen->id, $allowed_screens, true ), $notice );
	}

	/**
	 * Stores a dismissed notice in the database.
	 *
	 *  
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
	 *  
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
	 *  
	 *
	 * @return void
	 */
	public function display_notices() {
		// Check if we're on the specific ?page=lmat page and should suppress notices
		if ( current_user_can( 'manage_options' ) ) {
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
		if ( $this->is_lmat_page() ) {
			// Don't display notices here, they will be captured and displayed later
			return;
		}
	}

	/**
	 * Displays a dismiss button
	 *
	 *  
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
	 * Check if we're on the specific ?page=lmat page
	 *
	 * @since 1.0.0
	 *
	 * @return bool
	 */
	private function is_lmat_page() {
		$screen = get_current_screen();
		if ( empty( $screen ) ) {
			return false;
		}
		
		// Check if we're specifically on the ?page=lmat page
		return $screen->id === 'toplevel_page_lmat' || $screen->id === 'languages_page_lmat_settings';
	}
	/**
	 * Add inline CSS and JavaScript for notice positioning on ?page=lmat
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function add_notice_positioning_inline() {
		if ( ! $this->is_lmat_page() ) {
			return;
		}

		// Add inline CSS
		$css = "
		/* Notice positioning for ?page=lmat */
		body.toplevel_page_lmat .notice,
		body.toplevel_page_lmat .error,
		body.toplevel_page_lmat .updated,
		body.toplevel_page_lmat .notice-error,
		body.toplevel_page_lmat .notice-warning,
		body.toplevel_page_lmat .notice-info,
		body.toplevel_page_lmat .notice-success {
			display: none !important;
			margin-left: 2rem;
		}

		/* Show notices after they are moved */
		body.toplevel_page_lmat .lmat-moved-notice {
			display: block !important;
			margin-left: 2rem;
			margin-right: 2rem;
			width: auto;
		}
		";
		wp_add_inline_style( 'linguator_admin', $css );

		// Add inline JavaScript
		$js = "
		jQuery(document).ready(function($) {
			// Wait for the page to load
			setTimeout(function() {
				// Find all notices including error, updated, and other notice classes
				var notices = $('.notice, .error, .updated, .notice-error, .notice-warning, .notice-info, .notice-success');
				if (notices.length > 0) {
					// Find the header container
					var headerContainer = $('#lmat-settings-header');
					if (headerContainer.length > 0) {
						// Move notices after the header
						notices.detach().insertAfter(headerContainer);
						// Add class to make notices visible
						notices.addClass('lmat-moved-notice');
					}
				}
			}, 100);
		});
		";
		wp_add_inline_script( 'lmat_admin', $js );
	}

	/**
	 * Displays a notice asking for a review
	 *
	 *  
	 *
	 * @return string
	 */
	private function review_notice() {
		$review_url = 'https://wordpress.org/support/plugin/linguator-multilingual-ai-translation/reviews/?rate=5#new-post';
		
		if(class_exists(LMAT_Translation_Dashboard::class)){	
			LMAT_Translation_Dashboard::review_notice('lmat', 'Linguator', esc_url($review_url));
		}
	}


}
