<?php
namespace Linguator\Supported_Blocks;
use Linguator\Modules\Page_Translation\LMAT_Page_Translation_Helper;

/**
 * Do not access the page directly
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Custom_Block_Post' ) ) {
	/**
	 * Class Custom_Block_Post
	 *
	 * This class handles the custom block post type for the AutoPoly - AI Translation For Polylang plugin.
	 * It manages the registration of the custom post type, adds submenu pages under the Polylang menu,
	 * and handles post save actions.
	 *
	 * @package LMAT
	 */
	class Custom_Block_Post {
		/**
		 * Singleton instance.
		 *
		 * @var Custom_Block_Post
		 */
		private static $instance = null;

		/**
		 * Stores custom block data for processing and retrieval.
		 *
		 * This static array holds the data related to custom blocks that are
		 * used within the plugin. It can be utilized to manage and manipulate
		 * the custom block information as needed during AJAX requests.
		 *
		 * @var array
		 */
		private $custom_block_data_array = array();

		/**
		 * Constructor.
		 */
		private function __construct() {
			add_action( 'init', array( $this, 'register_custom_post_type' ) );
			add_action( 'save_post', array( $this, 'on_save_post' ), 10, 3 );
			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
			add_action( 'wp_ajax_lmat_get_custom_blocks_content', array( $this, 'get_custom_blocks_content' ) );
			add_action( 'wp_ajax_lmat_update_custom_blocks_content', array( $this, 'update_custom_blocks_content' ) );
		}

		/**
		 * Enqueue scripts.
		 */
		public function enqueue_scripts( $hook ) {
			$current_screen = get_current_screen();
			if ( 'lmat_add_blocks' === $current_screen->post_type && is_object( $current_screen ) && 'post.php' === $hook && $current_screen->is_block_editor ) {
				wp_enqueue_script( 'lmat-add-new-block', plugins_url('admin/assets/js/lmat-add-new-custom-block.min.js', LINGUATOR_ROOT_FILE), array( 'jquery','wp-data', 'wp-element' ), LINGUATOR_VERSION, true );
				wp_enqueue_style( 'lmat-supported-blocks', plugins_url('admin/assets/css/lmat-custom-data-table.min.css', LINGUATOR_ROOT_FILE), array(), LINGUATOR_VERSION, 'all' );

				wp_localize_script( 'lmat-add-new-block', 'lmatAddBlockVars', array(
					'lmat_demo_page_url' => esc_url('https://coolplugins.net/product/automatic-translations-for-polylang/'),
				) );

				wp_enqueue_style('lmat-update-custom-blocks', plugins_url('admin/assets/css/lmat-update-custom-blocks.min.css', LINGUATOR_ROOT_FILE), array(), LINGUATOR_VERSION);
				wp_enqueue_script('lmat-update-custom-blocks', plugins_url('admin/assets/js/lmat-update-custom-blocks.min.js', LINGUATOR_ROOT_FILE), array('jquery'), LINGUATOR_VERSION, true);
			
				wp_localize_script(
					'lmat-update-custom-blocks',
					'lmat_block_update_object',
					array(
						'ajax_url'       => admin_url('admin-ajax.php'),
						'ajax_nonce'     => wp_create_nonce('lmat_block_update_nonce'),
						'lmat_url'       => esc_url(plugins_url('admin/assets/css/lmat-update-custom-blocks.min.css', LINGUATOR_ROOT_FILE)),
						'action_get_content' => 'lmat_get_custom_blocks_content',
						'action_update_content' => 'lmat_update_custom_blocks_content',
					)
				);
			}
		}

		/**
		 * Function to run on post save or update.
		 *
		 * @param int          $post_id The ID of the post being saved.
		 * @param WP_Post|null $post The post object.
		 * @param bool         $update Whether this is an existing post being updated.
		 */
		public function on_save_post( $post_id, $post, $update ) {
			if(!current_user_can('edit_post', $post_id)){
				return;
			}

			if ( isset( $post->post_type ) && 'lmat_add_blocks' === $post->post_type ) {
				if (strpos($post->post_content, 'Make This Content Available for Translation') !== false) {
					update_option( 'lmat_custom_block_data', $post->post_content );
				}else{
					delete_option( 'lmat_custom_block_data' );
				}
			}
		}

		/**
		 * Get the singleton instance.
		 *
		 * @return Custom_Block_Post
		 */
		public static function get_instance() {
			if ( null === self::$instance ) {
				self::$instance = new self();
			}
			return self::$instance;
		}

		/**
		 * Register custom post type.
		 */
		public function register_custom_post_type() {
			$labels = array(
				'name'               => _x( 'Automatic Translations', 'post type general name' ),
				'singular_name'      => _x( 'Automatic Translation', 'post type singular name' ),
				'menu_name'          => _x( 'Automatic Translations', 'admin menu' ),
				'name_admin_bar'     => _x( 'Automatic Translation', 'add new on admin bar' ),
				'add_new'            => _x( 'Add New', 'Automatic Translation' ),
				'add_new_item'       => __( 'Add New Automatic Translation' ),
				'new_item'           => __( 'New Automatic Translation' ),
				'edit_item'          => __( 'Edit Automatic Translation' ),
				'view_item'          => __( 'View Automatic Translation' ),
				'all_items'          => __( 'Automatic Translations' ),
				'search_items'       => __( 'Search Automatic Translations' ),
				'not_found'          => __( 'No Automatic Translations found.' ),
				'not_found_in_trash' => __( 'No Automatic Translations found in Trash.' ),
			);

			$args = array(
				'labels'             => $labels,
				'public'             => true,
				'publicly_queryable' => true,
				'show_ui'            => true,
				'show_in_menu'       => false, // Ensure it shows in the menu
				'query_var'          => true,
				'rewrite'            => array( 'slug' => 'automatic-translation' ),
				'capability_type'    => 'page',
				'has_archive'        => true,
				'hierarchical'       => true,
				'menu_position'      => 0,
				'show_in_rest'       => true,
				'supports'           => array( 'editor' ), // Added support for excerpt and thumbnail
				'capabilities'       => array(
					'create_post'  => false,
					'create_posts' => false,
					'delete_post'  => false,
					'edit_post'    => 'edit_pages',
					'delete_posts' => false,
					'edit_posts'   => 'edit_pages',
					'edit_pages'   => 'edit_pages',
					'edit_page'    => 'edit_pages'
				),
			);

			register_post_type( 'lmat_add_blocks', $args );
		}

		public function get_custom_blocks_content() {
			if ( ! check_ajax_referer( 'lmat_block_update_nonce', 'lmat_nonce', false ) ) {
				wp_send_json_error( __( 'Invalid security token sent.', 'linguator-multilingual-ai-translation' ) );
				wp_die( '0', 400 );
			}

			if(!current_user_can('edit_posts')){
				wp_send_json_error( __( 'Unauthorized', 'linguator-multilingual-ai-translation' ), 403 );
				wp_die( '0', 403 );
			}

			$custom_content = get_option( 'lmat_custom_block_data', false ) ? get_option( 'lmat_custom_block_data', false ) : false;

			if ( $custom_content && is_string( $custom_content ) && ! empty( trim( $custom_content ) ) ) {
				return wp_send_json_success( array( 'block_data' => $custom_content ) );
			} else {
				return wp_send_json_success( array( 'message' => __( 'No custom blocks found.', 'linguator-multilingual-ai-translation' ) ) );
			}
			exit();
		}
		
		public function update_custom_blocks_content() {
			if ( ! check_ajax_referer( 'lmat_block_update_nonce', 'lmat_nonce', false ) ) {
				wp_send_json_error( __( 'Invalid security token sent.', 'linguator-multilingual-ai-translation' ) );
				wp_die( '0', 400 );
			}

			if(!current_user_can('edit_posts')){
				wp_send_json_error( __( 'Unauthorized', 'linguator-multilingual-ai-translation' ), 403 );
				wp_die( '0', 403 );
			}

			$json = isset($_POST['save_block_data']) ? wp_unslash($_POST['save_block_data']) : false;
			$updated_blocks_data = json_decode($json, true);
			if(json_last_error() !== JSON_ERROR_NONE){ 
				wp_send_json_error( __( 'Invalid JSON', 'linguator-multilingual-ai-translation' ) );
				wp_die( '0', 400 );
			}

			if($updated_blocks_data && class_exists(Supported_Blocks::class)){
				Supported_Blocks::get_instance()->update_custom_blocks_content($updated_blocks_data);
			}

			return wp_send_json_success( array( 'message' => __( 'Linguator Multilingual AI Translation: Custom Blocks data updated successfully', 'linguator-multilingual-ai-translation' ) ) );
			exit();
		}
	}
}
