{
    <?php get_template_part('template-parts/encode-publication-to-json') ?>
    <?php $categories = get_the_category();
    if ($categories): 
        $listOfCategories = array();
        foreach ($categories as $category) {
            $listOfCategories[] = array(
                'id' => $category->term_id,
                'name' => $category->name,
                'url' => get_term_link($category->term_id, $category->taxonomy),
                'description' => $category->description
            );
        }?>
    categories:<?php echo json_encode($listOfCategories); ?>,
    <?php else : ?>
    categories:[],
    <?php endif; ?>
    <?php $tagsOfPost = get_the_tags();
    if ($tagsOfPost) :
        $listOftags = array();
        foreach ( $tagsOfPost as $tagOfPost ) {
            $listOftags[] = array(
                'id' => $tagOfPost->term_id,
                'name' => $tagOfPost->name,
                'url' => get_term_link($tagOfPost->term_id, $tagOfPost->taxonomy),
                'description' => $tagOfPost->description
            );
        }?>
    tags:<?php echo json_encode($listOftags); ?>,
    <?php else : ?>
    tags:[],
    <?php endif; ?>
    <?php if ( !is_home() && !is_front_page() ) : ?>
    content:<?php echo json_encode(get_the_content()) ?>
    <?php endif; ?>
},