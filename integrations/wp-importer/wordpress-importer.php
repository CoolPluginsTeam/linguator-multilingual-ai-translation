<?php
/**
 * @package Linguator
 */
namespace Linguator\Integrations\wp_importer;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Manages the compatibility with WordPress Importer.
 *
 *  
 */
class LMAT_WordPress_Importer {

	/**
	 * Setups filters.
	 *
	 *  
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'maybe_wordpress_importer' ) );
		add_filter( 'wp_import_terms', array( $this, 'wp_import_terms' ) );
	}

	/**
	 * If WordPress Importer is active, replace the wordpress_importer_init function.
	 *
	 *  
	 */
	public function maybe_wordpress_importer() {
		if ( defined( 'WP_LOAD_IMPORTERS' ) && class_exists( 'WP_Import' ) ) {
			remove_action( 'admin_init', 'wordpress_importer_init' );
			add_action( 'admin_init', array( $this, 'wordpress_importer_init' ) );
		}
	}

	/**
	 * Loads our child class LMAT_WP_Import instead of WP_Import.
	 *
	 *  
	 */
	public function wordpress_importer_init() {
		$class = new \ReflectionClass( 'WP_Import' );

		$GLOBALS['wp_import'] = new \LMAT_WP_Import(); // WordPress core global variable for WP Importer
		register_importer( 'wordpress', 'WordPress', __( 'Import <strong>posts, pages, comments, custom fields, categories, and tags</strong> from a WordPress export file.', 'linguator-multilingual-ai-translation' ), array( $GLOBALS['wp_import'], 'dispatch' ) ); // phpcs:ignore WordPress.WP.CapitalPDangit.MisspelledInText
	}

	/**
	 * Handles imported terms.
	 *
	 *  
	 *
	 * @param array $terms An array of arrays containing terms information from the WXR file.
	 * @return array
	 */
	public function wp_import_terms( $terms ) {
		return $terms;
	}
}
