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
class LMAT_WPBakery {
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
		// Copy WPBakery data while Linguator creates a translation copy.
		add_filter( 'lmat_copy_post_metas', [ __CLASS__, 'save_wpbakery_meta' ], 10, 4 );
		
		// Ensure WPBakery editor is available for translated posts
		add_filter( 'vc_is_valid_post_type_be', [ __CLASS__, 'enable_wpbakery_editor' ], 10, 2 );
		
		// Mark WPBakery posts as "classic" editor type for translation but preserve structure
		add_filter( 'lmat_editor_type', [ __CLASS__, 'set_wpbakery_editor_type' ], 10, 2 );
		
		// Intercept content fetching for translation to decode WPBakery content
		add_action( 'wp_ajax_lmat_fetch_post_content', [ __CLASS__, 'intercept_fetch_content' ], 1 );
		
		// Intercept content saving to re-encode WPBakery content
		add_action( 'wp_ajax_lmat_update_classic_translate_status', [ __CLASS__, 'intercept_save_content' ], 1 );
		
		// Filter post content before saving to re-encode WPBakery attributes
		add_filter( 'wp_insert_post_data', [ __CLASS__, 'encode_wpbakery_content_before_save' ], 10, 2 );
	}



	/**
	 * Save WPBakery Page Builder meta.
	 *
	 * Copy WPBakery Page Builder data while Linguator creates a translation copy.
	 * This ensures all page builder content and settings are preserved in translations.
	 *
	 * Fired by `lmat_copy_post_metas` filter.
	 *
	 * @since 1.0.4
	 * @access public
	 * @static
	 *
	 * @param array $keys List of custom fields names.
	 * @param bool  $sync True if it is synchronization, false if it is a copy.
	 * @param int   $from ID of the post from which we copy information.
	 * @param int   $to   ID of the post to which we paste information.
	 *
	 * @return array List of custom fields names.
	 */
	public static function save_wpbakery_meta( $keys, $sync, $from, $to ) {
		// Copy only for a new post.
		if ( ! $sync ) {
			self::copy_wpbakery_meta( $from, $to );
		}

		return $keys;
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
	public static function copy_wpbakery_meta( $from_post_id, $to_post_id ) {
		$from_post_meta = get_post_meta( $from_post_id );
		
		// Core meta fields to copy
		$core_meta = [
			'_wp_page_template',
			'_thumbnail_id',
		];

		// WPBakery specific meta keys to copy
		$wpbakery_meta_keys = [
			'_wpb_vc_js_status',           // Visual Composer JS status
			'_wpb_shortcodes_custom_css',  // Custom CSS for page
			'_wpb_post_custom_css',        // Post custom CSS
			'_vc_post_settings',           // Visual Composer settings
			'_vcv-pageContent',            // Visual Composer content
			'vcv-settingsItemDataCollection', // Settings collection
			'vcv-pageDesignOptionsData',   // Design options
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
	public static function enable_wpbakery_editor( $is_valid, $type ) {
		// If already valid, return as is
		if ( $is_valid ) {
			return $is_valid;
		}

		// Check if this is a translated post
		global $post;
		if ( $post && lmat_get_post_language( $post->ID ) ) {
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
	public static function set_wpbakery_editor_type( $editor_type, $post_id ) {
		// Check if this post uses WPBakery
		$wpb_status = get_post_meta( $post_id, '_wpb_vc_js_status', true );
		
		// If WPBakery is active on this post, ensure it's treated as classic
		// (since WPBakery stores shortcodes in post_content)
		if ( 'true' === $wpb_status || true === $wpb_status ) {
			return 'classic';
		}

		return $editor_type;
	}

	/**
	 * Intercept content fetching to decode WPBakery shortcodes.
	 *
	 * WPBakery stores content in base64-encoded format within shortcode attributes.
	 * This intercepts the AJAX call to decode content before it's sent to the translation modal.
	 *
	 * @since 1.0.4
	 * @access public
	 * @static
	 */
	public static function intercept_fetch_content() {
		// Don't check nonce yet - the actual handler will do that
		// We just need to add a filter to modify the content before it's returned

		// Use the custom filter we added to page-translation-helper.php
		// Priority 10: Decode base64
		add_filter( 'lmat_post_content_for_translation', [ __CLASS__, 'decode_wpbakery_shortcodes' ], 10 );
		// Priority 20: Expose attributes as content for translation
		add_filter( 'lmat_post_content_for_translation', [ __CLASS__, 'expose_translatable_attributes' ], 20 );
		
		add_filter( 'get_post_field', [ __CLASS__, 'decode_post_content_field' ], 10, 3 );
	}

	/**
	 * Decode WPBakery shortcodes in post_content field.
	 *
	 * @since 1.0.4
	 * @access public
	 * @static
	 *
	 * @param mixed  $value The value of the field.
	 * @param string $field The field name.
	 * @param int    $post  The post object or ID.
	 *
	 * @return mixed The field value, decoded if it's post_content with WPBakery.
	 */
	public static function decode_post_content_field( $value, $field, $post ) {
		if ( 'post_content' !== $field ) {
			return $value;
		}

		return self::decode_wpbakery_shortcodes( $value );
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

				// Skip attributes that are clearly not encoded (like el_class, css_animation, etc.)
				$skip_attributes = array( 'el_id', 'el_class', 'css', 'css_animation', 'link', 'url' );
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

		$translatable_attributes = [ 'title', 'text', 'h2', 'h3', 'h4', 'h5', 'h6', 'heading', 'btn_title' ];

		// Match shortcodes and their attributes 
		$content = preg_replace_callback(
			'/(\[vc_[\w-]+)([^\]]*)(\])/',
			function( $matches ) use ( $translatable_attributes ) {
				$tag_start = $matches[1];
				$attributes_str = $matches[2];
				$tag_end = $matches[3];
				$append_content = '';

				// Find attributes in the string
				$attributes_str = preg_replace_callback(
					'/([\w-]+)=(["\'])(.*?)\2/',
					function( $attr_matches ) use ( $translatable_attributes, &$append_content ) {
						$attr_name = $attr_matches[1];
						$attr_quote = $attr_matches[2];
						$attr_val = $attr_matches[3];

						if ( in_array( $attr_name, $translatable_attributes, true ) && ! empty( $attr_val ) ) {
							// Generate a unique token for this attribute
							$token = '___LMAT_' . md5( $attr_name . $attr_val . mt_rand() ) . '___';
							
							// Create the value tag with the ID
							$append_content .= ' [lmat_val id="' . $token . '"]' . $attr_val . '[/lmat_val]';
							
							// Replace the attribute value with the token
							return $attr_name . '=' . $attr_quote . $token . $attr_quote;
						}
						return $attr_matches[0];
					},
					$attributes_str
				);

				return $tag_start . $attributes_str . $tag_end . $append_content;
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
	public static function restore_translatable_attributes( $content ) {
		// Optimization check
		if ( false === strpos( $content, '[lmat_val' ) ) {
			return $content;
		}
		
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
				$token = $match[1];
				$translated_value = $match[2];
				
				// Decode entities in translation (e.g. &quot; -> ", &lt; -> <)
				$translated_value = html_entity_decode( $translated_value );
				
				// Finds the token in the content and replaces it.
				// The token is unique enough that global replacement is safe.
				$content = str_replace( $token, $translated_value, $content );
			}
		}

		// Cleanup any remaining lmat_val tags globally
		$content = self::remove_remaining_lmat_tags( $content );

		return $content;
	}

	/**
	 * Intercept content saving to encode WPBakery shortcodes.
	 *
	 * Before saving translated content back to the database, we need to
	 * re-encode it in WPBakery's format (rawurlencode + base64).
	 *
	 * @since 1.0.4
	 * @access public
	 * @static
	 */
	public static function intercept_save_content() {
		// This runs before the actual save handler
		// We don't need to do anything here as we use wp_insert_post_data filter
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
	public static function encode_wpbakery_content_before_save( $data, $postarr ) {
		// Only process if we have post_content
		if ( empty( $data['post_content'] ) ) {
			return $data;
		}

		// First, restore exposed attributes
		if ( false !== strpos( $data['post_content'], '[lmat_val' ) ) {
			$data['post_content'] = self::restore_translatable_attributes( $data['post_content'] );
		}

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

				$skip_attributes = array( 'el_id', 'el_class', 'css', 'css_animation', 'link', 'url', 'image', 'img_size' );
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
		// Clean up any stray/orphan lmat_val tags (safety)
		if ( false !== strpos( $content, '[lmat_val' ) ) {
			// Matches [lmat_val ...]content[/lmat_val]
			// Supports newlines inside the tag or content
			$content = preg_replace( '/\[lmat_val[^\]]*\](.*?)\[\/lmat_val\]/s', '', $content );
		}
		return $content;
	}
}

