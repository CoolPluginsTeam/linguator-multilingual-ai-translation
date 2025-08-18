<?php
/**
 * Loads the integration with Duplicate Post.
 *
 * @package Linguator
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Don't access directly.
}

require_once __DIR__ . '/duplicate-post.php';

use Linguator\Integrations\duplicate_post\LMAT_Duplicate_Post;
use Linguator\Integrations\LMAT_Integrations;

add_action(
	'plugins_loaded',
	function () {
		if ( defined( 'DUPLICATE_POST_CURRENT_VERSION' ) ) {
			LMAT_Integrations::instance()->duplicate_post = new LMAT_Duplicate_Post();
			LMAT_Integrations::instance()->duplicate_post->init();
		}
	},
	0
);
