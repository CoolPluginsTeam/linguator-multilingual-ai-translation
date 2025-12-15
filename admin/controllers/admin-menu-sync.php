<?php
/**
 * Menu Sync Controller
 * 
 * Handles synchronization of menus across languages
 * 
 * @package Linguator
 */

namespace Linguator\Admin\Controllers;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class LMAT_Admin_Menu_Sync
 * 
 * Provides functionality to sync menu structure across multiple languages
 */
class LMAT_Admin_Menu_Sync {

	/**
	 * Flag to track if AJAX handler has been registered
	 *
	 * @var bool
	 */
	private static $ajax_registered = false;

	/**
	 * Linguator model instance
	 *
	 * @var object
	 */
	private $model;

	/**
	 * Linguator options instance
	 *
	 * @var object
	 */
	private $options;

	/**
	 * Theme name
	 *
	 * @var string
	 */
	private $theme;

	/**
	 * Constructor
	 *
	 * @param object $linguator The Linguator object.
	 * @param bool   $is_ajax Whether this is being loaded for AJAX requests only.
	 */
	public function __construct( &$linguator, $is_ajax = false ) {
		$this->model = &$linguator->model;
		$this->options = &$linguator->options;
		$this->theme = get_option( 'stylesheet' );

		// Register AJAX handler only once
		if ( ! self::$ajax_registered ) {
		add_action( 'wp_ajax_lmat_sync_menu', array( $this, 'ajax_sync_menu' ) );
			self::$ajax_registered = true;
		}
		
		// Only enqueue scripts when not in AJAX-only mode
		if ( ! $is_ajax ) {
			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
			}
	}




	/**
	 * Enqueue scripts and styles
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		global $nav_menu_selected_id;

		// Enqueue CSS
		wp_enqueue_style(
			'lmat-menu-sync',
			plugins_url( 'admin/assets/css/admin-menu-sync.css', LINGUATOR_ROOT_FILE ),
			array(),
			LINGUATOR_VERSION . '.' . time()
		);

		// Enqueue JavaScript
		wp_enqueue_script(
			'lmat-menu-sync',
			plugins_url( 'admin/assets/js/admin-menu-sync.js', LINGUATOR_ROOT_FILE ),
			array( 'jquery' ),
			LINGUATOR_VERSION . '.' . time(),
			true
		);

		// Get available languages
		$languages = $this->model->languages->get_list();
		$lang_data = array();
		
	// Get source menu object to check for existing synced menus
	$source_menu = wp_get_nav_menu_object( $nav_menu_selected_id );
	
	// Extract base menu name (remove language suffix if present)
	$base_menu_name = '';
	if ( $source_menu ) {
		$base_menu_name = $source_menu->name;
		// Remove language suffix pattern like " (Language)" or " (भाषा)"
		$base_menu_name = preg_replace( '/\s*\([^)]+\)\s*$/', '', $base_menu_name );
	}
	
	// If no menu selected, skip synced menu detection
	if ( ! $source_menu || empty( $base_menu_name ) ) {
		// Load predefined languages for English labels
		$predefined_languages = include LINGUATOR_DIR . '/admin/settings/controllers/languages.php';
		
		foreach ( $languages as $lang ) {
			// Get English label from predefined languages
			$english_name = $lang->name;
			$native_name = $lang->name;
			
			$lookup_key = $lang->slug;
			if ( isset( $predefined_languages[ $lookup_key ] ) && isset( $predefined_languages[ $lookup_key ]['label'] ) ) {
				$english_name = $predefined_languages[ $lookup_key ]['label'];
				if ( isset( $predefined_languages[ $lookup_key ]['name'] ) ) {
					$native_name = $predefined_languages[ $lookup_key ]['name'];
				}
			}
			
		$lang_data[ $lang->slug ] = array(
			'name'            => $english_name,
			'native_name'     => $native_name,
			'locale'          => isset( $lang->locale ) ? $lang->locale : $lang->slug,
			'flag'            => isset( $lang->flag ) ? $lang->flag : '',
			'has_synced_menu' => false,
		);
		}
		
		wp_localize_script( 'lmat-menu-sync', 'lmatMenuSync', array(
			'ajaxurl'    => admin_url( 'admin-ajax.php' ),
			'nonce'      => wp_create_nonce( 'lmat_sync_menu' ),
			'languages'  => $lang_data,
			'menuId'     => $nav_menu_selected_id,
			'menuLang'   => '', // No language selected
			'syncButton' => __( 'Sync Menu', 'linguator-multilingual-ai-translation' ),
		) );
		
		return;
	}
	
	// Get all menus to check for existing synced versions
	// Get terms directly to bypass any language filtering
	$all_menus = get_terms( array(
		'taxonomy'   => 'nav_menu',
		'hide_empty' => false,
		'orderby'    => 'name',
	) );
	
	// Fallback to wp_get_nav_menus if get_terms fails
	if ( is_wp_error( $all_menus ) || empty( $all_menus ) ) {
		$all_menus = wp_get_nav_menus();
	}
	
	$existing_menu_langs = array();
	
	// Optimize: Cache lowercase conversions and find default language once
		$base_name_lower = strtolower( $base_menu_name );
		$default_lang_slug = '';
		foreach ( $languages as $lang ) {
			if ( ! empty( $lang->is_default ) ) {
				$default_lang_slug = $lang->slug;
				break;
			}
		}
		
	// Check menus for existing synced versions (including currently selected menu)
	foreach ( $all_menus as $menu ) {
		$menu_name_lower = strtolower( $menu->name );
		
		// Check if this is the base menu (matches exactly) - assign to default language
		if ( $menu->name === $base_menu_name && $default_lang_slug ) {
			$existing_menu_langs[ $default_lang_slug ] = true;
		}
		
		// Only proceed if the menu name starts with the base menu name
		if ( strpos( $menu_name_lower, $base_name_lower ) !== 0 ) {
			continue;
		}
			
		// Check against language patterns for all menus (including current)
		foreach ( $languages as $lang ) {
			$lang_name_lower = strtolower( $lang->name );
			$lang_native_lower = isset( $lang->native_name ) ? strtolower( $lang->native_name ) : '';
			
			$pattern1 = "{$base_name_lower} ({$lang_name_lower}";
			$pattern2 = "{$base_name_lower} {$lang_name_lower}";
			$pattern3 = $lang_native_lower ? "{$base_name_lower} ({$lang_native_lower}" : '';
			
			// Pattern checks - check if menu name contains language-specific pattern
			// More flexible matching to handle variations like "p1 (हिन्दी) (Primary Menu हिन्दी)"
			// Check if menu name contains the base + language pattern
			if ( strpos( $menu_name_lower, $pattern1 ) !== false ||
			     strpos( $menu_name_lower, $pattern2 ) !== false ||
			     ( $pattern3 && strpos( $menu_name_lower, $pattern3 ) !== false ) ) {
				$existing_menu_langs[ $lang->slug ] = true;
				break; // Found match for this menu, move to next menu
			}
		}
	}
		
	// Get source menu items to check for available translations
	$source_items = wp_get_nav_menu_items( $nav_menu_selected_id );
	
	// Get current menu's language to exclude it from the list
	$current_menu_lang = $this->get_menu_language( $nav_menu_selected_id );
	
	// Load predefined languages for English labels
	$predefined_languages = include LINGUATOR_DIR . '/admin/settings/controllers/languages.php';
	
	// Build language data for JavaScript
	foreach ( $languages as $lang ) {
		// Skip the current menu's language (can't sync to itself)
		if ( $lang->slug === $current_menu_lang ) {
			continue;
		}
		
		// Check if this language has translated content in general
		if ( ! $this->language_has_content( $lang->slug ) ) {
			continue;
		}
		
		// Check if at least one menu item can be synced to this language
		$has_translations = false;
		if ( ! empty( $source_items ) ) {
			foreach ( $source_items as $item ) {
				if ( $this->can_sync_item( $item, $lang ) ) {
					$has_translations = true;
					break; // Found at least one, no need to check more
				}
			}
		}
		
		// Only include this language if it has translations for menu items
		if ( ! $has_translations ) {
			continue;
		}
		
		// Get English label from predefined languages
		$english_name = $lang->name; // Fallback to current name
		$native_name = $lang->name;
		
		// Look up by slug first, then by locale code
		$lookup_key = $lang->slug;
		if ( isset( $predefined_languages[ $lookup_key ] ) && isset( $predefined_languages[ $lookup_key ]['label'] ) ) {
			$english_name = $predefined_languages[ $lookup_key ]['label'];
			if ( isset( $predefined_languages[ $lookup_key ]['name'] ) ) {
				$native_name = $predefined_languages[ $lookup_key ]['name'];
			}
		}
		
	$lang_data[] = array(
		'slug' => $lang->slug,
		'name' => $english_name, // English name for display
		'native_name' => $native_name, // Native name
		'locale' => isset( $lang->locale ) ? $lang->locale : $lang->slug, // Locale code
		'is_default' => ! empty( $lang->is_default ),
		'has_synced_menu' => isset( $existing_menu_langs[ $lang->slug ] ),
	);
	}

		// Get menu ID and language for sync button
		$menu_id = $nav_menu_selected_id ? absint( $nav_menu_selected_id ) : 0;
		$menu_lang = $menu_id ? $this->get_menu_language( $menu_id ) : '';

		// Localize script
		wp_localize_script(
			'lmat-menu-sync',
			'lmatMenuSync',
			array(
				'ajaxUrl' => admin_url( 'admin-ajax.php' ),
				'nonce' => wp_create_nonce( 'lmat_sync_menu' ),
				'menuId' => $menu_id,
				'menuLang' => $menu_lang,
				'languages' => $lang_data,
				'strings' => array(
					'syncButton' => __( 'Sync Menu', 'linguator-multilingual-ai-translation' ),
					'selectLanguages' => __( 'Select languages to sync:', 'linguator-multilingual-ai-translation' ),
					'selectAll' => __( 'Select All', 'linguator-multilingual-ai-translation' ),
					'deselectAll' => __( 'Unselect All', 'linguator-multilingual-ai-translation' ),
					'sync' => __( 'Sync', 'linguator-multilingual-ai-translation' ),
					'cancel' => __( 'Cancel', 'linguator-multilingual-ai-translation' ),
					'syncing' => __( 'Syncing menus...', 'linguator-multilingual-ai-translation' ),
					'success' => __( 'Menu synced successfully!', 'linguator-multilingual-ai-translation' ),
					'error' => __( 'Error syncing menu. Please try again.', 'linguator-multilingual-ai-translation' ),
					'noLanguages' => __( 'Please select at least one language.', 'linguator-multilingual-ai-translation' ),
					'confirmReplace' => __( 'This will replace existing menus in the selected languages. Continue?', 'linguator-multilingual-ai-translation' ),
					'emptyMenuError' => __( 'The source menu is empty. Please add menu items before syncing.', 'linguator-multilingual-ai-translation' ),
					'noTranslatedContent' => __( 'No translated content is available for selected menu items. Please add and translate content in other languages first.', 'linguator-multilingual-ai-translation' ),
				),
			)
		);
	}

	/**
	 * AJAX handler for menu sync
	 *
	 * @return void
	 */
	public function ajax_sync_menu() {
		try {
		// Verify nonce
		check_ajax_referer( 'lmat_sync_menu', 'nonce' );

		// Check capabilities
		if ( ! current_user_can( 'edit_theme_options' ) ) {
			wp_send_json_error( array( 'message' => __( 'You do not have permission to perform this action.', 'linguator-multilingual-ai-translation' ) ) );
		}

		// Get parameters
		$menu_id = isset( $_POST['menu_id'] ) ? absint( $_POST['menu_id'] ) : 0;
		$target_langs = isset( $_POST['target_langs'] ) && is_array( $_POST['target_langs'] ) ? array_map( 'sanitize_text_field', $_POST['target_langs'] ) : array();

			if ( empty( $menu_id ) ) {
				wp_send_json_error( array( 'message' => __( 'Invalid menu ID.', 'linguator-multilingual-ai-translation' ) ) );
			}

			if ( empty( $target_langs ) ) {
				wp_send_json_error( array( 'message' => __( 'No target languages selected.', 'linguator-multilingual-ai-translation' ) ) );
		}
		// Perform sync
		$result = $this->sync_menu_to_languages( $menu_id, $target_langs );
		if ( $result['success'] ) {
			wp_send_json_success( $result );
		} else {
			wp_send_json_error( $result );
			}
		} catch ( Exception $e ) {
			error_log( 'Menu Sync Exception: ' . $e->getMessage() );
			wp_send_json_error( array( 
				'message' => $e->getMessage(),
				'error' => 'exception'
			) );
		}
	}

	/**
	 * Sync menu to multiple languages
	 *
	 * @param int   $source_menu_id Source menu ID.
	 * @param array $target_langs   Target language slugs.
	 * @return array Result data.
	 */
	private function sync_menu_to_languages( $source_menu_id, $target_langs ) {
		$result = array(
			'success' => true,
			'synced_languages' => array(),
			'details' => array(),
			'message' => '',
		);

		// Get source menu items
		$source_items = wp_get_nav_menu_items( $source_menu_id );
		
		if ( empty( $source_items ) ) {
			return array(
				'success' => false,
				'message' => __( 'Source menu is empty.', 'linguator-multilingual-ai-translation' ),
			);
		}

		// Get source menu object
		$source_menu = wp_get_nav_menu_object( $source_menu_id );
		if ( ! $source_menu ) {
			return array(
				'success' => false,
				'message' => __( 'Source menu not found.', 'linguator-multilingual-ai-translation' ),
			);
		}

		// Get menu locations for source menu
		$menu_locations = $this->get_menu_locations( $source_menu_id );

		// Sync to each target language
		foreach ( $target_langs as $lang_slug ) {
			$lang = $this->model->languages->get( $lang_slug );
			
			if ( ! $lang ) {
				continue;
			}

			$sync_result = $this->sync_menu_for_language( $source_menu, $source_items, $lang, $menu_locations );
			
			if ( $sync_result['synced'] > 0 ) {
				$result['synced_languages'][] = $lang->name;
			}
			
			$result['details'][ $lang_slug ] = $sync_result;
		}

		// Build success message
		if ( ! empty( $result['synced_languages'] ) ) {
			$result['message'] = sprintf(
				__( 'Menu synced to: %s', 'linguator-multilingual-ai-translation' ),
				implode( ', ', $result['synced_languages'] )
			);
		} else {
			$result['success'] = false;
			$result['message'] = __( 'No menus were synced. Please ensure translations exist.', 'linguator-multilingual-ai-translation' );
		}

		return $result;
	}

	/**
	 * Sync menu for a specific language
	 *
	 * @param object $source_menu   Source menu object.
	 * @param array  $source_items  Source menu items.
	 * @param object $lang          Target language object.
	 * @param array  $menu_locations Menu locations.
	 * @return array Sync result.
	 */
	private function sync_menu_for_language( $source_menu, $source_items, $lang, $menu_locations ) {
		$result = array(
			'synced' => 0,
			'skipped' => 0,
			'menu_id' => 0,
		);

		// First, check if there are any items that can be synced
		$items_to_sync = array();
		foreach ( $source_items as $item ) {
			if ( $this->can_sync_item( $item, $lang ) ) {
				$items_to_sync[] = $item;
			}
		}

		// If no items can be synced, don't create an empty menu
		if ( empty( $items_to_sync ) ) {
			$result['skipped'] = count( $source_items );
			return $result;
		}

		// Create or get target menu
		$target_menu_name = $source_menu->name . ' (' . $lang->name . ')';
		$target_menu = wp_get_nav_menu_object( $target_menu_name );

		if ( $target_menu ) {
			$target_menu_id = $target_menu->term_id;
			
			// Delete existing menu items in batch
			$existing_items = wp_get_nav_menu_items( $target_menu_id );
			if ( $existing_items ) {
				foreach ( $existing_items as $item ) {
					wp_delete_post( $item->ID, true );
				}
			}
		} else {
			// Create new menu
			$target_menu_id = wp_create_nav_menu( $target_menu_name );
			if ( is_wp_error( $target_menu_id ) ) {
				return $result;
			}
		}

		$result['menu_id'] = $target_menu_id;

		// Map old item IDs to new item IDs for parent relationships
		$item_id_map = array();

		// Sync menu items
		foreach ( $source_items as $item ) {
			$new_item_id = $this->sync_menu_item( $item, $target_menu_id, $lang, $item_id_map );
			
			if ( $new_item_id ) {
				$result['synced']++;
			} else {
				$result['skipped']++;
			}
		}

		// If nothing was actually synced, delete the empty menu
		if ( $result['synced'] === 0 ) {
			wp_delete_nav_menu( $target_menu_id );
			$result['menu_id'] = 0;
			return $result;
		}

		// Assign menu to locations
		if ( ! empty( $menu_locations ) ) {
			$this->assign_menu_to_locations( $target_menu_id, $lang->slug, $menu_locations );
		}

		return $result;
	}

	/**
	 * Check if a menu item can be synced to a language
	 *
	 * @param object $item Source menu item.
	 * @param object $lang Target language.
	 * @return bool True if item can be synced, false otherwise.
	 */
	private function can_sync_item( $item, $lang ) {
		// Custom links can always be synced (we translate the label)
		if ( $item->type === 'custom' ) {
			return true;
		}

		// Check if post type item has translation
		if ( $item->type === 'post_type' && in_array( $item->object, array( 'post', 'page' ), true ) ) {
			$translations = lmat_get_post_translations( $item->object_id );
			
			if ( ! isset( $translations[ $lang->slug ] ) ) {
				return false;
			}
			
			$translated_post_id = $translations[ $lang->slug ];
			$translated_post = get_post( $translated_post_id );
			
			// Check if translated post exists and is published
			if ( ! $translated_post || ! in_array( $translated_post->post_status, array( 'publish', 'private' ), true ) ) {
				return false;
			}
			
			return true;
		}

		// Check if taxonomy item has translation
		if ( $item->type === 'taxonomy' ) {
			$translations = lmat_get_term_translations( $item->object_id );
			
			if ( ! isset( $translations[ $lang->slug ] ) ) {
				return false;
			}
			
			$translated_term_id = $translations[ $lang->slug ];
			$translated_term = get_term( $translated_term_id );
			
			// Check if translated term exists and is valid
			if ( ! $translated_term || is_wp_error( $translated_term ) ) {
				return false;
			}
			
			return true;
		}

		// For other types, allow sync
		return true;
	}

	/**
	 * Sync a single menu item
	 *
	 * @param object $item        Source menu item.
	 * @param int    $menu_id     Target menu ID.
	 * @param object $lang        Target language.
	 * @param array  &$item_id_map Item ID mapping.
	 * @return int|false New menu item ID or false.
	 */
	private function sync_menu_item( $item, $menu_id, $lang, &$item_id_map ) {
		// Build base item data
		$item_data = array(
			'menu-item-title' => $item->title,
			'menu-item-url' => $item->url,
			'menu-item-status' => 'publish',
			'menu-item-type' => $item->type,
			'menu-item-object' => $item->object,
			'menu-item-object-id' => $item->object_id,
			'menu-item-position' => $item->menu_order,
			'menu-item-classes' => implode( ' ', $item->classes ),
			'menu-item-xfn' => $item->xfn,
			'menu-item-description' => $item->description,
			'menu-item-attr-title' => $item->attr_title,
			'menu-item-target' => $item->target,
		);

		// Handle parent relationship
		if ( $item->menu_item_parent && isset( $item_id_map[ $item->menu_item_parent ] ) ) {
			$item_data['menu-item-parent-id'] = $item_id_map[ $item->menu_item_parent ];
		}

		// Handle different item types
		if ( $item->type === 'post_type' && in_array( $item->object, array( 'post', 'page' ), true ) ) {
			// Get translated post
			$translations = lmat_get_post_translations( $item->object_id );
			
			if ( ! isset( $translations[ $lang->slug ] ) ) {
				return false; // No translation available
			}
			
			$translated_post_id = $translations[ $lang->slug ];
			
			// Get the translated post and verify it exists and is published
			$translated_post = get_post( $translated_post_id );
			
			// Skip if translated post doesn't exist or is not published
			if ( ! $translated_post || ! in_array( $translated_post->post_status, array( 'publish', 'private' ), true ) ) {
				return false; // Translated post doesn't exist or is not published
			}
			
			$item_data['menu-item-object-id'] = $translated_post_id;
			
			// Get the original post
			$original_post = get_post( $item->object_id );
			
			// Check if navigation label is customized (different from original post title)
			if ( $original_post && $item->title !== $original_post->post_title ) {
				// Navigation label is custom, translate it
				$translated_title = $this->translate_custom_link_title( $item->title, $lang );
				$item_data['menu-item-title'] = $translated_title ? $translated_title : $item->title;
			} else {
				// Use translated post title
				$item_data['menu-item-title'] = $translated_post->post_title;
			}
		} elseif ( $item->type === 'taxonomy' ) {
			// Get translated term
			$translations = lmat_get_term_translations( $item->object_id );
			
			if ( ! isset( $translations[ $lang->slug ] ) ) {
				return false; // No translation available
			}
			
			$translated_term_id = $translations[ $lang->slug ];
			
			// Get the translated term and verify it exists
			$translated_term = get_term( $translated_term_id );
			
			// Skip if translated term doesn't exist or is an error
			if ( ! $translated_term || is_wp_error( $translated_term ) ) {
				return false; // Translated term doesn't exist
			}
			
			$item_data['menu-item-object-id'] = $translated_term_id;
			
			// Get the original term
			$original_term = get_term( $item->object_id );
			
			// Check if navigation label is customized (different from original term name)
			if ( $original_term && ! is_wp_error( $original_term ) && $item->title !== $original_term->name ) {
				// Navigation label is custom, translate it
				$translated_title = $this->translate_custom_link_title( $item->title, $lang );
				$item_data['menu-item-title'] = $translated_title ? $translated_title : $item->title;
			} else {
				// Use translated term name
				$item_data['menu-item-title'] = $translated_term->name;
			}
		} elseif ( $item->type === 'custom' ) {
			// Handle custom links - translate navigation label
			$translated_title = $this->translate_custom_link_title( $item->title, $lang );
			if ( $translated_title ) {
				$item_data['menu-item-title'] = $translated_title;
			}
			// URL remains the same for custom links
		}

		// Add menu item
		$new_item_id = wp_update_nav_menu_item( $menu_id, 0, $item_data );

		if ( is_wp_error( $new_item_id ) ) {
			return false;
		}

			// Store mapping for parent relationships
			$item_id_map[ $item->ID ] = $new_item_id;
			
		// Copy custom meta for language switcher items
			if ( $item->type === 'custom' && $item->url === '#lmat_switcher' ) {
				$meta = get_post_meta( $item->ID, '_lmat_menu_item', true );
				if ( $meta ) {
					update_post_meta( $new_item_id, '_lmat_menu_item', $meta );
				}
			}
			
			return $new_item_id;
	}

	/**
	 * Get menu locations for a menu
	 *
	 * @param int $menu_id Menu ID.
	 * @return array Menu locations.
	 */
	private function get_menu_locations( $menu_id ) {
		$locations = array();
		$nav_menus = $this->options->get( 'nav_menus' );
		
		if ( empty( $nav_menus[ $this->theme ] ) ) {
			return $locations;
		}

		foreach ( $nav_menus[ $this->theme ] as $location => $languages ) {
			foreach ( $languages as $lang => $assigned_menu_id ) {
				if ( $assigned_menu_id == $menu_id ) {
					$locations[] = $location;
					break;
				}
			}
		}

		return $locations;
	}

	/**
	 * Assign menu to locations
	 *
	 * @param int    $menu_id   Menu ID.
	 * @param string $lang_slug Language slug.
	 * @param array  $locations Locations to assign.
	 * @return void
	 */
	private function assign_menu_to_locations( $menu_id, $lang_slug, $locations ) {
		$nav_menus = $this->options->get( 'nav_menus' );
		
		foreach ( $locations as $location ) {
			$nav_menus[ $this->theme ][ $location ][ $lang_slug ] = $menu_id;
		}
		
		$this->options->set( 'nav_menus', $nav_menus );
	}

	/**
	 * Get the language assigned to a menu
	 *
	 * @param int $menu_id Menu ID.
	 * @return string Language slug or empty string if not found.
	 */
	private function get_menu_language( $menu_id ) {
		$nav_menus = $this->options->get( 'nav_menus' );
		
		if ( empty( $nav_menus[ $this->theme ] ) ) {
			return '';
		}

		foreach ( $nav_menus[ $this->theme ] as $location => $languages ) {
			foreach ( $languages as $lang => $assigned_menu_id ) {
				if ( $assigned_menu_id == $menu_id ) {
					return $lang;
				}
			}
		}

		return '';
	}

	/**
	 * Custom Link Title Translation
	 *
	 * @param string $title Original navigation label.
	 * @param object $lang Target language object.
	 * @return string Translated title or original if translation fails.
	 */
	/**
	 * Translate custom link title using glossary or AI translation
	 *
	 * @param string $title Original navigation label.
	 * @param object $lang Target language object.
	 * @return string Translated title or original if translation fails.
	 */
	private function translate_custom_link_title( $title, $lang ) {
		// Get source language (default language)
		$default_lang = $this->model->languages->get_default();
		if ( ! $default_lang ) {
			return $title;
		}
		
		$source_lang_code = $default_lang->slug;
		$target_lang_code = $lang->slug;
		
		// First, check glossary for existing translation
		$glossary_translation = $this->get_glossary_translation( $title, $source_lang_code, $target_lang_code );
		if ( $glossary_translation ) {
			return $glossary_translation;
		}
		
		// No glossary entry found, use AI translation
		$ai_translation = $this->translate_with_ai( $title, $lang );
		if ( $ai_translation && $ai_translation !== $title ) {
			return $ai_translation;
		}
		
		// No translation found, return original title
		return $title;
	}
	
	/**
	 * Get translation from glossary
	 *
	 * @param string $title Original navigation label.
	 * @param string $source_lang_code Source language code.
	 * @param string $target_lang_code Target language code.
	 * @return string|false Translated title or false if not found.
	 */
	private function get_glossary_translation( $title, $source_lang_code, $target_lang_code ) {
		$glossary_data = get_option( 'lmat_glossary_data', array() );
		
		if ( empty( $glossary_data ) || ! is_array( $glossary_data ) ) {
			return false;
		}
		
		// Search for translation in glossary
		foreach ( $glossary_data as $entry ) {
			// Check if the original term matches (case-insensitive)
			if ( isset( $entry['original_term'] ) && 
			     strcasecmp( trim( $entry['original_term'] ), trim( $title ) ) === 0 &&
			     isset( $entry['original_language_code'] ) &&
			     $entry['original_language_code'] === $source_lang_code ) {
				
				// Look for translation in target language
				if ( isset( $entry['translations'] ) && is_array( $entry['translations'] ) ) {
					foreach ( $entry['translations'] as $translation ) {
						if ( isset( $translation['target_language_code'] ) &&
						     $translation['target_language_code'] === $target_lang_code &&
						     ! empty( $translation['translated_term'] ) ) {
							return trim( $translation['translated_term'] );
						}
					}
				}
				break;
			}
		}
		
		return false;
	}
	
	/**
	 * Translate text using Google Translate
	 *
	 * @param string $text Text to translate.
	 * @param object $lang Target language object.
	 * @return string|false Translated text or false if translation fails.
	 */
	private function translate_with_ai( $text, $lang ) {
		// Get translation configuration
		$ai_config = $this->options->get( 'ai_translation_configuration' );
		
		// Check if Google translation is enabled
		if ( empty( $ai_config['provider']['google'] ) ) {
			return false;
		}
		
		// Get source language
		$default_lang = $this->model->languages->get_default();
		if ( ! $default_lang ) {
			return false;
		}
		
		// Use Google Translate
		return $this->translate_with_google( $text, $default_lang->locale, $lang->locale );
	}
	
	/**
	 * Translate using Google Translate
	 *
	 * @param string $text Text to translate.
	 * @param string $source_locale Source language locale.
	 * @param string $target_locale Target language locale.
	 * @return string|false Translated text or false.
	 */
	private function translate_with_google( $text, $source_locale, $target_locale ) {
		// Extract language codes (first 2 letters)
		$source_lang = substr( $source_locale, 0, 2 );
		$target_lang = substr( $target_locale, 0, 2 );
		
		// Build Google Translate URL
		$url = add_query_arg(
			array(
				'client' => 'gtx',
				'sl'     => $source_lang,
				'tl'     => $target_lang,
				'dt'     => 't',
				'q'      => rawurlencode( $text ),
			),
			'https://translate.googleapis.com/translate_a/single'
		);
		
		// Make the request
		$response = wp_remote_get(
			$url,
			array(
				'timeout'    => 15,
				'user-agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
			)
		);
		
		if ( is_wp_error( $response ) ) {
			error_log( 'Google Translate Error: ' . $response->get_error_message() );
			return false;
		}
		
		$body = wp_remote_retrieve_body( $response );
		
		// Parse the response
		$data = json_decode( $body, true );
		
		if ( isset( $data[0][0][0] ) && ! empty( $data[0][0][0] ) ) {
			return trim( $data[0][0][0] );
		}
		return false;
	}

	/**
	 * Check if a language has any translated content (posts or pages)
	 *
	 * @param string $lang_slug Language slug.
	 * @return bool True if language has content, false otherwise.
	 */
	private function language_has_content( $lang_slug ) {
		// Linguator uses taxonomy 'lmat_language' to associate posts with languages
		// Check if there are any PUBLISHED posts/pages with this language taxonomy term
		// Optimized: Use minimal query with 'ids' fields and no_found_rows
		$query = new \WP_Query( array(
			'post_type'      => array( 'post', 'page' ),
			'post_status'    => 'publish',
			'posts_per_page' => 1,
			'fields'         => 'ids',
			'no_found_rows'  => true, // Performance optimization
			'update_post_meta_cache' => false, // Don't need meta
			'update_post_term_cache' => false, // Don't need term cache
			'tax_query'      => array(
				array(
					'taxonomy' => 'lmat_language',
					'field'    => 'slug',
					'terms'    => $lang_slug,
				),
			),
		) );
		
		return $query->have_posts();
	}
}
