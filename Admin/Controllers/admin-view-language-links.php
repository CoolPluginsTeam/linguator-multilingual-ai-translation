<?php

namespace Linguator\Admin\Controllers;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'LMAT_Admin_View_Language_Links' ) ) :
	class LMAT_Admin_View_Language_Links {

		public function __construct() {
			add_action( 'current_screen', array( $this, 'lmat_admin_view_language_links' ) );
            add_action( 'admin_enqueue_scripts', array( $this, 'lmat_admin_view_language_links_assets' ) );
		}

        public function lmat_admin_view_language_links_assets() {
            wp_enqueue_script( 'lmat-admin-view-language-links', plugins_url( 'Admin/Assets/js/admin-view-language-links.js', LINGUATOR_ROOT_FILE ), array( 'jquery' ), LINGUATOR_VERSION, true );
        }

		public function lmat_admin_view_language_links($current_screen) {
            if(is_admin()) {

				global $linguator;
        
				if(!$linguator || !property_exists($linguator, 'model')){
					return;
				}

				$translated_post_types = $linguator->model->get_translated_post_types();
				$translated_post_types = array_keys($translated_post_types);

				if(!in_array($current_screen->post_type, $translated_post_types)){
					return;
				}

				add_filter( "views_{$current_screen->id}", array($this, 'lmat_list_table_views_filter') );
			}
        }

        public function lmat_list_table_views_filter($views) {
            if(!function_exists('LMAT') || !function_exists('lmat_count_posts') || !function_exists('get_current_screen') || !property_exists(LMAT(), 'model') || !function_exists('lmat_current_language')){
                return $views;
			}
			
			$lmat_languages =  LMAT()->model->get_languages_list();
			$current_screen=get_current_screen();
			$index=0;
			$total_languages=count($lmat_languages);
			$lmat_active_languages=lmat_current_language();
			
			$post_type=isset($current_screen->post_type) ? $current_screen->post_type : '';
			$post_status=(isset($_GET['post_status']) && 'trash' === sanitize_text_field(wp_unslash($_GET['post_status']))) ? 'trash' : 'publish';
			$all_translated_post_count=0;
			$list_html='';
			if(count($lmat_languages) > 1){
                echo "<div class='lmat_subsubsub' style='display:none; clear:both;'>
					<ul class='subsubsub lmat_subsubsub_list'>";
					foreach($lmat_languages as $lang){
	
						$flag=isset($lang->flag) ? $lang->flag : '';
						$language_slug=isset($lang->slug) ? $lang->slug : '';
						$current_class=$lmat_active_languages && $lmat_active_languages == $language_slug ? 'current' : '';
						$translated_post_count=lmat_count_posts($language_slug, array('post_type'=>$post_type, 'post_status'=>$post_status));

						if('publish' === $post_status){
							$draft_post_count=lmat_count_posts($language_slug, array('post_type'=>$post_type, 'post_status'=>'draft'));
							$translated_post_count+=$draft_post_count;

							$pending_post_count=lmat_count_posts($language_slug, array('post_type'=>$post_type, 'post_status'=>'pending'));
							$translated_post_count+=$pending_post_count;
						}

						$all_translated_post_count+=$translated_post_count;
						// echo $flag; // phpcs:ignore WordPress.Security.EscapeOutput
						$list_html.="<li class='lmat_lang_".esc_attr($language_slug)."'><a href='edit.php?post_type=".esc_attr($post_type)."&lang=".esc_attr($language_slug)."' class='".esc_attr($current_class)."'>".esc_html($lang->name)." <span class='count'>(".esc_html($translated_post_count).")</span></a>".($index < $total_languages-1 ? ' |&nbsp;' : '')."</li>";
						$index++;
					}

					echo "<li class='lmat_lang_all'><a href='edit.php?post_type=".esc_attr($post_type)."&lang=all"."' class=''>All Languages<span class='count'>(".esc_html($all_translated_post_count).")</span></a> |&nbsp;</li>";
					echo $list_html;
				echo "</ul>
				</div>";
			}

			return $views;
		}
	}

endif;