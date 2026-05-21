<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * @package Linguator
 *
 * Provides utility functions for safely handling Linguator constants.
 * These functions make it easier to check, get, and define constants.
 */

/**
 * Checks whether a given constant is defined.
 *
 * @param string $constant_name Name of the constant to check.
 * @return bool True if the constant is defined, false otherwise.
 *
 * @phpstan-param non-falsy-string $constant_name
 */
function linguator_has_constant( string $constant_name ): bool {
	return defined( $constant_name ); // phpcs:ignore WordPressVIPMinimum.Constants.ConstantString.NotCheckingConstantName
}

/**
 * Retrieves the value of a constant if it is defined,
 * or returns a default value if it is not.
 *
 * @param string $constant_name Name of the constant to get.
 * @param mixed  $default       Optional. Value to return if the constant is not defined. Defaults to null.
 * @return mixed The value of the constant if defined, otherwise $default.
 *
 * @phpstan-template D of int|float|string|bool|array|null
 * @phpstan-param non-falsy-string $constant_name
 * @phpstan-param D $default
 * @phpstan-return D
 */
function linguator_get_constant( string $constant_name, $default = null ) {
	if ( ! linguator_has_constant( $constant_name ) ) {
		return $default;
	}

	/** @phpstan-var D $return */
	$return = constant( $constant_name );
	return $return;
}

/**
 * Defines a constant, but only if it is not already defined.
 *
 * @param string $constant_name Name of the constant to define.
 * @param mixed  $value         Value to assign to the constant.
 * @return bool True on successful definition, false if already defined.
 *
 * @phpstan-param non-falsy-string $constant_name
 * @phpstan-param int|float|string|bool|array|null $value
 */
function linguator_set_constant( string $constant_name, $value ): bool {
	if ( linguator_has_constant( $constant_name ) ) {
		return false;
	}

	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.VariableConstantNameFound, WordPress.NamingConventions.PrefixAllGlobals.VariableConstantNameFound, WordPress.NamingConventions.PrefixAllGlobals.VariableConstantNameFound
	return define( $constant_name, $value ); 
}
