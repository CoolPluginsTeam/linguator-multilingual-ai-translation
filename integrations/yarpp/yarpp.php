<?php
/**
 * @package Linguator
 */
namespace Linguator\Integrations\yarpp;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Manages the compatibility with Yet Another Related Posts Plugin.
 *
 * @since 1.0.0
 */
class LMAT_Yarpp {
	/**
	 * Just makes YARPP aware of the language taxonomy ( after Linguator registered it ).
	 *
	 * @since 1.0.0
	 */
	public function init() {
		$GLOBALS['wp_taxonomies']['language']->yarpp_support = 1;
	}
}
