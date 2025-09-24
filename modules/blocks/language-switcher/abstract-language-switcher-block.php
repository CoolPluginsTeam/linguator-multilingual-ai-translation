<?php
/**
 * @package Linguator
 */

namespace Linguator\Modules\Blocks;

/**
 * Abstract class for language switcher block.
 *
 */
abstract class LMAT_Abstract_Language_Switcher_Block {
	/**
	 * @var LMAT_Links
	 */
	protected $links;

	/**
	 * @var LMAT_Model
	 */
	protected $model;

	/**
	 * Current lang to render the language switcher block in an admin context.
	 *
	 *
	 * @var string|null
	 */
	protected $admin_current_lang;

	/**
	 * Is it the edit context?
	 *
	 * @var bool
	 */
	protected $is_edit_context = false;

	/**
	 * Constructor
	 *
	 *
	 * @param LMAT_Base $linguator Linguator object.
	 */
	public function __construct( &$linguator ) {
		$this->model = &$linguator->model;
		$this->links = &$linguator->links;
	}

	/**
	 * Adds the required hooks.
	 *
	 *
	 * @return self
	 */
	public function init() {
		// Use rest_pre_dispatch_filter to get additional parameters for language switcher block.
		add_filter( 'rest_pre_dispatch', array( $this, 'get_rest_query_params' ), 10, 3 );

		// Register language switcher block.
		add_action( 'init', array( $this, 'register' ) );

		return $this;
	}

	/**
	 * Returns the block name with the Linguator's namespace.
	 *
	 *
	 * @return string The block name.
	 */
	abstract protected function get_block_name();

	/**
	 * Renders the Linguator's block on server.
	 *
	 *  Accepts two new parameters, $content and $block.
	 *
	 * @param array    $attributes The block attributes.
	 * @param string   $content    The saved content.
	 * @param \WP_Block $block      The parsed block.
	 * @return string The HTML string output to serve.
	 */
	abstract public function render( $attributes, $content, $block );

	/**
	 * Returns the supported pieces of inherited context for the block, by default none are supported..
	 *
	 * @return array An array with context subject, default to empty.
	 */
	protected function get_context() {
		return array();
	}

	/**
	 * Registers the Linguator's block.
	 *
	 *  Renamed and now handle any type of block registration based on a dynamic name.
	 *
	 * @return void
	 */
	public function register() {
		if ( \WP_Block_Type_Registry::get_instance()->is_registered( $this->get_block_name() ) ) {
		
			// Don't register a block more than once or WordPress send an error. See https://github.com/WordPress/wordpress-develop/blob/5.9/src/wp-includes/class-wp-block-type-registry.php#L82-L90
			return;
		}

		$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

		// Build output lives under admin/assets/js/build per webpack config
		$script_filename = 'admin/assets/js/build/blocks' . $suffix . '.js';
		$script_handle = 'lmat_blocks';
		wp_register_script(
			$script_handle,
			plugins_url( $script_filename, LINGUATOR_ROOT_FILE ),
			array(
				'wp-block-editor',
				'wp-blocks',
				'wp-components',
				'wp-element',
				'wp-i18n',
				'wp-hooks',
				'wp-server-side-render',
				'lodash',
			),
			LINGUATOR_VERSION,
			true
		);

		wp_localize_script( $script_handle, 'lmat_block_editor_blocks_settings', \Linguator\Includes\Controllers\LMAT_Switcher::get_switcher_options( 'block', 'string' ) );

		// Ensure the block editor script is enqueued in the editor context
		add_action( 'enqueue_block_editor_assets', function() use ( $script_handle, $script_filename ) {
			
			if ( ! wp_script_is( $script_handle, 'enqueued' ) ) {
				wp_enqueue_script( $script_handle );
			}
		}, 20 );

		$attributes = array(
			'className' => array(
				'type'    => 'string',
				'default' => '',
			),
			'lmatLang' => array(
				'type'    => 'string',
				'default' => '',
			),
		);
		foreach ( \Linguator\Includes\Controllers\LMAT_Switcher::get_switcher_options( 'block', 'default' ) as $option => $default ) {
			$attributes[ $option ] = array(
				'type'    => 'boolean',
				'default' => $default,
			);
		}

		
		$block_registration = register_block_type(
			$this->get_block_name(),
			array(
				'editor_script'   => $script_handle,
				'attributes'      => $attributes,
				'render_callback' => array( $this, 'render' ),
				'uses_context'    => $this->get_context(),
			)
		);
		

		// Translated strings used in JS code
		wp_set_script_translations( $script_handle, 'linguator-multilingual-ai-translation' );
	}

	/**
	 * Returns the REST parameters for language switcher block.
	 * Used to store the request's language and context locally.
	 * Previously was in the `LMAT_Block_Editor_Switcher_Block` class.
	 *
	 * @see WP_REST_Server::dispatch()
	 *
	 *
	 * @param mixed           $result  Response to replace the requested version with. Can be anything
	 *                                 a normal endpoint can return, or null to not hijack the request.
	 * @param \WP_REST_Server  $server  Server instance.
	 * @param \WP_REST_Request $request Request used to generate the response.
	 * @return mixed
	 * @template T of WP_REST_Request
	 * @phpstan-param T $request
	 */
	public function get_rest_query_params( $result, $server, $request ) {
		if ( lmat_is_edit_rest_request( $request ) ) {
			$this->is_edit_context = true;

			$lang = $request->get_param( 'lang' );
			if ( is_string( $lang ) && ! empty( $lang ) ) {
				$this->admin_current_lang = $lang;
			}
		}
		return $result;
	}

	/**
	 * Adds the attributes to render the block correctly.
	 * Also specifies not to echo the switcher in any case.
	 *
	 *
	 * @param array $attributes The attributes of the currently rendered block.
	 * @return array The modified attributes.
	 */
	protected function set_attributes_for_block( $attributes ) {
		$attributes['echo'] = 0;
		if ( $this->is_edit_context ) {
			$attributes['admin_render']           = 1;
			$attributes['admin_current_lang']     = $this->admin_current_lang;
			$attributes['hide_if_empty']          = 0;
			$attributes['hide_if_no_translation'] = 0; // Force not to hide the language for the block preview even if the option is checked.
		}
		return $attributes;
	}
}
