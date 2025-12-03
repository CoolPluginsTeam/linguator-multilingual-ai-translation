<?php
namespace Linguator\Modules\Page_Translation;

use Linguator\Admin\Controllers\LMAT_Admin;
use Linguator\Supported_Blocks\Supported_Blocks;
use Linguator\Custom_Fields\Custom_Fields;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class LMAT_Page_Translation {


	/**
	 * Singleton instance of LMAT_Page_Translation.
	 *
	 * @var LMAT_Page_Translation
	 */
	private static $instance;

	/**
	 * Member Variable
	 *
	 * @var LMAT_Page_Translation_Helper
	 */
	public $page_translate_helper = null;

	/**
	 * Get the singleton instance of LMAT_Page_Translation.
	 *
	 * @return LMAT_Page_Translation
	 */
	public static function get_instance( $linguator = null ) {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self( $linguator );
		}
		return self::$instance;
	}

	/**
	 * Constructor for LMAT_Page_Translation.
	 */
	public function __construct( $linguator ) {
		if ( $linguator instanceof LMAT_Admin ) {
			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_gutenberg_translate_assets' ) );
			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_classic_translate_assets' ) );
			add_action( 'elementor/editor/before_enqueue_scripts', array( $this, 'enqueue_elementor_translate_assets' ) );
			add_action( 'add_meta_boxes', array( $this, 'lmat_gutenberg_metabox' ) );
			add_action( 'media_buttons', array( $this, 'lmat_classic_translate_button' ) );
			add_action( 'add_meta_boxes', array( $this, 'lmat_save_elementor_post_meta' ) );
		}

		if ( is_admin() && is_user_logged_in() ) {
			$this->page_translate_helper = new LMAT_Page_Translation_Helper();
			add_action( 'wp_ajax_lmat_fetch_post_content', array( $this, 'fetch_post_content' ) );
			add_action( 'wp_ajax_lmat_block_parsing_rules', array( $this, 'block_parsing_rules' ) );
			add_action( 'wp_ajax_lmat_update_elementor_data', array( $this, 'update_elementor_data' ) );
			add_action( 'wp_ajax_lmat_fetch_post_meta_fields', array( $this, 'fetch_post_meta_fields' ) );
			add_action( 'wp_ajax_lmat_update_post_meta_fields', array( $this, 'update_post_meta_fields' ) );
			add_action( 'wp_ajax_lmat_update_classic_translate_status', array( $this, 'update_classic_translate_status' ) );
		}
	}

	/**
	 * Register and display the automatic translation metabox.
	 */
	public function lmat_gutenberg_metabox() {
		if ( isset( $_GET['from_post'], $_GET['new_lang'], $_GET['_wpnonce'] ) &&
			wp_verify_nonce( sanitize_text_field( wp_unslash( $_GET['_wpnonce'] ) ), 'new-post-translation' ) ) {
			$post_id = isset( $_GET['from_post'] ) ? absint( $_GET['from_post'] ) : 0;

			if ( 0 === $post_id ) {
				return;
			}

			$editor = '';
			if ( 'builder' === get_post_meta( $post_id, '_elementor_edit_mode', true ) && defined( 'ELEMENTOR_VERSION' ) ) {
				$editor = 'Elementor';
			}
			if ( 'on' === get_post_meta( $post_id, '_et_pb_use_builder', true ) && defined( 'ET_CORE' ) ) {
				$editor = 'Divi';
			}

			$current_screen = get_current_screen();
			if ( method_exists( $current_screen, 'is_block_editor' ) && $current_screen->is_block_editor() && ! in_array( $editor, array( 'Elementor', 'Divi' ), true ) ) {
				if ( 'post-new.php' === $GLOBALS['pagenow'] && isset( $_GET['from_post'], $_GET['new_lang'] ) ) {
					global $post;

					if ( ! ( $post instanceof \WP_Post ) ) {
						return;
					}

					if ( ! function_exists( 'LMAT' ) || ! LMAT()->model->is_translated_post_type( $post->post_type ) ) {
						return;
					}
					add_meta_box( 'lmat-meta-box', __( 'Automatic Translate', 'linguator-multilingual-ai-translation' ), array( $this, 'lmat_metabox_text' ), null, 'side', 'high' );
				}
			}
		}
	}

	public function lmat_classic_translate_button() {

		global $linguator;
		global $post;

		if(!isset($post) || !isset($post->ID)){
			return;
		}

		$lmat_linguator        = $linguator;
		$post_translate_status = get_post_meta( $post->ID, '_lmat_translate_status', true );
		$post_parent_post_id   = get_post_meta( $post->ID, '_lmat_parent_post_id', true );

		if ( isset( $lmat_linguator ) && is_admin() ) {
			if ( ( isset( $_GET['from_post'], $_GET['new_lang'], $_GET['_wpnonce'] ) &&
			wp_verify_nonce( sanitize_text_field( wp_unslash( $_GET['_wpnonce'] ) ), 'new-post-translation' ) ) ) {

				$post_id = isset( $_GET['from_post'] ) ? absint( $_GET['from_post'] ) : 0;
				$post_id = ! empty( $post_parent_post_id ) ? $post_parent_post_id : $post_id;

				if ( 0 === $post_id ) {
					return;
				}

				$editor = '';
				if ( 'builder' === get_post_meta( $post_id, '_elementor_edit_mode', true ) && defined( 'ELEMENTOR_VERSION' ) ) {
					$editor = 'Elementor';
				}
				if ( 'on' === get_post_meta( $post_id, '_et_pb_use_builder', true ) && defined( 'ET_CORE' ) ) {
					$editor = 'Divi';
				}

				$current_screen = get_current_screen();
				if ( method_exists( $current_screen, 'is_block_editor' ) && ! $current_screen->is_block_editor() && ! in_array( $editor, array( 'Elementor', 'Divi' ), true ) ) {
					if ( ( 'post-new.php' === $GLOBALS['pagenow'] && isset( $_GET['from_post'], $_GET['new_lang'] ) ) || ( ! empty( $post_translate_status ) && $post_translate_status === 'pending' && ! empty( $post_parent_post_id ) ) ) {

						if ( ! ( $post instanceof \WP_Post ) ) {
							return;
						}

						if ( ! function_exists( 'LMAT' ) || ! LMAT()->model->is_translated_post_type( $post->post_type ) ) {
							return;
						}

						if ( empty( $post_translate_status ) && empty( $post_parent_post_id ) ) {
							update_post_meta( $post->ID, '_lmat_translate_status', 'pending' );
							update_post_meta( $post->ID, '_lmat_parent_post_id', $post_id );
						}

						echo '<button class="button button-primary" id="lmat-page-translation-button" name="lmat_page_translation_meta_box_translate">' . esc_html__( 'Translate Page', 'linguator-multilingual-ai-translation' ) . '</button>';
					}
				}
			}
		}
	}

	/**
	 * Display the automatic translation metabox button.
	 */
	public function lmat_metabox_text() {
		if ( isset( $_GET['_wpnonce'] ) &&
			wp_verify_nonce( sanitize_text_field( wp_unslash( $_GET['_wpnonce'] ) ), 'new-post-translation' ) ) {
			$target_language = '';
			if ( function_exists( 'LMAT' ) ) {
				$parent_post_id       = isset( $_GET['from_post'] ) ? sanitize_key( $_GET['from_post'] ) : '';
				$parent_post_language = lmat_get_post_language( $parent_post_id, 'name' );
				$target_code          = isset( $_GET['new_lang'] ) ? sanitize_key( $_GET['new_lang'] ) : '';
				$languages            = LMAT()->model->get_languages_list();
				foreach ( $languages as $lang ) {
					if ( $lang->slug === $target_code ) {
						$target_language = $lang->name;
					}
				}
			}

			$providers_config_class = ' providers-config-no-active';

			if ( property_exists( LMAT(), 'options' ) && isset( LMAT()->options['ai_translation_configuration']['provider'] ) ) {
				$providers = LMAT()->options['ai_translation_configuration']['provider'];

				foreach ( $providers as $provider => $value ) {
					if ( $value ) {
						$providers_config_class = '';
						break;
					}
				}
			}

			?>
			<input type="button" class="button button-primary<?php echo esc_attr( $providers_config_class ); ?>" name="lmat_page_translation_meta_box_translate" id="lmat-page-translation-button" value="<?php echo esc_attr__( 'Translate Page', 'linguator-multilingual-ai-translation' ); ?>" readonly/><br><br>
			<p style="margin-bottom: .5rem;"><?php echo esc_html( sprintf( __( 'Translate or duplicate content from %1$s to %2$s', 'linguator-multilingual-ai-translation' ), $parent_post_language, $target_language ) ); ?></p>
			<?php
		}
	}

	/**
	 * Register backend assets.
	 */
	public function enqueue_gutenberg_translate_assets() {
		$current_screen = get_current_screen();
		if (
			isset( $_GET['from_post'], $_GET['new_lang'], $_GET['_wpnonce'] ) &&
			wp_verify_nonce( sanitize_text_field( wp_unslash( $_GET['_wpnonce'] ) ), 'new-post-translation' )
		) {
			if ( method_exists( $current_screen, 'is_block_editor' ) && $current_screen->is_block_editor() ) {
				$from_post_id = isset( $_GET['from_post'] ) ? absint( $_GET['from_post'] ) : 0;

				global $post;

				if ( null === $post || 0 === $from_post_id ) {
					return;
				}

				$lang = isset( $_GET['new_lang'] ) ? sanitize_key( $_GET['new_lang'] ) : '';

				$editor = '';
				if ( 'builder' === get_post_meta( $from_post_id, '_elementor_edit_mode', true ) && defined( 'ELEMENTOR_VERSION' ) ) {
					$source_lang_name = lmat_get_post_language( $from_post_id, 'slug' );
					$this->enqueue_elementor_confirm_box_assets( $from_post_id, $lang, $source_lang_name, 'gutenberg' );
					$editor = 'Elementor';
				}
				if ( 'on' === get_post_meta( $from_post_id, '_et_pb_use_builder', true ) && defined( 'ET_CORE' ) ) {
					$editor = 'Divi';
				}

				if ( in_array( $editor, array( 'Elementor', 'Divi' ), true ) ) {
					return;
				}

				$languages = LMAT()->model->get_languages_list();

				$lang_object = array();
				foreach ( $languages as $lang_obj ) {
					$lang_object[ $lang_obj->slug ] = $lang_obj->name;
				}

				$post_translate = LMAT()->model->is_translated_post_type( $post->post_type );

				$post_type = isset( $_GET['post_type'] ) ? sanitize_key( $_GET['post_type'] ) : '';

				if ( $post_translate && $lang && $post_type ) {
					$data = array(
						'action_fetch'       => 'lmat_fetch_post_content',
						'action_block_rules' => 'lmat_block_parsing_rules',
						'parent_post_id'     => $from_post_id,
					);

					$this->enqueue_automatic_translate_assets( lmat_get_post_language( $from_post_id, 'slug' ), $lang, 'gutenberg', $data );
				}
			}
		}
	}

	public function enqueue_classic_translate_assets() {
		global $post;
		$current_screen        = get_current_screen();
		$post_translate_status = isset( $post ) ? get_post_meta( $post->ID, '_lmat_translate_status', true ) : '';
		$post_parent_post_id   = isset( $post ) ? get_post_meta( $post->ID, '_lmat_parent_post_id', true ) : '';

		if ( isset( $current_screen ) && isset( $current_screen->id ) && $current_screen->id === 'edit-page' ) {
			return;
		}

		if (
			isset( $_GET['from_post'], $_GET['new_lang'], $_GET['_wpnonce'] ) &&
			wp_verify_nonce( sanitize_text_field( wp_unslash( $_GET['_wpnonce'] ) ), 'new-post-translation' ) ) {
			$current_screen = get_current_screen();

			if ( method_exists( $current_screen, 'is_block_editor' ) && ! $current_screen->is_block_editor() ) {
				$from_post_id = isset( $_GET['from_post'] ) ? absint( $_GET['from_post'] ) : 0;
				$from_post_id = ! empty( $post_parent_post_id ) ? $post_parent_post_id : $from_post_id;

				if ( null === $post || 0 === $from_post_id ) {
					return;
				}

				$lang = isset( $_GET['new_lang'] ) ? sanitize_key( $_GET['new_lang'] ) : '';

				if ( ! empty( $post_translate_status ) && $post_translate_status === 'pending' ) {
					$lang = lmat_get_post_language( $post->ID, 'slug' );
				}

				$editor = '';
				if ( 'builder' === get_post_meta( $from_post_id, '_elementor_edit_mode', true ) && defined( 'ELEMENTOR_VERSION' ) ) {
					$source_lang_name = lmat_get_post_language( $from_post_id, 'slug' );
					$this->enqueue_elementor_confirm_box_assets( $from_post_id, $lang, $source_lang_name, 'classic' );
					$editor = 'Elementor';
				}
				if ( 'on' === get_post_meta( $from_post_id, '_et_pb_use_builder', true ) && defined( 'ET_CORE' ) ) {
					$editor = 'Divi';
				}

				if ( in_array( $editor, array( 'Elementor', 'Divi' ), true ) ) {
					return;
				}

				$languages = LMAT()->model->get_languages_list();

				$lang_object = array();
				foreach ( $languages as $lang_obj ) {
					$lang_object[ $lang_obj->slug ] = $lang_obj->name;
				}

				$post_translate = LMAT()->model->is_translated_post_type( $post->post_type );

				if ( $post_translate && $lang && ! empty( $lang ) ) {

					$data = array(
						'action_fetch'         => 'lmat_fetch_post_content',
						'parent_post_id'       => $from_post_id,
						'action_update_status' => 'lmat_update_classic_translate_status',
						'classic_status_key'   => wp_create_nonce( 'lmat_classic_translate_nonce' ),
					);

					$parent_page_content = get_the_content( null, false, $from_post_id );
					$block_comment_tag   = preg_match( '/<!--[\s\S]*?-->/s', $parent_page_content ) && strpos( $parent_page_content, '<!--' ) < strpos( $parent_page_content, '-->' );

					if ( $block_comment_tag ) {
						$data['blockCommentTag'] = 'true';
					}

					$this->enqueue_automatic_translate_assets( lmat_get_post_language( $from_post_id, 'slug' ), $lang, 'classic', $data );
				}
			}
		}
	}

	public function enqueue_elementor_translate_assets() {
		$page_translated           = get_post_meta( get_the_ID(), '_lmat_elementor_translated', true );
		$parent_post_language_slug = get_post_meta( get_the_ID(), '_lmat_parent_post_language_slug', true );

		if ( ( ! empty( $page_translated ) && $page_translated === 'true' ) || empty( $parent_post_language_slug ) ) {
			return;
		}

		$post_language_slug = lmat_get_post_language( get_the_ID(), 'slug' );
		$current_post_id    = get_the_ID(); // Get the current post ID

		if ( ! class_exists( '\Elementor\Plugin' ) || ! property_exists( '\Elementor\Plugin', 'instance' ) ) {
			return;
		}

		$elementor_data = \Elementor\Plugin::$instance->documents->get( $current_post_id )->get_elements_data();

		if ( $parent_post_language_slug === $post_language_slug ) {
			return;
		}

		$parent_post_id = LMAT()->model->post->get_translation( $current_post_id, $parent_post_language_slug );

		$data = array(
			'update_elementor_data' => 'lmat_update_elementor_data',
			'elementorData'         => $elementor_data,
			'parent_post_id'        => $parent_post_id,
			'parent_post_title'     => get_the_title( $parent_post_id ),
		);

		wp_enqueue_style( 'lmat-elementor-translate', plugins_url( 'admin/assets/css/lmat-elementor-translate.min.css', LINGUATOR_ROOT_FILE ), array(), LINGUATOR_VERSION );
		$this->enqueue_automatic_translate_assets( $parent_post_language_slug, $post_language_slug, 'elementor', $data );
	}

	public function enqueue_automatic_translate_assets( $source_lang, $target_lang, $editor_type, $extra_data = array() ) {
		wp_register_script( 'lmat-google-api', 'https://translate.google.com/translate_a/element.js', '', LINGUATOR_VERSION, true );

		$editor_script_asset = include LINGUATOR_DIR . '/admin/assets/page-translation/index.asset.php';
		if ( ! is_array( $editor_script_asset ) ) {
			$editor_script_asset = array(
				'dependencies' => array(),
				'version'      => LINGUATOR_VERSION,
			);
		}

		wp_register_script( 'lmat-page-translate', plugins_url( 'admin/assets/page-translation/index.js', LINGUATOR_ROOT_FILE ), array_merge( $editor_script_asset['dependencies'], array( 'lmat-google-api' ) ), $editor_script_asset['version'], true );
		wp_register_style( 'lmat-page-translate', plugins_url( 'admin/assets/page-translation/index.css', LINGUATOR_ROOT_FILE ), array(), $editor_script_asset['version'] );
		$post_type = get_post_type();
		$providers = array();

		if ( property_exists( LMAT(), 'options' ) && isset( LMAT()->options['ai_translation_configuration']['provider'] ) ) {
			$providers = LMAT()->options['ai_translation_configuration']['provider'];
		}

		$active_providers = array();

		foreach ( $providers as $provider => $value ) {
			if ( $value ) {
				$provdername        = $provider === 'chrome_local_ai' ? 'localAiTranslator' : $provider;
				$active_providers[] = $provdername;
			}
		}

		$languages = LMAT()->model->get_languages_list();

		$lang_object = array();
		foreach ( $languages as $lang ) {
			$lang_object[ $lang->slug ] = array(
				'name'   => $lang->name,
				'flag'   => $lang->flag_url,
				'locale' => $lang->locale,
			);
		}

		$slug_translation_option = 'title_translate';

		if ( property_exists( LMAT(), 'options' ) && isset( LMAT()->options['ai_translation_configuration']['slug_translation_option'] ) ) {
			$slug_translation_option = LMAT()->options['ai_translation_configuration']['slug_translation_option'];
		}

		wp_enqueue_style( 'lmat-page-translate' );
		wp_enqueue_script( 'lmat-page-translate' );
		
		// Set script translations for wp-i18n functions (required for WordPress 6.9+)
		wp_set_script_translations( 'lmat-page-translate', 'linguator-multilingual-ai-translation' );

		$post_id = get_the_ID();

		if ( isset( $extra_data['parent_post_id'] ) ) {
			$parent_post_id   = $extra_data['parent_post_id'];
			$parent_post_slug = get_post_field( 'post_name', $parent_post_id );

			$extra_data['slug_name'] = $parent_post_slug;
		}

		if ( ! isset( LMAT()->options['sync'] ) || ( isset( LMAT()->options['sync'] ) && ! in_array( 'post_meta', LMAT()->options['sync'] ) ) ) {
			$extra_data['postMetaSync'] = 'false';

			if ( in_array( $editor_type, array( 'classic', 'gutenberg' ) ) ) {
				$extra_data['update_post_meta_fields'] = 'lmat_update_post_meta_fields';
				$extra_data['post_meta_fields_key']    = wp_create_nonce( 'lmat_update_post_meta_fields' );
			}
		} else {
			$extra_data['postMetaSync'] = 'true';
		}

		$data = array_merge(
			array(
				'ajax_url'                 => admin_url( 'admin-ajax.php' ),
				'ajax_nonce'               => wp_create_nonce( 'lmat_page_translation_admin' ),
				'update_translation_check' => wp_create_nonce( 'lmat_update_translate_data_nonce' ),
				'fetchBlockRulesNonce'     => wp_create_nonce( 'lmat_fetch_block_rules_nonce' ),
				'get_glossary_validate'    => wp_create_nonce( 'lmat_get_glossary_private' ),
				'add_glossary_validate'    => wp_create_nonce( 'lmat_add_glossary_nonce' ),
				'lmat_url'                 => esc_url( plugins_url( '', LINGUATOR_ROOT_FILE ) ) . '/',
				'admin_url'                => admin_url(),
				'update_translate_data'    => 'lmat_update_translate_data',
				'source_lang'              => $source_lang,
				'target_lang'              => $target_lang,
				'languageObject'           => $lang_object,
				'post_type'                => $post_type,
				'editor_type'              => $editor_type,
				'current_post_id'          => $post_id,
				'providers'                => $active_providers,
				'get_meta_fields'          => 'lmat_fetch_post_meta_fields',
				'meta_fields_key'          => wp_create_nonce( 'lmat_fetch_post_meta_fields' ),
				'slug_translation_option'  => $slug_translation_option,
			),
			$extra_data
		);

		wp_localize_script(
			'lmat-page-translate',
			'lmatPageTranslationGlobal',
			$data
		);
	}

	public function enqueue_elementor_confirm_box_assets( $parent_post_id, $target_lang_name, $source_lang_name, $editor_type='gutenberg' ) {
		$post_id = get_the_ID();

		$source_lang_name = LMAT()->model->get_language( $source_lang_name );
		$target_lang_name = LMAT()->model->get_language( $target_lang_name );

		wp_enqueue_script( 'lmat-elementor-confirm-box', plugins_url('admin/assets/js/lmat-elementor-translate-confirm-box.js', LINGUATOR_ROOT_FILE), array( 'jquery', 'wp-i18n' ), LINGUATOR_VERSION, true );
		
		// Set script translations for wp-i18n functions (required for WordPress 6.9+)
		wp_set_script_translations( 'lmat-elementor-confirm-box', 'linguator-multilingual-ai-translation' );

		wp_localize_script(
			'lmat-elementor-confirm-box',
			'lmatElementorConfirmBoxData',
			array(
				'postId'         => $post_id,
				'parentPostId'   => $parent_post_id,
				'sourceLangSlug' => $source_lang_name->slug,
				'targetLangSlug' => $target_lang_name->slug,
				'sourceLangName' => $source_lang_name->name,
				'targetLangName' => $target_lang_name->name,
				'editorType'     => $editor_type,
			)
		);

		wp_enqueue_style( 'lmat-elementor-confirm-box', plugins_url('admin/assets/css/lmat-elementor-translate-confirm-box.css', LINGUATOR_ROOT_FILE), array(), LINGUATOR_VERSION );
	}

	public function lmat_save_elementor_post_meta() {
		if ( isset( $_GET['_wpnonce'] ) &&
		wp_verify_nonce( sanitize_text_field( wp_unslash( $_GET['_wpnonce'] ) ), 'new-post-translation' ) ) {
			if ( function_exists( 'LMAT' ) ) {
				global $post;
				$current_post_id = $post->ID;

				$parent_post_id        = isset( $_GET['from_post'] ) ? sanitize_key( $_GET['from_post'] ) : '';
				$parent_editor         = get_post_meta( $parent_post_id, '_elementor_edit_mode', true );
				$parent_elementor_data = get_post_meta( $parent_post_id, '_elementor_data', true );

				if ( $parent_editor === 'builder' || ! empty( $parent_elementor_data ) ) {
					$parent_post_language_slug = lmat_get_post_language( $parent_post_id, 'slug' );
					update_post_meta( $current_post_id, '_lmat_parent_post_language_slug', $parent_post_language_slug );
				}
			}
		}
	}

	public function fetch_post_content() {
		$post_id = absint( isset( $_POST['postId'] ) ? absint( sanitize_text_field( $_POST['postId'] ) ) : false );

		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			wp_send_json_error( __( 'Unauthorized', 'linguator-multilingual-ai-translation' ), 403 );
			wp_die( '0', 403 );
		}

		if ( ! $this->page_translate_helper instanceof LMAT_Page_Translation_Helper || ! method_exists( $this->page_translate_helper, 'fetch_post_content' ) ) {
			wp_send_json_error( array( 'message' => __( 'Fetch post content method not found.', 'linguator-multilingual-ai-translation' ) ) );
			exit;
		}

		$this->page_translate_helper->fetch_post_content();

		exit;
	}

	public function fetch_post_meta_fields() {
		if ( ! check_ajax_referer( 'lmat_fetch_post_meta_fields', 'meta_fields_key', false ) ) {
			wp_send_json_error( __( 'Invalid security token sent.', 'linguator-multilingual-ai-translation' ) );
			wp_die( '0', 400 );
		}

		$post_id = absint( isset( $_POST['postId'] ) ? absint( sanitize_text_field( $_POST['postId'] ) ) : false );

		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			wp_send_json_error( __( 'Unauthorized', 'linguator-multilingual-ai-translation' ), 403 );
			wp_die( '0', 403 );
		}

		if ( ! $this->page_translate_helper instanceof LMAT_Page_Translation_Helper || ! method_exists( $this->page_translate_helper, 'fetch_post_meta_fields' ) ) {
			wp_send_json_error( array( 'message' => __( 'Fetch post meta fields method not found.', 'linguator-multilingual-ai-translation' ) ) );
			exit;
		}

		$this->page_translate_helper->fetch_post_meta_fields();
	}

	public function update_post_meta_fields() {
		if ( ! check_ajax_referer( 'lmat_update_post_meta_fields', 'post_meta_fields_key', false ) ) {
			wp_send_json_error( __( 'Invalid security token sent.', 'linguator-multilingual-ai-translation' ) );
			wp_die( '0', 400 );
		}

		$post_id = isset( $_POST['post_id'] ) ? absint( sanitize_text_field( $_POST['post_id'] ) ) : false;

		if ( ! isset( $post_id ) || false === $post_id ) {
			wp_send_json_error( __( 'Invalid Post ID.', 'linguator-multilingual-ai-translation' ) );
			wp_die( '0', 400 );
		}

		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			wp_send_json_error( __( 'Unauthorized', 'linguator-multilingual-ai-translation' ), 403 );
			wp_die( '0', 403 );
		}

		$meta_fields = isset( $_POST['meta_fields'] ) ? json_decode( wp_unslash( $_POST['meta_fields'] ), true ) : false;

		if ( ! $meta_fields || ! is_array( $meta_fields ) || count( $meta_fields ) < 1 ) {
			wp_send_json_success( __( 'No Meta Fields to update.', 'linguator-multilingual-ai-translation' ) );
			wp_die( '0', 200 );
		}

		$this->update_post_custom_fields( $meta_fields, $post_id );

        wp_send_json_success( __( 'Meta Fields updated successfully.', 'linguator-multilingual-ai-translation' ) );
		exit;
	}

	public function block_parsing_rules() {
		if ( ! check_ajax_referer( 'lmat_fetch_block_rules_nonce', 'lmat_fetch_block_rules_key', false ) ) {
			wp_send_json_error( array( 'message' => __( 'Invalid security token sent for block parsing rules.', 'linguator-multilingual-ai-translation' ) ) );
			exit;
		}

		if(!current_user_can('edit_posts')){
			wp_send_json_error( __( 'Unauthorized', 'linguator-multilingual-ai-translation' ), 403 );
			wp_die( '0', 403 );
		}

		if ( ! method_exists( Supported_Blocks::class, 'block_parsing_rules' ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'The method block_parsing_rules() does not exist in Supported_Blocks.', 'linguator-multilingual-ai-translation' ),
				)
			);
			exit;
		}

		$data = Supported_Blocks::get_instance()->block_parsing_rules();
		wp_send_json_success( array( 'blockRules' => json_encode( $data ) ) );
		exit;
	}

	public function update_elementor_data() {
		if ( ! $this->page_translate_helper instanceof LMAT_Page_Translation_Helper ) {
			wp_send_json_error( array( 'message' => __( 'Elementor data update does exist AJAX handler.', 'linguator-multilingual-ai-translation' ) ) );
			exit;
		}

		if ( ! method_exists( $this->page_translate_helper, 'update_elementor_data' ) ) {
			wp_send_json_error( array( 'message' => __( 'Elementor data update method not found.', 'linguator-multilingual-ai-translation' ) ) );
			exit;
		}

		$this->page_translate_helper->update_elementor_data();

		exit;
	}

	public function update_classic_translate_status() {
		if ( ! check_ajax_referer( 'lmat_classic_translate_nonce', 'lmat_classic_translate_nonce', false ) ) {
			wp_send_json_error( __( 'Invalid security token sent.', 'linguator-multilingual-ai-translation' ) );
			wp_die( '0', 400 );
		}

		$post_id = isset( $_POST['post_id'] ) ? absint( sanitize_text_field( $_POST['post_id'] ) ) : 0;
		if ( ! $post_id || ! current_user_can( 'edit_post', $post_id ) ) {
			wp_send_json_error( __( 'Unauthorized', 'linguator-multilingual-ai-translation' ), 403 );
			wp_die( '0', 403 );
		}

		$status = isset( $_POST['status'] ) ? sanitize_text_field( $_POST['status'] ) : '';
		if ( $status !== 'completed' ) {
			wp_send_json_error( __( 'Invalid status', 'linguator-multilingual-ai-translation' ), 400 );
			wp_die( '0', 400 );
		}

		update_post_meta( $post_id, '_lmat_classic_translate_status', $status );
		wp_send_json_success( 'Classic translate status updated.' );
	}


	private function update_post_custom_fields( $fields, $post_id ) {
		$post_meta_sync = true;

		if ( ! isset( LMAT()->options['sync'] ) || ( isset( LMAT()->options['sync'] ) && ! in_array( 'post_meta', LMAT()->options['sync'] ) ) ) {
			$post_meta_sync = false;
		}

		if ( $post_meta_sync ) {
			return;
		}

		$allowed_meta_fields = Custom_Fields::get_allowed_custom_fields();

		if ( $fields && is_array( $fields ) && count( $fields ) > 0 ) {
			$valid_meta_fields = array_intersect( array_keys( $fields ), array_keys( $allowed_meta_fields ) );
			if ( count( $valid_meta_fields ) > 0 ) {
				foreach ( $valid_meta_fields as $key ) {
					if ( isset( $allowed_meta_fields[ $key ] ) && $allowed_meta_fields[ $key ]['status'] ) {
						$value = is_array( $fields[ $key ] ) ? $this->sanitize_array_value( $fields[ $key ], array() ) : sanitize_text_field( $fields[ $key ] );

						update_post_meta( absint( $post_id ), sanitize_text_field( $key ), $value );
					}
				}
			}
		}
	}

	private function sanitize_array_value( $value, $arr ) {
		foreach ( $value as $key => $item ) {
			$arr[ sanitize_text_field( $key ) ] = is_array( $item ) ? $this->sanitize_array_value( $item, array() ) : sanitize_text_field( $item );
		}

		return $arr;
	}
}
