<?php
/**
 * @package Linguator
 */
namespace Linguator\Frontend\Filters;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Filters search forms when using permalinks
 *
 *  
 */
class LMAT_Frontend_Filters_Search {
	/**
	 * Instance of a child class of LMAT_Links_Model.
	 *
	 * @var LMAT_Links_Model
	 */
	public $links_model;

	/**
	 * Current language.
	 *
	 * @var LMAT_Language|null
	 */
	public $curlang;

	/**
	 * Constructor.
	 *
	 *  
	 *
	 * @param object $linguator The Linguator object.
	 */
	public function __construct( &$linguator ) {
		$this->links_model = &$linguator->links_model;
		$this->curlang = &$linguator->curlang;

		// Adds the language information in the search form
		// Low priority in case the search form is created using the same filter as described in http://codex.wordpress.org/Function_Reference/get_search_form
		add_filter( 'get_search_form', array( $this, 'get_search_form' ), 99 );

		// Adds the language information in the search block.
		add_filter( 'render_block_core/search', array( $this, 'get_search_form' ) );

		// Adds the language information in admin bar search form
		add_action( 'add_admin_bar_menus', array( $this, 'add_admin_bar_menus' ) );

	}

	/**
	 * Adds the language information in the search form.
	 *
	 * Does not work if searchform.php ( prior to WP 3.6 ) is used or if the search form is hardcoded in another template file
	 *
	 *  
	 *
	 * @param string $form The search form HTML.
	 * @return string Modified search form.
	 */
	public function get_search_form( $form ) {
		if ( empty( $form ) || empty( $this->curlang ) ) {
			return $form;
		}

		if ( $this->links_model->using_permalinks ) {
			// Take care to modify only the url in the <form> tag.
			preg_match( '#<form.+?>#s', $form, $matches );
			$old = reset( $matches );
			if ( empty( $old ) ) {
				return $form;
			}
			// Replace action attribute (a text with no space and no closing tag within double quotes or simple quotes or without quotes).
			$new = preg_replace( '#\saction=("[^"\r\n]+"|\'[^\'\r\n]+\'|[^\'"][^>\s]+)#', ' action="' . esc_url( $this->curlang->get_search_url() ) . '"', $old );
			if ( empty( $new ) ) {
				return $form;
			}
			$form = str_replace( $old, $new, $form );
		} else {
			$form = str_replace( '</form>', '<input type="hidden" name="lang" value="' . esc_attr( $this->curlang->slug ) . '" /></form>', $form );
		}

		return $form;
	}

	/**
	 * Adds the language information in the admin bar search form.
	 *
	 *  
	 *
	 * @return void
	 */
	public function add_admin_bar_menus() {
		remove_action( 'admin_bar_menu', 'wp_admin_bar_search_menu', 9999 );
		add_action( 'admin_bar_menu', array( $this, 'admin_bar_search_menu' ), 9999 );
	}

	/**
	 * Rewrites the admin bar search form to pass our get_search_form filter.
	 * Code last checked: WP 5.4.1.
	 *
	 *  
	 *
	 * @param WP_Admin_Bar $wp_admin_bar The WP_Admin_Bar instance, passed by reference.
	 * @return void
	 */
	public function admin_bar_search_menu( $wp_admin_bar ) {
		$form  = '<form action="' . esc_url( home_url( '/' ) ) . '" method="get" id="adminbarsearch">';
		$form .= '<input class="adminbar-input" name="s" id="adminbar-search" type="text" value="" maxlength="150" />';
		$form .= '<label for="adminbar-search" class="screen-reader-text">' .
					/* translators: Hidden accessibility text. */
					esc_html__( 'Search', 'linguator-multilingual-ai-translation' ) .
				'</label>';
		$form .= '<input type="submit" class="adminbar-button" value="' . esc_attr__( 'Search', 'linguator-multilingual-ai-translation' ) . '" />';
		$form .= '</form>';

		$wp_admin_bar->add_node(
			array(
				'parent' => 'top-secondary',
				'id'     => 'search',
				'title'  => $this->get_search_form( $form ), // Pass the get_search_form filter.
				'meta'   => array(
					'class'    => 'admin-bar-search',
					'tabindex' => -1,
				),
			)
		);
	}


}
