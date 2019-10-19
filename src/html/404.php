<?php 
    /*
        因為暫時還拿不定主意要把 404 頁面設計成什麼樣子，
        所以目前處理這些問題的方法是呈現首頁的內容並由客戶端附上錯誤訊息，
        待將來有 404 頁面的設計靈感時，再來實現更嚴謹的設計。
    */
    global $wp_query, $wp_the_query;
    $wp_query = new WP_Query();
    $wp_query->query( '' );
    $wp_the_query = $wp_query;

    get_template_part( 'front-page' );
?>