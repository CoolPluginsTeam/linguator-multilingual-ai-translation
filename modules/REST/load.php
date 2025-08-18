<?php
/**
 * @package Linguator
 */

namespace Linguator\Modules\REST;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

require_once __DIR__ . '/API.php';
require_once __DIR__ . '/Abstract_Controller.php';
require_once __DIR__ . '/V1/Languages.php';
require_once __DIR__ . '/V1/Settings.php';

add_action(
	'lmat_init',
	function ( $linguator ) {
		$linguator->rest = new API( $linguator->model );
		add_action( 'rest_api_init', array( $linguator->rest, 'init' ) );
	}
);
