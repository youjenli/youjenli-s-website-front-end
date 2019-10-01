<?php 
	
	require_once( 'constants.php' );

	/*
		metabox 是一個能夠在後台的文章編輯頁提供欄位讓作者可以輸入文章附加內容的擴充套件。
		為提供更好用的功能，我要運用此套件在文章編輯頁產生文章主旨的輸入欄位，因此要藉由以下函式設定 meta box。
		
	*/
	function youjenli_create_meta_boxes( $meta_boxes ) {
		global $name_of_custom_field_gist, $name_of_custom_field_pathOfIcon, 
			   $name_of_custom_field_nameOfLink, $name_of_custom_field_hintOfLink;

		$meta_boxes[] = array(
			/*
				參閱以下連結了解 meta box 設定的用途：
				https://docs.metabox.io/creating-meta-boxes/
			*/
			/* 呈現在文章編輯頁面之 meta box 提供的輸入欄位上面之標題文字
			*/
			'title' => '發文自訂欄位',
			// 指出以下自訂欄位適用的內容類型。
			'post_types' => array('post'),
			// 設定自訂欄位要顯示的位置。side 表示在側邊與文章其他設定並列顯示在選單中。
			'context' => 'side',
			// 是否自動儲存自訂欄位的內容？
			'autosave' => 'false',
			/* 此欄位在選單上相對於其他自訂欄位的順位，可填 high, low, default。
			   若未特別調整，則自訂欄位都會被排在系統內建欄位的後面。
			*/
			'priority' => 'high',
			// 要自訂哪些欄位？
			'fields' => [
				/*
					可參閱以下連結了解欄位各項設定的用途：
					https://docs.metabox.io/field-settings/
				*/
				[
					//在後台發文頁面提供的欄位類型
					'type' => 'textarea',
					//儲存至 wp_postmeta 的 meta key 名稱
					'id' => $name_of_custom_field_gist,
					//在後台發文頁面顯示的欄位名稱
					'name' => '本文主旨',
					//顯示在上面一項欄位名稱下面的欄位說明。
					'label_description' => '這篇文章想傳達的思想或情感。',
					//在輸入欄位下方，用來引導使用者的內容。
					'desc' => '此欄位填寫的主旨會出現在發表內容的上面，使讀者更容易瞭解文章內容。'
				]
			]
		);

		$meta_boxes[] = array(
			'title' => '發表物自訂欄位',
			'post_types' => array('post', 'page'),
			'context' => 'side',
			'autosave' => false,
			'priority' => 'low',
			'fields' => [
				[
					'type' => 'text',
					'id' => $name_of_custom_field_nameOfLink,
					'name' => '釘選在標題列或選單的顯示名稱',
					'label_description' => '此發表物的連結在標題列或連結選單上面的顯示名稱'
				],
				[
					'type' => 'textarea',
					'id' => $name_of_custom_field_hintOfLink,
					'name' => '發表物內容的提示訊息',
					'label_description' => '當滑鼠游標移到選單上此文章的連結時，畫面上會浮現的內容概要'
				]
				,[
					'type' => 'file_input',
					'id' => $name_of_custom_field_pathOfIcon,
					'name' => '發表物連結的示意圖',
					'label_description' => '伴隨此文章的連結一起呈現的示意圖'
				]
			]
		);

		return $meta_boxes;
	}
	add_filter( 'rwmb_meta_boxes', 'youjenli_create_meta_boxes' );

	/*
		在上面為文章主旨建立自訂欄位之後，接下來為了讓 rest api 的發文查詢功能可以輸出此自訂欄位，
		我要藉由以下函式讓 wordpress 系統知道我有自訂欄位，而且需要在 rest api 輸出這些自訂欄位。
	*/
	function youjenli_register_posts_meta_field() {
		global $name_of_custom_field_gist;
		register_meta('post', $name_of_custom_field_gist,
				  [
					  'type' => 'string',
					  'description' => 'The gist of current post/page.',
					  'show_in_rest' => true,
					  'single' => true
				  ]
			  );
	}
	add_action( 'rest_api_init', 'youjenli_register_posts_meta_field' );

	/*
		因為 wordpress 5.0 以後加人的 Gutenberg 編輯器會加入我不需要的資訊影響文章篇幅，
		所以下面兩行要參考網路上的做法來禁用此功能。
		https://digwp.com/2018/04/how-to-disable-gutenberg/
	*/	
	if (version_compare($GLOBALS['wp_version'], '5.0-beta', '>')) {
		// WP > 5 beta
		// disable for posts
		add_filter('use_block_editor_for_post', '__return_false', 10);
		// disable for post types
		add_filter('use_block_editor_for_post_type', '__return_false', 10);
		
	} else {
		// WP < 5 beta
		// disable for posts
		add_filter('gutenberg_can_edit_post', '__return_false', 10);
		// disable for post types
		add_filter('gutenberg_can_edit_post_type', '__return_false', 10);
	}


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