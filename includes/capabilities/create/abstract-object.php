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
 * Class to manage the language context for posts creation or update.
 *
 */
abstract class Abstract_Object {
	/**
	 * @var LMAT_Model
	 */
	protected $model;

	/**
	 * @var LMAT_Language|null
	 */
	protected $pref_lang;

	/**
	 * @var LMAT_Language|null
	 */
	protected $curlang;

	/**
	 * @var Request
	 */
	protected $request;

	/**
	 * Constructor.
	 *
	 *
	 * @param LMAT_Model         $model     The model instance.
	 * @param Request           $request   The request instance.
	 * @param LMAT_Language|null $pref_lang The preferred language.
	 * @param LMAT_Language|null $curlang   The current language.
	 */
	public function __construct( LMAT_Model $model, Request $request, ?LMAT_Language $pref_lang, ?LMAT_Language $curlang ) {
		$this->model     = $model;
		$this->request   = $request;
		$this->pref_lang = $pref_lang;
		$this->curlang   = $curlang;
	}

	/**
	 * Returns the language to set for an object creation or update based on the global context.
	 *
	 *
	 * @param User    $user The user object.
	 * @param integer $id   The object ID.
	 * @return LMAT_Language The language defined from the global context.
	 */
	abstract public function get_language( User $user, int $id = 0 ): LMAT_Language;
}
