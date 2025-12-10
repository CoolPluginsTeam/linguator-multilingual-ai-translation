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
	 */
	public function __construct( &$linguator ) {
		$this->model = &$linguator->model;
		$this->options = &$linguator->options;
		$this->theme = get_option( 'stylesheet' );

		// Add hooks
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		add_action( 'wp_ajax_lmat_sync_menu', array( $this, 'ajax_sync_menu' ) );
		add_action( 'admin_footer', array( $this, 'add_sync_button' ) );
	}

	/**
	 * Add sync button next to Save Menu button
	 *
	 * @return void
	 */
	public function add_sync_button() {
		$screen = get_current_screen();
		if ( empty( $screen ) || 'nav-menus' !== $screen->base ) {
			return;
		}

		global $nav_menu_selected_id;
		
		if ( empty( $nav_menu_selected_id ) ) {
			return;
		}
		
		// Detect current menu's language
		$current_menu_lang = $this->get_menu_language( $nav_menu_selected_id );
		
		?>
		<script type="text/javascript">
		jQuery(document).ready(function($) {
			// Find the Save Menu button and add our Sync button next to it
			var $saveButton = $('#save_menu_header');
			if ($saveButton.length) {
				var $syncButton = $('<button type="button" id="lmat-sync-menu-btn" class="button button-secondary" data-menu-id="<?php echo esc_attr( $nav_menu_selected_id ); ?>" data-menu-lang="<?php echo esc_attr( $current_menu_lang ); ?>" style="margin-left: 10px;"><?php esc_html_e( 'Sync Menu', 'linguator-multilingual-ai-translation' ); ?></button>');
				$saveButton.after($syncButton);
				
				// Add result container below the buttons
				var $resultContainer = $('<div id="lmat-sync-result" style="display:none; margin-top: 15px; clear: both;"></div>');
				$('#nav-menu-header').after($resultContainer);
			}
		});
		</script>
		<?php
	}



	/**
	 * Enqueue scripts and styles
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		$screen = get_current_screen();
		if ( empty( $screen ) || 'nav-menus' !== $screen->base ) {
			return;
		}

		// Enqueue CSS
		wp_enqueue_style(
			'lmat-menu-sync',
			plugins_url( 'admin/assets/css/admin-menu-sync.css', LINGUATOR_ROOT_FILE ),
			array(),
			LINGUATOR_VERSION
		);

		// Enqueue JavaScript
		wp_enqueue_script(
			'lmat-menu-sync',
			plugins_url( 'admin/assets/js/admin-menu-sync.js', LINGUATOR_ROOT_FILE ),
			array( 'jquery' ),
			LINGUATOR_VERSION,
			true
		);

		// Get available languages
		$languages = $this->model->get_languages_list();
		$lang_data = array();
		
		// Get source menu object to check for existing synced menus
		global $nav_menu_selected_id;
		$source_menu = wp_get_nav_menu_object( $nav_menu_selected_id );
		
		// Extract base menu name (remove language suffix if present)
		$base_menu_name = '';
		if ( $source_menu ) {
			$base_menu_name = $source_menu->name;
			// Remove language suffix pattern like " (Language)" or " (भाषा)"
			$base_menu_name = preg_replace( '/\s*\([^)]+\)\s*$/', '', $base_menu_name );
		}
		
		// Get all menus to check for existing synced versions
		$all_menus = wp_get_nav_menus();
		$existing_menu_langs = array();
		
		// First, check if a menu with the exact base name exists (this is typically the default language)
		// But exclude the current menu itself
		$base_menu_exists = false;
		foreach ( $all_menus as $menu ) {
			// Only count it if it's not the currently selected menu
			if ( $menu->name === $base_menu_name && $menu->term_id != $nav_menu_selected_id ) {
				$base_menu_exists = true;
				break;
			}
		}
		
		foreach ( $all_menus as $menu ) {
			// Skip the currently selected menu
			if ( $menu->term_id == $nav_menu_selected_id ) {
				continue;
			}
			
			// Check if this is the base menu (matches exactly) - assign to default language
			if ( $base_menu_exists && $menu->name === $base_menu_name ) {
				foreach ( $languages as $lang ) {
					if ( !empty( $lang->is_default ) ) {
						$existing_menu_langs[ $lang->slug ] = true;
						break;
					}
				}
			}
			
			// Check if this menu matches various patterns for each language
			// IMPORTANT: Only check menus that start with the base menu name
			$menu_name_lower = strtolower( $menu->name );
			$base_name_lower = strtolower( $base_menu_name );
			
			// Only proceed if the menu name starts with the base menu name
			if ( strpos( $menu_name_lower, $base_name_lower ) !== 0 ) {
				continue;
			}
			
			foreach ( $languages as $lang ) {
				$lang_name_lower = strtolower( $lang->name );
				
				// Pattern 1: "base_name (language_name)" - exact match
				$pattern1 = $base_name_lower . ' (' . $lang_name_lower . ')';
				
				// Pattern 2: Check if menu name contains the language name in parentheses after base name
				$pattern2 = $base_name_lower . ' (' . $lang_name_lower;
				
				// Pattern 3: Check for "base_name language_name" 
				$pattern3 = $base_name_lower . ' ' . $lang_name_lower;
				
				if ( $menu_name_lower === $pattern1 || 
				     strpos( $menu_name_lower, $pattern2 ) === 0 ||
				     $menu_name_lower === $pattern3 ) {
					$existing_menu_langs[ $lang->slug ] = true;
					break;
				}
			}
		}
		
		foreach ( $languages as $lang ) {
			$lang_data[] = array(
				'slug' => $lang->slug,
				'name' => $lang->name,
				'is_default' => !empty( $lang->is_default ),
				'has_synced_menu' => isset( $existing_menu_langs[ $lang->slug ] ),
			);
		}

		// Localize script
		wp_localize_script(
			'lmat-menu-sync',
			'lmatMenuSync',
			array(
				'ajaxUrl' => admin_url( 'admin-ajax.php' ),
				'nonce' => wp_create_nonce( 'lmat_sync_menu' ),
				'languages' => $lang_data,
				'strings' => array(
					'selectLanguages' => __( 'Select languages to sync:', 'linguator-multilingual-ai-translation' ),
					'selectAll' => __( 'Select All', 'linguator-multilingual-ai-translation' ),
					'deselectAll' => __( 'Deselect All', 'linguator-multilingual-ai-translation' ),
					'sync' => __( 'Sync', 'linguator-multilingual-ai-translation' ),
					'cancel' => __( 'Cancel', 'linguator-multilingual-ai-translation' ),
					'syncing' => __( 'Syncing menus...', 'linguator-multilingual-ai-translation' ),
					'success' => __( 'Menu synced successfully!', 'linguator-multilingual-ai-translation' ),
					'error' => __( 'Error syncing menu. Please try again.', 'linguator-multilingual-ai-translation' ),
					'noLanguages' => __( 'Please select at least one language.', 'linguator-multilingual-ai-translation' ),
					'confirmReplace' => __( 'This will replace existing menus in the selected languages. Continue?', 'linguator-multilingual-ai-translation' ),
					'emptyMenuError' => __( 'The source menu is empty. Please add menu items before syncing.', 'linguator-multilingual-ai-translation' ),
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
		// Verify nonce
		check_ajax_referer( 'lmat_sync_menu', 'nonce' );

		// Check capabilities
		if ( ! current_user_can( 'edit_theme_options' ) ) {
			wp_send_json_error( array( 'message' => __( 'You do not have permission to perform this action.', 'linguator-multilingual-ai-translation' ) ) );
		}

		// Get parameters
		$menu_id = isset( $_POST['menu_id'] ) ? absint( $_POST['menu_id'] ) : 0;
		$target_langs = isset( $_POST['target_langs'] ) && is_array( $_POST['target_langs'] ) ? array_map( 'sanitize_text_field', $_POST['target_langs'] ) : array();

		if ( empty( $menu_id ) || empty( $target_langs ) ) {
			wp_send_json_error( array( 'message' => __( 'Invalid parameters.', 'linguator-multilingual-ai-translation' ) ) );
		}

		// Perform sync
		$result = $this->sync_menu_to_languages( $menu_id, $target_langs );

		if ( $result['success'] ) {
			wp_send_json_success( $result );
		} else {
			wp_send_json_error( $result );
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
			$lang = $this->model->get_language( $lang_slug );
			
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

		// Create or get target menu
		$target_menu_name = $source_menu->name . ' (' . $lang->name . ')';
		$target_menu = wp_get_nav_menu_object( $target_menu_name );

		if ( $target_menu ) {
			// Delete existing menu items
			$existing_items = wp_get_nav_menu_items( $target_menu->term_id );
			if ( $existing_items ) {
				foreach ( $existing_items as $item ) {
					wp_delete_post( $item->ID, true );
				}
			}
			$target_menu_id = $target_menu->term_id;
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

		// Assign menu to locations
		if ( ! empty( $menu_locations ) ) {
			$this->assign_menu_to_locations( $target_menu_id, $lang->slug, $menu_locations );
		}

		return $result;
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
		if ( $item->type === 'post_type' && in_array( $item->object, array( 'post', 'page' ) ) ) {
			// Get translated post
			$translations = lmat_get_post_translations( $item->object_id );
			
			if ( isset( $translations[ $lang->slug ] ) ) {
				$translated_post_id = $translations[ $lang->slug ];
				$item_data['menu-item-object-id'] = $translated_post_id;
				
				// Get the translated post title
				$translated_post = get_post( $translated_post_id );
				if ( $translated_post ) {
					$item_data['menu-item-title'] = $translated_post->post_title;
				}
			} else {
				// No translation available, skip this item
				return false;
			}
		} elseif ( $item->type === 'taxonomy' ) {
			// Get translated term
			$translations = lmat_get_term_translations( $item->object_id );
			
			if ( isset( $translations[ $lang->slug ] ) ) {
				$translated_term_id = $translations[ $lang->slug ];
				$item_data['menu-item-object-id'] = $translated_term_id;
				
				// Get the translated term name
				$translated_term = get_term( $translated_term_id );
				if ( $translated_term && ! is_wp_error( $translated_term ) ) {
					$item_data['menu-item-title'] = $translated_term->name;
				}
			} else {
				// No translation available, skip this item
				return false;
			}
		} elseif ( $item->type === 'custom' ) {
			// Custom links are copied as-is
			// Language switcher items are also copied
		}

		// Add menu item
		$new_item_id = wp_update_nav_menu_item( $menu_id, 0, $item_data );

		if ( ! is_wp_error( $new_item_id ) ) {
			// Store mapping for parent relationships
			$item_id_map[ $item->ID ] = $new_item_id;
			
			// Copy custom meta if exists
			if ( $item->type === 'custom' && $item->url === '#lmat_switcher' ) {
				$meta = get_post_meta( $item->ID, '_lmat_menu_item', true );
				if ( $meta ) {
					update_post_meta( $new_item_id, '_lmat_menu_item', $meta );
				}
			}
			
			return $new_item_id;
		}

		return false;
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
}
