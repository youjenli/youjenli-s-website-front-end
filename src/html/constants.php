<?php 
    /*
        以下變數是有關自訂欄位相關的常數。
    */
    //為自訂的主旨欄位加上前綴詞以免與其他套件的參數衝突
    $prefix_of_custom_field = 'custom-field-';
    
	//自訂的主旨欄位在資料庫 wp_post meta 表單裡面 meta key 的名稱
    $name_of_custom_field_gist = $prefix_of_custom_field . 'gist';
    //自訂的選單圖示欄位在資料庫 wp_post_meta 表單裡面 meta key 的名稱
    $name_of_custom_field_nameOfLink = $prefix_of_custom_field . 'nameOfLink';
    $name_of_custom_field_hintOfLink = $prefix_of_custom_field . 'hintOfLink';
    $name_of_custom_field_pathOfIcon = $prefix_of_custom_field . 'icon';
    $name_of_custom_field_colorOfLink = $prefix_of_custom_field . 'color';
    //自訂的估計閱讀時間欄位在資料庫 wp_post_meta 表單裡面 meta key 的名稱
    $name_of_custom_field_estimatedReadingTimes = $prefix_of_custom_field . 'estimatedReadingTimes';

    //大尺吋縮略圖的尺吋名稱
    $name_of_the_size_of_custom_post_thumbnails_in_single_or_page = 'post-thumbnail_single-page';
?>