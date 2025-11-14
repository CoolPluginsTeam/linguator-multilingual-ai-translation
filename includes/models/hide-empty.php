<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Models;

use Linguator\Includes\Models\Languages_Proxy_Interface;
use Linguator\Includes\Other\LMAT_Language;

/**
 * Class to filter the list of languages to only include non-empty languages.
 */
class Hide_Empty implements Languages_Proxy_Interface {
	/**
	 * Returns the proxy's key.
	 *
	 * @since 0.0.8
	 *
	 * @return string
	 */
	public function key(): string {
		return 'hide_empty';
	}

	/**
	 * Returns the list of non-empty languages after passing it through this proxy.
	 *
	 * @since 0.0.8
	 *
	 * @param \LMAT_Language[] $languages List of languages to filter.
	 * @return \LMAT_Language[] Filtered languages.
	 */
	public function filter( array $languages ): array {
		return array_filter(
			$languages,
			static function ( $lang ) {
				return $lang->get_tax_prop( 'language', 'count' ) > 0;
			}
		);
	}
}
