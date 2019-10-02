type:<?php echo json_encode(get_post_type()); ?>,
id:<?php echo json_encode(get_the_ID()); ?>,
title:<?php echo json_encode(get_the_title()); ?>,
slug:<?php echo json_encode(get_post_field('post_name', get_post())) ?>,
date:new Date(<?php echo json_encode(get_post_time('Y-m-d\TH:i:s', true)); ?>),
modified:new Date(<?php echo json_encode(get_post_modified_time('Y-m-d\TH:i:s', true)); ?>),
content:<?php echo json_encode(get_the_content()); ?>,
excerpt:<?php echo json_encode(get_the_excerpt());
/* 註：這裡一定要使用 get_the_excerpt 而不是 the_excerpt，否則系統會直接輸出 html 文件而不會在此回傳摘抄。 */
?>,
url:<?php echo json_encode(get_permalink($post->ID)); ?>,
<?php if ( has_post_thumbnail() ) :
    $thumbnail = array(
        'url' => get_the_post_thumbnail_url(),
        'caption' => get_the_post_thumbnail_caption()
    ); ?>
thumbnail:<?php echo json_encode($thumbnail); ?>,
<?php endif; ?>
<?php 
require( dirname( __FILE__ ) . '/../constants.php');
/*註：雖然 title-bar.php 應該已經在前面載入過這個變數檔案，
  但我推測因為 wordpress 採用 function 之類的辦法載入呈現發表物的樣板，
  所以這裡要用 require 載入變數檔案，否則會讀不到變數
*/
$estimatedReadingTimes = get_post_meta($post->ID, $name_of_custom_field_estimatedReadingTimes, true);
if ( is_numeric( $estimatedReadingTimes ) ) : ?>
estimatedReadingTimes:<?php echo json_encode( $estimatedReadingTimes ) ?>,
<?php else: ?>
estimatedReadingTimes:0,
<?php endif ?>