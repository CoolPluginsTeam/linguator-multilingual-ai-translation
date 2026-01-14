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
		// Copy WPBakery meta when translation is created via REST API
		add_action( 'lmat_translation_created', [ __CLASS__, 'copy_meta_on_translation_created' ], 10, 2 );
		
		// Copy WPBakery meta when translation is created via bulk translation (sync system)
		add_action( 'lmat_created_sync_post', [ __CLASS__, 'copy_meta_on_sync_post_created' ], 10, 2 );
		
		// Set default content for new WPBakery translations
		add_filter( 'default_content', [ __CLASS__, 'set_default_translation_content' ], 10, 2 );
		
		// Ensure WPBakery editor is available for translated posts
		add_filter( 'vc_is_valid_post_type_be', [ __CLASS__, 'enable_wpbakery_editor' ], 10, 2 );
		
		// Mark WPBakery posts as "classic" editor type for translation but preserve structure
		add_filter( 'lmat_editor_type', [ __CLASS__, 'set_wpbakery_editor_type' ], 10, 2 );
		
		// Disable Gutenberg for WPBakery translation creation
		add_filter( 'use_block_editor_for_post', [ __CLASS__, 'disable_gutenberg_for_wpbakery' ], 10, 2 );
		
		// Modify edit links for WPBakery posts to open backend editor
		add_filter( 'get_edit_post_link', [ __CLASS__, 'modify_edit_post_link' ], 10, 3 );
		
		// Filter post content for translation - decode and expose WPBakery content
		// These filters work for both single page translation and bulk translation
		// Priority 10: Decode base64 encoded attributes
		add_filter( 'lmat_post_content_for_translation', [ __CLASS__, 'decode_wpbakery_shortcodes' ], 10 );
		// Priority 20: Expose translatable attributes as [lmat_val] tags
		add_filter( 'lmat_post_content_for_translation', [ __CLASS__, 'expose_translatable_attributes' ], 20 );
		
		
		// Intercept content saving to re-encode WPBakery content
		add_action( 'wp_ajax_lmat_update_classic_translate_status', [ __CLASS__, 'intercept_save_content' ], 1 );
		
		// Filter post content before saving to re-encode WPBakery attributes
		add_filter( 'wp_insert_post_data', [ __CLASS__, 'encode_wpbakery_content_before_save' ], 10, 2 );
		
		// Clean up page translation placeholders on frontend display (priority 5 - before shortcodes)
		add_filter( 'the_content', [ __CLASS__, 'cleanup_content_on_frontend' ], 5 );
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
	public static function copy_meta_on_translation_created( $new_post_id, $source_id ) {
		// Check if source post uses WPBakery
		$wpb_status = get_post_meta( $source_id, '_wpb_vc_js_status', true );
		
		// Only copy if source post has WPBakery enabled
		if ( 'true' === $wpb_status || true === $wpb_status ) {
			// Copy WPBakery meta fields
			self::copy_wpbakery_meta( $source_id, $new_post_id );
			
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
	public static function copy_meta_on_sync_post_created( $source_id, $new_post_id ) {
		// Check if source post uses WPBakery
		$wpb_status = get_post_meta( $source_id, '_wpb_vc_js_status', true );
		
		// Only copy if source post has WPBakery enabled
		if ( 'true' === $wpb_status || true === $wpb_status ) {
			// Copy WPBakery meta fields
			self::copy_wpbakery_meta( $source_id, $new_post_id );
			
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
	public static function set_default_translation_content( $content, $post ) {
		// Only for new posts
		if ( ! $post || 'auto-draft' !== $post->post_status ) {
			return $content;
		}
		
		// Check if we have from_post parameter
		if ( ! isset( $_GET['from_post'] ) ) {
			return $content;
		}
		
		$from_post_id = absint( $_GET['from_post'] );
		if ( ! $from_post_id ) {
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
			self::copy_wpbakery_meta( $from_post_id, $post->ID );
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
	public static function disable_gutenberg_for_wpbakery( $use_block_editor, $post ) {
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
		if ( isset( $_GET['from_post'] ) ) {
			$from_post_id = absint( $_GET['from_post'] );
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
	 * Modify edit post links for WPBakery posts.
	 *
	 * Add the wpb-backend-editor parameter to edit links for WPBakery posts
	 * so they open directly in the WPBakery backend editor.
	 *
	 * @since 1.0.5
	 * @access public
	 * @static
	 *
	 * @param string $url     The edit post link.
	 * @param int    $post_id The post ID.
	 * @param string $context The context (display or other).
	 * @return string Modified edit link.
	 */
	public static function modify_edit_post_link( $url, $post_id, $context ) {
		// Check if this is a WPBakery post
		$wpb_status = get_post_meta( $post_id, '_wpb_vc_js_status', true );
		
		// If not a WPBakery post, return original URL
		if ( 'true' !== $wpb_status && true !== $wpb_status ) {
			return $url;
		}
		
		// Add wpb-backend-editor parameter to the URL
		$url = add_query_arg( 'wpb-backend-editor', '', $url );
		
		return $url;
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
				$skip_attributes = array( 'el_id', 'el_class', 'css', 'css_animation', 'link', 'url', 'image', 'img_size', 'img_id', 'video_id', 'gallery', 'images', 'font_container', 'google_fonts', 'post_id', 'taxonomy', 'term_id' );
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

		$translatable_attributes = [ 'title', 'text', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'heading', 'btn_title', 'p', 'div' ];
		$protected_attributes = [ 'image', 'img_size', 'img_id', 'video_id', 'gallery', 'images', 'post_id', 'taxonomy', 'term_id', 'el_id' ];

		// Match shortcodes and their attributes 
		$content = preg_replace_callback(
			'/(\[vc_[\w-]+)([^\]]*)(\])/',
			function( $matches ) use ( $translatable_attributes, $protected_attributes ) {
				$tag_start = $matches[1];
				$attributes_str = $matches[2];
				$tag_end = $matches[3];
				$append_content = '';

				// Find attributes in the string
				$attributes_str = preg_replace_callback(
					'/([\w-]+)=(["\'])(.*?)\2/',
					function( $attr_matches ) use ( $translatable_attributes, $protected_attributes, &$append_content ) {
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
						
						// Protect ID-based attributes by encoding them in a token
						if ( in_array( $attr_name, $protected_attributes, true ) && ! empty( $attr_val ) ) {
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
		if ( false === strpos( $content, '[lmat_val' ) && false === strpos( $content, '___LMAT' ) ) {
			return $content;
		}

		// Normalize quotes first (fix smart quotes introduced by translation around tokens)
		// We do this BEFORE restoring values, so that we don't accidentally normalize quotes *inside* the translated text.
		$content = self::normalize_shortcode_quotes( $content );
		
		// Restore protected attributes that were tokenized to prevent translation
		// These are ID-based attributes that should never be translated
		$content = self::restore_protected_attributes( $content );
		
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
				
				// Escape attributes to prevent breaking shortcode syntax (e.g. quotes inside value)
				$translated_value = esc_attr( $translated_value );
				
				// Finds the token in the content and replaces it.
				// The token is unique enough that global replacement is safe.
				$content = str_replace( $token, $translated_value, $content );
			}
		}

		// Cleanup any remaining lmat_val tags globally
		$content = self::remove_remaining_lmat_tags( $content );
		
		// Remove page translation placeholders that might have been left in the content
		$content = self::remove_page_translation_placeholders( $content );

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
	 * @param string $content Post content with protected tokens.
	 * @return string Content with original attribute values restored.
	 */
	private static function restore_protected_attributes( $content ) {
		// Pattern: ___LMAT_PROTECTED_{base64}___
		// Find all protected tokens and decode them
		$content = preg_replace_callback(
			'/___LMAT_PROTECTED_([A-Za-z0-9+\/=]+)___/',
			function( $matches ) {
				$encoded_value = $matches[1];
				// Decode the base64 value
				$original_value = base64_decode( $encoded_value );
				return $original_value;
			},
			$content
		);
		
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

		// First, clean up any page translation placeholders
		$data['post_content'] = self::remove_page_translation_placeholders( $data['post_content'] );
		
		// Second, restore exposed attributes
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
		// Clean up any stray/orphan lmat_val tags (safety)
		if ( false !== strpos( $content, '[lmat_val' ) ) {
			// Matches [lmat_val ...]content[/lmat_val]
			// Supports newlines inside the tag or content
			$content = preg_replace( '/\[lmat_val[^\]]*\](.*?)\[\/lmat_val\]/s', '', $content );
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
	public static function normalize_shortcode_quotes( $content ) {
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
	public static function remove_page_translation_placeholders( $content ) {
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
	public static function cleanup_content_on_frontend( $content ) {
		// Check if content has any placeholders before processing
		if ( false === strpos( $content, '#lmat_page_translation' ) && false === strpos( $content, '[lmat_val' ) ) {
			return $content;
		}
		
		// Remove any remaining lmat_val tags
		$content = self::remove_remaining_lmat_tags( $content );
		
		// Remove page translation placeholders
		$content = self::remove_page_translation_placeholders( $content );
		
		return $content;
	}
}

