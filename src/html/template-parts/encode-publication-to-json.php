type:<?php echo json_encode(get_post_type()); ?>,
id:<?php echo json_encode(get_the_ID()); ?>,
title:<?php echo json_encode(get_the_title()); ?>,
slug:<?php echo json_encode(get_post_field('post_name', get_post())) ?>,
date:new Date(<?php echo json_encode(get_post_time('Y-m-d\TH:i:s', true)); ?>),
modified:new Date(<?php echo json_encode(get_post_modified_time('Y-m-d\TH:i:s', true)); ?>),
content:<?php echo json_encode(get_the_content()); ?>,
<?php 
/*
    當使用者在文章編輯頁面打開自訂摘抄選單後，wordpress 就不會自動依據內容產生摘抄，
    也不會在資料庫留存摘抄資訊──這是我希望系統運作的方式。
    
    問題是當開發者透過 get_the_excerpt API 讀取摘抄時，wordpress 若發現此文章在資料庫裡無摘抄，
    則會拿文章內容來填充摘抄，這導致首頁版面跑掉的問題。
    為避免此問題，這邊要先藉由 has_excerpt() 判斷文章是否有自訂的摘抄，
    若有的話才透過 get_the_excerpt() 取得，反之則不提供此項資料。
*/
if (has_excerpt()): ?>
excerpt:<?php echo json_encode(get_the_excerpt()); ?>,
<?php endif; ?>
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