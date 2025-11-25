<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Capabilities\Create;

use Linguator\Includes\Other\LMAT_Language;
use Linguator\Includes\Capabilities\User;

/**
 * Helps choose the right language for creating or updating posts.
 *
 * This class will check several possible sources, in a specific order, to pick the most suitable language.
 * The checks go from the most direct user input to system defaults. It makes sure the post gets the best language setting.
 *
 * How it picks the language, step by step:
 * 1. If the user picks a language in the admin, use that.
 * 2. If there is a 'lang' parameter in the request (for example, on the frontend), use it.
 * 3. If this is a REST API request, use the language from the REST request.
 * 4. If the post has a parent and the parent already has a language set, use the parent’s language.
 * 5. If the user has a preferred language and can translate into it (normally in the admin), use it.
 * 6. If there is a current language set on the frontend, use it.
 * 7. If the user is a translator: use the default language if allowed, otherwise use the user’s own preferred language.
 * 8. If nothing else fits, use the default language.
 *
 * @since 0.0.8
 */
class Post extends Abstract_Object {
	/**
	 * Choose which language to set for a post when creating or updating it.
	 *
	 * Goes through multiple checks to find the best option, starting from user choices, then request values,
	 * parent post language, user preferences, and finally falls back to the system's default.
	 *
	 * @since 0.0.8
	 *
	 * @param User $user The user doing the action.
	 * @param int  $id   The post ID (0 for new posts).
	 * @return LMAT_Language The selected language to assign to the post.
	 */
	public function get_language( User $user, int $id = 0 ): LMAT_Language {
		/** Get the default language from the system as a final fallback. */
		$default_language = $this->model->get_default_language();

		// 1. If a language is directly picked in admin (in GET['new_lang']), use it.
		if ( ! empty( $_GET['new_lang'] ) && $lang = $this->model->get_language( sanitize_key( $_GET['new_lang'] ) ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			return $lang;
		}
		// 2. If there’s no preferred language but 'lang' is present (commonly on frontend), use that.
		if ( ! isset( $this->pref_lang ) && ! empty( $_REQUEST['lang'] ) && $lang = $this->model->get_language( sanitize_key( $_REQUEST['lang'] ) ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			return $lang;
		}
		// 3. If this is a REST API request and the request has a language, use it.
		if ( $this->request && $lang = $this->request->get_language() ) {
			return $lang;
		}
		// 4. If the current post has a parent and the parent has a language, use the parent's language.
		if ( ( $parent_id = wp_get_post_parent_id( $id ) ) && $parent_lang = $this->model->post->get_language( $parent_id ) ) {
			return $parent_lang;
		}
		// 5. If there's a preferred language and the user can translate into it (most often in admin), use that language.
		if ( isset( $this->pref_lang ) && $user->can_translate( $this->pref_lang ) ) {
			return $this->pref_lang;
		}
		// 6. If there’s a current language (usually set on the frontend), use it.
		if ( ! empty( $this->curlang ) ) {
			return $this->curlang;
		}
		// 7. If the user is a translator, use default language if possible, otherwise use their preferred one.
		if ( $user->is_translator() ) {
			// a) Use the default language if the user can translate into it.
			if ( $user->can_translate( $default_language ) ) {
				return $default_language;
			}
			// b) Or try the user's preferred language (from their settings).
			$preferred_language = $this->model->get_language( $user->get_preferred_language_slug() );
			if ( $preferred_language ) {
				return $preferred_language;
			}
		}

		// 8. If none of the above fit, just use the system's default language as a last resort.
		return $default_language;
	}
}
