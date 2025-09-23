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
			global $linguator;
			if(function_exists('get_current_screen') && property_exists(get_current_screen(), 'post_type') && $linguator && property_exists($linguator, 'model')){
				$current_screen=get_current_screen();
				$translated_post_types = $linguator->model->get_translated_post_types();
				$translated_post_types = array_keys($translated_post_types);
				
				$post_type=$current_screen->post_type;

				if(!in_array($post_type, $translated_post_types)){
					return;
				}

				wp_enqueue_style( 'lmat-admin-view-language-links', plugins_url( 'admin/assets/css/admin-view-language-links.css', LINGUATOR_ROOT_FILE ), array(), LINGUATOR_VERSION );
				wp_enqueue_script( 'lmat-admin-view-language-links', plugins_url( 'admin/assets/js/admin-view-language-links.js', LINGUATOR_ROOT_FILE ), array( 'jquery' ), LINGUATOR_VERSION, true );

			}
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
			$lmat_active_languages = !$lmat_active_languages ? 'all' : $lmat_active_languages;
			$taxonomy=isset($current_screen->taxonomy) ? $current_screen->taxonomy : '';
			
			$post_type=isset($current_screen->post_type) ? $current_screen->post_type : '';
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only parameter for filtering
			$post_status=(isset($_GET['post_status']) && 'trash' === sanitize_text_field(wp_unslash($_GET['post_status']))) ? 'trash' : 'publish';
			$all_translated_post_count=0;
			$list_html='';

			if(count($lmat_languages) > 1 && !$taxonomy && empty($taxonomy)){
                echo wp_kses("<div class='lmat_subsubsub' style='display:none; clear:both;'>
					<ul class='lmat_subsubsub_list'>", array(
						'div' => array(
							'class' => array(),
							'style' => array(),
						),
						'ul' => array('class' => array()),
					));
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

                        $flag_url=isset($lang->flag_url) ? $lang->flag_url : '';
                        $is_default = !empty($lang->is_default);
                        $icon = $is_default ? " <span class='icon-default-lang' aria-hidden='true'></span>" : '';

                        $all_translated_post_count+=$translated_post_count;
                        $list_html.="<li class='lmat_lang_".esc_attr($language_slug)."'><a href='edit.php?post_type=".esc_attr($post_type)."&lang=".esc_attr($language_slug)."' class='".esc_attr($current_class)."'><img src='".esc_url($flag_url)."' alt='".esc_attr($lang->name)."' width='16' style='margin-right: 5px;'>".esc_html($lang->name).$icon." <span class='count'>(".esc_html($translated_post_count).")</span></a></li>";
						$index++;
					}

					$current_lang_link='all' !== $lmat_active_languages ? "edit.php?post_type=".esc_attr($post_type)."&lang=all" : '';

					echo "<li class='lmat_lang_all'><a href='".esc_url($current_lang_link)."' class='".esc_attr($lmat_active_languages == 'all' ? 'current' : '')."	'>All Languages <span class='count'>(".esc_html($all_translated_post_count).")</span></a></li>";
					
					$allowed = [
						'ul'   => [ 'class' => true ],
						'ol'   => [ 'class' => true ],
						'li'   => [ 'class' => true ],
						'a'    => [ 'href' => true, 'title' => true, 'target' => true, 'rel' => true, 'class' => true ],
						'span' => [ 'class' => true, 'aria-hidden' => true ],
						'strong' => [],
						'em'     => [],
						'img'    => [ 'src' => true, 'alt' => true, 'width' => true, 'height' => true, 'style' => true ],
					];
					
					echo wp_kses($list_html, $allowed);
				echo "</ul>
				</div>";
			}

			return $views;
		}
	}

endif;