<?php
/**
 * @package Linguator
 */
namespace Linguator\Integrations\elementor;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}


use Linguator\Frontend\Controllers\LMAT_Frontend;
use Linguator\Includes\Other\LMAT_Model;


/**
 * Manages the compatibility with Elementor
 *
 * @since 1.0.0
 */
class LMAT_Elementor {
	/**
	 * Constructor
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		self::elementor_compatibility();
	}

    /**
	 * Elementor compatibility.
	 *
	 * Fix Elementor compatibility with Linguator.
	 *
	 * @since 1.0.0
	 * @access private
	 * @static
	 */
	private static function elementor_compatibility() {
		// Copy elementor data while linguator creates a translation copy.
		add_filter( 'lmat_copy_post_metas', [ __CLASS__, 'save_elementor_meta' ], 10, 4 );
	}

    /**
	 * Save elementor meta.
	 *
	 * Copy elementor data while Linguator creates a translation copy.
	 *
	 * Fired by `lmat_copy_post_metas` filter.
	 *
	 * @since 1.0.0
	 * @access public
	 * @static
	 *
	 * @param array $keys List of custom fields names.
	 * @param bool  $sync True if it is synchronization, false if it is a copy.
	 * @param int   $from ID of the post from which we copy information.
	 * @param int   $to   ID of the post to which we paste information.
	 *
	 * @return array List of custom fields names.
	 */
	public static function save_elementor_meta( $keys, $sync, $from, $to ) {
		// Copy only for a new post.
		if ( ! $sync ) {
			self::copy_elementor_meta( $from, $to );
		}

		return $keys;
	}

    /**
	 * Copy Elementor meta.
	 *
	 * Duplicate the data from one post to another.
	 *
	 * Consider using `safe_copy_elementor_meta()` method instead.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param int $from_post_id Original post ID.
	 * @param int $to_post_id   Target post ID.
	 */
	public static function copy_elementor_meta( $from_post_id, $to_post_id ) {
		$from_post_meta = get_post_meta( $from_post_id );
		$core_meta = [
			'_wp_page_template',
			'_thumbnail_id',
		];

		foreach ( $from_post_meta as $meta_key => $values ) {
			// Copy only meta with the `_elementor` prefix.
			if ( 0 === strpos( $meta_key, '_elementor' ) || in_array( $meta_key, $core_meta, true ) ) {
				$value = $values[0];

				// The elementor JSON needs slashes before saving.
				if ( '_elementor_data' === $meta_key ) {
					$value = wp_slash( $value );
				} else {
					$value = maybe_unserialize( $value );
				}

				// Don't use `update_post_meta` that can't handle `revision` post type.
				update_metadata( 'post', $to_post_id, $meta_key, $value );
			}
		}
	}
} 