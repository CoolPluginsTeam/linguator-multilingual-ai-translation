<?php
/**
 * @package Linguator
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) { // If uninstall not called from WordPress exit.
	exit;
}

/**
 * Manages Linguator uninstallation.
 * The goal is to remove **all** Linguator related data in db.
 *
 * @since 1.0.0
 */
class LMAT_Uninstall {

	/**
	 * Constructor: manages uninstall for multisite.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		global $wpdb;

		// Don't do anything except if the constant LMAT_REMOVE_ALL_DATA is explicitly defined and true.
		if ( ! defined( 'LMAT_REMOVE_ALL_DATA' ) || ! LMAT_REMOVE_ALL_DATA ) {
			return;
		}

		// Check if it is a multisite uninstall - if so, run the uninstall function for each blog id.
		if ( is_multisite() ) {
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.PreparedSQL.NotPrepared,WordPress.DB.DirectDatabaseQuery.NoCaching -- Direct DB query is required here because WordPress core does not provide any efficient or native way to fetch all blog IDs in a multisite network. This raw query is necessary for performance and compatibility.
			foreach ( $wpdb->get_col( "SELECT blog_id FROM $wpdb->blogs" ) as $blog_id ) {
				switch_to_blog( $blog_id );
				$this->uninstall();
			}
			restore_current_blog();
		} else {
			$this->uninstall();
		}
	}

	/**
	 * Removes **all** plugin data.
	 *
	 * @since 1.0.0
	 */
	public function uninstall() {
		global $wpdb;

		do_action( 'lmat_uninstall' );

		// We need to register the taxonomies.
		$lmat_taxonomies = array(
			'lmat_language',
			'lmat_term_language',
			'lmat_post_translations',
			'lmat_term_translations',
		);

		foreach ( $lmat_taxonomies as $taxonomy ) {
			register_taxonomy(
				$taxonomy,
				null,
				array(
					'label'     => false,
					'public'    => false,
					'query_var' => false,
					'rewrite'   => false,
				)
			);
		}

		$languages = get_terms(
			array(
				'taxonomy'   => 'lmat_language',
				'hide_empty' => false,
			)
		);

		// Delete users options.
		delete_metadata( 'user', 0, 'lmat_filter_content', '', true );
		delete_metadata( 'user', 0, 'lmat_dismissed_notices', '', true ); // Legacy meta.
		foreach ( $languages as $lang ) {
			delete_metadata( 'user', 0, "description_{$lang->slug}", '', true );
		}

		// Delete menu language switchers.
		$ids = get_posts(
			array(
				'post_type'   => 'nav_menu_item',
				'numberposts' => -1,
				'nopaging'    => true,
				'fields'      => 'ids',
				'meta_key'    => '_lmat_menu_item', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key -- Using meta_key here is necessary to identify all nav_menu_item posts that are language switchers added by this plugin. This ensures complete cleanup of all plugin-inserted menu items during uninstall, and there is no performant alternative in core WP for this use-case.
			)
		);

		foreach ( $ids as $id ) {
			wp_delete_post( $id, true );
		}

		

		// Delete all what is related to languages and translations.
		$term_ids = array();
		$tt_ids   = array();

		$terms = get_terms(
			array(
				'taxonomy'   => $lmat_taxonomies,
				'hide_empty' => false,
			)
		);

		foreach ( $terms as $term ) {
			$term_ids[] = (int) $term->term_id;
			$tt_ids[]   = (int) $term->term_taxonomy_id;
		}

		if ( ! empty( $term_ids ) ) {
			$term_ids = array_unique( $term_ids );
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.PreparedSQL.NotPrepared,WordPress.DB.DirectDatabaseQuery.NoCaching -- Bulk deletion of terms via direct DB query is required here: WordPress core does not offer any performant or reliable API for deleting many terms at once, especially during plugin uninstall. This approach ensures all related data is efficiently removed.
			$wpdb->query(
				$wpdb->prepare(
					sprintf(
						"DELETE FROM {$wpdb->terms} WHERE term_id IN (%s)",
						implode( ',', array_fill( 0, count( $term_ids ), '%d' ) )
					),
					$term_ids
				)
			);
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.PreparedSQL.NotPrepared,WordPress.DB.DirectDatabaseQuery.NoCaching -- Bulk deletion of term taxonomy rows: no native WP API exists for this, and direct query is necessary for complete cleanup on uninstall.
			$wpdb->query(
				$wpdb->prepare(
					sprintf(
						"DELETE FROM {$wpdb->term_taxonomy} WHERE term_id IN (%s)",
						implode( ',', array_fill( 0, count( $term_ids ), '%d' ) )
					),
					$term_ids
				)
			);
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.PreparedSQL.NotPrepared,WordPress.DB.DirectDatabaseQuery.NoCaching -- Bulk deletion of term meta for uninstall: required for performance and data integrity, as WP has no efficient API for this operation.
			$wpdb->query(
				$wpdb->prepare(
					sprintf(
						"DELETE FROM {$wpdb->termmeta} WHERE term_id IN (%s) AND meta_key='_lmat_strings_translations'",
						implode( ',', array_fill( 0, count( $term_ids ), '%d' ) )
					),
					$term_ids
				)
			);
		}

		if ( ! empty( $tt_ids ) ) {
			$tt_ids = array_unique( $tt_ids );
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.PreparedSQL.NotPrepared,WordPress.DB.DirectDatabaseQuery.NoCaching -- Bulk deletion of term relationships: required for efficient and reliable cleanup during uninstall, as no performant or reliable WordPress API exists for mass deletion of term relationships.
			$wpdb->query( $wpdb->prepare( sprintf( "DELETE FROM {$wpdb->term_relationships} WHERE term_taxonomy_id IN (%s)", implode( ',', array_fill( 0, count( $tt_ids ), '%d' ) ) ), $tt_ids ) );
		}

		// Delete options.
		delete_option( 'linguator' );
		delete_option( 'widget_linguator_widget' ); // Automatically created by WP.
		delete_option( 'linguator_wpml_strings' ); // Strings registered with icl_register_string.
		delete_option( 'linguator_licenses' );
		delete_option( 'lmat_dismissed_notices' );
		delete_option( 'lmat_language_from_content_available' );
		if (wp_next_scheduled('lmat_extra_data_update')) {
			wp_clear_scheduled_hook('lmat_extra_data_update');
		}
		// Delete transients.
		delete_transient( 'lmat_languages_list' );
	}
}

new LMAT_Uninstall();
