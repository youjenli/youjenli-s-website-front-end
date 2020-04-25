<?php 
    /*
        這個樣板是用來提供標題列上面的重要連結給各資源頁面。
        原本我打算整合 wordpress 自訂選單的功能以實現這種功能，而不自行實現一套自訂選單，但是後來發現以下幾個問題：

        1. 雖然 wordpress 的選單項目可以定義階層，但我還沒有想好要不要有階層選單，要的話又該怎麼設計，因此先作罷。

        綜合以上原因，最後我決定暫時先在此處寫死要送給客戶端的文章連結，
        等到後續研究完 wordpress 機制並規劃好整合自訂選單的方式之後再來調整這裡的做法。
    */
?>
<script type="text/javascript">
    <?php 
        require_once( dirname( __FILE__ ) . '/../constants.php');

        $menuItems = array();

        function retrieveMenuItem( $post ) {
            global $name_of_custom_field_nameOfLink, $name_of_custom_field_hintOfLink, 
                   $name_of_custom_field_pathOfIcon;
            
            $name_of_link = get_post_meta($post->ID, $name_of_custom_field_nameOfLink, true);
            if (!$name_of_link) {
                $name_of_link = get_the_title($post);
            }
            $hint_of_link = get_post_meta($post->ID, $name_of_custom_field_hintOfLink, true);
            if (!$hint_of_link) {
                $hint_of_link = get_the_excerpt($post);
            }
            return array(
                'type' => get_post_type($post),
                'name' => $name_of_link,
                'url' => get_permalink($post),
                'hint' => $hint_of_link,
                'slug' => get_post_field('post_name', $post),
                'pathOfIcon' => get_post_meta($post->ID, $name_of_custom_field_pathOfIcon, true)
            );
        };
        /*
            注意事項：
            1. 存取專頁的參數來自 class-wp-query.php 之 parse_query 的參數。
            2. 若要以 slug 查詢專頁 (page)，則要用 pagename 參數，name 參數是給發文 (post) 使用的。
            3. 一定要加入 post_type 參數指定查詢的資料類型，否則執行此函數什麼都拿不到。
        */
        $me = get_posts( array(
            'pagename' => 'about-myself',
            'post_type' => 'page'
        ) );
        
        if ( count($me) > 0 ) {
            $me = $me[0];
            $menuItems[] = retrieveMenuItem($me);
        }
        
        $mySite = get_posts( array(
            'pagename' => 'about-this-website',
            'post_type' => 'page'
        ) );

        if ( count($mySite) > 0 ) {
            $mySite = $mySite[0];
            $menuItems[] = retrieveMenuItem($mySite);
        }
    ?>
    window.wp.titleBar = {
        menuItems:<?php echo json_encode($menuItems); ?>
    }
</script>