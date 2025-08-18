<?php
/**
 * @package Linguator
 */
namespace Linguator\Integrations\wpseo;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
use Yoast\WP\SEO\Presenters\Abstract_Indexable_Presenter;


/**
 * Creates an Opengraph alternate locale meta tag to be consumed by Yoast SEO
 * Requires Yoast SEO 14.0 or newer.
 *
 * @since 1.0.0
 */
final class LMAT_WPSEO_OGP extends Abstract_Indexable_Presenter {
	/**
	 * Facebook locale
	 *
	 * @var string $locale
	 */
	private $locale;

	/**
	 * Constructor
	 *
	 * @since 1.0.0
	 *
	 * @param string $locale Facebook locale.
	 */
	public function __construct( $locale ) {
		$this->locale = $locale;
	}

	/**
	 * Returns the meta Opengraph alternate locale meta tag
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function present() {
		return sprintf( '<meta property="og:locale:alternate" content="%s" />', esc_attr( $this->get() ) );
	}

	/**
	 * Returns the alternate locale
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get() {
		return $this->locale;
	}
}
