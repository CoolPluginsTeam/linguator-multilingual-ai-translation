<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Models;

use Linguator\Includes\Models\Languages;
use Linguator\Includes\Models\Languages_Proxy_Interface;

defined( 'ABSPATH' ) || exit;

/**
 * Chains together multiple language filter proxies and applies them to a list of languages.
 *
 * @since 0.0.8
 */
class Languages_Proxies {
	/**
	 * Holds the main Languages model (lists and converts languages).
	 *
	 * @var Languages
	 */
	protected $languages;

	/**
	 * Stores all proxy objects. Each proxy can change/filter the list of languages.
	 *
	 * @var Languages_Proxy_Interface[]
	 * @phpstan-var array<non-falsy-string, Languages_Proxy_Interface>
	 */
	private $proxies = array();

	/**
	 * Keeps track of which proxies should be applied and in what order.
	 *
	 * @var string[]
	 */
	protected $stack = array();

	/**
	 * Set up the object with a Languages model, a list of proxies, and the first proxy to use.
	 *
	 * @since 0.0.8
	 *
	 * @param Languages $languages The main languages model.
	 * @param array     $proxies   All proxies that can filter languages.
	 * @param string    $parent    The key of the initial proxy to be applied.
	 */
	public function __construct( Languages $languages, array $proxies, string $parent ) {
		$this->languages = $languages;
		$this->proxies   = $proxies;
		$this->stack[]   = $parent; // Start the filter stack with the first proxy key.
	}

	/**
	 * Get the full list of languages, applying all proxies in the stack one after another.
	 *
	 * @since 0.0.8
	 *
	 * @param array $args Options for the languages list (passed to Languages::get_list).
	 * @return array Filtered list of language objects or their properties.
	 */
	public function get_list( array $args = array() ): array {
		$all_args = $args; // Save all arguments for possible later use.
		unset( $args['fields'] ); // Remove 'fields' parameter before getting the languages.

		$languages = $this->languages->get_list( $args ); // Get the original list of languages.

		// Loop through the stack, applying each proxy in order.
		foreach ( $this->stack as $key ) {
			if ( ! isset( $this->proxies[ $key ] ) ) {
				continue; // Skip if the proxy doesn't exist.
			}
			$languages = $this->proxies[ $key ]->filter( $languages ); // Filter the list.
		}

		$languages = array_values( $languages ); // Reset array keys to be sequential.

		return $this->languages->maybe_convert_list( $languages, $all_args ); // Return formatted/converted list.
	}

	/**
	 * Add another proxy (by key) to the stack to be applied to the languages list.
	 *
	 * @since 0.0.8
	 *
	 * @param string $key The proxy's key to add.
	 * @return Languages_Proxies This object, allowing method chaining.
	 */
	public function filter( string $key ): Languages_Proxies {
		$this->stack[] = $key; // Add new proxy to be used later.
		return $this; // So you can chain filter() calls.
	}
}
