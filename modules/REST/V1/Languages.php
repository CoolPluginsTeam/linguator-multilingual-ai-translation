<?php
/**
 * @package Linguator
 */

namespace Linguator\Modules\REST\V1;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use Linguator\Includes\Other\LMAT_Language;
use Linguator\Includes\Other\LMAT_Model;
use Linguator\Modules\REST\Abstract_Controller;
use Linguator\Includes\Models\Translatable\LMAT_Translatable_Objects;
use stdClass;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;
use Linguator\Includes\Models\Languages as Languages_Model;



/**
 * Languages REST controller.
 *
 * @since 1.0.0
 */
class Languages extends Abstract_Controller {
	/**
	 * @var Languages_Model
	 */
	private $languages;

	/**
	 * @var LMAT_Translatable_Objects
	 */
	private $translatable_objects;

	/**
	 * Reference to the model object
	 *
	 * @var LMAT_Model
	 */
	protected $model;

	protected $namespace;
	protected $rest_base;
	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 *
	 * @param LMAT_Model $model Linguator's model.
	 */
	public function __construct( LMAT_Model $model ) {
		$this->namespace            = 'lmat/v1';
		$this->rest_base            = 'languages';
		$this->model                = $model;
		$this->languages            = $model->languages;
		$this->translatable_objects = $model->translatable_objects;
	}

	/**
	 * Registers the routes for languages.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function register_routes(): void {

		
		register_rest_route(
			$this->namespace,
			"/{$this->rest_base}",
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items' ),
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
				),
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'create_item' ),
					'permission_callback' => array( $this, 'create_item_permissions_check' ),
					'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::CREATABLE ),
					'allow_batch'         => array( 'v1' => true ),
				),
				'schema'      => array( $this, 'get_public_item_schema' ),
				'allow_batch' => array( 'v1' => true ),
			)
		);
		register_rest_route(
			$this->namespace,
			"/{$this->rest_base}/utils/get_all_pages_data",
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_all_pages_data' ),
				'permission_callback' => array( $this, 'get_all_post_data_permissions_check' ),
			)
			);

		register_rest_route(
			$this->namespace,
			"/{$this->rest_base}/(?P<term_id>[\d]+)",
			array(
				'args'   => array(
					'term_id' => array(
						'description' => __( 'Unique identifier for the language.', 'linguator-multilingual-ai-translation' ),
						'type'        => 'integer',
					),
				),
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_item' ),
					'permission_callback' => array( $this, 'get_item_permissions_check' ),
					'args'                => array(
						'context' => $this->get_context_param( array( 'default' => 'view' ) ),
					),
				),
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array( $this, 'update_item_permissions_check' ),
					'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::EDITABLE ),
				),
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'delete_item' ),
					'permission_callback' => array( $this, 'delete_item_permissions_check' ),
				),
				'schema'      => array( $this, 'get_public_item_schema' ),
				'allow_batch' => array( 'v1' => true ),
			)
		);
		register_rest_route(
			$this->namespace,
			sprintf( '/%1$s/(?P<slug>%2$s)', $this->rest_base, Languages_Model::INNER_SLUG_PATTERN ),
			array(
				'args'   => array(
					'slug'    => array(
						'description' => __( 'Language code - preferably 2-letters ISO 639-1 (for example: en).', 'linguator-multilingual-ai-translation' ),
						'type'        => 'string',
					),
				),
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_item' ),
					'permission_callback' => array( $this, 'get_item_permissions_check' ),
					'args'                => array(
						'context' => $this->get_context_param( array( 'default' => 'view' ) ),
					),
				),
				'schema'      => array( $this, 'get_public_item_schema' ),
				'allow_batch' => array( 'v1' => true ),
			)
		);
		register_rest_route(
			$this->namespace,
			"/{$this->rest_base}/assign-language",
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'assign_language_in_mass' ),
				'permission_callback' => array( $this, 'assign_language_permissions_check' ),
				'args'                => array(
					'locale' => array(
						'description' => __( 'Locale of the language to assign.', 'linguator-multilingual-ai-translation' ),
						'type'        => 'string',
						'required'    => true,
					),
				),
			)
		);
		// Link an existing page to the current translation group
		register_rest_route(
			$this->namespace,
			"/{$this->rest_base}/link-translation",
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'link_translation' ),
				'permission_callback' => array( $this, 'link_translation_permissions_check' ),
				'args'                => array(
					'source_id' => array(
						'description' => __( 'ID of the source post (current).', 'linguator-multilingual-ai-translation' ),
						'type'        => 'integer',
						'required'    => true,
					),
					'target_id' => array(
						'description' => __( 'ID of the existing page to link.', 'linguator-multilingual-ai-translation' ),
						'type'        => 'integer',
						'required'    => true,
					),
					'target_lang' => array(
						'description' => __( 'Language slug of the target page.', 'linguator-multilingual-ai-translation' ),
						'type'        => 'string',
						'required'    => true,
					),
				),
			)
		);
		register_rest_route(
			$this->namespace,
			"/{$this->rest_base}/create-home-page-translation",
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'create_home_page_translation' ),
				'permission_callback' => array( $this, 'create_home_page_translation_permissions_check' ),
			)
		);
		// Create and link a new translation from a typed title (no redirect)
		register_rest_route(
			$this->namespace,
			"/{$this->rest_base}/create-translation",
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'create_translation_from_title' ),
				'permission_callback' => array( $this, 'create_translation_permissions_check' ),
				'args'                => array(
					'source_id' => array(
						'description' => __( 'ID of the source post (current).', 'linguator-multilingual-ai-translation' ),
						'type'        => 'integer',
						'required'    => true,
					),
					'target_lang' => array(
						'description' => __( 'Language slug for the new translation.', 'linguator-multilingual-ai-translation' ),
						'type'        => 'string',
						'required'    => true,
					),
					'title' => array(
						'description' => __( 'Title for the new translation post.', 'linguator-multilingual-ai-translation' ),
						'type'        => 'string',
						'required'    => true,
					),
					'post_type' => array(
						'description' => __( 'Post type for the new translation (default page).', 'linguator-multilingual-ai-translation' ),
						'type'        => 'string',
						'required'    => false,
					),
				),
			)
		);

		
	}

	/**
	 * Retrieves all translatable posts with their language.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|array
	 */
	public function get_all_pages_data( $request ) {
		$response = array();

		// Get post types managed by Linguator
		$post_types = array( 'page' );
		if ( empty( $post_types ) ) {
			return rest_ensure_response( $response );
		}

		$posts = get_posts( array(
			'post_type'        => 'page',
			'post_status'      => array( 'publish' ),
			'posts_per_page'   => -1,
			'suppress_filters' => false,
		) );

		foreach ( $posts as $post ) {
			$language = $this->model->post->get_language( $post->ID );
			// Translations mapping: language slug/locale => post ID
			$translations = (array) $this->model->post->get_translations( $post->ID );
			$linked_ids = array();
			foreach ( $translations as $lang_key => $tr_post_id ) {
				if ( $tr_post_id && (int) $tr_post_id !== (int) $post->ID ) {
					$linked_ids[ $lang_key ] = (int) $tr_post_id;
				}
			}
			$response[] = array(
				'ID'       => $post->ID,
				'title'    => $post->post_title,
				'slug'     => $post->post_name,
				'type'     => $post->post_type,
				'status'   => $post->post_status,
				'date'     => $post->post_date,
				'modified' => $post->post_modified,
				'language' => $language ? $language->to_array() : null,
				'translations' => $translations,
				'is_linked' => ! empty( $linked_ids ),
				'linked_ids' => $linked_ids,
			);
		}

		return rest_ensure_response( $response );
	}

	/**
	 * Permissions for get_all_post_data endpoint.
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return true|WP_Error
	 */
	public function get_all_post_data_permissions_check( $request ) {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return new WP_Error(
				'rest_forbidden',
				__( 'Sorry, you are not allowed to view posts data.', 'linguator-multilingual-ai-translation' ),
				array( 'status' => rest_authorization_required_code() )
			);
		}
		return true;
	}

	/**
	 * Retrieves all languages.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 *
	 * @phpstan-template T of array
	 * @phpstan-param WP_REST_Request<T> $request
	 */
	public function get_items( $request ) {
		$response = array();

		foreach ( $this->languages->get_list() as $language ) {
			$language   = $this->prepare_item_for_response( $language, $request );
			$response[] = $this->prepare_response_for_collection( $language );
		}

		return rest_ensure_response( $response );
	}

	/**
	 * Creates one or multiple languages from the collection.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 *
	 * @phpstan-template T of array
	 * @phpstan-param WP_REST_Request<T> $request
	 */
	public function create_item( $request ) {
		$body_params = $request->get_json_params();
		// Check if this is a bulk operation (array of languages)
		if ( is_array( $body_params ) && isset( $body_params[0] ) && is_array( $body_params[0] ) ) {
			return $this->create_multiple_languages( $body_params, $request );
		}
		
		// Single language creation (existing logic)
		if ( isset( $request['term_id'] ) ) {
			return new WP_Error(
				'rest_exists',
				__( 'Cannot create existing language.', 'linguator-multilingual-ai-translation' ),
				array( 'status' => 400 )
			);
		}

		// At this point, `$request['locale']` is provided (but maybe not valid).
		$prepared = $this->prepare_item_for_database( $request );

		if ( is_wp_error( $prepared ) ) {
			return $prepared;
		}

		/**
		 * @phpstan-var array{
		 *    locale: non-empty-string,
		 *    slug: non-empty-string,
		 *    name: non-empty-string,
		 *    rtl: bool,
		 *    term_group: int,
		 *    flag: non-empty-string,
		 *    no_default_cat: bool
		 * } $args
		 */
		$args   = (array) $prepared;
		$result = $this->languages->add( $args );

		if ( is_wp_error( $result ) ) {
			return $this->add_status_to_error( $result );
		}

		/** @var LMAT_Language */
		// Try to get the language by locale first, then by slug if not found
		$language = $this->languages->get( $args['locale'] );
		if ( ! $language ) {
			$language = $this->languages->get( $args['slug'] );
		}
		return $this->prepare_item_for_response( $language, $request );
	}

	/**
	 * Creates multiple languages efficiently without sub-requests.
	 *
	 * @since 1.0.0
	 *
	 * @param array           $languages_data Array of language data objects.
	 * @param WP_REST_Request $request       Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	private function create_multiple_languages( $languages_data, $request ) {
		$results = array();
		$errors = array();
		$created_languages = array();

		foreach ( $languages_data as $index => $language_data ) {
			// Get language identifier for error reporting
			$language_identifier = $this->get_language_identifier( $language_data );
			
			// Check for existing term_id
			if ( isset( $language_data['term_id'] ) ) {
				$errors[ $index ] = array(
					'language' => $language_identifier,
					'error' => new WP_Error(
						'rest_exists',
						__( 'Cannot create existing language.', 'linguator-multilingual-ai-translation' ),
						array( 'status' => 400 )
					)
				);
				continue;
			}

			// Create a mock request for this language data
			$mock_request = new WP_REST_Request( 'POST', $request->get_route() );
			$mock_request->set_body_params( $language_data );

			// Prepare the language data
			$prepared = $this->prepare_item_for_database( $mock_request );

			if ( is_wp_error( $prepared ) ) {
				$errors[ $index ] = array(
					'language' => $language_identifier,
					'error' => $prepared
				);
				continue;
			}

			/**
			 * @phpstan-var array{
			 *    locale: non-empty-string,
			 *    slug: non-empty-string,
			 *    name: non-empty-string,
			 *    rtl: bool,
			 *    term_group: int,
			 *    flag: non-empty-string,
			 *    no_default_cat: bool
			 * } $args
			 */
			$args = (array) $prepared;
			
			// Add the language
			$result = $this->languages->add( $args );

			if ( is_wp_error( $result ) ) {
				$errors[ $index ] = array(
					'language' => $language_identifier,
					'error' => $this->add_status_to_error( $result )
				);
				continue;
			}

			// Get the created language and prepare response
			/** @var LMAT_Language */
			// Try to get the language by locale first, then by slug if not found
			$language = $this->languages->get( $args['locale'] );
			if ( ! $language ) {
				$language = $this->languages->get( $args['slug'] );
			}
			$created_languages[ $index ] = $this->prepare_response_for_collection(
				$this->prepare_item_for_response( $language, $request )
			);
		}

		// Prepare the response
		$response_data = array(
			'created' => $created_languages,
			'errors'  => $errors,
			'total'   => count( $languages_data ),
			'success' => count( $created_languages ),
			'failed'  => count( $errors ),
		);

		return rest_ensure_response( $response_data );
	}

	/**
	 * Gets a human-readable identifier for a language from the provided data.
	 *
	 * @since 1.0.0
	 *
	 * @param array $language_data Language data array.
	 * @return string Language identifier for error reporting.
	 */
	private function get_language_identifier( $language_data ) {
		// Try to get the most descriptive identifier available
		if ( ! empty( $language_data['name'] ) ) {
			return $language_data['name'] . ( ! empty( $language_data['locale'] ) ? ' (' . $language_data['locale'] . ')' : '' );
		}
		
		if ( ! empty( $language_data['locale'] ) ) {
			return $language_data['locale'];
		}
		
		if ( ! empty( $language_data['slug'] ) ) {
			return $language_data['slug'];
		}
		
		// Fallback to a generic identifier
		return __( 'Unknown language', 'linguator-multilingual-ai-translation' );
	}

	/**
	 * Retrieves one language from the collection.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 *
	 * @phpstan-template T of array
	 * @phpstan-param WP_REST_Request<T> $request
	 */
	public function get_item( $request ) {
		$language = $this->get_language( $request );

		if ( is_wp_error( $language ) ) {
			return $language;
		}

		return $this->prepare_item_for_response( $language, $request );
	}

	/**
	 * Updates one language from the collection.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 *
	 * @phpstan-template T of array
	 * @phpstan-param WP_REST_Request<T> $request
	 */
	public function update_item( $request ) {
		$prepared = $this->prepare_item_for_database( $request );

		if ( is_wp_error( $prepared ) ) {
			// Should not happen, but if it does, it's our fault.
			return $prepared;
		}

		/**
		 * @phpstan-var array{
		 *     lang_id: int,
		 *     locale: non-empty-string,
		 *     slug: non-empty-string,
		 *     name: non-empty-string,
		 *     rtl: bool,
		 *     term_group: int,
		 *     flag?: non-empty-string
		 * } $args
		 */
		$args   = (array) $prepared;
		$update = $this->languages->update( $args );

		if ( is_wp_error( $update ) ) {
			return $this->add_status_to_error( $update );
		}

		/** @var LMAT_Language */
		$language = $this->languages->get( $args['lang_id'] );
		return $this->prepare_item_for_response( $language, $request );
	}

	/**
	 * Deletes one language from the collection.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 *
	 * @phpstan-template T of array
	 * @phpstan-param WP_REST_Request<T> $request
	 */
	public function delete_item( $request ) {
		$language = $this->get_language( $request );

		if ( is_wp_error( $language ) ) {
			return $language;
		}

		$this->languages->delete( $language->term_id );

		$previous = $this->prepare_item_for_response( $language, $request );
		$response = new WP_REST_Response();
		$response->set_data(
			array(
				'deleted'  => true,
				'previous' => $previous->get_data(),
			)
		);

		return $response;
	}

	/**
	 * Assigns a language to untranslated posts or pages.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response|WP_Error
	 */
	public function assign_language_in_mass( $request ) {
		
		$lang = sanitize_text_field( $request['slug'] );
		$language = $this->model->get_language( $lang );
		if ( ! ( $language instanceof LMAT_Language ) ) {
			return new WP_Error(
				'lmat_invalid_language',
				__( 'Invalid language locale provided.', 'linguator-multilingual-ai-translation' ),
				array( 'status' => 400 )
			);
		}
		
		$this->model->set_language_in_mass( $language );
		
		// Set option to track that untranslated content has been handled
		update_option('lmat_untranslated_content_handled', true);
		
		return rest_ensure_response( array(
			'success'  => true,
			// translators: %s is the language name being assigned to untranslated content.
			'message'  => sprintf( __( 'Language %s assigned to untranslated content.', 'linguator-multilingual-ai-translation' ), $language->name ),
			'language' => $language->to_array(),
		) );
	}

	/**
	 * Links an existing page as a translation of the source post.
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response|WP_Error
	 */
	public function link_translation( $request ) {
		$source_id = (int) $request['source_id'];
		$target_id = (int) $request['target_id'];
		$target_lang_slug = sanitize_key( $request['target_lang'] );

		if ( ! $source_id || ! $target_id || ! $target_lang_slug ) {
			return new WP_Error( 'lmat_link_invalid_params', __( 'Missing required parameters.', 'linguator-multilingual-ai-translation' ), array( 'status' => 400 ) );
		}

		$source = get_post( $source_id );
		$target = get_post( $target_id );
		if ( ! $source || ! $target ) {
			return new WP_Error( 'lmat_link_invalid_posts', __( 'Invalid source or target.', 'linguator-multilingual-ai-translation' ), array( 'status' => 404 ) );
		}

		// Validate target language
		$target_lang = $this->model->get_language( $target_lang_slug );
		if ( ! $target_lang ) {
			return new WP_Error( 'lmat_invalid_language', __( 'Invalid target language.', 'linguator-multilingual-ai-translation' ), array( 'status' => 400 ) );
		}

		// Ensure target is in requested language
		$current_target_lang = $this->model->post->get_language( $target_id );
		if ( ! $current_target_lang || $current_target_lang->slug !== $target_lang->slug ) {
			$this->model->post->set_language( $target_id, $target_lang );
		}

		// Merge translations
		$translations = $this->model->post->get_translations( $source_id );
		$source_lang  = $this->model->post->get_language( $source_id );
		if ( $source_lang ) {
			$translations[ $source_lang->slug ] = $source_id;
		}
		$translations[ $target_lang->slug ] = $target_id;

		// Save for all posts in the group
		foreach ( $translations as $lang_slug => $post_id ) {
			if ( $post_id ) {
				$this->model->post->save_translations( $post_id, $translations );
			}
		}

		return rest_ensure_response( array(
			'success'      => true,
			'translations' => $translations,
		) );
	}

	/**
	 * Permission check for linking translations.
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return true|WP_Error
	 */
	public function link_translation_permissions_check( $request ) {
		$source_id = (int) $request['source_id'];
		$target_id = (int) $request['target_id'];
		if ( ( $source_id && ! current_user_can( 'edit_post', $source_id ) ) || ( $target_id && ! current_user_can( 'edit_post', $target_id ) ) ) {
			return new WP_Error( 'rest_forbidden', __( 'You are not allowed to link these posts.', 'linguator-multilingual-ai-translation' ), array( 'status' => rest_authorization_required_code() ) );
		}
		// Verify nonce for non-GET requests
		$nonce_check = $this->verify_nonce( $request );
		if ( is_wp_error( $nonce_check ) ) {
			return $nonce_check;
		}
		return true;
	}

	/**
	 * Creates a new post in target language and links it to the source post translations.
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response|WP_Error
	 */
	public function create_translation_from_title( $request ) {
		$source_id       = (int) $request['source_id'];
		$target_lang_slug = sanitize_key( $request['target_lang'] );
		$title           = sanitize_text_field( (string) $request['title'] );
		$post_type       = sanitize_key( $request['post_type'] ?: 'page' );

		if ( ! $source_id || ! $target_lang_slug || '' === $title ) {
			return new WP_Error( 'lmat_create_tr_invalid_params', __( 'Missing required parameters.', 'linguator-multilingual-ai-translation' ), array( 'status' => 400 ) );
		}

		$source = get_post( $source_id );
		if ( ! $source ) {
			return new WP_Error( 'lmat_create_tr_invalid_source', __( 'Invalid source post.', 'linguator-multilingual-ai-translation' ), array( 'status' => 404 ) );
		}

		$target_lang = $this->model->get_language( $target_lang_slug );
		if ( ! $target_lang ) {
			return new WP_Error( 'lmat_create_tr_invalid_language', __( 'Invalid target language.', 'linguator-multilingual-ai-translation' ), array( 'status' => 400 ) );
		}

		// If a translation already exists, return it.
		$existing_tr_id = $this->model->post->get_translation( $source_id, $target_lang );
		if ( $existing_tr_id && (int) $existing_tr_id !== (int) $source_id ) {
			return rest_ensure_response( array(
				'success'   => true,
				'already'   => true,
				'id'        => (int) $existing_tr_id,
				'edit_link' => get_edit_post_link( $existing_tr_id, 'raw' ),
			) );
		}

		// Create the post as draft to avoid publishing unintentionally.
		$new_post_id = wp_insert_post( array(
			'post_title'  => $title,
			'post_type'   => $post_type,
			'post_status' => 'draft',
		) );

		if ( is_wp_error( $new_post_id ) || ! $new_post_id ) {
			return new WP_Error( 'lmat_create_tr_failed', __( 'Failed to create translation post.', 'linguator-multilingual-ai-translation' ), array( 'status' => 500 ) );
		}

		// Assign language and link translations.
		lmat_set_post_language( $new_post_id, $target_lang_slug );

		$translations = $this->model->post->get_translations( $source_id );
		$source_lang  = $this->model->post->get_language( $source_id );
		if ( $source_lang ) {
			$translations[ $source_lang->slug ] = $source_id;
		}
		$translations[ $target_lang->slug ] = $new_post_id;

		foreach ( $translations as $lang_slug => $post_id ) {
			if ( $post_id ) {
				$this->model->post->save_translations( $post_id, $translations );
			}
		}

		return rest_ensure_response( array(
			'success'   => true,
			'id'        => (int) $new_post_id,
			'edit_link' => get_edit_post_link( $new_post_id, 'raw' ),
		) );
	}

	/**
	 * Permission check for creating a translation from a typed title.
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return true|WP_Error
	 */
	public function create_translation_permissions_check( $request ) {
		$source_id = (int) $request['source_id'];
		if ( $source_id && ! current_user_can( 'edit_post', $source_id ) ) {
			return new WP_Error( 'rest_forbidden', __( 'You are not allowed to create a translation for this post.', 'linguator-multilingual-ai-translation' ), array( 'status' => rest_authorization_required_code() ) );
		}
		if ( ! current_user_can( 'edit_posts' ) ) {
			return new WP_Error( 'rest_forbidden', __( 'You are not allowed to create posts.', 'linguator-multilingual-ai-translation' ), array( 'status' => rest_authorization_required_code() ) );
		}
		$nonce_check = $this->verify_nonce( $request );
		if ( is_wp_error( $nonce_check ) ) {
			return $nonce_check;
		}
		return true;
	}

	/**
	 * Creates a Home Page translation.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return array|WP_Error Response data or WP_Error object on failure.
	 */
	public function create_home_page_translation($request) {
		$source_id = $request['source_id'];
		$languages = $request['languages']; // Array of languages
		$base_title = $request['title'];
		
		$created_pages = [];
		
		// Get source language
		$source_language = $this->model->get_language(lmat_get_post_language($source_id));
		if (!$source_language) {
			return new WP_Error(
				'lmat_invalid_source',
				__('Source page has no language assigned', 'linguator-multilingual-ai-translation'),
				array('status' => 400)
			);
		}

		// Initialize translations with source
		$all_translations = array(
			$source_language->locale => $source_id
		);

		// Get and merge existing translations
		$existing_translations = lmat_get_post_translations($source_id);
		if (!empty($existing_translations)) {
			$all_translations = array_merge($all_translations, $existing_translations);
		}
		
		// Create pages for each language
		foreach ($languages as $language_data) {
			// Convert language data to LMAT_Language object if needed
			$language = $this->model->get_language($language_data['locale']);
			
			if (!$language) {
				continue; // Skip if language not found
			}
			
			// Skip if translation already exists
			if (isset($all_translations[$language->locale])) {
				continue;
			}
			
			// Create title with language
			$title = sprintf('%s - %s', $base_title, $language->name);
			
			// Create new page as translation
			$new_page = wp_insert_post([
				'post_title' => $title,
				'post_type' => 'page',
				'post_status' => 'publish'
			]);
			
			if (!is_wp_error($new_page)) {
				// Set language for new page
				lmat_set_post_language($new_page, $language->locale);
				
				// Add to translations array
				$all_translations[$language->locale] = $new_page;
				
				$created_pages[] = [
					'id' => $new_page,
					'language' => $language->to_array(),
					'title' => $title
				];
			}
		}
		
		// Save all translations together
		if (!empty($created_pages)) {
			// Ensure all pages have their languages set
			foreach ($all_translations as $locale => $page_id) {
				lmat_set_post_language($page_id, $locale);
			}

			// Save translations multiple times to ensure all links are created
			lmat_save_post_translations($all_translations);
			// Second pass to ensure bidirectional links
			foreach ($all_translations as $page_id) {
				$page_translations = lmat_get_post_translations($page_id);
				lmat_save_post_translations(array_merge($page_translations, $all_translations));
			}
		}
		
		return [
			'success' => true,
			'pages' => $created_pages,
			'translations' => $all_translations // Include for debugging
		];
	}

	/**
	 * Checks if the user has permission to create a home page translation.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return true|WP_Error True if the request has access to create a home page translation, WP_Error object otherwise.
	 */
	public function create_home_page_translation_permissions_check( $request ) {
		if ( ! $this->check_update_permission() ) {
			return new WP_Error(
				'rest_cannot_create',
				__( 'Sorry, you are not allowed to create a home page translation.', 'linguator-multilingual-ai-translation' ),
				array( 'status' => rest_authorization_required_code() )
			);
		}

		// Verify nonce for non-GET requests
		$nonce_check = $this->verify_nonce( $request );
		if ( is_wp_error( $nonce_check ) ) {
			return $nonce_check;
		}

		return true;
	}
	
	/**
	 * Checks if a given request has access to get the languages.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 *
	 * @phpstan-template T of array
	 * @phpstan-param WP_REST_Request<T> $request
	 */
	public function get_items_permissions_check( $request ) {
		if ( 'edit' === $request['context'] && ! $this->check_update_permission() ) {
			return new WP_Error(
				'rest_forbidden_context',
				__( 'Sorry, you are not allowed to edit languages.', 'linguator-multilingual-ai-translation' ),
				array( 'status' => rest_authorization_required_code() )
			);
		}
		return true;
	}

	/**
	 * Checks if a given request has access to create a language.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has access to create languages, WP_Error object otherwise.
	 *
	 * @phpstan-template T of array
	 * @phpstan-param WP_REST_Request<T> $request
	 */
	public function create_item_permissions_check( $request ) {
		// Check user capabilities first
		if ( ! $this->check_update_permission() ) {
			return new WP_Error(
				'rest_cannot_create',
				__( 'Sorry, you are not allowed to create a language.', 'linguator-multilingual-ai-translation' ),
				array( 'status' => rest_authorization_required_code() )
			);
		}

		// Verify nonce for non-GET requests
		$nonce_check = $this->verify_nonce( $request );
		if ( is_wp_error( $nonce_check ) ) {
			return $nonce_check;
		}

		return true;
	}

	/**
	 * Checks if a given request has access to get a specific language.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access for the language, WP_Error object otherwise.
	 *
	 * @phpstan-template T of array
	 * @phpstan-param WP_REST_Request<T> $request
	 */
	public function get_item_permissions_check( $request ) {
		return $this->get_items_permissions_check( $request );
	}

	/**
	 * Checks if a given request has access to update a specific language.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has access to update the language, WP_Error object otherwise.
	 *
	 * @phpstan-template T of array
	 * @phpstan-param WP_REST_Request<T> $request
	 */
	public function update_item_permissions_check( $request ) {
		// Check user capabilities first
		if ( ! $this->check_update_permission() ) {
			return new WP_Error(
				'rest_cannot_update',
				__( 'Sorry, you are not allowed to edit this language.', 'linguator-multilingual-ai-translation' ),
				array( 'status' => rest_authorization_required_code() )
			);
		}

		// Verify nonce for non-GET requests
		$nonce_check = $this->verify_nonce( $request );
		if ( is_wp_error( $nonce_check ) ) {
			return $nonce_check;
		}

		return true;
	}

	/**
	 * Checks if a given request has access to delete a specific language.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has access to delete the language, WP_Error object otherwise.
	 *
	 * @phpstan-template T of array
	 * @phpstan-param WP_REST_Request<T> $request
	 */
	public function delete_item_permissions_check( $request ) {
		// Check user capabilities first
		if ( ! $this->check_update_permission() ) {
			return new WP_Error(
				'rest_cannot_delete',
				__( 'Sorry, you are not allowed to delete this language.', 'linguator-multilingual-ai-translation' ),
				array( 'status' => rest_authorization_required_code() )
			);
		}

		// Verify nonce for non-GET requests
		$nonce_check = $this->verify_nonce( $request );
		if ( is_wp_error( $nonce_check ) ) {
			return $nonce_check;
		}

		return true;
	}

	/**
	 * Checks if a given request has access to assign language in mass.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has access to assign language, WP_Error object otherwise.
	 *
	 * @phpstan-template T of array
	 * @phpstan-param WP_REST_Request<T> $request
	 */
	public function assign_language_permissions_check( $request ) {
		// Check user capabilities first
		if ( ! $this->check_update_permission() ) {
			return new WP_Error(
				'rest_cannot_assign',
				__( 'Sorry, you are not allowed to assign languages.', 'linguator-multilingual-ai-translation' ),
				array( 'status' => rest_authorization_required_code() )
			);
		}

		// Verify nonce for non-GET requests
		$nonce_check = $this->verify_nonce( $request );
		if ( is_wp_error( $nonce_check ) ) {
			return $nonce_check;
		}

		return true;
	}

	/**
	 * Prepares the language for the REST response.
	 *
	 * @since 1.0.0
	 *
	 * @param LMAT_Language    $item    Language object.
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response Response object.
	 *
	 * @phpstan-template T of array
	 * @phpstan-param WP_REST_Request<T> $request
	 */
	public function prepare_item_for_response( $item, $request ) {
		$data     = $item->to_array();
		$fields   = $this->get_fields_for_response( $request );
		$response = array();

		$data['is_rtl'] = (bool) $data['is_rtl'];
		$data['host']   = (string) $data['host'];

		foreach ( $data as $language_prop => $prop_value ) {
			if ( rest_is_field_included( $language_prop, $fields ) ) {
				$response[ $language_prop ] = $prop_value;
			}
		}

		/** @var WP_REST_Response */
		return rest_ensure_response( $response );
	}

	/**
	 * Retrieves the language's schema, conforming to JSON Schema.
	 *
	 * @since 1.0.0
	 *
	 * @return array Item schema data.
	 */
	public function get_item_schema(): array {
		if ( $this->schema ) {
			return $this->add_additional_fields_schema( $this->schema );
		}

		$this->schema = array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'language',
			'type'       => 'object',
			'properties' => array(
				'term_id'         => array(
					'description' => __( 'Unique identifier for the language.', 'linguator-multilingual-ai-translation' ),
					'type'        => 'integer',
					'minimum'     => 1,
					'context'     => array( 'view', 'edit' ),
					'readonly'    => true,
				),
				'name'            => array(
					'description' => __( 'The name is how it is displayed on your site (for example: English).', 'linguator-multilingual-ai-translation' ),
					'type'        => 'string',
					'minLength'   => 1,
					'context'     => array( 'view', 'edit' ),
				),
				'slug'            => array(
					'description' => __( 'Language code - preferably 2-letters ISO 639-1 (for example: en).', 'linguator-multilingual-ai-translation' ),
					'type'        => 'string',
					'pattern'     => Languages_Model::SLUG_PATTERN,
					'context'     => array( 'view', 'edit' ),
				),
				'locale'          => array(
					'description' => __( 'WordPress Locale for the language (for example: en_US).', 'linguator-multilingual-ai-translation' ),
					'type'        => 'string',
					'pattern'     => Languages_Model::LOCALE_PATTERN,
					'context'     => array( 'view', 'edit' ),
					'required'    => true,
				),
				'w3c'             => array(
					'description' => __( 'W3C Locale for the language (for example: en-US).', 'linguator-multilingual-ai-translation' ),
					'type'        => 'string',
					'context'     => array( 'view', 'edit' ),
					'readonly'    => true,
				),
				'facebook'        => array(
					'description' => __( 'Facebook Locale for the language (for example: en_US).', 'linguator-multilingual-ai-translation' ),
					'type'        => 'string',
					'context'     => array( 'view', 'edit' ),
					'readonly'    => true,
				),
				'is_rtl'          => array(
					'description' => sprintf(
						/* translators: %s is a value. */
						__( 'Text direction. %s for right-to-left.', 'linguator-multilingual-ai-translation' ),
						'`true`'
					),
					'type'        => 'boolean',
					'context'     => array( 'view', 'edit' ),
				),
				'term_group'      => array(
					'description' => __( 'Position of the language in the language switcher.', 'linguator-multilingual-ai-translation' ),
					'type'        => 'integer',
					'context'     => array( 'view', 'edit' ),
				),
				'flag_code'       => array(
					'description' => __( 'Flag code corresponding to ISO 3166-1 (for example: us for the United States flag).', 'linguator-multilingual-ai-translation' ),
					'type'        => 'string',
					'context'     => array( 'view', 'edit' ),
				),
				'flag_url'        => array(
					'description' => __( 'Flag URL.', 'linguator-multilingual-ai-translation' ),
					'type'        => 'string',
					'format'      => 'uri',
					'context'     => array( 'view', 'edit' ),
					'readonly'    => true,
				),
				'flag'            => array(
					'description' => __( 'HTML tag for the flag.', 'linguator-multilingual-ai-translation' ),
					'type'        => 'string',
					'context'     => array( 'view', 'edit' ),
					'readonly'    => true,
				),
				'custom_flag_url' => array(
					'description' => __( 'Custom flag URL.', 'linguator-multilingual-ai-translation' ),
					'type'        => 'string',
					'format'      => 'uri',
					'context'     => array( 'view', 'edit' ),
					'readonly'    => true,
				),
				'custom_flag'     => array(
					'description' => __( 'HTML tag for the custom flag.', 'linguator-multilingual-ai-translation' ),
					'type'        => 'string',
					'context'     => array( 'view', 'edit' ),
					'readonly'    => true,
				),
				'is_default'      => array(
					'description' => __( 'Tells whether the language is the default one.', 'linguator-multilingual-ai-translation' ),
					'type'        => 'boolean',
					'context'     => array( 'view', 'edit' ),
					'readonly'    => true,
				),
				'active'          => array(
					'description' => __( 'Tells whether the language is active.', 'linguator-multilingual-ai-translation' ),
					'type'        => 'boolean',
					'context'     => array( 'view', 'edit' ),
					'readonly'    => true,
				),
				'home_url'        => array(
					'description' => __( 'Home URL in this language.', 'linguator-multilingual-ai-translation' ),
					'type'        => 'string',
					'format'      => 'uri',
					'context'     => array( 'view', 'edit' ),
					'readonly'    => true,
				),
				'search_url'      => array(
					'description' => __( 'Search URL in this language.', 'linguator-multilingual-ai-translation' ),
					'type'        => 'string',
					'format'      => 'uri',
					'context'     => array( 'view', 'edit' ),
					'readonly'    => true,
				),
				'host'            => array(
					'description' => __( 'Host for this language.', 'linguator-multilingual-ai-translation' ),
					'type'        => 'string',
					'format'      => 'uri',
					'context'     => array( 'view', 'edit' ),
					'readonly'    => true,
				),
				'page_on_front'   => array(
					'description' => __( 'Page on front ID in this language.', 'linguator-multilingual-ai-translation' ),
					'type'        => 'integer',
					'minimum'     => 0,
					'context'     => array( 'view', 'edit' ),
					'readonly'    => true,
				),
				'page_for_posts'  => array(
					'description' => __( 'Identifier of the page for posts in this language.', 'linguator-multilingual-ai-translation' ),
					'type'        => 'integer',
					'minimum'     => 0,
					'context'     => array( 'view', 'edit' ),
					'readonly'    => true,
				),
				'fallbacks'       => array(
					'description' => __( 'List of language locale fallbacks.', 'linguator-multilingual-ai-translation' ),
					'type'        => 'array',
					'uniqueItems' => true,
					'items'       => array(
						'type'    => 'string',
						'pattern' => Languages_Model::LOCALE_PATTERN,
					),
					'context'     => array( 'view', 'edit' ),
					'readonly'    => true,
				),
				'term_props'      => array(
					'description' => __( 'Language properties.', 'linguator-multilingual-ai-translation' ),
					'type'        => 'object',
					'properties'  => array(),
					'context'     => array( 'view', 'edit' ),
					'readonly'    => true,
				),
				'no_default_cat'  => array(
					'description' => __( 'Tells whether the default category must be created when creating a new language.', 'linguator-multilingual-ai-translation' ),
					'type'        => 'boolean',
					'context'     => array( 'edit' ),
					'default'     => false,
				),
			),
		);

		foreach ( $this->translatable_objects as $translatable_object ) {
			$this->schema['properties']['term_props']['properties'][ $translatable_object->get_tax_language() ] = array(
				'description' => $translatable_object->get_rest_description(),
				'type'        => 'object',
				'properties'  => array(
					'term_id'          => array(
						/* translators: %s is the name of the term property (`term_id` or `term_taxonomy_id`). */
						'description' => sprintf( __( 'The %s of the language term for this translatable entity.', 'linguator-multilingual-ai-translation' ), '`term_id`' ),
						'type'        => 'integer',
						'minimum'     => 1,
					),
					'term_taxonomy_id' => array(
						/* translators: %s is the name of the term property (`term_id` or `term_taxonomy_id`). */
						'description' => sprintf( __( 'The %s of the language term for this translatable entity.', 'linguator-multilingual-ai-translation' ), '`term_taxonomy_id`' ),
						'type'        => 'integer',
						'minimum'     => 1,
					),
					'count'            => array(
						'description' => __( 'Number of items of this type of content in this language.', 'linguator-multilingual-ai-translation' ),
						'type'        => 'integer',
						'minimum'     => 0,
					),
				),
			);
		}

		return $this->add_additional_fields_schema( $this->schema );
	}


	/**
	 * Retrieves an array of endpoint arguments from the item schema for the controller.
	 * Ensures that the `no_default_cat` property is returned only for `CREATABLE` requests.
	 * Supports both single language objects and arrays of languages for bulk operations.
	 *
	 * @since 1.0.0
	 *
	 * @param string $method Optional. HTTP method of the request. Default WP_REST_Server::CREATABLE.
	 * @return array Endpoint arguments.
	 */
	public function get_endpoint_args_for_item_schema( $method = WP_REST_Server::CREATABLE ) {
		$schema = $this->get_item_schema();
		if ( WP_REST_Server::CREATABLE !== $method ) {
			unset( $schema['properties']['no_default_cat'] );
		}
		
		// For CREATABLE method, support both single object and array of objects
		if ( WP_REST_Server::CREATABLE === $method ) {
			$single_schema = $schema;
			$bulk_schema = array(
				'type'  => 'array',
				'items' => $single_schema,
			);
			
			// Return a schema that accepts either a single object or an array
			return array(
				'type'       => array( 'object', 'array' ),
				'properties' => $single_schema['properties'],
				'items'      => $single_schema,
			);
		}
		
		return rest_get_endpoint_args_for_schema( $schema, $method );
	}

	/**
	 * Prepares one language for create or update operation.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return object|WP_Error The prepared language, or WP_Error object on failure.
	 *
	 * @phpstan-template T of array
	 * @phpstan-param WP_REST_Request<T> $request
	 */
	protected function prepare_item_for_database( $request ) {
		if ( isset( $request['term_id'] ) ) {
			// Update a language.
			$language = $this->get_language( $request );

			if ( is_wp_error( $language ) ) {
				return $language;
			}

			return (object) array(
				'lang_id'    => $language->term_id,
				'name'       => $request['name'] ?? $language->name,
				'slug'       => $request['slug'] ?? $language->slug,
				'locale'     => $request['locale'] ?? $language->locale,
				'rtl'        => $request['is_rtl'] ?? (bool) $language->is_rtl,
				'flag'       => $request['flag_code'] ?? $language->flag_code,
				'term_group' => $request['term_group'] ?? $language->term_group,
			);
		}

		// Create a language.
		if ( empty( $request['locale'] ) ) {
			// Should not happen.
			return new WP_Error(
				'rest_invalid_locale',
				__( 'The locale is invalid.', 'linguator-multilingual-ai-translation' ),
				array( 'status' => 400 )
			);
		}

		if ( isset( $request['name'], $request['slug'], $request['is_rtl'], $request['flag_code'] ) ) {
			return (object) array(
				'name'           => $request['name'],
				'slug'           => $request['slug'],
				'locale'         => $request['locale'],
				'rtl'            => $request['is_rtl'],
				'flag'           => $request['flag_code'],
				'term_group'     => $request['term_group'] ?? 0,
				'no_default_cat' => $request['no_default_cat'] ?? false,
			);
		}

		// Create a language from our default list with only the locale.
		$languages = include LINGUATOR_DIR . '/Settings/Controllers/languages.php';

		if ( empty( $languages[ $request['locale'] ] ) ) {
			return new WP_Error(
				'lmat_rest_invalid_locale',
				__( 'The locale is invalid.', 'linguator-multilingual-ai-translation' ),
				array( 'status' => 400 )
			);
		}

		$language = (object) $languages[ $request['locale'] ];

		return (object) array(
			'name'           => $request['name'] ?? $language->name,
			'slug'           => $request['slug'] ?? $language->code,
			'locale'         => $request['locale'],
			'rtl'            => $request['is_rtl'] ?? 'rtl' === $language->dir,
			'flag'           => $request['flag_code'] ?? $language->flag,
			'term_group'     => $request['term_group'] ?? 0,
			'no_default_cat' => $request['no_default_cat'] ?? false,
		);
	}

	/**
	 * Tells if languages can be edited.
	 *
	 * @since 1.0.0
	 *
	 * @return bool
	 */
	protected function check_update_permission(): bool {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Returns the language, if the ID is valid.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return LMAT_Language|WP_Error Language object if the ID or slug is valid, WP_Error otherwise.
	 *
	 * @phpstan-template T of array
	 * @phpstan-param WP_REST_Request<T> $request
	 */
	private function get_language( WP_REST_Request $request ) {
		if ( isset( $request['term_id'] ) ) {
			$error = new WP_Error(
				'rest_invalid_id',
				__( 'Invalid language ID', 'linguator-multilingual-ai-translation' ),
				array( 'status' => 404 )
			);

			if ( $request['term_id'] <= 0 ) {
				return $error;
			}

			$language = $this->languages->get( (int) $request['term_id'] );

			if ( ! $language instanceof LMAT_Language ) {
				return $error;
			}

			return $language;
		}

		if ( isset( $request['slug'] ) ) {
			$language = $this->languages->get( (string) $request['slug'] );

			if ( ! $language instanceof LMAT_Language ) {
				return new WP_Error(
					'rest_invalid_slug',
					__( 'Invalid language slug', 'linguator-multilingual-ai-translation' ),
					array( 'status' => 404 )
				);
			}

			return $language;
		}

		// Should not happen.
		return new WP_Error(
			'rest_invalid_identifier',
			__( 'Invalid language identifier', 'linguator-multilingual-ai-translation' ),
			array( 'status' => 404 )
		);
	}
}
