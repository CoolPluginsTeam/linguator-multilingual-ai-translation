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
 *  
 */
class Linguator_Sync_Term_Metas extends Linguator_Sync_Metas {

	/**
	 * Constructor.
	 *
	 *  
	 *
	 * @param object $linguator The Linguator object.
	 */
	public function __construct( &$linguator ) {
		$this->meta_type = 'term';

		parent::__construct( $linguator );
	}
}

