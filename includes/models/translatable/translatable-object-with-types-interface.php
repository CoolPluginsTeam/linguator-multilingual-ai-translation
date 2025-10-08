<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Models\Translatable;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Interface to use for objects that can have one or more types.
 *
 *  
 *
 * @phpstan-type DBInfoWithType array{
 *     table: non-empty-string,
 *     id_column: non-empty-string,
 *     type_column: non-empty-string,
 *     default_alias: non-empty-string
 * }
 */
interface LMAT_Translatable_Object_With_Types_Interface {

	/**
	 * Returns object types that need to be translated.
	 *
	 *  
	 *
	 * @param bool $filter True if we should return only valid registered object types.
	 * @return string[] Object type names for which Linguator manages languages.
	 *
	 * @phpstan-return array<non-empty-string, non-empty-string>
	 */
	public function get_translated_object_types( $filter = true );

	/**
	 * Returns true if Linguator manages languages for this object type.
	 *
	 *  
	 *
	 * @param string|string[] $object_type Object type name or array of object type names.
	 * @return bool
	 *
	 * @phpstan-param non-empty-string|non-empty-string[] $object_type
	 */
	public function is_translated_object_type( $object_type );
}
