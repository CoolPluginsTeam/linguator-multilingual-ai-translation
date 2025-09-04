<?php
/**
 * @package Linguator
 */
namespace Linguator\Integrations\duplicate_post;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Manages the compatibility with Duplicate Post.
 *
 * @since 1.0.0
 */
class LMAT_Duplicate_Post {
	/**
	 * Setups actions.
	 *
	 * @since 1.0.0
	 */
	public function init() {
		add_filter( 'option_duplicate_post_taxonomies_blacklist', array( $this, 'taxonomies_blacklist' ) );
	}

	/**
	 * Avoid duplicating the 'lmat_post_translations' taxonomy.
	 *
	 * @since 1.0.0
	 *
	 * @param array|string $taxonomies The list of taxonomies not to duplicate.
	 * @return array
	 */
	public function taxonomies_blacklist( $taxonomies ) {
		if ( empty( $taxonomies ) ) {
			$taxonomies = array(); // As we get an empty string when there is no taxonomy.
		}

		$taxonomies[] = 'lmat_post_translations';
		return $taxonomies;
	}
}
