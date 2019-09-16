<?php 
    /*
        以下變數是有關自訂欄位相關的常數。
    */
    //為自訂的主旨欄位加上前綴詞以免與其他套件的參數衝突
    $prefix_of_custom_field = 'custom-field-';
    
	//自訂的主旨欄位在資料庫裡 postmetas 表單裡面 meta key 的名稱
    $name_of_custom_field_gist = $prefix_of_custom_field . 'gist';
    //自訂的選單圖示欄位在資料庫裡 postmetas 表單裡面 meta key 的名稱
    $name_of_custom_field_nameOfLink = $prefix_of_custom_field . 'nameOfLink';
    $name_of_custom_field_hintOfLink = $prefix_of_custom_field . 'hintOfLink';
    $name_of_custom_field_pathOfIcon = $prefix_of_custom_field . 'icon';
?>