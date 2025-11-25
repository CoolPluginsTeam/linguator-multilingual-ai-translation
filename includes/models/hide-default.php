<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Models;

use Linguator\Includes\Models\Languages_Proxy_Interface;
use Linguator\Includes\Other\LMAT_Language;

/**
 * This class helps to hide the default language from a list of languages.
 * Whenever you want to show languages but skip the default one, use this.
 */
class Hide_Default implements Languages_Proxy_Interface {
	/**
	 * Returns this filter's key, which can be used to refer to it elsewhere.
	 *
	 * @since 0.0.8
	 *
	 * @return string The key name for this filter.
	 */
	public function key(): string {
		return 'hide_default';
	}

	/**
	 * Removes the default language from the given list and returns only the non-default languages.
	 *
	 * @since 0.0.8
	 *
	 * @param \LMAT_Language[] $languages List of languages you want to filter.
	 * @return \LMAT_Language[] The result list, with the default language removed.
	 */
	public function filter( array $languages ): array {
		// Go through each language and keep only the ones that are not set as default
		return array_filter(
			$languages,
			static function ( $lang ) {
				// Only include if it's NOT the default language
				return ! $lang->is_default;
			}
		);
	}
}
