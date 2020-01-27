<?php 
require( dirname( __FILE__ ) . '/../constants.php'); 
/*
  註：雖然 title-bar.php 應該已經在前面載入過以上變數檔案，
  但我推測因為 wordpress 採用 function 之類的辦法載入呈現發表物的樣板，
  所以這裡要用 require 載入變數檔案，否則會讀不到變數
*/
?>
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
if ( is_home() || is_front_page() ) {
  $thumbnail = array(
    'url' => get_the_post_thumbnail_url(),//也就是 400 x 240 的照片
    'caption' => get_the_post_thumbnail_caption()
  );
} else {
  //is_single() || is_page() 及其他情況
  $thumbnail = array(
      'url' => get_the_post_thumbnail_url( $post, $name_of_the_size_of_custom_post_thumbnails_in_single_or_page ), //也就是 1024 x 614 的照片
      'caption' => get_the_post_thumbnail_caption()
  );
}?>
thumbnail:<?php echo json_encode($thumbnail); ?>,
<?php endif; ?>
<?php if ( !is_home() && !is_front_page() ) :
  $estimatedReadingTimes = get_post_meta($post->ID, $name_of_custom_field_estimatedReadingTimes, true);
  if ( is_numeric( $estimatedReadingTimes ) ) : 
  /*
    註：這裡有個奇怪的問題，那就是不管有沒有用 intval 處理 $estimatedReadingTimes 的值，
    也不管後面是否用 json_encode 處理 $estimatedReadingTimes，
    網頁都會拿到型態為字串的 estimatedReadingTimes，
    因此後來前端乾脆直接產生介面上的閱讀時間而不像先前一樣先辨識文章 estimatedReadingTimes 屬性的型態再決定是否產生閱讀時間說明。
  */
  ?>
estimatedReadingTimes:<?php echo json_encode( $estimatedReadingTimes ) ?>,
  <?php else: ?>
estimatedReadingTimes:0,
  <?php endif; ?>
commentPermitted:<?php echo json_encode( comments_open() ) ?>,
<?php endif; ?>