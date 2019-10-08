<?php 
    /*
        發文 /post-slug

        除了網站標頭資訊以外，總計要提供下列資訊:
        1. 文章標題
        2. 分類名稱列表與連結
        3. 標籤名稱列表與連結
        4. 發文日期
        5. 更新日期
        6. 發文的意象圖
        7. 內容
    */
?>
<!DOCTYPE html>
<html>
<head>
    <?php get_template_part('template-parts/general-header') ?>
    <script>
        window.wp.completePosts = [
        <?php while ( have_posts() ) {
            the_post();  // 這是此 post 物件的起點 
            get_template_part('template-parts/encapsulate-post-to-json');
        } //have_posts() 結尾 ?>
        ];
    </script>
</head>
<body>
    <?php get_template_part('template-parts/general-content') ?>
</body>
</html>