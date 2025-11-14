<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Models;

use Linguator\Includes\Models\Languages_Proxy_Interface;
use Linguator\Includes\Other\LMAT_Language;

/**
 * Class to filter the list of languages to only include non-default languages.
 */
class Hide_Default implements Languages_Proxy_Interface {
	/**
	 * Returns the proxy's key.
	 *
	 * @since 0.0.8
	 *
	 * @return string
	 */
	public function key(): string {
		return 'hide_default';
	}

	/**
	 * Returns the list of non-default languages after passing it through this proxy.
	 *
	 * @since 0.0.8
	 *
	 * @param \LMAT_Language[] $languages List of languages to filter.
	 * @return \LMAT_Language[]
	 */
	public function filter( array $languages ): array {
		return array_filter(
			$languages,
			static function ( $lang ) {
				return ! $lang->is_default;
			}
		);
	}
}
