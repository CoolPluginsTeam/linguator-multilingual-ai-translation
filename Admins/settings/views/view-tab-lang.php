<?php
/**
 * Displays the languages tab in Linguator settings
 *
 * @package Linguator
 *
 * @var LMAT_Table_Languages $list_table An object representing the languages list table.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use Linguator\Includes\Other\LMAT_Language;
use Linguator\Settings\Controllers\LMAT_Settings;

?>
<div id="col-container">
	<?php $header && $header instanceof \Linguator\Settings\Header\Header && $header->header(); ?>
	<div id="col-right">
		<div class="col-wrap">
			<?php
			// Displays the language list in a table
			$list_table->display();
			?>
			<div class="metabox-holder">
				<?php
				wp_nonce_field( 'closedpostboxes', 'closedpostboxesnonce', false );
				do_meta_boxes( 'toplevel_page_lmat', 'normal', array() );
				?>
			</div>
		</div><!-- col-wrap -->
	</div><!-- col-right -->

	<div id="col-left">
		<div class="col-wrap">

			<div class="form-wrap">
				<h2><?php echo ! empty( $edit_lang ) ? esc_html__( 'Edit language', 'linguator-multilingual-ai-translation' ) : esc_html__( 'Add new language', 'linguator-multilingual-ai-translation' ); ?></h2>
				<?php
				// Displays the add ( or edit ) language form
				// Adds noheader=true in the action url to allow using wp_redirect when processing the form
				?>
				<form id="add-lang" method="post" action="admin.php?page=lmat&amp;noheader=true" class="validate">
				<?php
				wp_nonce_field( 'add-lang', '_wpnonce_add-lang' );

				if ( ! empty( $edit_lang ) ) {
					?>
					<input type="hidden" name="lmat_action" value="update" />
					<input type="hidden" name="lang_id" value="<?php echo esc_attr( $edit_lang->term_id ); ?>" />
					<?php
				} else {
					?>
					<input type="hidden" name="lmat_action" value="add" />
					<?php
				}
				?>
					<div class="form-field">
						<label for="lang_list"><?php esc_html_e( 'Choose a language', 'linguator-multilingual-ai-translation' ); ?></label>
						<select name="lang_list" id="lang_list">
							<option value=""></option>
							<?php
							// Get existing languages
							$existing_languages = $list_table->items;
							$existing_locales = array();
							foreach ($existing_languages as $lang) {
								$existing_locales[] = $lang->locale;
							}

							// Get predefined languages and filter out existing ones
							$predefined_languages = LMAT_Settings::get_predefined_languages();
							foreach ( $predefined_languages as $language ) {
								// Skip if this language is already added
								if (in_array($language['locale'], $existing_locales)) {
									continue;
								}
								printf(
									'<option value="%1$s:%2$s:%3$s:%4$s" data-flag-html="%6$s">%5$s - %2$s</option>' . "\n",
									esc_attr( $language['code'] ),
									esc_attr( $language['locale'] ),
									'rtl' == $language['dir'] ? '1' : '0',
									esc_attr( $language['flag'] ),
									esc_html( $language['name'] ),
									esc_attr( LMAT_Language::get_predefined_flag( $language['flag'] ) )
								);
							}
							?>
						</select>
						<p><?php esc_html_e( 'You can choose a language in the list or directly edit it below.', 'linguator-multilingual-ai-translation' ); ?></p>
					</div>

					<div class="form-field form-required">
						<label for="lang_name"><?php esc_html_e( 'Full name', 'linguator-multilingual-ai-translation' ); ?></label>
						<?php
						printf(
							'<input name="name" id="lang_name" type="text" value="%s" size="40" aria-required="true" />',
							! empty( $edit_lang ) ? esc_attr( $edit_lang->name ) : ''
						);
						?>
						<p><?php esc_html_e( 'The name is how it is displayed on your site (for example: English).', 'linguator-multilingual-ai-translation' ); ?></p>
					</div>

					<div class="form-field form-required">
						<label for="lang_locale"><?php esc_html_e( 'Locale', 'linguator-multilingual-ai-translation' ); ?></label>
						<?php
						printf(
							'<input name="locale" id="lang_locale" type="text" value="%s" size="40" aria-required="true" />',
							! empty( $edit_lang ) ? esc_attr( $edit_lang->locale ) : ''
						);
						?>
						<p><?php esc_html_e( 'WordPress Locale for the language (for example: en_US). You will need to install the .mo file for this language.', 'linguator-multilingual-ai-translation' ); ?></p>
					</div>

					<div class="form-field">
						<label for="lang_slug"><?php esc_html_e( 'Language code', 'linguator-multilingual-ai-translation' ); ?></label>
						<?php
						printf(
							'<input name="slug" id="lang_slug" type="text" value="%s" size="40"/>',
							! empty( $edit_lang ) ? esc_attr( $edit_lang->slug ) : ''
						);
						?>
						<p><?php esc_html_e( 'Language code - preferably 2-letters ISO 639-1  (for example: en)', 'linguator-multilingual-ai-translation' ); ?></p>
					</div>

					<div class="form-field"><fieldset>
						<legend class="lmat-legend"><?php esc_html_e( 'Text direction', 'linguator-multilingual-ai-translation' ); ?></legend>
						<?php
						printf(
							'<label><input name="rtl" type="radio" value="0" %s /> %s</label>',
							checked( ! empty( $edit_lang ) && $edit_lang->is_rtl, false, false ),
							esc_html__( 'left to right', 'linguator-multilingual-ai-translation' )
						);
						printf(
							'<label><input name="rtl" type="radio" value="1" %s /> %s</label>',
							checked( ! empty( $edit_lang ) && $edit_lang->is_rtl, true, false ),
							esc_html__( 'right to left', 'linguator-multilingual-ai-translation' )
						);
						?>
						<p><?php esc_html_e( 'Choose the text direction for the language', 'linguator-multilingual-ai-translation' ); ?></p>
					</fieldset></div>

					<div class="form-field">
						<label for="flag_list"><?php esc_html_e( 'Flag', 'linguator-multilingual-ai-translation' ); ?></label>
						<select name="flag" id="flag_list">
							<option value=""></option>
							<?php
							$flags = include __DIR__ . '/../controllers/flags.php';
							foreach ( $flags as $code => $label ) {
								printf(
									'<option value="%s" data-flag-html="%s"%s>%s</option>' . "\n",
									esc_attr( $code ),
									esc_html( LMAT_Language::get_flag_html( LMAT_Language::get_flag_information( $code ) ) ),
									selected( isset( $edit_lang->flag_code ) && $edit_lang->flag_code === $code, true, false ),
									esc_html( $label )
								);
							}
							?>
						</select>
						<p><?php esc_html_e( 'Choose a flag for the language.', 'linguator-multilingual-ai-translation' ); ?></p>
					</div>

					<div class="form-field">
						<label for="lang_order"><?php esc_html_e( 'Order', 'linguator-multilingual-ai-translation' ); ?></label>
						<?php
						printf(
							'<input name="term_group" id="lang_order" type="text" value="%d" />',
							! empty( $edit_lang ) ? esc_attr( $edit_lang->term_group ) : ''
						);
						?>
						<p><?php esc_html_e( 'Position of the language in the language switcher', 'linguator-multilingual-ai-translation' ); ?></p>
					</div>
					<?php
					if ( ! empty( $edit_lang ) ) {
						/**
						 * Fires after the Edit Language form fields are displayed.
						 *
						 *  
						 *
						 * @param LMAT_Language $lang language being edited.
						 */
						do_action( 'lmat_language_edit_form_fields', $edit_lang );
					} else {
						/**
						 * Fires after the Add Language form fields are displayed.
						 *
						 *  
						 */
						do_action( 'lmat_language_add_form_fields' );
					}

					submit_button( ! empty( $edit_lang ) ? __( 'Update', 'linguator-multilingual-ai-translation' ) : __( 'Add new language', 'linguator-multilingual-ai-translation' ) ); // since WP 3.1
					?>
				</form>
			</div><!-- form-wrap -->
		</div><!-- col-wrap -->
	</div><!-- col-left -->
</div><!-- col-container -->
