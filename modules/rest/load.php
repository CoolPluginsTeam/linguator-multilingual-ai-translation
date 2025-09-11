<?php
/**
 * @package Linguator
 */

namespace Linguator\Modules\REST;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

require_once __DIR__ . '/api.php';
require_once __DIR__ . '/abstract-controller.php';
require_once __DIR__ . '/v1/languages.php';
require_once __DIR__ . '/v1/settings.php';

add_action(
	'lmat_init',
	function ( $linguator ) {
		$linguator->rest = new API( $linguator->model );
		add_action( 'rest_api_init', array( $linguator->rest, 'init' ) );
	}
);
