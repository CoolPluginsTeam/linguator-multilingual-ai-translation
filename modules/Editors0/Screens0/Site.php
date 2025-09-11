<?php
/**
 * @package Linguator 
 */

namespace Linguator\Modules\Editors\Screens;

use Linguator\Includes\Base\LMAT_Base;
use Linguator\Includes\Other\LMAT_Model;
use WP_Screen;
use Linguator\Includes\Other\LMAT_Language;
use Linguator\Modules\Full_Site_Editing\LMAT_FSE_Tools;

/**
 * Class to manage Site editor scripts.
 */
class Site extends Abstract_Screen {
	/**
	 * @var LMAT_Language|false|null
	 */
	protected $curlang;

	/**
	 * Constructor
	 *
	 *
	 * @param LMAT_Base $linguator Linguator object.
	 */
	public function __construct( LMAT_Base &$linguator ) {
		parent::__construct( $linguator );

		$this->curlang = &$linguator->curlang;
	}

	/**
	 * Adds required hooks.
	 *
	 *
	 * @return static
	 */
	public function init() {
		parent::init();
		add_filter( 'lmat_admin_ajax_params', array( $this, 'ajax_filter' ) );

		return $this;
	}

	/**
	 * Adds the language to the data added to all AJAX requests.
	 *
	 *
	 * @param array $params List of parameters to add to the admin ajax request.
	 * @return array
	 */
	public function ajax_filter( $params ) {
		$screen = get_current_screen();

		if ( empty( $screen ) ) {
			return $params;
		}

		if ( ! $this->screen_matches( $screen ) ) {
			return $params;
		}

		$editor_lang = $this->get_language();

		if ( empty( $editor_lang ) ) {
			return $params;
		}

		$params['lang'] = $editor_lang->slug;
		return $params;
	}


	/**
	 * Tells whether the given screen is the Site edtitor or not.
	 *
	 *
	 * @param  WP_Screen $screen The current screen.
	 * @return bool True if Site editor screen, false otherwise.
	 */
	protected function screen_matches( WP_Screen $screen ): bool {
		return (
			'site-editor' === $screen->base
			&& $this->model->post_types->is_translated( 'wp_template_part' )
			&& method_exists( $screen, 'is_block_editor' )
			&& $screen->is_block_editor()
		);
	}

	/**
	 * Returns the language to use in the Site editor.
	 *
	 *
	 * @return LMAT_Language|null
	 */
	protected function get_language(): ?LMAT_Language {
		if ( ! empty( $this->curlang ) && LMAT_FSE_Tools::is_site_editor() ) {
			return $this->curlang;
		}

		return null;
	}

	/**
	 * Returns the screen name for the Site editor to use across all process.
	 *
	 *
	 * @return string
	 */
	protected function get_screen_name(): string {
		return 'site';
	}
}
