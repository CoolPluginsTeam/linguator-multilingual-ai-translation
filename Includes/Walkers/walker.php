<?php
namespace Linguator\Includes\Walkers;


if ( ! defined( 'ABSPATH' ) ) {
    exit;
}


use Walker;
use Linguator\Includes\Other\LMAT_Language;



/**
 * @package Linguator
 */
/**
 * A class for displaying various tree-like language structures.
 *
 * Extend the `LMAT_Walker` class to use it, and implement some of the methods from `Walker`.
 * See: {https://developer.wordpress.org/reference/classes/walker/#methods}.
 *
 * @since 1.0.0
 */
class LMAT_Walker extends Walker {
	/**
	 * Database fields to use.
	 *
	 * @see https://developer.wordpress.org/reference/classes/walker/#properties Walker::$db_fields.
	 *
	 * @var string[]
	 */
	public $db_fields = array( 'parent' => 'parent', 'id' => 'id' );

	/**
	 * Overrides Walker::display_element as it expects an object with a parent property.
	 *
	 *
	 * @param LMAT_Language|stdClass $element           Data object. `LMAT_language` in our case.
	 * @param array                 $children_elements List of elements to continue traversing.
	 * @param int                   $max_depth         Max depth to traverse.
	 * @param int                   $depth             Depth of current element.
	 * @param array                 $args              An array of arguments.
	 * @param string                $output            Passed by reference. Used to append additional content.
	 * @return void
	 */
	public function display_element( $element, &$children_elements, $max_depth, $depth, $args, &$output ) {
		if ( $element instanceof LMAT_Language ) {
			$element = $element->to_std_class();

			// Sets the w3c locale as the main locale.
			$element->locale = $element->w3c ?? $element->locale;
		}

		$element->parent = $element->id = 0; // Don't care about this.

		parent::display_element( $element, $children_elements, $max_depth, $depth, $args, $output );
	}

	/**
	 * Sets `LMAT_Walker::walk()` arguments as it should
	 * and triggers an error in case of misuse of them.
	 *
	 * @since 1.0.0
	 *
	 * @param array|int $max_depth The maximum hierarchical depth. Passed by reference.
	 * @param array     $args      Additional arguments. Passed by reference.
	 * @return void
	 */
	protected function maybe_fix_walk_args( &$max_depth, &$args ) {
		if ( ! is_array( $max_depth ) ) {
			$args = $args[0] ?? array();
			return;
		}
	}
}
