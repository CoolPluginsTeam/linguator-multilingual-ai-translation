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
 * Handles translation features for a WordPress user. 
 * Think of this as a helper to check if someone can or can't translate stuff,
 * and to get information about what languages they can work with.
 *
 * @since 0.0.8
 */
class User {
	/**
	 * Stores the WordPress user object.
	 *
	 * @var WP_User
	 */
	private $user;

	/**
	 * Holds the language-specific translation permissions for this user, or null if not loaded yet.
	 *
	 * @var string[]|null
	 */
	private $language_caps;

	/**
	 * Creates a new instance of User.
	 * If you don't give a user, it will use the current logged-in user by default.
	 *
	 * @since 0.0.8
	 *
	 * @param WP_User|null $user Optionally pass in a WP_User object, or leave blank to use the current user.
	 */
	public function __construct( ?WP_User $user = null ) {
		if ( empty( $user ) ) {
			// If no user given, use the currently logged-in user
			$user = wp_get_current_user();
		}
		$this->user = $user;
	}

	/**
	 * Checks if the user is a translator for any language.
	 * Note: This will return true even if some of those languages have been removed.
	 * It's designed this way so a user's permissions don't suddenly change if a language disappears.
	 *
	 * @since 0.0.8
	 *
	 * @return bool True if the user has at least one translation permission, false otherwise.
	 */
	public function is_translator(): bool {
		return ! empty( $this->get_language_caps() );
	}

	/**
	 * Checks if this user can translate to a specific language.
	 *
	 * @since 0.0.8
	 *
	 * @param LMAT_Language $language The language you want to check.
	 * @return bool True if the user can translate to this language.
	 */
	public function can_translate( LMAT_Language $language ): bool {
		// If the user has no translator roles, allow by default.
		if ( ! $this->is_translator() ) {
			return true;
		}

		// Only allow if the user has permission to translate to this specific language.
		return $this->user->has_cap( "translate_{$language->slug}" );
	}

	/**
	 * Checks if the user has the specified WordPress capability.
	 * This is a wrapper around the standard has_cap().
	 *
	 * @since 0.0.8
	 *
	 * @param string $capability The capability to check.
	 * @param mixed  ...$args    Optional extra arguments (like object ID).
	 * @return bool True if the user has the capability.
	 */
	public function has_cap( $capability, ...$args ): bool {
		return $this->user->has_cap( $capability, ...$args );
	}

	/**
	 * Gets the user's preferred language slug.
	 * If the user can't translate anything, returns an empty string.
	 * Otherwise, takes the first language they can translate to (no preference order).
	 *
	 * @since 0.0.8
	 *
	 * @return string The preferred language code (slug), or '' if none found.
	 */
	public function get_preferred_language_slug(): string {
		$language_caps = $this->get_language_caps();

		if ( empty( $language_caps ) ) {
			// No language permissions found for this user
			return '';
		}

		// Use the first available translation capability as their preferred language
		$language_cap = reset( $language_caps );

		return str_replace( 'translate_', '', $language_cap );
	}

	/**
	 * Finds all translation capabilities this user has, for each language.
	 * Only gets capabilities like "translate_xx".
	 * Uses caching so it's not recalculated each call.
	 *
	 * @since 0.0.8
	 *
	 * @return array List of translation capabilities for this user.
	 */
	private function get_language_caps(): array {
		// Use cached result if already available
		if ( isset( $this->language_caps ) ) {
			return $this->language_caps;
		}

		// Find all capabilities that start with 'translate_' followed by a valid slug
		$this->language_caps = (array) preg_grep( '/^translate_' . Languages::INNER_SLUG_PATTERN . '$/', array_keys( $this->user->allcaps ) );

		return $this->language_caps;
	}

	/**
	 * Checks if the user is allowed to translate to a language.
	 * If not, stops everything and shows an error.
	 *
	 * @since 0.0.8
	 *
	 * @param LMAT_Language $language The language to check permissions for.
	 * @return void|never Stops execution with error if user can't translate, does nothing if they can.
	 */
	public function can_translate_or_die( LMAT_Language $language ): void {
		if ( ! $this->can_translate( $language ) ) {
			/* translators: %s: language name */
			// User is not allowed, so stop and show error message
			wp_die( esc_html( sprintf( __( 'You are not allowed to do action in %s.', 'linguator-multilingual-ai-translation' ), $language->name ) ) );
		}
	}
}
