<?php
/**
 * Loads the integration with Twenty Seventeen.
 *
 * @package Linguator
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Don't access directly.
}

require_once __DIR__ . '/twenty-seven-teen.php';

use Linguator\Integrations\twenty_seventeen\Linguator_Twenty_Seventeen;
use Linguator\Integrations\Linguator_Integrations;

add_action( 'init', array( Linguator_Integrations::instance()->twenty_seventeen = new Linguator_Twenty_Seventeen(), 'init' ) );
