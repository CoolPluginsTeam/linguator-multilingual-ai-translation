<?php
/**
 * @package Linguator
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * A class to manage the copy and synchronization of term metas.
 *
 * @since 1.0.0
 */
class LMAT_Sync_Term_Metas extends LMAT_Sync_Metas {

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 *
	 * @param object $linguator The Linguator object.
	 */
	public function __construct( &$linguator ) {
		$this->meta_type = 'term';

		parent::__construct( $linguator );
	}
}
