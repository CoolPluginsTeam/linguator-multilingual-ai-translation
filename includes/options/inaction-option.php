<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Options;

use WP_Error;
use Linguator\Includes\Options\Options;

defined( 'ABSPATH' ) || exit;

/**
 * This class is a wrapper (decorator) for an option when Linguator is not active
 * on the current WordPress site. It prevents any changes to the setting and always
 * shows its default value. If someone tries to change the option, it simply adds an error.
 *
 * @since 0.0.8
 */
class Inactive_Option extends Abstract_Option {
	public const ERROR_CODE = 'linguator_not_active';

	/**
	 * The wrapped option object (the real option that we are disabling).
	 *
	 * @var Abstract_Option
	 */
	private $option;

	/**
	 * The key used for this inactive option (not a real option).
	 *
	 * @var string
	 *
	 * @phpstan-var non-falsy-string
	 */
	private static $key = 'not-an-option';

	/**
	 * Sets up a new Inactive_Option wrapper.
	 *
	 * @since 0.0.8
	 *
	 * @param Abstract_Option $option The original option we want to wrap and deactivate.
	 */
	public function __construct( Abstract_Option $option ) {
		$this->option = $option;
		$this->errors = new WP_Error();

		// Make sure there's no value stored for this option.
		// We want the option to look like it's empty or unused.
		$this->option->reset();
	}

	/**
	 * Gets the key for this inactive option (always returns 'not-an-option').
	 *
	 * @since 0.0.8
	 *
	 * @return string
	 *
	 * @phpstan-return non-falsy-string
	 */
	public static function key(): string {
		return self::$key;
	}

	/**
	 * Blocks setting a value on this option. Instead, it logs an error
	 * that Linguator is not active, so you can't change this setting.
	 *
	 * @since 0.0.8
	 *
	 * @param mixed   $value   The value that was attempted to be set (ignored).
	 * @param Options $options All options (ignored).
	 * @return bool Always false since you cannot set a value.
	 */
	public function set( $value, Options $options ): bool { // phpcs:ignore VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable
		// Only add the error once, not every time someone tries to set a value
		if ( ! in_array( self::ERROR_CODE, $this->errors->get_error_codes(), true ) ) {
			$this->errors->add(
				self::ERROR_CODE,
				esc_html( sprintf( 
					// translators: %s is a blog ID.
					__( 'Linguator is not active on site %s.', 'linguator-multilingual-ai-translation' ),
					(int) get_current_blog_id()
				) )
			);
		}
		return false;
	}

	/**
	 * Always returns the value of the original option (usually its default value).
	 * This ensures the setting never actually changes while Linguator is inactive.
	 *
	 * @since 0.0.8
	 *
	 * @return mixed
	 */
	public function get() {
		return $this->option->get();
	}

	/**
	 * Returns the default value for this inactive option.
	 * Simply delegates to the original option's default.
	 *
	 * @since 0.0.8
	 *
	 * @return mixed
	 */
	protected function get_default() {
		return $this->option->get();
	}

	/**
	 * This method isn't used for inactive options but must be provided
	 * because it's required by the base class.
	 *
	 * @since 0.0.8
	 *
	 * @return array Will always be an empty array for inactive options.
	 */
	protected function get_data_structure(): array {
		return array();
	}

	/**
	 * Returns an empty schema since inactive options have no editable values.
	 *
	 * @since 0.0.8
	 *
	 * @return array Always an empty array.
	 */
	public function get_schema(): array {
		return array();
	}

	/**
	 * This method isn't used, but is needed for the abstract base class.
	 * No description for inactive options.
	 *
	 * @since 0.0.8
	 *
	 * @return string An empty string.
	 */
	protected function get_description(): string {
		return '';
	}
}
