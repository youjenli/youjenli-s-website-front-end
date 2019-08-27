{
    <?php get_template_part('template-parts/encode-publication-to-json') ?>
    <?php if ( is_search() ) : ?>
    type:'Page',
    <?php endif ?>
    <?php if ($post->post_parent) : 
        $parent = get_post($post->post_parent); 
        $parentObj = array(
            'title' => $parent->post_title,
            'url' => get_permalink($parent->ID),
            'slug' => get_post_field('post_name', $parent)
        ); ?>
    parent:<?php echo json_encode($parentObj) ?>,
    <?php endif; ?>
    <?php if ( !is_home() && !is_front_page() ) : ?>
    content:<?php echo json_encode(get_the_content()) ?>
    <?php endif; ?>
},