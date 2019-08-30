type:<?php echo json_encode(get_post_type()); ?>,
id:<?php echo json_encode(get_the_ID()); ?>,
title:<?php echo json_encode(get_the_title()); ?>,
slug:<?php echo json_encode(get_post_field('post_name', get_post())) ?>,
date:new Date(<?php echo json_encode(get_post_time('Y-m-d\TH:i:s', true)); ?>),
modified:new Date(<?php echo json_encode(get_post_modified_time('Y-m-d\TH:i:s', true)); ?>),
content:<?php echo json_encode(get_the_content()); ?>,
excerpt:<?php echo json_encode(get_the_excerpt()); ?>,
url:<?php echo json_encode(get_permalink($post->ID)); ?>,
<?php if ( has_post_thumbnail() ) :
    $thumbnail = array(
        'url' => get_the_post_thumbnail_url(),
        'caption' => get_the_post_thumbnail_caption()
    ); ?>
thumbnail:<?php echo json_encode($thumbnail); ?>,
<?php endif; ?>