<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Services\Crud;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use Linguator\Includes\Other\LMAT_Language;
use Linguator\Includes\Other\LMAT_Model;
use Linguator\Includes\Helpers\LMAT_Term_Slug;
use Linguator\Modules\REST\Request;
use Linguator\Includes\Capabilities\User;
use Linguator\Includes\Capabilities\Create\Term as Create_Term;

/**
 * Adds actions and filters related to languages when creating, reading, updating or deleting posts
 * Acts both on frontend and backend
 *
 *  
 */
class LMAT_CRUD_Terms {
	/**
	 * @var LMAT_Model
	 */
	public $model;

	/**
	 * Current language (used to filter the content).
	 *
	 * @var LMAT_Language|null
	 */
	public $curlang;

	/**
	 * Language selected in the admin language filter.
	 *
	 * @var LMAT_Language|null
	 */
	public $filter_lang;

	/**
	 * Preferred language to assign to new contents.
	 *
	 * @var LMAT_Language|null
	 */
	public $pref_lang;

	/**
	 * Stores the 'lang' query var from WP_Query.
	 *
	 * @var string|null
	 */
	private $tax_query_lang;

	/**
	 * Stores the term name before creating a slug if needed.
	 *
	 * @var string
	 */
	private $pre_term_name = '';

	/**
	 * Reference to the Linguator options array.
	 *
	 * @var array
	 */
	protected $options;

	/**
	 * Reference to the Linguator Request object.
	 *
	 * @var Request
	 */
	private $request;

	/**
	 * Constructor
	 *
	 *  
	 *
	 * @param object $linguator The Linguator object.
	 */
	public function __construct( &$linguator ) {
		$this->options     = &$linguator->options;
		$this->model       = &$linguator->model;
		$this->curlang     = &$linguator->curlang;
		$this->filter_lang = &$linguator->filter_lang;
		$this->pref_lang   = &$linguator->pref_lang;
		$this->request   = &$linguator->request;

		// Saving terms.
		add_action( 'create_term', array( $this, 'save_term' ), 999, 3 );
		add_action( 'edit_term', array( $this, 'save_term' ), 999, 3 ); // After LMAT_Admin_Filters_Term
		add_filter( 'pre_term_name', array( $this, 'set_pre_term_name' ) );
		add_filter( 'pre_term_slug', array( $this, 'set_pre_term_slug' ), 10, 2 );

		// Filters terms query by language.
		add_filter( 'get_terms_args', array( $this, 'adjust_query_lang' ) );
		add_filter( 'terms_clauses', array( $this, 'terms_clauses' ), 10, 3 );
		add_action( 'pre_get_posts', array( $this, 'set_tax_query_lang' ), 999 );
		add_action( 'posts_selection', array( $this, 'unset_tax_query_lang' ), 0 );

		// Deleting terms.
		add_action( 'pre_delete_term', array( $this, 'delete_term' ), 10, 2 );
	}

	/**
	 * Allows to set a language by default for terms if it has no language yet.
	 *
	 *  
	 *
	 * @param int    $term_id  Term ID.
	 * @param string $taxonomy Taxonomy name.
	 * @return void
	 */
	protected function set_default_language( $term_id, $taxonomy ) {
		$term_language = new Create_Term(
			$this->model,
			$this->request,
			$this->pref_lang instanceof LMAT_Language ? $this->pref_lang : null, // Can be `false` as well...
			$this->curlang instanceof LMAT_Language ? $this->curlang : null // Can be `false` as well...
		);

		$this->model->term->set_language(
			$term_id,
			$term_language->get_language( new User(), (int) $term_id, (string) $taxonomy )
		);
	}

	/**
	 * Called when a category or post tag is created or edited.
	 * Does nothing except on taxonomies which are filterable.
	 *
	 *  
	 *
	 * @param int    $term_id  Term id of the term being saved.
	 * @param int    $tt_id    Term taxonomy id.
	 * @param string $taxonomy Taxonomy name.
	 * @return void
	 */
	public function save_term( $term_id, $tt_id, $taxonomy ) {
		if ( is_multisite() && ms_is_switched() && ! $this->model->has_languages() ) {
			return;
		}

		if ( ! $this->model->is_translated_taxonomy( $taxonomy ) ) {
			return;
		}

			$lang = $this->model->term->get_language( $term_id );

			if ( empty( $lang ) ) {
				$this->set_default_language( $term_id, $taxonomy );
			}

			/**
			 * Fires after the term language and translations are saved.
			 *
			 *  
			 *
			 * @param int    $term_id      Term id.
			 * @param string $taxonomy     Taxonomy name.
			 * @param int[]  $translations The list of translations term ids.
			 */
			do_action( 'lmat_save_term', $term_id, $taxonomy, $this->model->term->get_translations( $term_id ) );
	}

	/**
	 * Get the language(s) to filter WP_Term_Query.
	 *
	 *  
	 *
	 * @param string[] $taxonomies Queried taxonomies.
	 * @param array    $args       WP_Term_Query arguments.
	 * @return LMAT_Language[] The language(s) to use in the filter, false otherwise.
	 */
	protected function get_queried_languages( $taxonomies, $args ): array {
		global $pagenow;

		// Does nothing except on taxonomies which are filterable
		// Since WP 4.7, make sure not to filter wp_get_object_terms()
		if ( ! $this->model->is_translated_taxonomy( $taxonomies ) || ! empty( $args['object_ids'] ) ) {
			return array();
		}

		// If get_terms() is queried with a 'lang' parameter.
		if ( isset( $args['lang'] ) ) {
			$languages = is_string( $args['lang'] ) ? explode( ',', $args['lang'] ) : $args['lang'];
			return array_filter( array_map( array( $this->model, 'get_language' ), (array) $languages ) );
		}

		// On the tags page, everything should be filtered according to the admin language filter except the parent dropdown.
		if ( 'edit-tags.php' === $pagenow && empty( $args['class'] ) ) {
			return ! empty( $this->filter_lang ) ? array( $this->filter_lang ) : array();
		}

		return ! empty( $this->curlang ) ? array( $this->curlang ) : array();
	}

	/**
	 * Adds language dependent cache domain when querying terms.
	 * Useful as the 'lang' parameter is not included in cache key by WordPress.
	 *
	 *  
	 *
	 * @param array    $args       WP_Term_Query arguments.
	 * @param string[] $taxonomies Queried taxonomies.
	 * @return array Modified arguments.
	 */
	public function adjust_query_lang( $args ) {
		// Don't break _get_term_hierarchy().
		if ( 'all' === $args['get'] && 'id' === $args['orderby'] && 'id=>parent' === $args['fields'] ) {
			$args['lang'] = '';
		}

		if ( isset( $this->tax_query_lang ) ) {
			$args['lang'] = empty( $this->tax_query_lang ) && ! empty( $this->curlang ) && ! empty( $args['slug'] ) ? $this->curlang->slug : $this->tax_query_lang;
		}

		return $args;
	}

	/**
	 * Filters categories and post tags by language(s) when needed on admin side
	 *
	 *  
	 *
	 * @param string[] $clauses    List of sql clauses.
	 * @param string[] $taxonomies List of taxonomies.
	 * @param array    $args       WP_Term_Query arguments.
	 * @return string[] Modified sql clauses.
	 */
	public function terms_clauses( $clauses, $taxonomies, $args ) {
		$languages = $this->get_queried_languages( $taxonomies, $args );
		return $this->model->terms_clauses( $clauses, $languages );
	}

	/**
	 * Sets the WP_Term_Query language when doing a WP_Query.
	 * Needed since WP 4.9.
	 *
	 *  
	 *
	 * @param WP_Query $query WP_Query object.
	 * @return void
	 */
	public function set_tax_query_lang( $query ) {
		$this->tax_query_lang = $query->query_vars['lmat_lang'] ?? '';
	}

	/**
	 * Removes the WP_Term_Query language filter for WP_Query.
	 * Needed since WP 4.9.
	 *
	 *  
	 *
	 * @return void
	 */
	public function unset_tax_query_lang() {
		unset( $this->tax_query_lang );
	}

	/**
	 * Called when a category or post tag is deleted
	 * Deletes language and translations
	 *
	 *  
	 *
	 * @param int    $term_id  Id of the term to delete.
	 * @param string $taxonomy Name of the taxonomy.
	 * @return void
	 */
	public function delete_term( $term_id, $taxonomy ) {
		if ( ! $this->model->is_translated_taxonomy( $taxonomy ) ) {
			return;
		}

		// Delete translation and relationships only if the term is translatable.
		$this->model->term->delete_translation( $term_id );
		$this->model->term->delete_language( $term_id );
	}

	/**
	 * Stores the term name for use in pre_term_slug
	 *
	 *  
	 *
	 * @param string $name term name
	 * @return string unmodified term name
	 */
	public function set_pre_term_name( $name ) {
		$this->pre_term_name = is_string( $name ) ? $name : '';

		return $name;
	}

	/**
	 * Appends language slug to the term slug if needed.
	 *
	 *  
	 *
	 * @param string $slug     Term slug.
	 * @param string $taxonomy Term taxonomy.
	 * @return string Slug with a language suffix if found.
	 */
	public function set_pre_term_slug( $slug, $taxonomy ) {
		if ( ! $this->model->is_translated_taxonomy( $taxonomy ) || ! is_string( $slug ) ) {
			return $slug;
		}

		$term_slug = new LMAT_Term_Slug( $this->model, $slug, $taxonomy, $this->pre_term_name );

		return $term_slug->get_suffixed_slug( '-' );
	}
}
