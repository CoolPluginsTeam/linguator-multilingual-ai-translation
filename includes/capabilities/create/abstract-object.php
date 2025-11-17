<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Capabilities\Create;

use Linguator\Includes\Other\LMAT_Model;
use Linguator\Includes\Other\LMAT_Language;
use Linguator\Modules\REST\Request;
use Linguator\Includes\Capabilities\User;

/**
 * Abstract class for helping choose the right language when creating or updating an object
 * (like a post or term) in Linguator.
 *
 * This class provides the common properties and method signature.
 * Child classes decide how to pick the language.
 */
abstract class Abstract_Object {
	/**
	 * Main model instance. Used to access language data and helpers.
	 *
	 * @var LMAT_Model
	 */
	protected $model;

	/**
	 * User's preferred language, if available.
	 * This is usually chosen in the admin area.
	 *
	 * @var LMAT_Language|null
	 */
	protected $pref_lang;

	/**
	 * Current language in use on the site, or the "active" language.
	 * Can come from frontend or admin filters.
	 *
	 * @var LMAT_Language|null
	 */
	protected $curlang;

	/**
	 * Request object that might contain language info (such as for REST API requests).
	 *
	 * @var Request
	 */
	protected $request;

	/**
	 * Set up the object and store the main properties.
	 *
	 * @param LMAT_Model         $model     Main model, used for lookups and helpers.
	 * @param Request            $request   The current request, may have language info.
	 * @param LMAT_Language|null $pref_lang The preferred language of the user (if set).
	 * @param LMAT_Language|null $curlang   The currently active language (if any).
	 */
	public function __construct( LMAT_Model $model, Request $request, ?LMAT_Language $pref_lang, ?LMAT_Language $curlang ) {
		$this->model     = $model;   // Model gives access to language utilities.
		$this->request   = $request; // Holds request data (can include language).
		$this->pref_lang = $pref_lang; // User's preferred language, or null.
		$this->curlang   = $curlang;   // Current language detected, or null.
	}

	/**
	 * Decide which language should be set for this object (post, term, etc).
	 *
	 * The actual logic for choosing the right language is implemented in child classes.
	 *
	 * @param User    $user The user creating or updating the object.
	 * @param int     $id   The object's ID (usually 0 when creating new).
	 *
	 * @return LMAT_Language The language to assign.
	 */
	abstract public function get_language( User $user, int $id = 0 ): LMAT_Language;
}
