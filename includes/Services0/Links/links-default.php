<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Services\Links;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}


use Linguator\Includes\Other\LMAT_Language;



/**
 * Links model for the default permalinks
 * for example mysite.com/?somevar=something&lmat_lang=en.
 *
 * @since 1.0.0
 */
class LMAT_Links_Default extends LMAT_Links_Model {
	/**
	 * Tells this child class of LMAT_Links_Model does not use pretty permalinks.
	 *
	 * @var bool
	 */
	public $using_permalinks = false;

	/**
	 * Adds the language code in a url.
	 *
	 * @since 1.0.0
	 * @since 1.0.0 Accepts now a language slug.
	 *
	 * @param string                    $url      The url to modify.
	 * @param LMAT_Language|string|false $language Language object or slug.
	 * @return string The modified url.
	 */
	public function add_language_to_link( $url, $language ) {
		if ( $language instanceof LMAT_Language ) {
			$language = $language->slug;
		}

		return empty( $language ) || ( $this->options['hide_default'] && $this->options['default_lang'] === $language ) ? $url : add_query_arg( 'lmat_lang', $language, $url );
	}

	/**
	 * Removes the language information from an url.
	 *
	 * @since 1.0.0
	 *
	 * @param string $url The url to modify.
	 * @return string The modified url.
	 */
	public function remove_language_from_link( $url ) {
		return remove_query_arg( 'lmat_lang', $url );
	}

	/**
	 * Returns the link to the first page.
	 *
	 * @since 1.0.0
	 *
	 * @param string $url The url to modify.
	 * @return string The modified url.
	 */
	public function remove_paged_from_link( $url ) {
		return remove_query_arg( 'paged', $url );
	}

	/**
	 * Returns the link to the paged page.
	 *
	 * @since 1.0.0
	 *
	 * @param string $url  The url to modify.
	 * @param int    $page The page number.
	 * @return string The modified url.
	 */
	public function add_paged_to_link( $url, $page ) {
		return add_query_arg( array( 'paged' => $page ), $url );
	}

	/**
	 * Gets the language slug from the url if present.
	 *
	 * @since 1.0.0
	 * @since 1.0.0 Add the $url argument.
	 *
	 * @param string $url Optional, defaults to the current url.
	 * @return string Language slug.
	 */
	public function get_language_from_url( $url = '' ) {
		if ( empty( $url ) ) {
			$url = lmat_get_requested_url();
		}

		$pattern = sprintf(
			'#[?&]lmat_lang=(?<lang>%s)(?:$|&)#',
			implode( '|', $this->model->get_languages_list( array( 'fields' => 'slug' ) ) )
		);
		return preg_match( $pattern, $url, $matches ) ? $matches['lang'] : '';
	}

	/**
	 * Returns the static front page url in the given language.
	 *
	 * @since 1.0.0
	 * @since 1.0.0 Accepts now an array of language properties.
	 *
	 * @param LMAT_Language|array $language Language object or array of language properties.
	 * @return string The static front page url.
	 */
	public function front_page_url( $language ) {
		if ( $language instanceof LMAT_Language ) {
			$language = $language->to_array();
		}

		if ( $this->options['hide_default'] && $language['is_default'] ) {
			return trailingslashit( $this->home );
		}
		$url = home_url( '/?page_id=' . $language['page_on_front'] );
		return $this->options['force_lang'] ? $this->add_language_to_link( $url, $language['slug'] ) : $url;
	}
}
