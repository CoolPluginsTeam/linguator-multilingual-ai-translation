<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Capabilities\Create;

use Linguator\Includes\Other\LMAT_Language;
use Linguator\Includes\Capabilities\User;

/**
 * This class helps pick which language should be used when creating or updating a taxonomy term.
 *
 * When a new term is created or updated, several different options are checked (in order) to pick the right language.
 * The checks are done from most specific (what the user picked directly) to fallback (the system's default).
 *
 * Here’s how the language is chosen, step by step:
 * 1. If a language is picked (for example, in the admin screen or a POST request), use that.
 * 2. If there's a general 'lang' parameter (when no preferred language is set), use that—often on the frontend.
 * 3. If this is a REST API request, use the language from the REST request.
 * 4. If the term being edited has a parent term with a language set, use the parent’s language.
 * 5. In admin: if a preferred language is set and the user can translate into it, use it.
 * 6. On the frontend: if a current language exists (curlang), use that.
 * 7. If the user is a translator: use the default language (if allowed), or the user's preferred language.
 * 8. If nothing else fits, just use the system’s default language.
 *
 * @since 0.0.8
 */
class Term extends Abstract_Object {
	/**
	 * Picks the language to use for a term when creating or updating.
	 *
	 * Checks each possible source in order, from most direct to least specific, and returns the first match.
	 *
	 * @since 0.0.8
	 *
	 * @param User   $user     The user creating or editing the term.
	 * @param int    $id       The term’s ID (usually 0 for new).
	 * @param string $taxonomy The taxonomy’s name (optional).
	 *
	 * @return LMAT_Language   The chosen language for this term.
	 */
	public function get_language( User $user, int $id = 0, string $taxonomy = '' ): LMAT_Language {
		/** The default language as a fallback. */
		$default_language = $this->model->get_default_language();

		// 1. If 'new_lang' is set in GET (admin interface), use it.
		if ( ! empty( $_GET['new_lang'] ) && $lang = $this->model->get_language( sanitize_key( $_GET['new_lang'] ) ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			return $lang;
		}
		// 1. If posted term_lang_choice is set, use it.
		if ( ! empty( $_POST['term_lang_choice'] ) && is_string( $_POST['term_lang_choice'] ) && $lang = $this->model->get_language( sanitize_key( $_POST['term_lang_choice'] ) ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			return $lang;
		}
		// 1. If posted inline_lang_choice is set, use it.
		if ( ! empty( $_POST['inline_lang_choice'] ) && is_string( $_POST['inline_lang_choice'] ) && $lang = $this->model->get_language( sanitize_key( $_POST['inline_lang_choice'] ) ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			return $lang;
		}
		// 2. If no preferred language, but 'lang' exists in the request (often frontend), use that.
		if ( ! isset( $this->pref_lang ) && ! empty( $_REQUEST['lang'] ) && $lang = $this->model->get_language( sanitize_key( $_REQUEST['lang'] ) ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			return $lang;
		}
		// 3. If this is a REST request, use its language.
		if ( $this->request && $lang = $this->request->get_language() ) {
			return $lang;
		}
		// 4. If the term has a parent, and the parent has a language, use that.
		if ( ( $term = get_term( $id, $taxonomy ) ) && ! empty( $term->parent ) && $parent_lang = $this->model->term->get_language( $term->parent ) ) {
			return $parent_lang;
		}
		// 5. If there is a preferred language and user can translate into it (admin), use it.
		if ( isset( $this->pref_lang ) && $user->can_translate( $this->pref_lang ) ) {
			return $this->pref_lang;
		}
		// 6. If there is a current language (usually on frontend), use it.
		if ( ! empty( $this->curlang ) ) {
			return $this->curlang;
		}
		// 7. If the user is a translator:
		if ( $user->is_translator() ) {
			// Try the default language first.
			if ( $user->can_translate( $default_language ) ) {
				return $default_language;
			}
			// Or use the user's own preferred language.
			$preferred_language = $this->model->get_language( $user->get_preferred_language_slug() );
			if ( $preferred_language ) {
				return $preferred_language;
			}
		}

		// 8. Fallback: use default language as a last resort.
		return $default_language;
	}
}
