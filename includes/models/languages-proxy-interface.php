<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Models;

use Linguator\Includes\Other\LMAT_Language;

// Prevent direct access to this file for security.
defined( 'ABSPATH' ) || exit;

/**
 * This interface lets you create a "proxy" that can filter or change the list of languages. 
 * You can use it to add custom logic for which languages show up or how they are handled.
 *
 * @since 0.0.8
 */
interface Languages_Proxy_Interface {
	/**
	 * Get a unique name (key) that identifies this proxy.
	 *
	 * @since 0.0.8
	 *
	 * @return string A non-empty string that is used as the proxy's identifier.
	 *
	 * @phpstan-return non-falsy-string
	 */
	public function key(): string;

	/**
	 * Change or filter the list of available languages as needed.
	 * Takes an array of LMAT_Language objects and returns a (possibly changed) array.
	 *
	 * @since 0.0.8
	 *
	 * @param LMAT_Language[] $languages The current list of languages to be filtered or changed.
	 * @return LMAT_Language[] The new or filtered list of languages.
	 */
	public function filter( array $languages ): array;
}
