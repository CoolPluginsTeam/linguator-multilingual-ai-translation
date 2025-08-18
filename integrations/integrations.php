<?php
/**
 * @package Linguator
 */
namespace Linguator\Integrations;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
use Linguator\Includes\Core\Linguator;



/**
 * Container for 3rd party plugins ( and themes ) integrations.
 * This class is available as soon as the plugin is loaded.
 *
 * @since 1.0.0
 * @since 1.0.0 Renamed from LMAT_Plugins_Compat to LMAT_Integrations.
 */
#[AllowDynamicProperties]
class LMAT_Integrations {
	/**
	 * Singleton instance.
	 *
	 * @var LMAT_Integrations|null
	 */
	protected static $instance = null;

	// Integration properties
	/**
	 * @var mixed
	 */
	public $aq_resizer;

	/**
	 * @var mixed
	 */
	public $dm;

	/**
	 * @var mixed
	 */
	public $jetpack;

	/**
	 * @var mixed
	 */
	public $featured_content;

	/**
	 * @var mixed
	 */
	public $no_category_base;

	/**
	 * @var mixed
	 */
	public $twenty_seventeen;

	/**
	 * @var mixed
	 */
	public $wp_importer;

	/**
	 * @var mixed
	 */
	public $yarpp;

	/**
	 * @var mixed
	 */
	public $wpseo;

	/**
	 * @var mixed
	 */
	public $wp_sweep;

	/**
	 * @var mixed
	 */
	public $as3cf;

	/**
	 * @var mixed
	 */
	public $duplicate_post;

	/**
	 * @var mixed
	 */
	public $cft;

	/**
	 * @var mixed
	 */
	public $cache_compat;

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	protected function __construct() {}

	/**
	 * Returns the single instance of the class.
	 *
	 * @since 1.0.0
	 *
	 * @return self
	 */
	public static function instance(): self {
		if ( null === self::$instance ) {
			self::$instance = new self();
			self::$instance->init();
		}

		return self::$instance;
	}

	/**
	 * Requires integrations.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	protected function init(): void {
		// Loads external integrations.
		foreach ( glob( __DIR__ . '/*/load.php', GLOB_NOSORT ) as $load_script ) { // phpcs:ignore VariableAnalysis.CodeAnalysis.VariableAnalysis.UndefinedVariable
			require_once $load_script; // phpcs:ignore WordPressVIPMinimum.Files.IncludingFile.UsingVariable
		}
	}
}

class_alias( 'Linguator\Integrations\LMAT_Integrations', 'LMAT_Integrations' ); // For global access.
