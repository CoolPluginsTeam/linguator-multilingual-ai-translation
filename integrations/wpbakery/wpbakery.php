<?php
/**
 * WPBakery Page Builder integration for Linguator.
 *
 * @package Linguator
 */
namespace Linguator\Integrations\wpbakery;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Manages the compatibility with WPBakery Page Builder (formerly Visual Composer).
 *
 * This class ensures that WPBakery Page Builder content is properly handled
 * when creating translations in Linguator, similar to the Elementor integration.
 *
 * @since 1.0.4
 */
class Linguator_WPBakery {
	/**
	 * Constructor
	 *
	 * Initializes the WPBakery Page Builder compatibility features.
	 *
	 * @since 1.0.4
	 */
	public function __construct() {
		self::wpbakery_compatibility();
	}

	/**
	 * WPBakery Page Builder compatibility.
	 *
	 * Fix WPBakery Page Builder compatibility with Linguator.
	 * This ensures that page builder content is copied when creating translations.
	 *
	 * @since 1.0.4
	 * @access private
	 * @static
	 */
	private static function wpbakery_compatibility() {
		// Copy WPBakery meta when translation is created via REST API
		add_action( 'lmat_translation_created', [ __CLASS__, 'linguator_copy_meta_on_translation_created' ], 10, 2 );
		
		// Copy WPBakery meta when translation is created via bulk translation (sync system)
		add_action( 'lmat_created_sync_post', [ __CLASS__, 'linguator_copy_meta_on_sync_post_created' ], 10, 2 );
		
		// Set default content for new WPBakery translations
		add_filter( 'default_content', [ __CLASS__, 'linguator_set_default_translation_content' ], 10, 2 );
		
		// Ensure WPBakery editor is available for translated posts
		add_filter( 'vc_is_valid_post_type_be', [ __CLASS__, 'linguator_enable_wpbakery_editor' ], 10, 2 );
		
		// Mark WPBakery posts as "classic" editor type for translation but preserve structure
		add_filter( 'lmat_editor_type', [ __CLASS__, 'linguator_set_wpbakery_editor_type' ], 10, 2 );
		
		// Disable Gutenberg for WPBakery translation creation
		add_filter( 'use_block_editor_for_post', [ __CLASS__, 'linguator_disable_gutenberg_for_wpbakery' ], 10, 2 );
		
		// Filter post content for translation - decode and expose WPBakery content
		// These filters work for both single page translation and bulk translation
		// Priority 10: Decode base64 encoded attributes
		add_filter( 'lmat_post_content_for_translation', [ __CLASS__, 'decode_wpbakery_shortcodes' ], 10 );
		// Priority 20: Expose translatable attributes as [lmat_val] tags
		add_filter( 'lmat_post_content_for_translation', [ __CLASS__, 'expose_translatable_attributes' ], 20 );
		
		// Filter post content before saving to re-encode WPBakery attributes
		add_filter( 'wp_insert_post_data', [ __CLASS__, 'linguator_encode_wpbakery_content_before_save' ], 10, 2 );
		
		// Clean up translation markers on frontend output only (not wp-admin).
		add_action( 'wp', [ __CLASS__, 'linguator_register_frontend_the_content_cleanup' ], 0 );
	}

	/**
	 * Attach `the_content` cleanup only on public requests.
	 *
	 * Avoids registering a global `the_content` filter while wp-admin is loading.
	 * The callback still returns unchanged content unless markers are present
	 * (`#lmat_page_translation*`, `[lmat_val`, `___LMAT_`), so non-WPBakery posts
	 * pay only a few strpos checks per `the_content` run (singular, archives, feeds).
	 *
	 * @since 1.0.10
	 *
	 * @return void
	 */
	public static function linguator_register_frontend_the_content_cleanup() {
		if ( is_admin() ) {
			return;
		}
		// Priority 5: before shortcodes so stray markers never reach VC parsing.
		add_filter( 'the_content', [ __CLASS__, 'linguator_cleanup_content_on_frontend' ], 5 );
	}

	/**
	 * Copy WPBakery Page Builder meta.
	 *
	 * Duplicate the WPBakery data from one post to another.
	 * This includes all Visual Composer settings and content.
	 *
	 * @since 1.0.4
	 * @access public
	 * @static
	 *
	 * @param int $from_post_id Original post ID.
	 * @param int $to_post_id   Target post ID.
	 */
	public static function linguator_copy_wpbakery_meta( $from_post_id, $to_post_id ) {
		$from_post_meta = get_post_meta( $from_post_id );
		
		// Core meta fields to copy
		$core_meta = [
			'_wp_page_template',
			'_thumbnail_id',
		];

		foreach ( $from_post_meta as $meta_key => $values ) {
			$should_copy = false;

			// Check if it's a core meta field
			if ( in_array( $meta_key, $core_meta, true ) ) {
				$should_copy = true;
			}
			
			// Check if it's a WPBakery meta field (starts with _wpb, _vc, or vcv)
			if ( strpos( $meta_key, '_wpb' ) === 0 || 
			     strpos( $meta_key, '_vc' ) === 0 || 
			     strpos( $meta_key, 'vcv' ) === 0 ) {
				$should_copy = true;
			}

			if ( $should_copy ) {
				$value = $values[0];
				
				// Unserialize if needed
				$value = maybe_unserialize( $value );

				// Don't use `update_post_meta` that can't handle `revision` post type.
				update_metadata( 'post', $to_post_id, $meta_key, $value );
			}
		}
	}

	/**
	 * Copy WPBakery meta when a translation is created.
	 *
	 * This hooks into the lmat_translation_created action that fires after
	 * a translation is created via REST API and translations are linked.
	 *
	 * @since 1.0.5
	 * @access public
	 * @static
	 *
	 * @param int    $new_post_id      New translation post ID.
	 * @param int    $source_id        Source post ID.
	 */
	public static function linguator_copy_meta_on_translation_created( $new_post_id, $source_id ) {
		// Check if source post uses WPBakery
		$wpb_status = get_post_meta( $source_id, '_wpb_vc_js_status', true );
		
		// Only copy if source post has WPBakery enabled
		if ( 'true' === $wpb_status || true === $wpb_status ) {
			// Copy WPBakery meta fields
			self::linguator_copy_wpbakery_meta( $source_id, $new_post_id );
			
			// Copy post content (which contains WPBakery shortcodes)
			$source_post = get_post( $source_id );
			if ( $source_post && ! empty( $source_post->post_content ) ) {
				wp_update_post( array(
					'ID'           => $new_post_id,
					'post_content' => $source_post->post_content,
				) );
			}
		}
	}

	/**
	 * Copy WPBakery meta when a translation is created via bulk translation.
	 *
	 * This hooks into the lmat_created_sync_post action that fires after
	 * a translation is created via the sync system (bulk translation).
	 *
	 * @since 1.0.6
	 * @access public
	 * @static
	 *
	 * @param int    $source_id        Source post ID.
	 * @param int    $new_post_id      New translation post ID.
	 */
	public static function linguator_copy_meta_on_sync_post_created( $source_id, $new_post_id ) {
		// Check if source post uses WPBakery
		$wpb_status = get_post_meta( $source_id, '_wpb_vc_js_status', true );
		
		// Only copy if source post has WPBakery enabled
		if ( 'true' === $wpb_status || true === $wpb_status ) {
			// Copy WPBakery meta fields
			self::linguator_copy_wpbakery_meta( $source_id, $new_post_id );
			
			// Note: Content is already copied by the sync system,
			// but we need to ensure WPBakery-specific meta is copied
		}
	}

	/**
	 * Set default content for new WPBakery translations.
	 *
	 * When creating a new post with from_post parameter (translation),
	 * set the default content to the source post's content.
	 *
	 * @since 1.0.5
	 * @access public
	 * @static
	 *
	 * @param string  $content Default content.
	 * @param WP_Post $post    Post object.
	 * @return string Modified content.
	 */
	public static function linguator_set_default_translation_content( $content, $post ) {
		// Only for new posts
		if ( ! $post || 'auto-draft' !== $post->post_status ) {
			return $content;
		}
		
		// Check if we have from_post parameter
		if ( ! isset( $_GET['from_post'], $_GET['_wpnonce'] ) ) {
			return $content;
		}
		
		$nonce = sanitize_text_field( wp_unslash( $_GET['_wpnonce'] ) );
		if ( ! wp_verify_nonce( $nonce, 'new-post-translation' ) ) {
			return $content;
		}

		$from_post_id = absint( wp_unslash( $_GET['from_post'] ) );
		if ( ! $from_post_id ) {
			return $content;
		}

		if ( ! current_user_can( 'edit_post', $from_post_id ) ) {
			return $content;
		}
		
		// Check if source post uses WPBakery
		$wpb_status = get_post_meta( $from_post_id, '_wpb_vc_js_status', true );
		if ( 'true' !== $wpb_status && true !== $wpb_status ) {
			return $content;
		}
		
		// Get the source post content
		$source_post = get_post( $from_post_id );
		if ( ! $source_post || empty( $source_post->post_content ) ) {
			return $content;
		}
		
		// Also copy WPBakery meta to the new post
		if ( $post->ID ) {
			self::linguator_copy_wpbakery_meta( $from_post_id, $post->ID );
		}
		
		return $source_post->post_content;
	}

	/**
	 * Enable WPBakery Page Builder editor for translated posts.
	 *
	 * Ensures that the WPBakery backend editor is available for
	 * posts in all languages, not just the original.
	 *
	 * @since 1.0.4
	 * @access public
	 * @static
	 *
	 * @param bool   $is_valid Whether the post type is valid for WPBakery.
	 * @param string $type     The post type being checked.
	 *
	 * @return bool Whether the post type is valid for WPBakery.
	 */
	public static function linguator_enable_wpbakery_editor( $is_valid, $type ) {
		// If already valid, return as is
		if ( $is_valid ) {
			return $is_valid;
		}

		// Check if this is a translated post
		global $post;
		if ( $post && linguator_get_post_language( $post->ID ) ) {
			// If it has a language assigned, it's likely a translation
			// Allow WPBakery editor
			return true;
		}

		return $is_valid;
	}

	/**
	 * Set editor type for WPBakery posts.
	 *
	 * Ensures that WPBakery posts are properly identified during translation.
	 * WPBakery stores content as shortcodes in post_content, similar to classic editor,
	 * but needs special handling to preserve the structure.
	 *
	 * @since 1.0.4
	 * @access public
	 * @static
	 *
	 * @param string $editor_type The current editor type.
	 * @param int    $post_id     The post ID being checked.
	 *
	 * @return string The editor type.
	 */
	public static function linguator_set_wpbakery_editor_type( $editor_type, $post_id ) {
		// Check if this post uses WPBakery
		$wpb_status = get_post_meta( $post_id, '_wpb_vc_js_status', true );
		
		// If WPBakery is active on this post, set editor type to wpbakery
		if ( 'true' === $wpb_status || true === $wpb_status ) {
			return 'wpbakery';
		}

		return $editor_type;
	}

	/**
	 * Disable Gutenberg editor for WPBakery posts.
	 *
	 * When creating a translation from a WPBakery post, disable Gutenberg
	 * and force classic editor mode so WPBakery can load.
	 *
	 * @since 1.0.5
	 * @access public
	 * @static
	 *
	 * @param bool    $use_block_editor Whether to use the block editor.
	 * @param WP_Post $post             The post being edited.
	 * @return bool Whether to use the block editor.
	 */
	public static function linguator_disable_gutenberg_for_wpbakery( $use_block_editor, $post ) {
		// If already disabled, return
		if ( ! $use_block_editor ) {
			return $use_block_editor;
		}
		
		// Check if this is a WPBakery post
		if ( $post && $post->ID ) {
			$wpb_status = get_post_meta( $post->ID, '_wpb_vc_js_status', true );
			if ( 'true' === $wpb_status || true === $wpb_status ) {
				return false; // Disable Gutenberg
			}
		}
		
		// Check if we're creating a translation from a WPBakery post
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- WordPress core parameter, no nonce available
		if ( isset( $_GET['from_post'] ) ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- WordPress core parameter, sanitized with absint()
			$from_post_id = absint( wp_unslash( $_GET['from_post'] ) );
			if ( $from_post_id ) {
				$wpb_status = get_post_meta( $from_post_id, '_wpb_vc_js_status', true );
				if ( 'true' === $wpb_status || true === $wpb_status ) {
					return false; // Disable Gutenberg
				}
			}
		}
		
		return $use_block_editor;
	}

	/**
	 * Decode base64-encoded WPBakery shortcode attributes.
	 *
	 * WPBakery uses rawurlencode(base64_encode()) for shortcode attributes.
	 * Example: title="JTIwT25saW5lJTIwRWR1Y2F0aW9u"
	 *
	 * @since 1.0.4
	 * @access public
	 * @static
	 *
	 * @param string $content The post content.
	 *
	 * @return string Content with decoded shortcode attributes.
	 */
	public static function decode_wpbakery_shortcodes( $content ) {
		// Check if this contains WPBakery shortcodes
		if ( false === strpos( $content, '[vc_' ) ) {
			return $content;
		}

		// Decode all shortcode attributes that look like base64
		// Pattern: attribute="base64string" where base64string may contain % encoding
		// Updated regex to support attributes with dashes (e.g. data-foo)
		$content = preg_replace_callback(
			'/([\w-]+)=(["\'])([A-Za-z0-9+\/=%]+)\2/',
			function( $matches ) {
				$attribute = $matches[1];
				$quote = $matches[2];
				$value = $matches[3];

				// Skip attributes that are clearly not encoded or contain IDs/references
				// These should never be decoded or translated as they reference WordPress entities
				$skip_attributes = array( 
					'el_id', 'el_class', 'css', 'css_animation', 'link', 'url', 'image', 'img_size', 
					'img_id', 'video_id', 'gallery', 'images', 'font_container', 'google_fonts', 
					'post_id', 'taxonomy', 'term_id', 'color', 'custom_background', 'custom_text',
					'outline_custom_color', 'outline_custom_hover_background', 'outline_custom_hover_text'
				);
				if ( in_array( $attribute, $skip_attributes, true ) ) {
					return $matches[0];
				}

				// Try to decode if it contains % or looks like base64
				$decoded = rawurldecode( $value );
				
				// Check if the result is valid base64
				$test_decode = base64_decode( $decoded, true );
				
				// Validate: Base64 decode must be successful AND re-encoding must match the decoded string (rawurldecode result)
				// This prevents decoding of plain text that accidentally looks like base64
				if ( false !== $test_decode && base64_encode( $test_decode ) === $decoded ) {
					// Successfully decoded - return the readable text
					$final_value = base64_decode( $decoded );
					// Escape for use in attribute
					return $attribute . '=' . $quote . esc_attr( $final_value ) . $quote;
				}

				// Return original if not encoded
				return $matches[0];
			},
			$content
		);

		return $content;
	}

	/**
	 * Expose specific WPBakery attributes as content for translation.
	 * 
	 * Uses WPBakery's API to dynamically detect translatable attributes,
	 * 
	 * 
	 * @since 1.0.5
	 * @access public
	 * @static
	 * 
	 * @param string $content Post content.
	 * @return string Content with attributes exposed.
	 */
	public static function expose_translatable_attributes( $content ) {
		if ( false === strpos( $content, '[vc_' ) ) {
			return $content;
		}

		// Text-based parameter types that should be translated
		$translatable_param_types = [
			'textfield',
			'textarea',
			'textarea_html',
			'textarea_raw_html',
			'textarea_safe',
			'textfield_html',
		];
		
		// Parameter types that might contain translatable content but need special handling
		$json_param_types = [
			'param_group',
			'textarea_raw_html',
		];
		
		// Attributes that contain JSON data with translatable nested properties
		// Format: attribute_name => array of json keys to translate
		$json_attributes = [
			'values' => [ 'label', 'title', 'text' ], // For vc_progress_bar, pie charts, etc.
		];
		
		// Attributes that should never be translated (colors, CSS, IDs, etc.)
		$skip_attributes = [
			'css', 'color', 'custom_background', 'custom_text', 'outline_custom_color',
			'outline_custom_hover_background', 'outline_custom_hover_text', 'font_container',
			'google_fonts', 'css_animation', 'el_class', 'el_id', 'css_id', 'css_class',
			'url', 'link', 'href', 'src', 'source', 'background_image', 'bg_image',
			'icon', 'icon_type', 'icon_fontawesome', 'icon_openiconic', 'icon_typicons',
			'icon_entypo', 'icon_linecons', 'icon_monosocial', 'icon_material',
		];
		
		// Attributes that contain IDs or references that should be protected
		$protected_attributes = [
			'image', 'img_size', 'img_id', 'video_id', 'gallery', 'images', 'post_id',
			'taxonomy', 'term_id', 'el_id', 'attachment_id', 'media_id', 'page_id',
		];

		// Match shortcodes and their attributes 
		$content = preg_replace_callback(
			'/(\[(vc_[\w-]+))([^\]]*)(\])/s',
			function( $matches ) use ( $translatable_param_types, $json_param_types, $json_attributes, $protected_attributes, $skip_attributes ) {
				$tag_start = $matches[1];
				$shortcode_tag = $matches[2]; // Full shortcode tag (e.g., vc_column_text)
				$attributes_str = $matches[3];
				$tag_end = $matches[4];
				$append_content = '';

				// Get shortcode definition from WPBakery API
				$shortcode_def = self::linguator_get_wpbakery_shortcode_definition( $shortcode_tag );
				$dynamic_translatable_attrs = [];
				
				if ( $shortcode_def && ! empty( $shortcode_def['params'] ) ) {
					// Extract translatable attributes from WPBakery API
					foreach ( $shortcode_def['params'] as $param ) {
						if ( ! empty( $param['param_name'] ) && ! empty( $param['type'] ) ) {
							$param_name = $param['param_name'];
							$param_type = $param['type'];
							
							// Check if this parameter type is translatable
							if ( in_array( $param_type, $translatable_param_types, true ) ) {
								$dynamic_translatable_attrs[] = $param_name;
							}
							
							// Check for JSON-based parameters
							if ( in_array( $param_type, $json_param_types, true ) && isset( $json_attributes[ $param_name ] ) ) {
								// Already handled in $json_attributes
							}
						}
					}
				}

				// Find attributes in the string - using /s modifier to handle multiline values
				$attributes_str = preg_replace_callback(
					'/([\w-]+)=(["\'])((?:(?!\2).)*)\2/s',
					function( $attr_matches ) use ( $dynamic_translatable_attrs, $json_attributes, $protected_attributes, $skip_attributes, &$append_content ) {
						$attr_name = $attr_matches[1];
						$attr_quote = $attr_matches[2];
						$attr_val = $attr_matches[3];

						// Skip attributes that should never be translated (colors, CSS, etc.)
						if ( in_array( $attr_name, $skip_attributes, true ) ) {
							return $attr_matches[0];
						}

						// Handle JSON-encoded attributes (e.g., values in vc_progress_bar)
						if ( isset( $json_attributes[ $attr_name ] ) && ! empty( $attr_val ) ) {
							$processed_json = self::linguator_process_json_attribute( $attr_val, $json_attributes[ $attr_name ], $append_content );
							if ( $processed_json !== $attr_val ) {
								// JSON was processed and tokens were added to append_content
								return $attr_name . '=' . $attr_quote . $processed_json . $attr_quote;
							}
						}

						// Check if attribute is translatable (from WPBakery API or heuristics)
						$is_translatable = false;
						
						if ( in_array( $attr_name, $dynamic_translatable_attrs, true ) ) {
							// Found in WPBakery API definition
							$is_translatable = true;
						} else {
							// Fallback: Use heuristics to detect translatable attributes
							$is_translatable = self::linguator_is_attribute_translatable_by_heuristics( $attr_name, $attr_val );
						}

						if ( $is_translatable && ! empty( $attr_val ) ) {
							// Skip if already tokenized
							if ( strpos( $attr_val, '___LMAT_' ) === 0 ) {
								return $attr_matches[0];
							}
							
							// Skip if value looks like a color code or CSS
							if ( preg_match( '/^#[0-9a-fA-F]{3,6}$/', $attr_val ) || 
							     preg_match( '/^%23[0-9a-fA-F]{3,6}$/', $attr_val ) ||
							     strpos( $attr_val, 'vc_custom_' ) === 0 ) {
								return $attr_matches[0];
							}
							
							// Clean data-start and data-end attributes before exposing for translation
							$cleaned_attr_val = self::linguator_clean_data_attributes( $attr_val );
							
							// Generate a unique token for this attribute
							$token = '___LMAT_' . md5( $attr_name . $attr_val . wp_rand() ) . '___';
							
							// Create the value tag with the ID using cleaned value
							$append_content .= ' [lmat_val id="' . $token . '"]' . $cleaned_attr_val . '[/lmat_val]';
							
							// Replace the attribute value with the token
							return $attr_name . '=' . $attr_quote . $token . $attr_quote;
						}
						
						// Protect ID-based attributes by encoding them in a token
						if ( in_array( $attr_name, $protected_attributes, true ) && ! empty( $attr_val ) ) {
							// Skip if already protected
							if ( strpos( $attr_val, '___LMAT_PROTECTED_' ) === 0 ) {
								return $attr_matches[0];
							}
							
							// Encode the value in base64 so we can decode it later
							// Format: ___LMAT_PROTECTED_{base64}___
							$protected_token = '___LMAT_PROTECTED_' . base64_encode( $attr_val ) . '___';
							return $attr_name . '=' . $attr_quote . $protected_token . $attr_quote;
						}
						
						return $attr_matches[0];
					},
					$attributes_str
				);

				return $tag_start . $attributes_str . $tag_end . $append_content;
			},
			$content
		);
		
		// Also handle content between shortcode tags (e.g., [vc_column_text]content[/vc_column_text])
		$content = self::linguator_expose_shortcode_content( $content );

		return $content;
	}
	
	/**
	 * Get WPBakery shortcode definition using WPBakery API.
	 * 
	 * @since 1.0.10
	 * @access private
	 * @static
	 * 
	 * @param string $shortcode_tag The shortcode tag (e.g., 'vc_column_text').
	 * @return array|null Shortcode definition array or null if not found.
	 */
	private static function linguator_get_wpbakery_shortcode_definition( $shortcode_tag ) {
		// Check if WPBakery API is available
		if ( ! class_exists( 'WPBMap' ) || ! method_exists( 'WPBMap', 'getShortCode' ) ) {
			return null;
		}
		
		try {
			$shortcode_def = \WPBMap::getShortCode( $shortcode_tag );
			return $shortcode_def ? $shortcode_def : null;
		} catch ( \Exception $e ) {
			// WPBakery API might throw exceptions, return null on error
			return null;
		}
	}
	
	/**
	 * Determine if an attribute is translatable using heuristics.
	 * 
	 * This is a fallback method when WPBakery API is not available or
	 * doesn't have the shortcode definition. Uses naming patterns and
	 * value analysis to detect translatable content.
	 * 
	 * @since 1.0.10
	 * @access private
	 * @static
	 * 
	 * @param string $attr_name Attribute name.
	 * @param string $attr_val Attribute value.
	 * @return bool True if attribute appears to be translatable.
	 */
	private static function linguator_is_attribute_translatable_by_heuristics( $attr_name, $attr_val ) {
		// Skip if value is empty or too short
		if ( empty( $attr_val ) || strlen( trim( $attr_val ) ) < 2 ) {
			return false;
		}
		
		// Skip if value looks like an ID, URL, or technical value
		if ( preg_match( '/^(https?:\/\/|#|@|\d+$|vc_|wp-|data-)/i', $attr_val ) ) {
			return false;
		}
		
		// Skip if value is only numbers, special characters, or single character
		if ( preg_match( '/^[\d\s\-_\.]+$/', $attr_val ) || strlen( trim( $attr_val ) ) === 1 ) {
			return false;
		}
		
		// Common translatable attribute name patterns
		$translatable_patterns = [
			'/^(title|text|heading|subtitle|description|excerpt|label|caption|placeholder|content|value|message|quote|author|company|question|answer|button|link|name|name_plural)$/i',
			'/_(title|text|heading|subtitle|description|label|caption|content|value|message|quote|author|company|question|answer|button|link|name)$/i',
			'/^(h[1-6]|btn_|cta_|icon_|counter_|bar_|separator_|marker_|posts_|grid_|video_|price|gallery_|img_|tour_|primary_|hover_)/i',
		];
		
		foreach ( $translatable_patterns as $pattern ) {
			if ( preg_match( $pattern, $attr_name ) ) {
				// Additional check: value should contain letters (not just numbers/symbols)
				if ( preg_match( '/[a-zA-Z]/', $attr_val ) ) {
					return true;
				}
			}
		}
		
		return false;
	}
	
	/**
	 * Process JSON-encoded attribute values to extract translatable content.
	 * 
	 * Some WPBakery shortcodes (like vc_progress_bar) store data as URL-encoded JSON
	 * with translatable properties inside (e.g., "label", "title"). This function
	 * decodes the JSON, extracts translatable properties, wraps them in tokens,
	 * and creates lmat_val tags.
	 * 
	 * @since 1.0.9
	 * @access private
	 * @static
	 * 
	 * @param string $json_string The URL-encoded JSON string.
	 * @param array  $translatable_keys Array of JSON keys that should be translated.
	 * @param string &$append_content Reference to append_content string to add lmat_val tags.
	 * @return string Processed JSON string with tokens replacing translatable values.
	 */
	private static function linguator_process_json_attribute( $json_string, $translatable_keys, &$append_content ) {
		// Skip if already tokenized
		if ( strpos( $json_string, '___LMAT_' ) !== false ) {
			return $json_string;
		}
		
		// Decode URL encoding
		$decoded = rawurldecode( $json_string );
		
		// Try to decode JSON
		$data = json_decode( $decoded, true );
		
		// If not valid JSON, return original
		if ( ! is_array( $data ) ) {
			return $json_string;
		}
		
		// Process each item in the array/object
		$modified = false;
		array_walk_recursive(
			$data,
			function( &$value, $key ) use ( $translatable_keys, &$append_content, &$modified ) {
				// Only process if the key is in our translatable list and value is a non-empty string
				if ( in_array( $key, $translatable_keys, true ) && is_string( $value ) && ! empty( trim( $value ) ) ) {
					// Generate unique token
					$token = '___LMAT_' . md5( $key . $value . wp_rand() ) . '___';
					
					// Create lmat_val tag
					$append_content .= ' [lmat_val id="' . $token . '"]' . esc_attr( $value ) . '[/lmat_val]';
					
					// Replace value with token
					$value = $token;
					$modified = true;
				}
			}
		);
		
		// If we modified the data, re-encode it
		if ( $modified ) {
			// Encode back to JSON and then URL encode
			$new_json = json_encode( $data );
			return rawurlencode( $new_json );
		}
		
		return $json_string;
	}
	
	/**
	 * Clean HTML content by removing data-start and data-end attributes.
	 * 
	 * These attributes are added by the translation system as position markers
	 * and should not be included in the translatable content.
	 * 
	 * @since 1.0.8
	 * @access private
	 * @static
	 * 
	 * @param string $html HTML content with data attributes.
	 * @return string Cleaned HTML content.
	 */
	private static function linguator_clean_data_attributes( $html ) {
		// Remove data-start and data-end attributes from all HTML tags
		$html = preg_replace( '/\s+data-start="[^"]*"/', '', $html );
		$html = preg_replace( '/\s+data-end="[^"]*"/', '', $html );
		
		return $html;
	}

	/**
	 * Extract translatable text nodes from HTML content.
	 * 
	 * This function parses HTML and replaces text content with tokens,
	 * then creates lmat_val tags with only the text (no HTML tags).
	 * This makes the translation modal cleaner and easier to use.
	 * 
	 * @since 1.0.8
	 * @access private
	 * @static
	 * 
	 * @param string $html HTML content.
	 * @param string $shortcode_name The shortcode name (for token generation).
	 * @return string HTML with text replaced by tokens + lmat_val tags with text only.
	 */
	private static function linguator_extract_translatable_text_nodes( $html, $shortcode_name ) {
		// Separate existing lmat_val tags from HTML content
		$existing_lmat_tags = array();
		$html_without_lmat = preg_replace_callback(
			'/\[lmat_val[^\]]*\].*?\[\/lmat_val\]/s',
			function( $matches ) use ( &$existing_lmat_tags ) {
				$existing_lmat_tags[] = $matches[0];
				// Return a placeholder that won't interfere with HTML processing
				return '';
			},
			$html
		);
		
		// Clean data attributes first
		$html_without_lmat = self::linguator_clean_data_attributes( $html_without_lmat );
		
		// Array to store new lmat_val tags
		$new_lmat_tags = array();
		
		// Replace text nodes with tokens
		// This regex matches text outside of HTML tags
		// We need to be careful to preserve HTML structure
		$processed_html = preg_replace_callback(
			'/>([^<]+)</s',
			function( $matches ) use ( $shortcode_name, &$new_lmat_tags ) {
				$text = $matches[1];
				
				// Skip if only whitespace
				if ( empty( trim( $text ) ) ) {
					return $matches[0];
				}
				
				// Skip if this is already a token
				if ( strpos( $text, '___LMAT_' ) !== false ) {
					return $matches[0];
				}
				
				// Generate unique token
				$token = '___LMAT_' . md5( $shortcode_name . $text . wp_rand() ) . '___';
				
				// Store the lmat_val tag with only the text content
				$new_lmat_tags[] = '[lmat_val id="' . $token . '"]' . trim( $text ) . '[/lmat_val]';
				
				// Replace text with token in HTML
				return '>' . $token . '<';
			},
			$html_without_lmat
		);
		
		// Handle text at the beginning (before any tag)
		$processed_html = preg_replace_callback(
			'/^([^<\[]+)/s',
			function( $matches ) use ( $shortcode_name, &$new_lmat_tags ) {
				$text = $matches[1];
				
				// Skip if only whitespace
				if ( empty( trim( $text ) ) ) {
					return $matches[0];
				}
				
				// Skip if this is already a token
				if ( strpos( $text, '___LMAT_' ) !== false ) {
					return $matches[0];
				}
				
				// Generate unique token
				$token = '___LMAT_' . md5( $shortcode_name . $text . wp_rand() ) . '___';
				
				// Store the lmat_val tag with only the text content
				$new_lmat_tags[] = '[lmat_val id="' . $token . '"]' . trim( $text ) . '[/lmat_val]';
				
				// Replace text with token
				return $token;
			},
			$processed_html
		);
		
		// Handle text at the end (after last tag)
		$processed_html = preg_replace_callback(
			'/>([^<]+)$/s',
			function( $matches ) use ( $shortcode_name, &$new_lmat_tags ) {
				$text = $matches[1];
				
				// Skip if only whitespace
				if ( empty( trim( $text ) ) ) {
					return $matches[0];
				}
				
				// Skip if this is already a token
				if ( strpos( $text, '___LMAT_' ) !== false ) {
					return $matches[0];
				}
				
				// Generate unique token
				$token = '___LMAT_' . md5( $shortcode_name . $text . wp_rand() ) . '___';
				
				// Store the lmat_val tag with only the text content
				$new_lmat_tags[] = '[lmat_val id="' . $token . '"]' . trim( $text ) . '[/lmat_val]';
				
				// Replace text with token
				return '>' . $token;
			},
			$processed_html
		);
		
		// Combine all lmat_val tags (existing + new)
		$all_lmat_tags = array_merge( $existing_lmat_tags, $new_lmat_tags );
		
		// Return the processed HTML followed by all lmat_val tags
		return $processed_html . ' ' . implode( ' ', $all_lmat_tags );
	}

	/**
	 * Expose content between shortcode tags for translation.
	 * 
	 * @since 1.0.7
	 * @access private
	 * @static
	 * 
	 * @param string $content Post content.
	 * @return string Content with shortcode content exposed.
	 */
	private static function linguator_expose_shortcode_content( $content ) {
		// Match all WPBakery shortcodes with inner content dynamically (any [vc_*]...[/vc_*] pair)
		$content = preg_replace_callback(
			'/\[(vc_[\w-]+)([^\]]*)\](.*?)\[\/\1\]/s',
			function( $matches ) {
				$shortcode_name = $matches[1];
				$attributes = $matches[2];
				$inner_content = $matches[3];
				
				// Skip if empty or contains only whitespace
				if ( empty( trim( $inner_content ) ) ) {
					return $matches[0];
				}
				
				// For nested shortcodes, we need to be careful
				// Check if this content has nested vc_ shortcodes
				$has_nested_shortcodes = preg_match( '/\[vc_/', $inner_content );
				
				if ( $has_nested_shortcodes ) {
					// For container shortcodes (tabs, accordions), recursively process nested content
					// This ensures content inside nested shortcodes is also extracted
					$processed_inner = self::linguator_expose_shortcode_content( $inner_content );
					
					// If the inner content was modified (has tokens or lmat_val tags), use the processed version
					if ( $processed_inner !== $inner_content ) {
						return '[' . $shortcode_name . $attributes . ']' . $processed_inner . '[/' . $shortcode_name . ']';
					}
					
					// Otherwise return original
					return $matches[0];
				}
				
			// Check if content contains HTML tags
			$has_html = preg_match( '/<[^>]+>/', $inner_content );
			
			if ( $has_html ) {
				// Strip HTML to check if there's untokenized text content
				// Remove existing lmat_val tags to check remaining content
				$content_without_tokens = preg_replace( '/\[lmat_val[^\]]*\].*?\[\/lmat_val\]/s', '', $inner_content );
				$text_content = wp_strip_all_tags( $content_without_tokens );
				
				// If there's actual text content (not just whitespace), process it
				if ( ! empty( trim( $text_content ) ) ) {
					// Extract text nodes from HTML and create separate lmat_val tags
					$processed_content = self::linguator_extract_translatable_text_nodes( $inner_content, $shortcode_name );
					return '[' . $shortcode_name . $attributes . ']' . $processed_content . '[/' . $shortcode_name . ']';
				}
				
				// No new text to process, return as is
				return $matches[0];
			}
			
		// Check if content has existing lmat_val tags (from attribute processing)
		$has_existing_tokens = strpos( $inner_content, '[lmat_val' ) !== false;
		
		if ( $has_existing_tokens ) {
			// Extract and separate existing lmat_val tags from the actual content
			$existing_lmat_tags = array();
			$content_without_lmat = preg_replace_callback(
				'/\[lmat_val[^\]]*\].*?\[\/lmat_val\]/s',
				function( $matches ) use ( &$existing_lmat_tags ) {
					$existing_lmat_tags[] = $matches[0];
					return ''; // Remove from content
				},
				$inner_content
			);
			
			// Check if there's any actual text content remaining
			$remaining_text = trim( $content_without_lmat );
			
			if ( ! empty( $remaining_text ) ) {
				// There's text content that needs to be tokenized
				$cleaned_content = self::linguator_clean_data_attributes( $remaining_text );
				$token = '___LMAT_' . md5( $shortcode_name . $remaining_text . wp_rand() ) . '___';
				$new_lmat_tag = '[lmat_val id="' . $token . '"]' . $cleaned_content . '[/lmat_val]';
				
				// Combine: shortcode with token, then all lmat_val tags
				$all_lmat_tags = implode( ' ', $existing_lmat_tags ) . ' ' . $new_lmat_tag;
				return '[' . $shortcode_name . $attributes . ']' . $token . ' ' . $all_lmat_tags . '[/' . $shortcode_name . ']';
			}
			
			// Only existing tokens, no new content to process
			return $matches[0];
		}
		
		// No existing tokens - check if there's text content
		$text_content = wp_strip_all_tags( $inner_content );
		if ( empty( trim( $text_content ) ) ) {
			return $matches[0];
		}
		
		// Simple text content without HTML - wrap as before
		$cleaned_content = self::linguator_clean_data_attributes( $inner_content );
		$token = '___LMAT_' . md5( $shortcode_name . $inner_content . wp_rand() ) . '___';
		$wrapped_content = '[lmat_val id="' . $token . '"]' . $cleaned_content . '[/lmat_val]';
		return '[' . $shortcode_name . $attributes . ']' . $wrapped_content . '[/' . $shortcode_name . ']';
			},
			$content
		);
		
		return $content;
	}

	/**
	 * Restore attributes from exposed content key.
	 * 
	 * @since 1.0.5
	 * @access public
	 * @static
	 * 
	 * @param string $content Post content.
	 * @return string Restored content.
	 */
	public static function linguator_restore_translatable_attributes( $content ) {
		// Optimization check
		if ( false === strpos( $content, '[lmat_val' ) && false === strpos( $content, '___LMAT' ) ) {
			return $content;
		}

		// Normalize quotes first (fix smart quotes introduced by translation around tokens)
		// We do this BEFORE restoring values, so that we don't accidentally normalize quotes *inside* the translated text.
		$content = self::linguator_normalize_shortcode_quotes( $content );
		
		// Restore protected attributes that were tokenized to prevent translation
		// These are ID-based attributes that should never be translated
		$content = self::linguator_restore_protected_attributes( $content );
		
		// Create a map of tokens to their translated values
		$token_map = array();
		
		// Find all translated values and their IDs
		// Regex explanation:
		// \[lmat_val : Start tag
		// [^\]]*? : Lazily match anything before the token
		// (___LMAT_[a-f0-9]{32}___) : Capture the exact Token format (md5 is 32 chars hex)
		// [^\]]*? : Lazily match anything after token before closing bracket
		// \] : Closing bracket of start tag
		// (.*?) : Capture content (translation)
		// \[\/lmat_val\] : Closing tag
		// s modifier: Dot matches newlines
		// i modifier: Case insensitive (just in case)
		if ( preg_match_all( '/\[lmat_val[^\]]*?(___LMAT_[a-f0-9]{32}___)[^\]]*?\](.*?)\[\/lmat_val\]/si', $content, $matches, PREG_SET_ORDER ) ) {
			foreach ( $matches as $match ) {
				$full_match = $match[0]; // The entire [lmat_val]...[/lmat_val]
				$token = $match[1];
				$translated_value = $match[2];
				
				// Decode entities in translation (e.g. &quot; -> ", &lt; -> <)
				$translated_value = html_entity_decode( $translated_value, ENT_QUOTES | ENT_HTML5 );
				
				// Store in map
				$token_map[ $token ] = $translated_value;
				
				// Check if this token exists elsewhere in the content (as an attribute value)
				$token_exists_separately = strpos( str_replace( $full_match, '', $content ), $token ) !== false;
				
				if ( $token_exists_separately ) {
					// Pattern 1: Token is used in an attribute (e.g., title="___TOKEN___")
					// Replace the token with translation, and we'll remove the lmat_val wrapper later
					$has_html = preg_match( '/<[^>]+>/', $translated_value );
					if ( ! $has_html ) {
						$translated_value = esc_attr( $translated_value );
					}
					$content = str_replace( $token, $translated_value, $content );
				} else {
					// Pattern 2: No separate token - this is direct content wrapping
					// Replace the entire [lmat_val]...[/lmat_val] with the translated content
					$content = str_replace( $full_match, $translated_value, $content );
				}
			}
		}
		
		// Restore JSON attributes (e.g., values in vc_progress_bar)
		// These have tokens embedded inside URL-encoded JSON
		if ( ! empty( $token_map ) ) {
			$content = self::linguator_restore_json_attributes( $content, $token_map );
		}

		// Cleanup any remaining lmat_val tags globally
		$content = self::remove_remaining_lmat_tags( $content );
		
		// Remove standalone LMAT tokens that weren't properly replaced
		// This must happen after removing lmat_val tags, as tokens inside those tags are handled separately
		$content = self::remove_standalone_lmat_tokens( $content );
		
		// Remove page translation placeholders that might have been left in the content
		$content = self::linguator_remove_page_translation_placeholders( $content );

		return $content;
	}
	
	/**
	 * Restore JSON-encoded attributes with translated values.
	 * 
	 * Searches for URL-encoded JSON strings in shortcode attributes and replaces
	 * tokens with their translated values.
	 * 
	 * @since 1.0.9
	 * @access private
	 * @static
	 * 
	 * @param string $content Post content.
	 * @param array  $token_map Map of tokens to translated values.
	 * @return string Content with JSON attributes restored.
	 */
	private static function linguator_restore_json_attributes( $content, $token_map ) {
		// Match attributes that contain URL-encoded data with tokens
		// Pattern: attribute="...___LMAT_..._..."
		$content = preg_replace_callback(
			'/([\w-]+)=(["\'])([^"\']*___LMAT_[a-f0-9]{32}___[^"\']*)\2/',
			function( $matches ) use ( $token_map ) {
				$attr_name = $matches[1];
				$attr_quote = $matches[2];
				$attr_val = $matches[3];
				
				// Try to decode as URL-encoded JSON
				$decoded = rawurldecode( $attr_val );
				$data = json_decode( $decoded, true );
				
				// If not valid JSON, try simple token replacement
				if ( ! is_array( $data ) ) {
					// Replace any tokens in the value
					foreach ( $token_map as $token => $translated ) {
						if ( strpos( $attr_val, $token ) !== false ) {
							$attr_val = str_replace( $token, esc_attr( $translated ), $attr_val );
						}
					}
					return $attr_name . '=' . $attr_quote . $attr_val . $attr_quote;
				}
				
				// Walk through the JSON and replace tokens with translations
				array_walk_recursive(
					$data,
					function( &$value ) use ( $token_map ) {
						if ( is_string( $value ) && isset( $token_map[ $value ] ) ) {
							$value = $token_map[ $value ];
						}
					}
				);
				
				// Re-encode to JSON and URL-encode
				$new_json = json_encode( $data );
				$new_val = rawurlencode( $new_json );
				
				return $attr_name . '=' . $attr_quote . $new_val . $attr_quote;
			},
			$content
		);
		
		return $content;
	}
	
	/**
	 * Restore protected attributes that were tokenized to prevent translation.
	 *
	 * Protected attributes are those containing IDs and references that should never
	 * be translated (like image IDs, post IDs, etc). These were encoded in base64
	 * tokens to protect them during translation.
	 *
	 * @since 1.0.5
	 * @access private
	 * @static
	 *
	 * @param string $content            Post content with protected tokens.
	 * @param bool   $escape_for_display When true (e.g. the_content), escape decoded values for safe HTML attributes. When false (save/translation pipeline), return raw restored values.
	 * @return string Content with original attribute values restored.
	 */
	private static function linguator_restore_protected_attributes( $content, $escape_for_display = false ) {
		// Pattern: ___LMAT_PROTECTED_{base64}___
		// Find all protected tokens and decode them
		// Base64 strings can contain A-Z, a-z, 0-9, +, /, and = (for padding)
		// Handle both complete tokens (___LMAT_PROTECTED_...___) and potentially truncated ones
		$content = preg_replace_callback(
			'/___LMAT_PROTECTED_([A-Za-z0-9+\/=]+)(?:___|__|$)/',
			function( $matches ) use ( $escape_for_display ) {
				$encoded_value = $matches[1];
				// Decode the base64 value
				$original_value = base64_decode( $encoded_value, true );
				// If decoding fails, return empty string to remove the broken token
				// This prevents broken tokens from appearing in the content
				if ( false === $original_value || '' === $original_value ) {
					return '';
				}
				if ( $escape_for_display ) {
					return esc_attr( $original_value );
				}
				return $original_value;
			},
			$content
		);
		
		return $content;
	}

	/**
	 * Re-encode WPBakery shortcode attributes before saving.
	 *
	 * After translation, the content has plain text attributes. We need to
	 * re-encode them in WPBakery's format: rawurlencode(base64_encode($text))
	 *
	 * @since 1.0.4
	 * @access public
	 * @static
	 *
	 * @param array $data    The post data to be inserted.
	 * @param array $postarr The post array (sanitized data).
	 *
	 * @return array Modified post data with encoded WPBakery attributes.
	 */
	public static function linguator_encode_wpbakery_content_before_save( $data, $postarr ) {
		// Only process if we have post_content
		if ( empty( $data['post_content'] ) ) {
			return $data;
		}

		// First, clean up any page translation placeholders
		$data['post_content'] = self::linguator_remove_page_translation_placeholders( $data['post_content'] );
		
		// Second, restore exposed attributes (this also restores protected attributes)
		if ( false !== strpos( $data['post_content'], '[lmat_val' ) || false !== strpos( $data['post_content'], '___LMAT' ) ) {
			$data['post_content'] = self::linguator_restore_translatable_attributes( $data['post_content'] );
		}
		
		// Also restore protected attributes separately in case they exist without lmat_val tags
		if ( false !== strpos( $data['post_content'], '___LMAT_PROTECTED_' ) ) {
			$data['post_content'] = self::linguator_restore_protected_attributes( $data['post_content'] );
		}
		
		// Remove any standalone LMAT tokens that weren't properly replaced
		$data['post_content'] = self::remove_standalone_lmat_tokens( $data['post_content'] );

		// Check if this contains WPBakery shortcodes
		if ( false === strpos( $data['post_content'], '[vc_' ) ) {
			return $data;
		}

		// Check if this is a WPBakery post
		$post_id = isset( $postarr['ID'] ) ? $postarr['ID'] : 0;
		if ( $post_id ) {
			$wpb_status = get_post_meta( $post_id, '_wpb_vc_js_status', true );
			if ( 'true' !== $wpb_status && true !== $wpb_status ) {
				// Check the parent post if this is a translation
				$parent_id = get_post_meta( $post_id, '_lmat_parent_post_id', true );
				if ( $parent_id ) {
					$wpb_status = get_post_meta( $parent_id, '_wpb_vc_js_status', true );
				}
			}
			
			if ( 'true' !== $wpb_status && true !== $wpb_status ) {
				return $data;
			}
		}

		// Re-encode shortcode attributes that were decoded for translation
		$data['post_content'] = preg_replace_callback(
			'/([\w-]+)=(["\'])([^"\']*)\2/',
			function( $matches ) {
				$attribute = $matches[1];
				$quote = $matches[2];
				$value = $matches[3];

				// Skip empty values and attributes that shouldn't be encoded
				if ( empty( $value ) ) {
					return $matches[0];
				}

				// Skip attributes that contain IDs, references, or shouldn't be encoded
				// These must match the skip list in decode_wpbakery_shortcodes for consistency
				$skip_attributes = array( 'el_id', 'el_class', 'css', 'css_animation', 'link', 'url', 'image', 'img_size', 'img_id', 'video_id', 'gallery', 'images', 'font_container', 'google_fonts', 'post_id', 'taxonomy', 'term_id' );
				if ( in_array( $attribute, $skip_attributes, true ) ) {
					return $matches[0];
				}

				// Check if this value should be encoded (contains spaces, special chars, or HTML)
				if ( preg_match( '/[\s<>]/', $value ) ) {
					// Encode in WPBakery format: rawurlencode(base64_encode())
					$encoded = rawurlencode( base64_encode( $value ) );
					return $attribute . '=' . $quote . $encoded . $quote;
				}

				return $matches[0];
			},
			$data['post_content']
		);

		return $data;
	}

	/**
	 * Remove any remaining lmat_val tags from content.
	 *
	 * @since 1.0.5
	 * @access public
	 * @static
	 *
	 * @param string $content Post content.
	 * @return string Content cleaned of lmat_val tags.
	 */
	public static function remove_remaining_lmat_tags( $content ) {
		// Clean up any lmat_val tags and their content
		// These tags are just carriers for the original text - the translations
		// have already been applied to the tokens in the shortcode attributes
		if ( false !== strpos( $content, '[lmat_val' ) ) {
			// Matches [lmat_val ...]content[/lmat_val]
			// Supports newlines inside the tag or content
			// Remove the entire tag and its content (it's already been translated in the token)
			$content = preg_replace( '/\s*\[lmat_val[^\]]*\].*?\[\/lmat_val\]/s', '', $content );
		}
		return $content;
	}
	
	/**
	 * Remove standalone LMAT tokens from content.
	 *
	 * These tokens (___LMAT_{hash}___) are placeholders used during translation
	 * and should be removed if they weren't properly replaced with translated content.
	 *
	 * @since 1.0.10
	 * @access public
	 * @static
	 *
	 * @param string $content Post content.
	 * @return string Content with standalone LMAT tokens removed.
	 */
	public static function remove_standalone_lmat_tokens( $content ) {
		// Pattern to match standalone LMAT tokens: ___LMAT_{32-char-hex-hash}___
		// These tokens should have been replaced during translation, but if they weren't,
		// we need to remove them to prevent them from appearing in the final content
		if ( false !== strpos( $content, '___LMAT_' ) ) {
			// Remove standalone LMAT tokens (not inside [lmat_val] tags)
			// This regex matches tokens that are not part of [lmat_val] tags
			$content = preg_replace( '/___LMAT_[a-f0-9]{32}___/i', '', $content );
		}
		return $content;
	}

	/**
	 * Normalize quotes in shortcodes (fix smart quotes introduced by translation).
	 *
	 * @since 1.0.5
	 * @access public
	 * @static
	 *
	 * @param string $content Post content.
	 * @return string Content with normalized quotes.
	 */
	public static function linguator_normalize_shortcode_quotes( $content ) {
		// Regex to find WPBakery shortcodes
		// Handles [vc_...] up to the closing bracket ]
		// We use a callback to only replace quotes *inside* the tag definition
		return preg_replace_callback(
			'/\[vc_[^\]]+\]/s',
			function( $matches ) {
				$tag = $matches[0];
				
				// Replace smart double quotes with straight double quotes
				$smart_double_quotes = array( "\xE2\x80\x9C", "\xE2\x80\x9D", "\xE2\x80\xB3", "\xE2\x80\x9E" );
				$tag = str_replace( $smart_double_quotes, '"', $tag );
				
				// Replace smart single quotes with straight single quotes
				$smart_single_quotes = array( "\xE2\x80\x98", "\xE2\x80\x99", "\xE2\x80\xB2", "\xE2\x80\x9A" );
				$tag = str_replace( $smart_single_quotes, "'", $tag );
				
				return $tag;
			},
			$content
		);
	}
	
	/**
	 * Remove page translation placeholders from content.
	 *
	 * These placeholders (#lmat_page_translation_*#) are used during the translation
	 * process to protect certain elements from being translated. They should be removed
	 * from the final content.
	 *
	 * @since 1.0.5
	 * @access public
	 * @static
	 *
	 * @param string $content Post content.
	 * @return string Content with placeholders removed.
	 */
	public static function linguator_remove_page_translation_placeholders( $content ) {
		// List of all page translation placeholders
		$placeholders = array(
			'#lmat_page_translation_open_translate_span#',
			'#lmat_page_translation_close_translate_span#',
			'#lmat_page_translation_temp_tag_open#',
			'#lmat_page_translation_temp_tag_close#',
			'#lmat_page_translation_less_then_symbol#',
			'#lmat_page_translation_greater_then_symbol#',
			'#lmat_page_translation_entity_open_translate_span#',
			'#lmat_page_translation_entity_close_translate_span#',
			'#lmat_page_translation_line_break_n_open#',
			'#lmat_page_translation_line_break_n_close#',
			'#lmat_page_translation_line_break_r_open#',
			'#lmat_page_translation_line_break_r_close#',
		);
		
		// Remove all placeholders from content
		foreach ( $placeholders as $placeholder ) {
			$content = str_replace( $placeholder, '', $content );
		}
		
		return $content;
	}
	
	/**
	 * Cleanup content on frontend display.
	 *
	 * Removes any leftover translation placeholders and lmat_val tags that might
	 * have been saved to the database during translation.
	 *
	 * @since 1.0.5
	 * @access public
	 * @static
	 *
	 * @param string $content Post content.
	 * @return string Cleaned content.
	 */
	public static function linguator_cleanup_content_on_frontend( $content ) {
		// Check if content has any placeholders before processing
		if ( false === strpos( $content, '#lmat_page_translation' ) && false === strpos( $content, '[lmat_val' ) && false === strpos( $content, '___LMAT_' ) ) {
			return $content;
		}
		
		// Remove any remaining lmat_val tags
		$content = self::remove_remaining_lmat_tags( $content );
		
		// Restore any protected attributes that might still be tokenized
		if ( false !== strpos( $content, '___LMAT_PROTECTED_' ) ) {
			$content = self::linguator_restore_protected_attributes( $content, true );
		}
		
		// Remove standalone LMAT tokens that weren't properly replaced
		$content = self::remove_standalone_lmat_tokens( $content );
		
		// Remove page translation placeholders
		$content = self::linguator_remove_page_translation_placeholders( $content );
		
		return $content;
	}
}


