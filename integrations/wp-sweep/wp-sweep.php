<?php
/**
 * @package Linguator
 */
namespace Linguator\Integrations\wp_sweep;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Manages the compatibility with WP Sweep.
 *
 *  
 */
class LMAT_WP_Sweep {
	/**
	 * Setups actions.
	 *
	 *  
	 */
	public function init() {
		add_filter( 'wp_sweep_excluded_taxonomies', array( $this, 'wp_sweep_excluded_taxonomies' ) );
		add_filter( 'wp_sweep_excluded_termids', array( $this, 'wp_sweep_excluded_termids' ), 0 );
	}

	/**
	 * Add 'lmat_term_language' and 'lmat_term_translations' to excluded taxonomies otherwise terms loose their language and translation group.
	 *
	 *  
	 *
	 * @param array $excluded_taxonomies List of taxonomies excluded from sweeping.
	 * @return array
	 */
	public function wp_sweep_excluded_taxonomies( $excluded_taxonomies ) {
		return array_merge( $excluded_taxonomies, array( 'lmat_term_language', 'lmat_term_translations' ) );
	}

	/**
	 * Add the translation of the default taxonomy terms and our language terms to the excluded terms.
	 *
	 *  
	 *
	 * @param array $excluded_term_ids List of term ids excluded from sweeping.
	 * @return array
	 */
	public function wp_sweep_excluded_termids( $excluded_term_ids ) {
		// We got a list of excluded terms (defaults and parents). Let exclude their translations too.
		$_term_ids = array();

		foreach ( $excluded_term_ids as $excluded_term_id ) {
			$_term_ids = array_merge( $_term_ids, array_values( lmat_get_term_translations( $excluded_term_id ) ) );
		}

		$excluded_term_ids = array_merge( $excluded_term_ids, $_term_ids );

		// Add the terms of our languages.
		foreach ( LMAT()->model->get_languages_list() as $language ) {
			$excluded_term_ids = array_merge(
				$excluded_term_ids,
				array_values( $language->get_tax_props( 'term_id' ) )
			);
		}

		return array_unique( $excluded_term_ids );
	}
}
