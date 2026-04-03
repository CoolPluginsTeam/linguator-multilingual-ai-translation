<?php

namespace Linguator\Admin\Controllers;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Linguator_Admin_View_Language_Links' ) ) :
	class Linguator_Admin_View_Language_Links {

		public function __construct() {
			add_action( 'current_screen', array( $this, 'linguator_admin_view_language_links' ) );
            add_action( 'admin_enqueue_scripts', array( $this, 'linguator_admin_view_language_links_assets' ) );
		}

        public function linguator_admin_view_language_links_assets() {
			global $linguator;
			if(function_exists('get_current_screen') && property_exists(get_current_screen(), 'post_type') && $linguator && property_exists($linguator, 'model')){
				$current_screen=get_current_screen();

				$translated_post_types = $linguator->model->get_translated_post_types();
				$translated_taxonomies = $linguator->model->get_translated_taxonomies();

				$translated_post_types = array_keys($translated_post_types);
				$translated_taxonomies = array_keys($translated_taxonomies);

				$translated_post_types=array_filter($translated_post_types, function($post_type){
					return is_string($post_type);
				});
		
				$translated_taxonomies=array_filter($translated_taxonomies, function($taxonomy){
					return is_string($taxonomy);
				});

				$valid_post_type=(isset($current_screen->post_type) && !empty($current_screen->post_type)) && in_array($current_screen->post_type, $translated_post_types) && $current_screen->post_type !== 'attachment' ? $current_screen->post_type : false;

				$valid_taxonomy=(isset($current_screen->taxonomy) && !empty($current_screen->taxonomy)) && in_array($current_screen->taxonomy, $translated_taxonomies) ? $current_screen->taxonomy : false;
				
				if((!$valid_post_type && !$valid_taxonomy) || ((!$valid_post_type || empty($valid_post_type)) && !isset($valid_taxonomy)) || (isset($current_screen->taxonomy) && !empty($current_screen->taxonomy) && !$valid_taxonomy)){
					return;
				}

				wp_enqueue_style( 'lmat-admin-view-language-links', plugins_url( 'admin/assets/css/admin-view-language-links.css', LINGUATOR_ROOT_FILE ), array(), LINGUATOR_VERSION );
				wp_enqueue_script( 'lmat-admin-view-language-links', plugins_url( 'admin/assets/js/admin-view-language-links.js', LINGUATOR_ROOT_FILE ), array( 'jquery' ), LINGUATOR_VERSION, true );

			}
        }

		public function linguator_admin_view_language_links($current_screen) {
            if(is_admin()) {

				global $linguator;
        
				if(!$linguator || !property_exists($linguator, 'model')){
					return;
				}

				$translated_post_types = $linguator->model->get_translated_post_types();
				$translated_taxonomies = $linguator->model->get_translated_taxonomies();

				$translated_post_types = array_keys($translated_post_types);
				$translated_taxonomies = array_keys($translated_taxonomies);

				$translated_post_types=array_filter($translated_post_types, function($post_type){
					return is_string($post_type);
				});
		
				$translated_taxonomies=array_filter($translated_taxonomies, function($taxonomy){
					return is_string($taxonomy);
				});

				$valid_post_type=(isset($current_screen->post_type) && !empty($current_screen->post_type)) && in_array($current_screen->post_type, $translated_post_types) && $current_screen->post_type !== 'attachment' ? $current_screen->post_type : false;
				$valid_taxonomy=(isset($current_screen->taxonomy) && !empty($current_screen->taxonomy)) && in_array($current_screen->taxonomy, $translated_taxonomies) ? $current_screen->taxonomy : false;
				
				if((!$valid_post_type && !$valid_taxonomy) || ((!$valid_post_type || empty($valid_post_type)) && !isset($valid_taxonomy)) || (isset($current_screen->taxonomy) && !empty($current_screen->taxonomy) && !$valid_taxonomy)){
					return;
				}

				add_filter( "views_{$current_screen->id}", array($this, 'linguator_list_table_views_filter') );
			}
        }

        public function linguator_list_table_views_filter($views) {
            if(!function_exists('LMAT') || !function_exists('linguator_count_posts') || !function_exists('get_current_screen') || !property_exists(LMAT(), 'model') || !function_exists('linguator_current_language')){
                return $views;
			}
			
			$linguator_languages =  LMAT()->model->get_languages_list();
			$current_screen=get_current_screen();
			$index=0;
			$total_languages=count($linguator_languages);
			$linguator_active_languages=linguator_current_language();
			$linguator_active_languages = !$linguator_active_languages ? 'all' : $linguator_active_languages;
			$taxonomy=isset($current_screen->taxonomy) ? $current_screen->taxonomy : '';
			
			$post_type=isset($current_screen->post_type) ? $current_screen->post_type : '';
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only parameter for filtering
			$post_status=(isset($_GET['post_status']) && 'trash' === sanitize_text_field(wp_unslash($_GET['post_status']))) ? 'trash' : 'publish';
			$all_translated_post_count=0;
			$list_html='';

			$publish_post_args = array('post_type'=>$post_type, 'post_status'=>$post_status);
			$draft_post_args = array('post_type'=>$post_type, 'post_status'=>'draft');
			$pending_post_args = array('post_type'=>$post_type, 'post_status'=>'pending');

		if($post_type === 'elementor_library'){
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only parameter for filtering
			$library_type=isset($_GET['elementor_library_type']) ? sanitize_text_field(wp_unslash($_GET['elementor_library_type'])) : '';

				if($library_type && !empty($library_type)){
					$post_meta_query= array(
						array(
							'key' => '_elementor_template_type',
							'value' => $library_type,
							'compare' => '=',
						)
					);
					// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
					$publish_post_args['meta_query'] = $post_meta_query;
					// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
					$draft_post_args['meta_query'] = $post_meta_query;
					// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
					$pending_post_args['meta_query'] = $post_meta_query;
				};
			};

			if(count($linguator_languages) > 1 && !$taxonomy && empty($taxonomy)){

                echo wp_kses("<div class='lmat_subsubsub' style='display:none; clear:both;'>
					<ul class='lmat_subsubsub_list'>", array(
						'div' => array(
							'class' => array(),
							'style' => array(),
						),
						'ul' => array('class' => array()),
					));
                    foreach($linguator_languages as $lang){
						$flag=isset($lang->flag) ? $lang->flag : '';
						$language_slug=isset($lang->slug) ? $lang->slug : '';
						$current_class=$linguator_active_languages && $linguator_active_languages == $language_slug ? 'current' : '';
						$translated_post_count=linguator_count_posts($language_slug, $publish_post_args);
						$url=function_exists('add_query_arg') ? add_query_arg('lang', $language_slug) : 'edit.php?post_type='.esc_attr($post_type).'&lang='.esc_attr($language_slug);
						// Language links must include nonce so admin language filter can update user meta safely.	
						$url = wp_nonce_url( $url, 'lmat_set_admin_filter_lang', '_lmat_lang_nonce' );
						if('publish' === $post_status){
							$draft_post_count=linguator_count_posts($language_slug, $draft_post_args);
							$translated_post_count+=$draft_post_count;

							$pending_post_count=linguator_count_posts($language_slug, $pending_post_args);
							$translated_post_count+=$pending_post_count;
						}

                        $flag_url=isset($lang->flag_url) ? $lang->flag_url : '';
                        $is_default = !empty($lang->is_default);
                        $icon = $is_default ? " <span class='icon-default-lang' aria-hidden='true'></span>" : '';

                        $all_translated_post_count+=$translated_post_count;
                        $list_html.="<li class='lmat_lang_".esc_attr($language_slug)."'><a href='".esc_url($url)."' class='".esc_attr($current_class)."'><img src='".esc_url($flag_url)."' alt='".esc_attr($lang->name)."' width='16' style='margin-right: 5px;'>".esc_html($lang->name).$icon." <span class='count'>(".esc_html($translated_post_count).")</span></a></li>";
						$index++;
					}

					$all_url=function_exists('add_query_arg') ? add_query_arg('lang', 'all') : 'edit.php?post_type='.esc_attr($post_type).'&lang=all';
					// Language links must include nonce so admin language filter can update user meta safely.
					$all_url = wp_nonce_url( $all_url, 'lmat_set_admin_filter_lang', '_lmat_lang_nonce' );
					$current_lang_link='all' !== $linguator_active_languages ? esc_url($all_url) : '';

					echo "<li class='lmat_lang_all'><a href='".esc_url($current_lang_link)."' class='".esc_attr($linguator_active_languages == 'all' ? 'current' : '')."	'>All <span class='count'>(".esc_html($all_translated_post_count).")</span></a></li>";
					
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