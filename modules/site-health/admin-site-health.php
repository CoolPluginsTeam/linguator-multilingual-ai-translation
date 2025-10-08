<?php
/**
 * @package Linguator
 */

/**
 * Class LMAT_Admin_Site_Health to add debug info in WP Site Health.
 *
 * @see https://make.wordpress.org/core/2019/04/25/site-health-check-in-5-2/ since WordPress 5.2
 *
 * @since 2.8
 */
class LMAT_Admin_Site_Health {
	/**
	 * A reference to the LMAT_Model instance.
	 *
	 *
	 * @var LMAT_Model
	 */
	protected $model;

	/**
	 * A reference to the LMAT_Admin_Static_Pages instance.
	 *
	 *
	 * @var LMAT_Admin_Static_Pages|null
	 */
	protected $static_pages;

	/**
	 * LMAT_Admin_Site_Health constructor.
	 *
	 *
	 * @param object $linguator The Linguator object.
	 */
	public function __construct( &$linguator ) {
		$this->model = &$linguator->model;
		$this->static_pages = &$linguator->static_pages;

		// Information tab.
		add_filter( 'debug_information', array( $this, 'info_options' ), 15 );
		add_filter( 'debug_information', array( $this, 'info_languages' ), 15 );
		add_filter( 'debug_information', array( $this, 'info' ), 15 );

		// Tests Tab.
		add_filter( 'site_status_tests', array( $this, 'status_tests' ) );
		add_filter( 'site_status_test_php_modules', array( $this, 'site_status_test_php_modules' ) ); // Require simplexml in Site health.
	}

	/**
	 * Returns a list of keys to exclude from the site health information.
	 *
	 *
	 * @return string[] List of option keys to ignore.
	 */
	protected function exclude_options_keys() {
		return array(
			'uninstall',
			'first_activation',
		);
	}

	/**
	 * Returns a list of keys to exclude from the site health information.
	 *
	 *
	 * @return string[] List of language keys to ignore.
	 */
	protected function exclude_language_keys() {
		return array(
			'flag',
			'host',
			'taxonomy',
			'description',
			'parent',
			'filter',
			'custom_flag',
		);
	}

	/**
	 * Add Linguator Options to Site Health Information tab.
	 *
	 * @param array $debug_info The debug information to be added to the core information page.
	 *
	 * @return array
	 */
	public function info_options( $debug_info ) {
		$fields = $this->model->options->get_site_health_info();

		// Get effective translated post types and taxonomies. The options doesn't show all translated ones.
		if ( ! empty( $this->model->get_translated_post_types() ) ) {
			$fields['cpt']['label'] = __( 'Post Types', 'linguator-multilingual-ai-translation' );
			$fields['cpt']['value'] = implode( ', ', $this->model->get_translated_post_types() );
		}
		if ( ! empty( $this->model->get_translated_taxonomies() ) ) {
			$fields['taxonomies']['label'] = __( 'Custom Taxonomies', 'linguator-multilingual-ai-translation' );
			$fields['taxonomies']['value'] = implode( ', ', $this->model->get_translated_taxonomies() );
		}

		$debug_info['lmat_options'] = array(
			/* translators: placeholder is the plugin name */
			'label'  => sprintf( __( '%s options', 'linguator-multilingual-ai-translation' ), LINGUATOR ),
			'fields' => $fields,
		);

		return $debug_info;
	}

	/**
	 * Adds Linguator Languages settings to Site Health Information tab.
	 *
	 *
	 * @param array $debug_info The debug information to be added to the core information page.
	 * @return array
	 */
	public function info_languages( $debug_info ) {
		foreach ( $this->model->get_languages_list() as $language ) {
			$fields = array();

			foreach ( $language->to_array() as $key => $value ) {
				if ( in_array( $key, $this->exclude_language_keys(), true ) ) {
					continue;
				}

				if ( empty( $value ) ) {
					$value = '0';
				}

				$fields[ $key ]['label'] = $key;

				if ( 'term_props' === $key && is_array( $value ) ) {
					$fields[ $key ]['value'] = $this->get_info_term_props( $value );
				} else {
					$fields[ $key ]['value'] = $value;
				}

				if ( 'term_group' === $key ) {
					$fields[ $key ]['label'] = 'order'; // Changed for readability but not translated as other keys are not.
				}
			}

			$debug_info[ 'lmat_language_' . $language->slug ] = array(
				/* translators: %1$s placeholder is the language name, %2$s is the language code */
				'label'  => sprintf( __( 'Language: %1$s - %2$s', 'linguator-multilingual-ai-translation' ), $language->name, $language->slug ),
				/* translators: placeholder is the flag image */
				'description' => sprintf( esc_html__( 'Flag used in the language switcher: %s', 'linguator-multilingual-ai-translation' ), $this->get_flag( $language ) ),
				'fields' => $fields,
			);
		}

		return $debug_info;
	}

	/**
	 * Adds term props data to the info languages array.
	 *
	 * @param array $value The term props data.
	 * @return array The term props data formatted for the info languages tab.
	 */
	protected function get_info_term_props( $value ) {
		$return_value = array();

		foreach ( $value as $language_taxonomy => $item ) {
			$language_taxonomy_array = array_fill( 0, count( $item ), $language_taxonomy );

			$keys_with_language_taxonomy = array_map(
				function ( $key, $language_taxonomy ) {
					return "{$language_taxonomy}/{$key}";
				},
				array_keys( $item ),
				$language_taxonomy_array
			);

			$value = array_combine( $keys_with_language_taxonomy, $item );
			if ( is_array( $value ) ) {
				$return_value = array_merge( $return_value, $value );
			}
		}
		return $return_value;
	}

	/**
	 * Returns the flag used in the language switcher.
	 *
	 *
	 * @param LMAT_Language $language Language object.
	 * @return string
	 */
	protected function get_flag( $language ) {
		$flag = $language->get_display_flag();
		return empty( $flag ) ? '<span>' . esc_html__( 'Undefined', 'linguator-multilingual-ai-translation' ) . '</span>' : $flag;
	}

	/**
	 * Add a Site Health test on homepage translation.
	 *
	 *
	 * @param array $tests Array with tests declaration data.
	 * @return array
	 */
	public function status_tests( $tests ) {
		// Add the test only if the homepage displays static page.
		if ( 'page' === get_option( 'show_on_front' ) && get_option( 'page_on_front' ) ) {
			$tests['direct']['lmat_homepage'] = array(
				'label' => esc_html__( 'Homepage translated', 'linguator-multilingual-ai-translation' ),
				'test'  => array( $this, 'homepage_test' ),
			);
		}
		return $tests;
	}

	/**
	 * Test if the home page is translated or not.
	 *
	 *
	 * @return array $result Array with test results.
	 */
	public function homepage_test() {
		$result = array(
			'label'       => __( 'All languages have a translated homepage', 'linguator-multilingual-ai-translation' ),
			'status'      => 'good',
			'badge'       => array(
				'label' => LINGUATOR,
				'color' => 'blue',
			),
			'description' => sprintf(
				'<p>%s</p>',
				esc_html__( 'It is mandatory to translate the static front page in all languages.', 'linguator-multilingual-ai-translation' )
			),
			'actions'     => '',
			'test'        => 'lmat_homepage',
		);

		$message = $this->static_pages->get_must_translate_message();

		if ( ! empty( $message ) ) {
			$result['status']      = 'critical';
			$result['label']       = __( 'The homepage is not translated in all languages', 'linguator-multilingual-ai-translation' );
			$result['description'] = sprintf( '<p>%s</p>', $message );
		}
		return $result;
	}

	/**
	 * Add Linguator Warnings to Site Health Information tab.
	 *
	 *
	 * @param array $debug_info The debug information to be added to the core information page.
	 * @return array
	 */
	public function info( $debug_info ) {
		$fields = array();

		// Add Post Types without languages.
		$posts_no_lang = $this->get_post_ids_without_lang();

		if ( ! empty( $posts_no_lang ) ) {
			$fields['post-no-lang']['label'] = __( 'Posts without language', 'linguator-multilingual-ai-translation' );
			$fields['post-no-lang']['value'] = $posts_no_lang;
		}

		$terms_no_lang = $this->get_term_ids_without_lang();

		if ( ! empty( $terms_no_lang ) ) {
			$fields['term-no-lang']['label'] = __( 'Terms without language', 'linguator-multilingual-ai-translation' );
			$fields['term-no-lang']['value'] = $terms_no_lang;
		}

		// Add WPML files.
		$wpml_files = LMAT_WPML_Config::instance()->get_files();
		if ( ! empty( $wpml_files ) ) {
			$fields['wpml']['label'] = 'wpml-config.xml files';
			$fields['wpml']['value'] = $wpml_files;

			if ( ! extension_loaded( 'simplexml' ) ) {
				$fields['simplexml']['label'] = __( 'PHP SimpleXML extension', 'linguator-multilingual-ai-translation' );
				$fields['simplexml']['value'] = __( 'Not loaded. Contact your host provider.', 'linguator-multilingual-ai-translation' );
			}
		}

		// Create the section.
		if ( ! empty( $fields ) ) {
			$debug_info['lmat_warnings'] = array(
				/* translators: placeholder is the plugin name */
				'label'  => sprintf( __( '%s information', 'linguator-multilingual-ai-translation' ), LINGUATOR ),
				'fields' => $fields,
			);
		}

		return $debug_info;
	}

	/**
	 * Get an array with post_type as key and post ids as value.
	 *
	 *
	 * @param int $limit Max number of posts to show per post type. `-1` to return all of them. Default is 5.
	 *
	 * @return array An associative array where the keys are post types and the values
	 *                are comma-separated strings of post IDs without a language.
	 *
	 * @phpstan-param -1|positive-int $limit     *
	 */
	public function get_post_ids_without_lang( $limit = 5 ) {
		$posts = array();

		foreach ( $this->model->get_translated_post_types() as $post_type ) {
			$post_ids_with_no_language = $this->model->get_posts_with_no_lang( $post_type, $limit );

			if ( ! empty( $post_ids_with_no_language ) ) {
				foreach ( $post_ids_with_no_language as $id ) {
					$posts[ $post_type ][] = $id;
				}
			}
		}

		if ( ! empty( $posts ) ) {
			foreach ( $posts as $post_type => $post_ids ) {
				$posts[ $post_type ] = implode( ', ', $post_ids );
			}
		}

		return $posts;
	}

	/**
	 * Get an array with taxonomy as key and term ids as value.
	 *
	 * @param int $limit Max number of terms to show per post type. `-1` to return all of them. Default is 5.
	 *
	 * @return array An associative array where the keys are post types and the values
	 *                 are comma-separated strings of post IDs without a language.
	 * @phpstan-param -1|positive-int $limit
	 */
	public function get_term_ids_without_lang( $limit = 5 ) {
		$terms = array();

		foreach ( $this->model->get_translated_taxonomies() as $taxonomy ) {
			$term_ids_with_no_language = $this->model->get_terms_with_no_lang( $taxonomy, $limit );

			if ( ! empty( $term_ids_with_no_language ) ) {
				foreach ( $term_ids_with_no_language as $id ) {
					$terms[ $taxonomy ][] = $id;
				}
			}
		}

		if ( ! empty( $terms ) ) {
			foreach ( $terms as $taxonomy => $term_ids ) {
				$terms[ $taxonomy ] = implode( ', ', $term_ids );
			}
		}

		return $terms;
	}

	/**
	 * Requires the simplexml PHP module when a wpml-config.xml has been found.
	 *
	 *
	 * @param array $modules An associative array of modules to test for.
	 * @return array
	 */
	public function site_status_test_php_modules( $modules ) {
		$files = LMAT_WPML_Config::instance()->get_files();
		if ( ! empty( $files ) ) {
			$modules['simplexml'] = array(
				'extension' => 'simplexml',
				'required'  => true,
			);
		}
		return $modules;
	}
}