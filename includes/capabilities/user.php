<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Capabilities;

use WP_User;
use Linguator\Includes\Other\LMAT_Language;
use Linguator\Includes\Models\Languages;

defined( 'ABSPATH' ) || exit;

/**
 * A class wrapping `WP_User` with translation management feature.
 *
 * @since 3.8
 */
class User {
	/**
	 * @var WP_User
	 */
	private $user;

	/**
	 * @var string[]|null
	 */
	private $language_caps;

	/**
	 * Constructor.
	 *
	 * @since 3.8
	 *
	 * @param WP_User|null $user Optional. An instance of `WP_User`.
	 */
	public function __construct( ?WP_User $user = null ) {
		if ( empty( $user ) ) {
			$user = wp_get_current_user();
		}
		$this->user = $user;
	}

	/**
	 * Tells if the user is a translator (has a translator capability).
	 * Note: returns `true` if the user has a capability for a language that doesn't exist anymore. This is intentional,
	 * to prevent the user to suddenly have the rights to translate in all languages while it wasn't allowed until then.
	 *
	 * @since 3.8
	 *
	 * @return bool
	 */
	public function is_translator(): bool {
		return ! empty( $this->get_language_caps() );
	}

	/**
	 * Tells if the user can translate to the given language.
	 *
	 * @since 3.8
	 *
	 * @param LMAT_Language $language A language object.
	 * @return bool
	 */
	public function can_translate( LMAT_Language $language ): bool {
		if ( ! $this->is_translator() ) {
			return true;
		}

		return $this->user->has_cap( "translate_{$language->slug}" );
	}

	/**
	 * Tells if the user has the specified capability.
	 *
	 * @since 3.8
	 *
	 * @param string $capability Capability name.
	 * @param mixed  ...$args    Optional further parameters, typically starting with an object ID.
	 * @return bool
	 */
	public function has_cap( $capability, ...$args ): bool {
		return $this->user->has_cap( $capability, ...$args );
	}

	/**
	 * Returns the preferred language of the user.
	 *
	 * @since 3.8
	 *
	 * @return string The preferred language slug, empty string if no preferred language is found.
	 */
	public function get_preferred_language_slug(): string {
		$language_caps = $this->get_language_caps();

		if ( empty( $language_caps ) ) {
			return '';
		}

		// Arbitrarily use the first language cap.
		$language_cap = reset( $language_caps );

		return str_replace( 'translate_', '', $language_cap );
	}

	/**
	 * Returns the language capabilities of the user.
	 *
	 * @since 3.8
	 *
	 * @return array
	 */
	private function get_language_caps(): array {
		if ( isset( $this->language_caps ) ) {
			return $this->language_caps;
		}

		$this->language_caps = (array) preg_grep( '/^translate_' . Languages::INNER_SLUG_PATTERN . '$/', array_keys( $this->user->allcaps ) );

		return $this->language_caps;
	}

	/**
	 * Checks if the current user has the rights to assign a language to an object and dies if not.
	 *
	 * @since 3.8
	 *
	 * @param LMAT_Language $language The language to assign.
	 * @return void|never Dies if the user does not have the rights, does nothing otherwise.
	 */
	public function can_translate_or_die( LMAT_Language $language ): void {
		if ( ! $this->can_translate( $language ) ) {
			/* translators: %s: language name */
			wp_die( esc_html( sprintf( __( 'You are not allowed to do action in %s.', 'linguator-multilingual-ai-translation' ), $language->name ) ) );
		}
	}
}
