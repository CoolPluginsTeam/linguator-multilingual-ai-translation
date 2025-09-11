<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Filters;


if ( ! defined( 'ABSPATH' ) ) {
    exit;
}


use Linguator\Includes\Walkers\LMAT_Walker_Dropdown;


/**
 * Class LMAT_Widgets_Filters
 *
 * @since 1.0.0
 *
 * Add new options to {@see https://developer.wordpress.org/reference/classes/wp_widget/ WP_Widget} and saves them.
 */
class LMAT_Filters_Widgets_Options {

	/**
	 * @var LMAT_Model
	 */
	public $model;

	/**
	 * LMAT_Widgets_Filters constructor.
	 *
	 *
	 * @param LMAT_Base $linguator The Linguator object.
	 * @return void
	 */
	public function __construct( $linguator ) {
		$this->model = $linguator->model;

		add_action( 'in_widget_form', array( $this, 'in_widget_form' ), 10, 3 );
		add_filter( 'widget_update_callback', array( $this, 'widget_update_callback' ), 10, 2 );
	}

	/**
	 * Add the language filter field to the widgets options form.
	 *
	 * @since 1.0.0 Rename lang_choice field name and id to lmat_lang as the widget setting.
	 *
	 * @param WP_Widget $widget   The widget instance (passed by reference).
	 * @param null      $return   Return null if new fields are added.
	 * @param array     $instance An array of the widget's settings.
	 * @return void
	 *
	 * @phpstan-param WP_Widget<array<string, mixed>> $widget
	 */
	public function in_widget_form( $widget, $return, $instance ) {
		$dropdown = new LMAT_Walker_Dropdown();

		$dropdown_html = $dropdown->walk(
			array_merge(
				array( (object) array( 'slug' => 0, 'name' => __( 'All languages', 'linguator-multilingual-ai-translation' ) ) ),
				$this->model->get_languages_list()
			),
			-1,
			array(
				'id' => $widget->get_field_id( 'lmat_lang' ),
				'name' => $widget->get_field_name( 'lmat_lang' ),
				'class' => 'tags-input lmat-lang-choice',
				'selected' => empty( $instance['lmat_lang'] ) ? '' : $instance['lmat_lang'],
			)
		);

		printf(
			'<p><label for="%1$s">%2$s %3$s</label></p>',
			esc_attr( $widget->get_field_id( 'lmat_lang' ) ),
			esc_html__( 'The widget is displayed for:', 'linguator-multilingual-ai-translation' ),
			wp_kses(
				$dropdown_html,
				array(
					'span'   => array( 'class' => true ),
					'img'    => array(
						'src'      => true,
						'alt'      => true,
						'width'    => true,
						'height'   => true,
						'class'    => true,
						'style'    => true,
						'loading'  => true,
						'decoding' => true,
					),
					'select' => array(
						'name'     => true,
						'id'       => true,
						'class'    => true,
						'lang'     => true,
						'disabled' => true,
					),
					'option' => array(
						'value'     => true,
						'lang'      => true,
						'aria-label'=> true,
						'selected'  => true,
						'data-lang' => true,
					),
				),
				array_merge( wp_allowed_protocols(), array( 'data' ) )
			)
		);
	}

	/**
	 * Called when widget options are saved.
	 * Saves the language associated to the widget.
	 *
	 * @since 1.0.0
	 * @since 1.0.0 Remove unused $old_instance and $widget parameters.
	 *
	 * @param array $instance     The current Widget's options.
	 * @param array $new_instance The new Widget's options.
	 * @return array Widget options.
	 */
	public function widget_update_callback( $instance, $new_instance ) {
		if ( ! empty( $new_instance['lmat_lang'] ) && $lang = $this->model->get_language( $new_instance['lmat_lang'] ) ) {
			$instance['lmat_lang'] = $lang->slug;
		} else {
			unset( $instance['lmat_lang'] );
		}

		return $instance;
	}
}
