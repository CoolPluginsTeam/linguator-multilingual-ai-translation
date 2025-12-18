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
	 * Cache for menu language mappings to avoid N+1 queries
	 *
	 * @var array|null
	 */
	private $menu_language_cache = null;

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

		// Don't enqueue scripts if no menu is selected
		if ( empty( $nav_menu_selected_id ) ) {
			return;
		}

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
	
	// Get the locations of the current menu being edited
	$current_menu_locations = $this->get_menu_locations( $nav_menu_selected_id );
	
	// Only check for conflicts if the current menu is assigned to at least one location
	if ( ! empty( $current_menu_locations ) ) {
		// Check menus for existing synced versions in the SAME location(s)
		foreach ( $all_menus as $menu ) {
			// Skip the current menu itself
			if ( $menu->term_id === $nav_menu_selected_id ) {
				continue;
			}
			
			// Get the language assigned to this menu using its ID
			$menu_lang = $this->get_menu_language( $menu->term_id );
			
			// If this menu has a language, check if it's in the same location(s)
			if ( $menu_lang ) {
				$menu_locations = $this->get_menu_locations( $menu->term_id );
				
				// Check if there's any overlap in locations
				$has_common_location = ! empty( array_intersect( $current_menu_locations, $menu_locations ) );
				
				if ( $has_common_location ) {
					// This menu is in the same location(s) and has a language assigned
					foreach ( $languages as $lang ) {
						if ( $menu_lang === $lang->slug ) {
							$existing_menu_langs[ $lang->slug ] = true;
							break;
						}
					}
				}
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
					'selectLanguages' => __( 'Select languages to sync', 'linguator-multilingual-ai-translation' ),
					'selectAll' => __( 'Select All', 'linguator-multilingual-ai-translation' ),
					'deselectAll' => __( 'Unselect All', 'linguator-multilingual-ai-translation' ),
					'sync' => __( 'Sync', 'linguator-multilingual-ai-translation' ),
					'cancel' => __( 'Cancel', 'linguator-multilingual-ai-translation' ),
					'syncing' => __( 'Syncing...', 'linguator-multilingual-ai-translation' ),
					'success' => __( 'Menu synced successfully!', 'linguator-multilingual-ai-translation' ),
					'error' => __( 'Error syncing menu. Please try again.', 'linguator-multilingual-ai-translation' ),
					'noLanguages' => __( 'Please select at least one language.', 'linguator-multilingual-ai-translation' ),
					'confirmReplace' => __( 'This will replace existing menus in the selected languages. Continue?', 'linguator-multilingual-ai-translation' ),
					'emptyMenuError' => __( 'The source menu is empty. Please add menu items before syncing.', 'linguator-multilingual-ai-translation' ),
					'noTranslatedContent' => __( 'No translated content is available for selected menu items. Please add and translate content in other languages first.', 'linguator-multilingual-ai-translation' ),
					'permissionError' => __( 'You do not have permission to sync menus.', 'linguator-multilingual-ai-translation' ),
					'invalidMenuError' => __( 'Invalid menu selected.', 'linguator-multilingual-ai-translation' ),
					'noTranslationsError' => __( 'No menu items could be synced. Please ensure translations exist for your menu items.', 'linguator-multilingual-ai-translation' ),
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
			wp_send_json_error( array( 
				'message' => __( 'You do not have permission to perform this action.', 'linguator-multilingual-ai-translation' ),
				'error_code' => 'permission_denied'
			) );
		}

		// Get parameters
		$menu_id = isset( $_POST['menu_id'] ) ? absint( $_POST['menu_id'] ) : 0;
		$target_langs = isset( $_POST['target_langs'] ) && is_array( $_POST['target_langs'] ) ? array_map( 'sanitize_text_field', $_POST['target_langs'] ) : array();

			if ( empty( $menu_id ) ) {
				wp_send_json_error( array( 
					'message' => __( 'Invalid menu ID.', 'linguator-multilingual-ai-translation' ),
					'error_code' => 'invalid_menu_id'
				) );
			}

			if ( empty( $target_langs ) ) {
				wp_send_json_error( array( 
					'message' => __( 'No target languages selected.', 'linguator-multilingual-ai-translation' ),
					'error_code' => 'no_languages_selected'
				) );
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
				'error_code' => 'empty_menu'
			);
		}

		// Get source menu object
		$source_menu = wp_get_nav_menu_object( $source_menu_id );
		if ( ! $source_menu ) {
			return array(
				'success' => false,
				'message' => __( 'Source menu not found.', 'linguator-multilingual-ai-translation' ),
				'error_code' => 'menu_not_found'
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
			$result['error_code'] = 'no_translations';
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

		// Create or get target menu with unique name handling
		$base_menu_name = $source_menu->name . ' (' . $lang->name . ')';
		$target_menu = wp_get_nav_menu_object( $base_menu_name );

		if ( $target_menu ) {
			// Menu already exists - verify it's not assigned to a different language
			$existing_menu_lang = $this->get_menu_language( $target_menu->term_id );
			
			if ( $existing_menu_lang && $existing_menu_lang !== $lang->slug ) {
				// Menu exists but assigned to different language - generate unique name
				$target_menu_name = $this->generate_unique_menu_name( $source_menu->name, $lang->name );
				$target_menu_id = wp_create_nav_menu( $target_menu_name );
				if ( is_wp_error( $target_menu_id ) ) {
					return $result;
				}
			} else {
				// Use existing menu and delete its items
				$target_menu_id = $target_menu->term_id;
				
				// Delete existing menu items in batch
				$existing_items = wp_get_nav_menu_items( $target_menu_id );
				if ( $existing_items ) {
					foreach ( $existing_items as $item ) {
						wp_delete_post( $item->ID, true );
					}
				}
			}
		} else {
			// Create new menu
			$target_menu_id = wp_create_nav_menu( $base_menu_name );
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

		// Check if post type item has translation (supports all post types including custom)
		if ( $item->type === 'post_type' ) {
			// Check if this post type is enabled for translation in Linguator
			if ( ! $this->model->post->is_translated_object_type( $item->object ) ) {
				return false;
			}
			
			// Check if the source post has a language assigned
			$source_lang = $this->model->post->get_language( $item->object_id );
			if ( ! $source_lang ) {
				return false;
			}
			
			$translations = lmat_get_post_translations( $item->object_id );
			
			// If no translations array exists, the post isn't in a translation group yet
			if ( empty( $translations ) ) {
				return false;
			}
			
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
		if ( $item->type === 'post_type' ) {
			// Check if this post type is enabled for translation in Linguator
			if ( ! $this->model->post->is_translated_object_type( $item->object ) ) {
				return false; // Post type not enabled for translation
			}
			
			// Get translated post (supports all post types including custom)
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
				if ( $assigned_menu_id === $menu_id ) {
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
	 * Generate a unique menu name to avoid collisions
	 * Handles cases where menu name already exists with different language assignment
	 *
	 * @param string $base_name Base menu name.
	 * @param string $lang_name Language name.
	 * @return string Unique menu name.
	 */
	private function generate_unique_menu_name( $base_name, $lang_name ) {
		$menu_name = $base_name . ' (' . $lang_name . ')';
		$counter = 1;
		
		// Keep incrementing counter until we find a unique name
		while ( wp_get_nav_menu_object( $menu_name ) ) {
			$menu_name = $base_name . ' (' . $lang_name . ') ' . $counter;
			$counter++;
			
			// Safety limit to prevent infinite loops
			if ( $counter > 100 ) {
				$menu_name = $base_name . ' (' . $lang_name . ') ' . time();
				break;
			}
		}
		
		return $menu_name;
	}

	/**
	 * Build cache of menu ID to language mappings
	 * Prevents N+1 query problem when checking multiple menu languages
	 *
	 * @return void
	 */
	private function build_menu_language_cache() {
		if ( $this->menu_language_cache !== null ) {
			return; // Already cached
		}
		
		$this->menu_language_cache = array();
		$nav_menus = $this->options->get( 'nav_menus' );
		
		if ( empty( $nav_menus[ $this->theme ] ) ) {
			return;
		}

		foreach ( $nav_menus[ $this->theme ] as $location => $languages ) {
			foreach ( $languages as $lang => $assigned_menu_id ) {
				// Store menu_id => language mapping
				$this->menu_language_cache[ $assigned_menu_id ] = $lang;
			}
		}
	}

	/**
	 * Get the language assigned to a menu
	 * Uses cache to avoid repeated database queries
	 *
	 * @param int $menu_id Menu ID.
	 * @return string Language slug or empty string if not found.
	 */
	private function get_menu_language( $menu_id ) {
		// Build cache on first call
		$this->build_menu_language_cache();
		
		// Return from cache
		return isset( $this->menu_language_cache[ $menu_id ] ) 
			? $this->menu_language_cache[ $menu_id ] 
			: '';
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
		global $wpdb;
		
		// Get all translatable post types (includes custom post types)
		$post_types = $this->model->post->get_translated_object_types();
		
		// If no post types are enabled, return false
		if ( empty( $post_types ) ) {
			return false;
		}
		
		// Get the language term ID for faster querying
		$lang_term = get_term_by( 'slug', $lang_slug, 'lmat_language' );
		if ( ! $lang_term ) {
			return false;
		}
		
		// Use direct SQL query for maximum performance
		// This avoids WP_Query overhead and is much faster
		$post_types_placeholder = implode( ',', array_fill( 0, count( $post_types ), '%s' ) );
		
		$sql = "SELECT 1 
				FROM {$wpdb->posts} p 
				INNER JOIN {$wpdb->term_relationships} tr ON p.ID = tr.object_id
				INNER JOIN {$wpdb->term_taxonomy} tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
				WHERE tt.taxonomy = 'lmat_language' 
				AND tt.term_id = %d 
				AND p.post_status = 'publish' 
				AND p.post_type IN ($post_types_placeholder)
				LIMIT 1";
		
		$params = array_merge( array( $lang_term->term_id ), $post_types );
		$prepared_sql = $wpdb->prepare( $sql, $params );
		
		return (bool) $wpdb->get_var( $prepared_sql );
	}
}
