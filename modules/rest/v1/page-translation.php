<?php

namespace Linguator\Modules\REST\V1;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Page_Translation' ) ) :
	/**
	 * Registers page translation specific AI batch route.
	 */
	class Page_Translation extends Bulk_Translation {

		/**
		 * REST namespace.
		 *
		 * @var string
		 */
		private $namespace;

		/**
		 * REST base for page translation.
		 *
		 * @var string
		 */
		private $rest_base;

		/**
		 * Constructor.
		 *
		 * @param mixed $model Model instance (kept for parity with other REST controllers).
		 */
		public function __construct( $model ) {
			$this->namespace = 'lmat/v1';
			$this->rest_base = 'page-translate';
			parent::__construct( $model );
		}

		/**
		 * Register routes.
		 *
		 * @return void
		 */
		public function register_routes(): void {
			register_rest_route(
				$this->namespace,
				'/' . $this->rest_base . '/ai-translate-batch',
				array(
					'methods'             => 'POST',
					'callback'            => array( $this, 'ai_translate_batch' ),
					'permission_callback' => array( $this, 'ai_translate_batch_permissions_check' ),
				)
			);
		}

		/**
		 * Page translation AI batch permission callback.
		 *
		 * Kept in this controller so page translation does not depend on
		 * callback resolution from another REST controller class.
		 *
		 * @param \WP_REST_Request $request Request.
		 * @return true|\WP_Error
		 */
		public function ai_translate_batch_permissions_check( $request ) {
			return parent::ai_translate_batch_permissions_check( $request );
		}

		/**
		 * Page translation AI batch callback.
		 *
		 * Uses shared translation logic from the base REST implementation.
		 *
		 * @param \WP_REST_Request $request Request.
		 * @return \WP_REST_Response|\WP_Error
		 */
		public function ai_translate_batch( $request ) {
			return parent::ai_translate_batch( $request );
		}
	}
endif;
