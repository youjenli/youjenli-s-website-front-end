<?php 
	/*
		以下函式是用來設定重要頁面的文章數。
		基本上除了像首頁這樣要追求形式對齊之美的頁面以外，其他頁面的文章數我傾向從 wordpress 後台去調，
		不要在此用程式碼寫死。

		參考資料：以下是這種做法的教學。
		https://binaryfork.com/wordpress/coding/items-per-page-wordpress-archives-658/
	*/
	function youjenli_alter_items_per_page_of_home() {
		if ( is_home() || is_front_page() ) {
			set_query_var('posts_per_page', 12);
		}
	};
	add_filter('pre_get_posts', 'youjenli_alter_items_per_page_of_home');
	
	/*
		Wordpress 的專頁預設沒有摘要功能，要執行以下指令才能啟用該功能。
		欲了解詳情可參閱以下說明：
		https://www.wpentire.com/excerpt-field-in-wordpress-post-page/
	*/
	add_post_type_support( 'page', 'excerpt' );
	
	/*
		Wordpress 預設在 wp-includes/default-filters.php 裡面為 the_content 和 the_excerpt 註冊了 wpautop 這個 filter。
		https://codex.wordpress.org/Function_Reference/wpautop

		wpautop 的功能是把連續兩個斷行記號轉換為 <p>。
		也就是說，任何使用 the_content 和 the_excerpt 的地方所輸出的資料都可能會包含 <p></p>。
		實際使用發現就算摘抄內容只有一行，而且末尾沒有兩個斷行記號，wpautop 仍會以 <p> 包覆起來。
		然而，這會使我的場景不能從 rest api 拿到乾淨而無 html 標籤的資料，因此在這裡把它禁用掉。
		如果摘抄確實需要分段，那再由自己在寫摘抄時自己加上 p 即可。
	*/
	remove_filter( 'the_excerpt', 'wpautop' );

    function youjenli_setup() {
        add_theme_support('post-thumbnails');
    }
    add_action('after_setup_theme', 'youjenli_setup');
	
    /**
     * 這個函式的用途是讀取此網站之的分頁設定。
     * 這是從 general-template.php 的 paginate_links 函式學習到的做法。
     *
     * @global WP_Rewrite $wp_rewrite
     *
     * @return array|string|void String of page links or array of page links.
     */
    function youjenli_get_pagelink_format() {
    	global $wp_rewrite;
    
    	// Setting up default values based on the current URL.
	$pagenum_link = html_entity_decode(  get_pagenum_link() );
		
    	$url_parts    = explode( '?', $pagenum_link );

    	// Append the format placeholder to the base URL.
    	$pagenum_link = trailingslashit( $url_parts[0] ) . '%_%';
    
    	// URL base depends on permalink settings.
    	$using_index_permalinks = $wp_rewrite->using_index_permalinks();
    	/*
    	 * 什麼是 index permalink?
    	 * Determines whether permalinks are being used and rewrite module is not enabled.
    	 * Means that permalink links are enabled and index.php is in the URL.
    	*/	
    	$format  = $using_index_permalinks && ! strpos( $pagenum_link, 'index.php' ) ? 'index.php/' : '';
    
    	$using_permalinks = $wp_rewrite->using_permalinks();
    	/**
    	 * Determines whether permalinks are being used.
    	 *
    	 * This can be either rewrite module or permalink in the HTTP query string.
    	 */

		/*
		  這裡決定分頁符號的格式
		  https://codex.wordpress.org/Function_Reference/user_trailingslashit
		*/
    	$format .= $using_permalinks ? user_trailingslashit( $wp_rewrite->pagination_base . '/%#%', 'paged' ) : '?paged=%#%';
    
		$args = array(
    		'base'               => $pagenum_link, // http://example.com/all_posts.php%_% : %_% is replaced by format (below)
    		'format'             => $format, // ?page=%#% : %#% is replaced by the page number
    		'add_args'           => array(), // array of query args to add
    	);
    
    	if ( isset( $url_parts[1] ) ) {
    		// Find the format argument.
    		$format = explode( '?', str_replace( '%_%', $args['format'], $args['base'] ) );
    		$format_query = isset( $format[1] ) ? $format[1] : '';
    		wp_parse_str( $format_query, $format_args );
        
    		// Find the query args of the requested URL.
    		wp_parse_str( $url_parts[1], $url_query_args );
        
    		// Remove the format argument from the array of query arguments, to avoid overwriting custom format.
    		foreach ( $format_args as $format_arg => $format_arg_value ) {
    			unset( $url_query_args[ $format_arg ] );
    		}
        
    		$args['add_args'] = array_merge( $args['add_args'], urlencode_deep( $url_query_args ) );
    	}
        
        return $args;
    }
?>