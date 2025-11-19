<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Models;

use Linguator\Includes\Models\Languages_Proxy_Interface;
use Linguator\Includes\Other\LMAT_Language;

/**
 * This class helps to only show languages that are not empty.
 * In other words, it will hide languages that don't have any items/posts in them.
 */
class Hide_Empty implements Languages_Proxy_Interface {
	/**
	 * Get the unique key for this proxy.
	 *
	 * @since 0.0.8
	 *
	 * @return string The key that identifies this filter.
	 */
	public function key(): string {
		return 'hide_empty';
	}

	/**
	 * Filter the list of languages and keep only languages that have at least one item.
	 *
	 * @since 0.0.8
	 *
	 * @param \LMAT_Language[] $languages List of language objects to filter.
	 * @return \LMAT_Language[] Languages that are not empty.
	 */
	public function filter( array $languages ): array {
		return array_filter(
			$languages,
			static function ( $lang ) {
				// Keep this language only if it has more than 0 items (not empty)
				return $lang->get_tax_prop( 'lmat_language', 'count' ) > 0;
			}
		);
	}
}
