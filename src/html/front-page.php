<!DOCTYPE html>
<html>
<head>
<?php 
    /*
    主頁 /

        除了標題資訊以外，總計要提供下列資訊:
        1. 網站快速連結
        2. 近期文章
            * 標題
            * 分類名稱
            * 標籤名稱
            * 意象圖
            * 摘抄
            * 連結
    */
?>
<?php get_template_part('template-parts/general-header') ?>
    <script>
        window.wp.recentPosts = [
        <?php while ( have_posts() ) {
            the_post();
            get_template_part('template-parts/encapsulate-post-to-json');
        } //have_posts() 結尾 ?>
        ];
    </script>
</head>
<body>
    <?php get_template_part('template-parts/general-content') ?>
</body>
</html>