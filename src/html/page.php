<?php 
    /*
        專頁 /page-slug

        除了標題資訊以外，總計要提供下列資訊:
        1. 文章標題
        2. 母文章?
        3. 子文章?
        4. 發文日期
        6. 更新日期
        7. 發文的意象圖
        8. 內容
    */
?>
<!DOCTYPE html>
<html>
<head>
    <?php get_template_part('template-parts/general-header') ?>
    <script>
        window.wp.completePages = [
            <?php while ( have_posts() ) {
            the_post();  // 這是此 post 物件的起點 
            get_template_part('template-parts/encode-page-to-json');
            } //have_posts() 結尾 ?>
        ];
    </script>
</head>
<body>
    <?php get_template_part('template-parts/general-content') ?>
</body>
</html>