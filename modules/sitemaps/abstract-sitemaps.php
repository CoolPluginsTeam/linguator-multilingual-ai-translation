<?php
/**
 * @package Linguator
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Common class for handling the core sitemaps.
 *
 * The child classes must called the init() method.
 *
 *  
 */
abstract class LMAT_Abstract_Sitemaps {
	/**
	 * Setups actions and filters.
	 *
	 *  
	 *
	 * @return void
	 */
	public function init() {
		add_filter( 'lmat_home_url_white_list', array( $this, 'home_url_white_list' ) );
	}

	/**
	 * Whitelists the home url filter for the sitemaps.
	 *
	 *  
	 *
	 * @param array $whitelist White list.
	 * @return array;
	 */
	public function home_url_white_list( $whitelist ) {
		$whitelist[] = array( 'file' => 'class-wp-sitemaps-posts' );
		return $whitelist;
	}
}
