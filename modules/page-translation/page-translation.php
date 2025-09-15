<?php
namespace Linguator\modules\Page_Translation;

use Linguator\Admin\Controllers\LMAT_Admin;

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
			add_action( 'elementor/editor/before_enqueue_scripts', array( $this, 'enqueue_elementor_translate_assets' ) );
			add_action( 'add_meta_boxes', array( $this, 'lmat_gutenberg_metabox' ) );
			add_action( 'add_meta_boxes', array( $this, 'lmat_save_elementor_post_meta' ) );

		} 
		
		if ( is_admin() && is_user_logged_in() ) {
			$this->page_translate_helper = new LMAT_Page_Translation_Helper();
			add_action( 'wp_ajax_lmat_fetch_post_content', array( $this, 'fetch_post_content' ) );
			add_action( 'wp_ajax_lmat_block_parsing_rules', array( $this, 'block_parsing_rules' ) );
			add_action( 'wp_ajax_lmat_update_elementor_data', array( $this, 'update_elementor_data' ) );
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
			if ( 'builder' === get_post_meta( $post_id, '_elementor_edit_mode', true ) ) {
				$editor = 'Elementor';
			}
			if ( 'on' === get_post_meta( $post_id, '_et_pb_use_builder', true ) ) {
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

			$providers_config_class=' providers-config-no-active';

			if(property_exists(LMAT(), 'options') && isset(LMAT()->options['ai_translation_configuration']['provider'])){
				$providers = LMAT()->options['ai_translation_configuration']['provider'];

				foreach($providers as $provider => $value){
					if($value){
						$providers_config_class = '';
						break;
					}
				}
			}

			?>
			<input type="button" class="button button-primary<?php echo esc_attr($providers_config_class); ?>" name="lmat_page_translation_meta_box_translate" id="lmat-page-translation-button" value="<?php echo esc_attr__( 'Translate Page', 'linguator-multilingual-ai-translation' ); ?>" readonly/><br><br>
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

				$editor = '';
				if ( 'builder' === get_post_meta( $from_post_id, '_elementor_edit_mode', true ) ) {
					$editor = 'Elementor';
				}
				if ( 'on' === get_post_meta( $from_post_id, '_et_pb_use_builder', true ) ) {
					$editor = 'Divi';
				}

				if ( in_array( $editor, array( 'Elementor', 'Divi' ), true ) ) {
					return;
				}

				$languages = LMAT()->model->get_languages_list();

				$lang_object = array();
				foreach ( $languages as $lang ) {
					$lang_object[ $lang->slug ] = $lang->name;
				}

				$post_translate = LMAT()->model->is_translated_post_type( $post->post_type );
				$lang           = isset( $_GET['new_lang'] ) ? sanitize_key( $_GET['new_lang'] ) : '';
				$post_type      = isset( $_GET['post_type'] ) ? sanitize_key( $_GET['post_type'] ) : '';

				if ( $post_translate && $lang && $post_type ) {
					if ( function_exists( 'get_option' ) ) {
						$update_blocks = get_option( 'lmat_custom_block_status', false ) && 'true' === get_option( 'lmat_custom_block_status', false ) ? true : false;
						if ( $update_blocks ) {
							// Custom Translation Block update script
							wp_register_script( 'lmat-custom-blocks', plugins_url( 'Assets/Build/automatic-translate/index.js', LINGUATOR_ROOT_FILE ), array( 'wp-data', 'jquery' ), LINGUATOR_VERSION, true );
							wp_enqueue_script( 'lmat-custom-blocks' );

							wp_localize_script(
								'lmat-custom-blocks',
								'lmat_block_update_object',
								array(
									'ajax_url'           => admin_url( 'admin-ajax.php' ),
									'ajax_nonce'         => wp_create_nonce( 'lmat_block_update_nonce' ),
									'lmat_url'           => esc_url( plugins_url( LINGUATOR_ROOT_FILE ) ),
									'action_get_content' => 'lmat_get_custom_blocks_content',
									'action_update_content' => 'lmat_update_custom_blocks_content',
									'source_lang'        => lmat_get_post_language( $from_post_id, 'slug' ),
									'languageObject'     => $lang_object,
								)
							);
						}
					}

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

	public function enqueue_elementor_translate_assets() {

        $page_translated = get_post_meta(get_the_ID(), '_lmat_elementor_translated', true);
        $parent_post_language_slug = get_post_meta(get_the_ID(), '_lmat_parent_post_language_slug', true);

        if ((!empty($page_translated) && $page_translated === 'true') || empty($parent_post_language_slug)) {
            return;
        }

        $post_language_slug = lmat_get_post_language(get_the_ID(), 'slug');
        $current_post_id = get_the_ID(); // Get the current post ID

        if(!class_exists('\Elementor\Plugin') || !property_exists('\Elementor\Plugin', 'instance') ){
            return;
        }

        $elementor_data = \Elementor\Plugin::$instance->documents->get( $current_post_id )->get_elements_data();


        if ($parent_post_language_slug === $post_language_slug) {
            return;
        }

        $meta_fields=get_post_meta($current_post_id);

        $parent_post_id=LMAT()->model->post->get_translation($current_post_id, $parent_post_language_slug);

        $data = array(
            'update_elementor_data' => 'lmat_update_elementor_data',
            'elementorData' => $elementor_data,
            'metaFields' => $meta_fields,
            'parent_post_id' => $parent_post_id,
            'parent_post_title' => get_the_title($parent_post_id),
        );

		wp_enqueue_style( 'lmat-elementor-translate', plugins_url( 'Admin/Assets/css/lmat-elementor-translate.min.css', LINGUATOR_ROOT_FILE ), array(), LINGUATOR_VERSION );
		$this->enqueue_automatic_translate_assets($parent_post_language_slug, $post_language_slug, 'elementor', $data);
    }

	public function enqueue_automatic_translate_assets( $source_lang, $target_lang, $editor_type, $extra_data = array() ) {
		wp_register_script( 'lmat-google-api', 'https://translate.google.com/translate_a/element.js', '', LINGUATOR_VERSION, true );

		$editor_script_asset = include LINGUATOR_DIR . '/Admin/Assets/page-translation/index.asset.php';

		if ( ! is_array( $editor_script_asset ) ) {
			$editor_script_asset = array(
				'dependencies' => array(),
				'version'      => LINGUATOR_VERSION,
			);
		}

		wp_register_script( 'lmat-page-translate', plugins_url( 'Admin/Assets/page-translation/index.js', LINGUATOR_ROOT_FILE ), array_merge( $editor_script_asset['dependencies'], array( 'lmat-google-api' ) ), $editor_script_asset['version'], true );
		wp_register_style( 'lmat-page-translate', plugins_url( 'Admin/Assets/page-translation/index.css', LINGUATOR_ROOT_FILE ), array(), $editor_script_asset['version'] );

		$post_type = get_post_type();

		$languages   = LMAT()->model->get_languages_list();

		$providers=array();

		if(property_exists(LMAT(), 'options') && isset(LMAT()->options['ai_translation_configuration']['provider'])){
			$providers = LMAT()->options['ai_translation_configuration']['provider'];
		}

		$active_providers=array();

		foreach($providers as $provider => $value){
			if($value){
				$provdername = $provider==='chrome_local_ai' ? 'localAiTranslator' : $provider;
				$active_providers[] = $provdername;
			}
		}

		$lang_object = array();
		foreach ( $languages as $lang ) {
			$lang_object[ $lang->slug ] = array(
				'name'   => $lang->name,
				'flag'   => $lang->flag_url,
				'locale' => $lang->locale,
			);
		}

		// wp_enqueue_style('lmat-automatic-translate-custom');
		wp_enqueue_style( 'lmat-page-translate' );
		wp_enqueue_script( 'lmat-page-translate' );

		$post_id = get_the_ID();

		$data = array_merge(
			array(
				'ajax_url'                 => admin_url( 'admin-ajax.php' ),
				'ajax_nonce'               => wp_create_nonce( 'lmat_page_translation_admin' ),
				'update_translation_check' => wp_create_nonce( 'lmat_update_translate_data_nonce' ),
				'fetchBlockRulesNonce'     => wp_create_nonce( 'lmat_fetch_block_rules_nonce' ),
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
			),
			$extra_data
		);

		if ( ! isset( LMAT()->options['sync'] ) || ( isset( LMAT()->options['sync'] ) && ! in_array( 'post_meta', LMAT()->options['sync'] ) ) ) {
			$data['postMetaSync'] = 'false';
		} else {
			$data['postMetaSync'] = 'true';
		}

		wp_localize_script(
			'lmat-page-translate',
			'lmatPageTranslationGlobal',
			$data
		);
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

	public function block_parsing_rules() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( __( 'Unauthorized', 'linguator-multilingual-ai-translation' ), 403 );
			wp_die( '0', 403 );
		}

		if ( ! $this->page_translate_helper instanceof LMAT_Page_Translation_Helper ) {
			wp_send_json_error( array( 'message' => __( 'Block parsing rules does exist AJAX handler.', 'linguator-multilingual-ai-translation' ) ) );
			exit;
		}

		if ( ! method_exists( $this->page_translate_helper, 'block_parsing_rules' ) ) {
			wp_send_json_error( array( 'message' => __( 'Block parsing rules method not found.', 'linguator-multilingual-ai-translation' ) ) );
			exit;
		}

		if ( ! check_ajax_referer( 'lmat_fetch_block_rules_nonce', 'lmat_fetch_block_rules_key', false ) ) {
			wp_send_json_error( array( 'message' => __( 'Invalid security token sent for block parsing rules.', 'linguator-multilingual-ai-translation' ) ) );
			exit;
		}

		$data = $this->page_translate_helper->block_parsing_rules();
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
}
