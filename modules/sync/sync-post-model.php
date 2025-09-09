<?php
/**
 * @package Linguator
 */

/**
 * Model for synchronizing posts
 *
 * @since 1.0.0
 */
class LMAT_Sync_Post_Model {
	/**
	 * Stores the plugin options.
	 *
	 * @var array
	 */
	public $options;

	/**
	 * @var LMAT_Model
	 */
	public $model;

	/**
	 * @var LMAT_Sync
	 */
	public $sync;

	/**
	 * @var LMAT_Sync_Content
	 */
	public $sync_content;

	/**
	 * Stores temporary a synchronization information.
	 *
	 * @var array
	 */
	protected $temp_synchronized;

	/**
	 * Constructor
	 *
	 * @since 1.0.0
	 *
	 * @param object $linguator Linguator object.
	 */
	public function __construct( &$linguator) {
		$this->options      = &$linguator->options;
		$this->model        = &$linguator->model;
		$this->sync         = &$linguator->sync;
		$this->sync_content = new LMAT_Sync_Post($linguator);

		add_filter( 'lmat_copy_taxonomies', array( $this, 'copy_taxonomies' ), 5, 4 );
		add_filter( 'lmat_copy_post_metas', array( $this, 'copy_post_metas' ), 5, 4 );
	}

	/**
	 * Copies all taxonomies.
	 *
	 * @since 1.0.0
	 *
	 * @param string[] $taxonomies List of taxonomy names.
	 * @param bool     $sync       True for a synchronization, false for a simple copy.
	 * @param int      $from       Source post id.
	 * @param int      $to         Target post id.
	 * @return string[]
	 */
	public function copy_taxonomies( $taxonomies, $sync, $from, $to ) {
		if ( ! empty( $from ) && ! empty( $to ) && $this->are_synchronized( $from, $to ) ) {
			$taxonomies = array_diff( get_post_taxonomies( $from ), get_taxonomies( array( '_lmat' => true ) ) );
		}
		return $taxonomies;
	}

	/**
	 * Copies all custom fields.
	 *
	 * @since 1.0.0
	 *
	 * @param string[] $keys List of custom fields names.
	 * @param bool     $sync True if it is synchronization, false if it is a copy.
	 * @param int      $from Id of the post from which we copy the information.
	 * @param int      $to   Id of the post to which we paste the information.
	 * @return string[]
	 */
	public function copy_post_metas( $keys, $sync, $from, $to ) {
		if ( ! empty( $from ) && ! empty( $to ) && $this->are_synchronized( $from, $to ) ) {
			$from_keys = array_keys( get_post_custom( $from ) ); // *All* custom fields.
			$to_keys   = array_keys( get_post_custom( $to ) ); // Adding custom fields of the destination allow to synchronize deleted custom fields.
			$keys      = array_merge( $from_keys, $to_keys );
			$keys      = array_unique( $keys );
			$keys      = array_diff( $keys, array( '_edit_last', '_edit_lock' ) );
		}
		return $keys;
	}

	/**
	 * Duplicates the post to one language and optionally saves the synchronization group
	 *
	 * @since 1.0.0
	 *
	 * @param int    $post_id    Post id of the source post.
	 * @param string $source_language Source language slug.
	 * @param string $target_language Target language slug.
	 * @param bool   $save_group True to update the synchronization group, false otherwise.
	 * @return int Id of the target post, 0 on failure.
	 */
	public function copy_post( $post_id, $source_language, $target_language, $save_group = true, $post_data = array() ) {
		global $wpdb;

		$tr_id     = $this->model->post->get( $post_id, $this->model->get_language( $target_language ) );
		$tr_post   = get_post( $post_id );
		$languages = array_keys( $this->get( $post_id ) );

		if ( ! $tr_post instanceof WP_Post ) {
			// Something went wrong!
			return 0;
		}

		foreach($tr_post as $key => $value){
			if(isset($post_data[$key]) && $key !== 'meta_fields'){
				$tr_post->$key = $post_data[$key];
			}
		}

		if(isset($tr_post->post_content)){
			$tr_post->post_content=wp_kses_post(lmat_replace_links_with_translations($tr_post->post_content, $target_language, $source_language));
		}

		$post_status='draft';

		if(isset($this->options['ai_translation_configuration']['bulk_translation_post_status'])){
			$post_status=$this->options['ai_translation_configuration']['bulk_translation_post_status'];
		}

		// If it does not exist, create it.
		if ( ! $tr_id ) {
			$tr_post->ID = 0;
			$tr_post->post_status = $post_status;
		
			$tr_id       = wp_insert_post( wp_slash( $tr_post->to_array() ) );
			$this->model->post->set_language( $tr_id, $target_language ); // Necessary to do it now to share slug.

			$translations = $this->model->post->get_translations( $post_id );
			$translations[ $target_language ] = $tr_id;
			$this->model->post->save_translations( $post_id, $translations ); // Saves translations in case we created a post.

			$languages[] = $target_language;

			// Temporarily sync group, even if false === $save_group as we need synchronized posts to copy *all* taxonomies and post metas.
			$this->temp_synchronized[ $post_id ][ $tr_id ] = true;

			// Maybe duplicates the featured image.
			if ( $this->options['media_support'] ) {
				add_filter( 'lmat_translate_post_meta', array( $this->sync_content, 'duplicate_thumbnail' ), 10, 3 );
			}

			add_filter( 'lmat_maybe_translate_term', array( $this->sync_content, 'duplicate_term' ), 10, 3 );

			$this->sync->taxonomies->copy( $post_id, $tr_id, $target_language );
			$this->sync->post_metas->copy( $post_id, $tr_id, $target_language );

			$_POST['post_tr_lang'][ $target_language ] = $tr_id; // Hack to avoid creating multiple posts if the original post is saved several times (ex WooCommerce 3.0+).

			/**
			 * Fires after a synchronized post has been created
			 *
			 * @since 1.0.0
			 *
			 * @param int    $post_id Id of the source post.
			 * @param int    $tr_id   Id of the newly created post.
			 * @param string $lang    Language of the newly created post.
			 */
			do_action( 'lmat_created_sync_post', $post_id, $tr_id, $target_language );

			$post=get_post($post_id);
			do_action( 'lmat_save_post', $post_id, $post, $translations ); // Fire again as we just updated $translations.

			unset( $this->temp_synchronized[ $post_id ][ $tr_id ] );
		}

		if ( $save_group ) {
			$this->save_group( $post_id, $languages );
		}

		$tr_post->ID = $tr_id;
		$post=get_post($post_id);

		$tr_post->post_parent = (int) $this->model->post->get( $post->post_parent, $target_language ); // Translates post parent.

		$post = clone $tr_post;
		$post->ID=$post_id;

		$tr_post = $this->sync_content->copy_content( $post, $tr_post, $target_language );

		// The columns to copy in DB.
		$columns = array(
			'post_author',
			'post_date',
			'post_date_gmt',
			'post_content',
			'post_title',
			'post_excerpt',
			'comment_status',
			'ping_status',
			'post_name',
			'post_modified',
			'post_modified_gmt',
			'post_parent',
			'menu_order',
			'post_mime_type',
		);

		$columns[] = 'post_status';

		is_sticky( $post_id ) ? stick_post( $tr_id ) : unstick_post( $tr_id );

		/**
		 * Filters the post fields to synchronize when synchronizing posts
		 *
		 * @since 1.0.0
		 *
		 * @param array  $fields     WP_Post fields to synchronize.
		 * @param int    $post_id    Post id of the source post.
		 * @param string $lang       Target language slug.
		 * @param bool   $save_group True to update the synchronization group, false otherwise.
		 */
		$columns = apply_filters( 'lmat_sync_post_fields', array_combine( $columns, $columns ), $post_id, $target_language, $save_group );
		
		$tr_post = array_intersect_key( (array) $tr_post, $columns );

		$wpdb->update( $wpdb->posts, $tr_post, array( 'ID' => (int) $tr_id ) ); // Don't use wp_update_post to avoid conflict (reverse sync).
		clean_post_cache( $tr_id );

		/**
		 * Fires after a post has been synchronized.
		 *
		 * @since 1.0.0
		 *
		 * @param int    $post_id Id of the source post.
		 * @param int    $tr_id   Id of the target post.
		 * @param string $lang    Language of the target post.
		 * @param string $strategy `copy`.
		 */
		do_action( 'lmat_post_synchronized', $post_id, $tr_id, $target_language, 'copy' );

		// Update Elementor Translations
		$this->update_elementor_data($tr_id, $post_data, $post_id);

		return $tr_id;
	}

	/**
	 * Update Elementor data
	 *
	 * @param int $tr_id The ID of the translated post.
	 * @param string $elementor_data The Elementor data to update.
	 * @return void
	 */
	private function update_elementor_data($tr_id, $post_data, $parent_post_id = 0){
		$current_post_elementor_data = get_post_meta($tr_id, '_elementor_data', true);

		if(!isset($post_data['meta_fields']['_elementor_data'])){
			return;
		}

		$elementor_data=$post_data['meta_fields']['_elementor_data'];

		// Check if the current post has Elementor data
		if('' !== $current_post_elementor_data && $elementor_data && '' !== $elementor_data){
			if(class_exists('Elementor\Plugin')){
				$plugin=\Elementor\Plugin::$instance;
				$document=$plugin->documents->get($tr_id);
	
				$document->save( [
					'elements' => json_decode($elementor_data, true),
				] );

				$plugin->files_manager->clear_cache();
			}else{

				if($parent_post_id > 0){
					$elementor_data=\Elementor\Plugin::$instance->documents->get($parent_post_id)->get_elements_data();
					$elementor_data=wp_json_encode($elementor_data);
					$elementor_data=preg_replace('#(?<!\\\\)/#', '\\/', $elementor_data);
					update_post_meta($tr_id, '_elementor_data', $elementor_data);
				}
			}
		}
	}

	/**
	 * Saves the synchronization group
	 * This is stored as an array beside the translations in the post_translations term description
	 *
	 * @since 1.0.0
	 *
	 * @param int   $post_id   ID of the post currently being saved.
	 * @param array $sync_post Array of languages to sync with this post.
	 * @return void
	 */
	public function save_group( $post_id, $sync_post ) {
		$term = $this->model->post->get_object_term( $post_id, 'post_translations' );

		if ( empty( $term ) ) {
			return;
		}

		$d    = maybe_unserialize( $term->description );
		$lang = $this->model->post->get_language( $post_id );

		if ( ! is_array( $d ) || empty( $lang ) ) {
			return;
		}

		$lang = $lang->slug;

		if ( empty( $sync_post ) ) {
			if ( isset( $d['sync'][ $lang ] ) ) {
				$d['sync'] = array_diff( $d['sync'], array( $d['sync'][ $lang ] ) );
			}
		} else {
			$sync_post[] = $lang;
			$d['sync']   = empty( $d['sync'] ) ? array_fill_keys( $sync_post, $lang ) : array_merge( array_diff( $d['sync'], array( $lang ) ), array_fill_keys( $sync_post, $lang ) );
		}

		wp_update_term( (int) $term->term_id, 'post_translations', array( 'description' => maybe_serialize( $d ) ) );
	}

	/**
	 * Get all posts synchronized with a given post
	 *
	 * @since 1.0.0
	 *
	 * @param int $post_id The id of the post.
	 * @return array An associative array of arrays with language code as key and post id as value.
	 */
	public function get( $post_id ) {
		$term = $this->model->post->get_object_term( $post_id, 'post_translations' );

		if ( ! empty( $term ) ) {
			$lang = $this->model->post->get_language( $post_id );
			$d    = maybe_unserialize( $term->description );

			if ( ! is_array( $d ) || empty( $lang ) ) {
				return array();
			}

			if ( ! empty( $d['sync'][ $lang->slug ] ) ) {
				$keys = array_keys( $d['sync'], $d['sync'][ $lang->slug ] );
				return array_intersect_key( $d, array_flip( $keys ) );
			}
		}

		return array();
	}

	/**
	 * Checks whether two posts are synchronized
	 *
	 * @since 1.0.0
	 *
	 * @param int $post_id  The id of a first post to compare.
	 * @param int $other_id The id of the other post to compare.
	 * @return bool
	 */
	public function are_synchronized( $post_id, $other_id ) {
		return isset( $this->temp_synchronized[ $post_id ][ $other_id ] ) || in_array( $other_id, $this->get( $post_id ) );
	}

	/**
	 * Check if the current user can synchronize a post in other language
	 *
	 * @since 1.0.0
	 *
	 * @param int    $post_id Post to synchronize.
	 * @param string $lang    Language code.
	 * @return bool
	 */
	public function current_user_can_synchronize( $post_id, $lang ) {
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return false;
		}

		$tr_id = $this->model->post->get( $post_id, $this->model->get_language( $lang ) );

		// If we don't have a translation yet, check if we have the right to create a new one?
		if ( empty( $tr_id ) ) {
			$post_type = get_post_type( $post_id );
			$post_type_object = get_post_type_object( $post_type );
			return current_user_can( $post_type_object->cap->create_posts );
		}

		// Do we have the right to edit this translation?
		if ( ! current_user_can( 'edit_post', $tr_id ) ) {
			return false;
		}

		// Is this translation synchronized with a post that we can't edit?
		$ids = $this->get( $tr_id );

		foreach ( $ids as $id ) {
			if ( ! current_user_can( 'edit_post', $id ) ) {
				return false;
			}
		}

		return true;
	}
}
