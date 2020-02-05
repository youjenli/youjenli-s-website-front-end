<?php 
    /*
        這個樣板負責提供橫跨各資源頁面的必要資源，包含
        1. 標題
        2. 樣式表
        3. 標題列設定
        4. 文章分頁設定
    */

    //載入包含 $pathOfJsSrcFiles, $connectionProtocolOfThisSite, $shortNameOfDisqusForum 在內的參數
    require('parameters.php');
?>
<title></title>
<link rel="stylesheet" type="text/css" href="<?php echo get_theme_file_uri( $pathOfMainCssOutputFile ); ?>">
<?php
    /*
      以下參數的用途是讓 navigo 知道 site url，這樣解析路徑的規則就不用寫死在客戶端。
      site_url 是當使用者加上 wp-admin 之後就可以存取到管理介面的路徑。
      https://developer.wordpress.org/reference/functions/get_site_url/

      get_site_url 函式最後一項參數的奇怪符號是 gulp 所調用的 Lodash/Underscore 樣板引擎之記號。
      我們在打包場景之前要透過樣板引擎調整這裡的設定，使它能符合場景的使用情境（開發/生產環境）
    */
    $url = get_site_url(null, '', $connectionProtocolOfThisSite);
?>
<script>
    window.wp = {
        siteName:<?php echo json_encode( get_bloginfo('name', 'raw') ); ?>,
        siteUrl:<?php echo json_encode( untrailingslashit($url) ); ?>,
        <?php /*
            jsSrcFolder 是存放 javascript 執行檔的路徑，相對於場景根路徑。
            這個參數是讓前端可以生成 prism 語言套件的存放路徑。
        */ ?>
        jsSrcFolder:<?php echo json_encode( $jsSrcFolder ); ?>,
        <?php /*
            以下兩項參數是 prismjs 的 js 檔和 css 檔案之完整 url。
            提供路徑給前端的目的是讓前端可以視情況載入 prismjs 套件。
        */ ?>
        urlOfPrismJsSrcFile:<?php echo json_encode( get_theme_file_uri( $pathOfPrismJsSrcFile ) ); ?>,
        urlOfPrismCssSrcFile:<?php echo json_encode( get_theme_file_uri( $pathOfPrismCssSrcFile ) ); ?>,
        <?php 
            // themeUrl 的用途是讓前端知道場景的路徑，這樣才可以提供圖片網址給前端頁面
        ?>
        themeUrl:<?php echo json_encode( trailingslashit( get_template_directory_uri() ) ); ?>,
        responseCode:<?php echo http_response_code(); ?>,
        disquz:{
            shortName:<?php echo json_encode( $shortNameOfDisqusForum ) ?>
        }
    }
</script>
<?php 
/*注意，get_template_part 這個 wordpress 的函式接受的路徑是載入樣板相對於場景根目錄的路徑，而不是樣板與執行此函式的檔案之相對路徑。
  如果填寫樣板與執行此函式的檔案之相對路徑，那載入樣板的作業就會失敗。
  此函式載入失敗不會報錯，這特性容易讓人搞不懂發生什麼問題。

  欲了解此函式可參閱以下連結
  https://wordpress.stackexchange.com/questions/9978/how-to-use-get-template-part
*/
get_template_part('template-parts/title-bar');
get_template_part('template-parts/pagination');
?>