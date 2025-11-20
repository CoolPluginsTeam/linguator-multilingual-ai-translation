<?php
/**
 * Manages the compatibility with the Rank Math plugin
 *
 * @package Linguator
 */
namespace Linguator\Integrations\RankMath;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use RankMath\Sitemap\Sitemap;
use Linguator\Includes\Options\LMAT_Translate_Option;
use Linguator\Includes\Other\LMAT_Language;
use Linguator\Frontend\Controllers\LMAT_Frontend;

/**
 * Manages the compatibility with the Rank Math plugin
 *
 * @since 1.0
 */
class LMAT_RankMath {

	/**
	 * Cached active languages for sitemap generation
	 *
	 * @var array
	 */
	private $cached_active_languages = array();

	/**
	 * Add specific filters and actions
	 *
	 * @return void
	 */
	public function init() {
		add_action( 'wp_loaded', array( $this, 'rm_translate_options_keys' ) );
		add_action( 'plugins_loaded', array( $this, 'rm_reset_rank_math_options' ) );

		if ( LMAT() instanceof LMAT_Frontend ) {
			// Filters sitemap queries to remove inactive language or to get
			// one sitemap per language when using multiple domains or subdomains
			// because Rank Math does not accept several domains or subdomains in one sitemap
			add_filter( 'rank_math/sitemap/post_count/join', array( $this, 'rank_math_sitemap_join_clause' ), 10, 2 );
			add_filter( 'rank_math/sitemap/post_count/where', array( $this, 'rank_math_sitemap_where_clause' ), 10, 2 );
			add_filter( 'rank_math/sitemap/get_posts/join', array( $this, 'rank_math_sitemap_join_clause' ), 10, 2 );
			add_filter( 'rank_math/sitemap/get_posts/where', array( $this, 'rank_math_sitemap_where_clause' ), 10, 2 );

			if ( LMAT()->options['force_lang'] > 1 ) {
				add_filter( 'rank_math/sitemap/enable_caching', '__return_false' ); // Disable cache! otherwise Rank Math keeps only one domain
				add_filter( 'home_url', array( $this, 'rank_math_home_url' ), 10, 2 );
			} else {
				add_filter( 'rank_math/sitemap/enable_caching', '__return_false' );
				// Cache active languages before sitemap generation to avoid infinite loops
				add_action( 'pre_get_posts', array( $this, 'cache_active_languages_for_sitemap' ), -1 );
				// Get all terms in all languages when the language is set from the content or directory name
				add_filter( 'get_terms_args', array( $this, 'rm_update_term_query_args' ) );
				// Include links to homepage of all languages.
				add_filter( 'rank_math/sitemap/exclude_post_type', array( $this, 'update_sitemap_contents' ), 0, 2 );
			}

			add_filter( 'lmat_home_url_white_list', array( $this, 'rm_white_list_home_url' ) );
			add_filter( 'rank_math/frontend/canonical', array( $this, 'rm_home_canonical' ), 10, 1 );
			add_filter( 'rank_math/opengraph/facebook', array( $this, 'rank_math_alt_locales' ), 10 );
		} else {
			// Copy post metas
			add_filter( 'lmat_copy_post_metas', array( $this, 'rm_sync_post_metas' ), 10, 4 );
			// Translate post metas
			add_filter( 'lmat_translate_post_meta', array( $this, 'rm_translate_post_meta' ), 10, 3 );
			// Export post metas
			add_filter( 'lmat_post_metas_to_export', array( $this, 'rm_export_post_metas' ), 10, 1 );
		}
	}

	/**
	 * Reset Rank Math options to clear cache
	 *
	 * @return void
	 */
	public function rm_reset_rank_math_options() {
		if ( function_exists( 'rank_math' ) && method_exists( rank_math(), 'settings' ) ) {
			rank_math()->settings->reset();
		}
	}

	/**
	 * Register options keys for translation.
	 *
	 * @return void
	 */
	public function rm_translate_options_keys() {
		// Keys for rank-math-options-general option
		$keys = array(
			'breadcrumbs_separator',
			'breadcrumbs_home_label',
			'breadcrumbs_archive_format',
			'breadcrumbs_search_format',
			'breadcrumbs_404_label',
			'content_ai_country',
			'content_ai_tone',
			'content_ai_audience',
			'content_ai_language',
			'toc_block_title',
		);

		new LMAT_Translate_Option( 'rank-math-options-general', array_fill_keys( $keys, 1 ), array( 'context' => 'rank-math' ) );

		// Keys for rank-math-options-titles
		$keys = array(
			'website_name',
			'knowledgegraph_name',
			'homepage_title',
			'author_archive_title',
			'date_archive_title',
			'search_title',
			'404_title',
			'pt_post_title',
			'pt_post_description',
			'pt_post_default_snippet_*',
			'pt_page_title',
			'pt_page_description',
			'pt_page_default_snippet_*',
			'pt_attachment_title',
			'pt_attachment_description',
			'pt_attachment_default_snippet_*',
			'pt_product_title',
			'pt_product_description',
			'pt_product_default_snippet_*',
		);

		new LMAT_Translate_Option( 'rank-math-options-titles', array_fill_keys( $keys, 1 ), array( 'context' => 'rank-math' ) );
	}

	/**
	 * Updates the home and stylesheet URLs when using multiple domains or subdomains.
	 *
	 * @param string $url  The complete URL including scheme and path.
	 * @param string $path Path relative to the home URL.
	 * @return string
	 */
	public function rank_math_home_url( $url, $path ) {
		$uri = empty( $path ) ? ltrim( (string) wp_parse_url( lmat_get_requested_url(), PHP_URL_PATH ), '/' ) : $path;
		if ( 'sitemap_index.xml' === $uri || preg_match( '#([^/]+?)-sitemap([0-9]+)?\.xml|([a-z]+)?-?sitemap\.xsl#', $uri ) ) {
			$url = LMAT()->links_model->switch_language_in_link( $url, LMAT()->curlang );
		}

		return $url;
	}

	/**
	 * Get the active languages.
	 *
	 * @return array list of active language slugs, empty if all languages are active
	 */
	protected function rank_math_get_active_languages() {
		$languages = LMAT()->model->get_languages_list();
		if ( wp_list_filter( $languages, array( 'active' => false ) ) ) {
			return wp_list_pluck( wp_list_filter( $languages, array( 'active' => false ), 'NOT' ), 'slug' );
		}
		return array();
	}

	/**
	 * Modifies the sql request for posts sitemaps
	 * Only when using multiple domains or subdomains or if some languages are not active
	 *
	 * @param string $sql       JOIN clause
	 * @param string $post_type Post type
	 * @return string
	 */
	public function rank_math_sitemap_join_clause( $sql, $post_type ) {
		return lmat_is_translated_post_type( $post_type ) ? $sql . LMAT()->model->post->join_clause( 'p' ) : $sql;
	}

	/**
	 * Modifies the sql request for posts sitemaps
	 * Only when using multiple domains or subdomains or if some languages are not active
	 *
	 * @param string $sql       WHERE clause
	 * @param string $post_type Post type
	 * @return string
	 */
	public function rank_math_sitemap_where_clause( $sql, $post_type ) {
		if ( ! lmat_is_translated_post_type( $post_type ) ) {
			return $sql;
		}

		if ( LMAT()->options['force_lang'] > 1 && LMAT()->curlang instanceof LMAT_Language ) {
			return $sql . LMAT()->model->post->where_clause( LMAT()->curlang );
		}

		$languages = $this->rank_math_get_active_languages();
		if ( empty( $languages ) ) { // Empty when all languages are active.
			$languages = lmat_languages_list();
		}

		return $sql . LMAT()->model->post->where_clause( $languages );
	}

	/**
	 * Cache active languages before sitemap generation to avoid infinite loops
	 *
	 * @param WP_Query $query WP_Query object.
	 * @return void
	 */
	public function cache_active_languages_for_sitemap( $query ) {
		if ( ! isset( $query->query['sitemap'] ) ) {
			return;
		}

		// Temporarily remove our own filter to avoid infinite loops
		remove_filter( 'get_terms_args', array( $this, 'rm_update_term_query_args' ) );

		// Get active languages directly from the languages model
		try {
			$languages = LMAT()->model->languages->get_list();
			$active_languages = array();
			
			foreach ( $languages as $lang ) {
				if ( $lang->active ) {
					$active_languages[] = $lang->slug;
				}
			}
			
			$this->cached_active_languages = $active_languages;
		} catch ( \Exception $e ) {
			// If something fails, set empty array (will use all languages)
			$this->cached_active_languages = array();
		}

		// Re-add our filter
		add_filter( 'get_terms_args', array( $this, 'rm_update_term_query_args' ) );
	}

	/**
	 * When the language is set from the content or directory name, the language filter (and inactive languages) need to be removed for the taxonomy sitemaps.
	 *
	 * @param array $args get_terms arguments
	 * @return array modified list of arguments
	 */
	public function rm_update_term_query_args( $args ) {
		// Only process during sitemap generation
		if ( ! isset( $GLOBALS['wp_query']->query['sitemap'] ) ) {
			return $args;
		}

		// CRITICAL: Don't filter language taxonomy queries to prevent infinite loops
		if ( isset( $args['taxonomy'] ) ) {
			$taxonomies = (array) $args['taxonomy'];
			// Skip if querying language taxonomies
			if ( in_array( 'lmat_language', $taxonomies, true ) || in_array( 'lmat_term_language', $taxonomies, true ) ) {
				return $args;
			}
		}

		// Use cached active languages to avoid infinite loops
		if ( ! empty( $this->cached_active_languages ) ) {
			$args['lang'] = implode( ',', $this->cached_active_languages );
		} else {
			// If cache is empty, use all languages (safer than risking infinite loop)
			$args['lang'] = '';
		}

		return $args;
	}

	/**
	 * A way to apply rank_math/sitemap/{$type}_content for all indexable post types.
	 *
	 * Updates homepage and archive pages to include links to the active languages.
	 *
	 * Always returns $excluded without altering its value.
	 *
	 * @param bool   $exclude Whether to exclude the post type
	 * @param string $type    Post type
	 * @return bool
	 */
	public function update_sitemap_contents( $exclude, $type ) {
		if ( lmat_is_translated_post_type( $type ) && ( 'post' !== $type || ! get_option( 'page_on_front' ) ) ) {
			// Include post, post type archives, and the homepages in all languages to the sitemap when the front page displays posts!
			add_action(
				"rank_math/sitemap/{$type}_content",
				function() use ( $type ) {
					$generator     = new \RankMath\Sitemap\Generator();
					$post_type_obj = get_post_type_object( $type );
					$languages     = wp_list_filter( LMAT()->model->get_languages_list(), array( 'active' => false ), 'NOT' );
					$mod           = Sitemap::get_last_modified_gmt( $type );
					$output        = '';

					if ( 'post' === $type ) {
						if ( ! empty( LMAT()->options['hide_default'] ) ) {
							// The home url is of course already added by Rank Math.
							$languages = wp_list_filter( $languages, array( 'slug' => lmat_default_language() ), 'NOT' );
						}

						foreach ( $languages as $lang ) {
							$output .= $generator->sitemap_url(
								array(
									'loc' => lmat_home_url( $lang->slug ),
									'mod' => $mod,
								)
							);
						}
					} elseif ( $post_type_obj->has_archive ) {
						// Exclude cases where a post type archive is attached to a page (ex: WooCommerce).
						$slug = true === $post_type_obj->has_archive ? $post_type_obj->rewrite['slug'] : $post_type_obj->has_archive;

						if ( ! wpcom_vip_get_page_by_path( $slug ) ) {
							// The post type archive in the current language is already added by Rank Math.
							$languages = wp_list_filter( $languages, array( 'slug' => lmat_current_language() ), 'NOT' );

							foreach ( $languages as $lang ) {
								LMAT()->curlang = $lang; // Switch the language to get the correct archive link.
								$output        .= $generator->sitemap_url(
									array(
										'loc' => get_post_type_archive_link( $type ),
										'mod' => $mod,
									)
								);
							}
						}
					}

					return $output;
				}
			);
		}

		return $exclude;
	}

	/**
	 * Include language code in the canonical URL.
	 *
	 * @param string $canonical The canonical URL.
	 * @return string
	 */
	public function rm_home_canonical( $canonical ) {
		global $post;

		$post_id = (int) get_option( 'page_on_front' );

		if ( ! is_home() && isset( $post->ID ) && $post->ID !== lmat_get_post( $post_id ) ) {
			return $canonical;
		}

		$path = ltrim( (string) wp_parse_url( lmat_get_requested_url(), PHP_URL_PATH ), '/' );

		return $canonical . $path;
	}

	/**
	 * Filters home url.
	 *
	 * @param array $arr List of files to whitelist
	 * @return array
	 */
	public function rm_white_list_home_url( $arr ) {
		return array_merge( $arr, array( array( 'file' => 'seo-by-rank-math' ) ) );
	}

	/**
	 * Updates OpenGraph meta output by adding support for translations.
	 *
	 * @return void
	 */
	public function rank_math_alt_locales() {
		if ( ! class_exists( '\RankMath\OpenGraph\OpenGraph' ) ) {
			return;
		}

		$og          = new \RankMath\OpenGraph\OpenGraph();
		$og->network = 'facebook';

		foreach ( $this->update_ogp_alternate_languages() as $lang ) {
			$og->tag( 'og:locale:alternate', $lang );
		}
	}

	/**
	 * Get alternate language codes for Opengraph.
	 *
	 * @return string[]
	 */
	protected function update_ogp_alternate_languages() {
		$alternates = array();

		foreach ( LMAT()->model->get_languages_list() as $language ) {
			if ( isset( LMAT()->curlang ) && LMAT()->curlang->slug !== $language->slug && LMAT()->links->get_translation_url( $language ) && isset( $language->facebook ) ) {
				$alternates[] = $language->facebook;
			}
		}

		// There is a risk that 2 languages have the same Facebook locale. So let's make sure to output each locale only once.
		return array_unique( $alternates );
	}

	/**
	 * Synchronizes or copies the metas.
	 *
	 * @param array $metas List of meta keys to copy
	 * @param bool  $sync  Whether this is a synchronization
	 * @param int   $from  Source post ID
	 * @param int   $to    Target post ID
	 * @return array
	 */
	public function rm_sync_post_metas( $metas, $sync, $from, $to ) {
		if ( ! $sync ) {
			$metas = array_merge( $metas, $this->rm_translatable_meta_keys() );

			// Copy image URLS
			$metas[] = 'rank_math_facebook_image';
			$metas[] = 'rank_math_facebook_image_id';
			$metas[] = 'rank_math_twitter_use_facebook';
			$metas[] = 'rank_math_twitter_image';
			$metas[] = 'rank_math_twitter_image_id';
			$metas[] = 'rank_math_robots';
		}

		$taxonomies = get_taxonomies(
			array(
				'hierarchical' => true,
				'public'       => true,
			)
		);

		$sync_taxonomies = LMAT()->sync->taxonomies->get_taxonomies_to_copy( $sync, $from, $to );

		$taxonomies = array_intersect( $taxonomies, $sync_taxonomies );

		foreach ( $taxonomies as $taxonomy ) {
			$metas[] = 'rank_math_primary_' . $taxonomy;
		}

		return $metas;
	}

	/**
	 * Translate the primary term during the synchronization process
	 *
	 * @param int    $value Meta value.
	 * @param string $key   Meta key.
	 * @param string $lang  Language of target.
	 * @return int
	 */
	public function rm_translate_post_meta( $value, $key, $lang ) {
		// Check if the key starts with rank_math_primary_
		if ( 0 !== strpos( $key, 'rank_math_primary_' ) ) {
			return $value;
		}

		$taxonomy = str_replace( 'rank_math_primary_', '', $key );

		if ( ! LMAT()->model->is_translated_taxonomy( $taxonomy ) ) {
			return $value;
		}

		return lmat_get_term( $value, $lang );
	}

	/**
	 * Meta key with translatable values.
	 *
	 * @return string[]
	 */
	private function rm_translatable_meta_keys() {
		return array(
			'rank_math_title',
			'rank_math_description',
			'rank_math_facebook_title',
			'rank_math_facebook_description',
			'rank_math_twitter_title',
			'rank_math_twitter_description',
			'rank_math_focus_keyword',
		);
	}

	/**
	 * Rank math translatable metas to export.
	 *
	 * @param array $metas List of meta keys
	 * @return array
	 */
	public function rm_export_post_metas( $metas ) {
		$rm_metas = array_fill_keys( $this->rm_translatable_meta_keys(), 1 );

		return array_merge( $metas, $rm_metas );
	}
}

