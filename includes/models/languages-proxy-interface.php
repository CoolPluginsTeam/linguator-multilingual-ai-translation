<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Models;

use Linguator\Includes\Other\LMAT_Language;

defined( 'ABSPATH' ) || exit;

/**
 * Interface allowing to proxy the list of languages.
 *
 * @since 0.0.8
 */
interface Languages_Proxy_Interface {
	/**
	 * Returns the proxy's key.
	 *
	 * @since 0.0.8
	 *
	 * @return string
	 *
	 * @phpstan-return non-falsy-string
	 */
	public function key(): string;

	/**
	 * Returns the list of available languages after passing it through this proxy.
	 *
	 * @since 0.0.8
	 *
	 * @param LMAT_Language[] $languages List of languages to filter.
	 * @return LMAT_Language[]
	 */
	public function filter( array $languages ): array;
}
