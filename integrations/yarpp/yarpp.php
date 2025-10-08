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
 *  
 */
class LMAT_Yarpp {
	/**
	 * Just makes YARPP aware of the language taxonomy ( after Linguator registered it ).
	 *
	 *  
	 */
	public function init() {
		$GLOBALS['wp_taxonomies']['lmat_language']->yarpp_support = 1;
	}
}
