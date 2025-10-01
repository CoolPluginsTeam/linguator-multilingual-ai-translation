<?php
/**
 * Language Condition for Elementor Display Conditions
 *
 * @package Linguator
 */

namespace Linguator\Integrations\elementor;

use ElementorPro\Modules\ThemeBuilder\Classes\Conditions_Manager;
use ElementorPro\Modules\ThemeBuilder\Conditions\Condition_Base;

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Language_Condition
 *
 * Custom condition for Elementor to display templates based on current language.
 */
class Language_Condition extends Condition_Base {

	/**
	 * Get the name of the condition
	 *
	 * @return string
	 */
	public static function get_type() {
		return 'singular';
	}

	/**
	 * Get the name identifier
	 *
	 * @return string
	 */
	public function get_name() {
		return 'language';
	}

	/**
	 * Get the label for the condition
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Language', 'linguator-multilingual-ai-translation' );
	}

	/**
	 * Get all available languages as options
	 *
	 * @return string
	 */
	public function get_all_label() {
		return esc_html__( 'All Languages', 'linguator-multilingual-ai-translation' );
	}

	/**
	 * Check if the condition is met
	 *
	 * @param array $args Condition arguments.
	 * @return bool
	 */
	public function check( $args ) {
		// Get the current language
		$current_language = lmat_current_language();
		
		if ( empty( $current_language ) ) {
			$current_language = lmat_default_language();
		}

		// Get the condition value (selected language)
		$condition_language = isset( $args['id'] ) ? $args['id'] : '';

		// If "All Languages" is selected or no specific language, always return true
		if ( empty( $condition_language ) || 'all' === $condition_language ) {
			return true;
		}

		// Check if current language matches the condition
		return strtolower( $current_language ) === strtolower( $condition_language );
	}

	/**
	 * Register sub-conditions (languages)
	 *
	 * @return void
	 */
	public function register_sub_conditions() {
		// Get all languages
		$languages = lmat_languages_list( [ 'fields' => '' ] );

		if ( empty( $languages ) ) {
			return;
		}

		// Register each language as a sub-condition
		foreach ( $languages as $language ) {
			$condition = new Language_Sub_Condition( [
				'id'    => $language->slug,
				'name'  => $language->slug,
				'label' => $language->name . ' (' . strtoupper( $language->slug ) . ')',
			] );
			
			$this->register_sub_condition( $condition );
		}
	}
}

/**
 * Class Language_Sub_Condition
 *
 * Represents individual language sub-conditions
 */
class Language_Sub_Condition extends Condition_Base {

	/**
	 * Language data
	 *
	 * @var array
	 */
	private $language_data;

	/**
	 * Constructor
	 *
	 * @param array $data Language data.
	 */
	public function __construct( $data ) {
		$this->language_data = $data;
		
		// Ensure required keys exist for parent constructor
		if ( ! isset( $data['id'] ) ) {
			$data['id'] = $data['name'];
		}
		
		parent::__construct( $data );
	}

	/**
	 * Get the name of the condition
	 *
	 * @return string
	 */
	public static function get_type() {
		return 'singular';
	}

	/**
	 * Get the name identifier
	 *
	 * @return string
	 */
	public function get_name() {
		return $this->language_data['name'];
	}

	/**
	 * Get the label for the condition
	 *
	 * @return string
	 */
	public function get_label() {
		return $this->language_data['label'];
	}

	/**
	 * Check if the condition is met
	 *
	 * @param array $args Condition arguments.
	 * @return bool
	 */
	public function check( $args ) {
		// Get the current language
		$current_language = lmat_current_language();
		
		if ( empty( $current_language ) ) {
			$current_language = lmat_default_language();
		}

		// Check if current language matches this sub-condition
		return strtolower( $current_language ) === strtolower( $this->get_name() );
	}
}
