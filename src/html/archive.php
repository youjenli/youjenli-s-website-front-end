<!DOCTYPE html>
<html>
<head>
    <?php get_template_part('template-parts/general-header') ?>
    <?php 
        $type_of_archive = null;
        if ( is_category() )  {
            $type_of_archive = 'category';
        }
        if ( is_tag() ) {
            $type_of_archive = 'tag';
        }
    ?>
    <script>
        window.wp.archive = {
        <?php echo $type_of_archive ?>:{
                taxonomy:{
                    id:<?php echo get_queried_object_id(); ?>,
                    name:<?php echo json_encode(get_queried_object()->name); ?>,
                    slug:<?php echo json_encode(get_queried_object()->slug); ?>,
                    url:<?php echo json_encode(get_category_link(get_queried_object_id())); ?>,
                    description:<?php echo json_encode(get_queried_object()->description); ?>

                <?php if (is_category()) :
                $parent_cat_id = get_queried_object()->parent ? get_queried_object()->parent : false;
                //如果此分類有母分類，那就輸出母分類
                    if ($parent_cat_id && $parent_cat_id > 0) :
                        $parent_cat = get_category( $parent_cat_id );
                        if ( $parent_cat ) : 
                            $data_of_parent = array(
                                'id' => $parent_cat->term_id,
                                'name' => $parent_cat->name,
                                'slug' => $parent_cat->slug,
                                'url' => get_term_link($parent_cat->term_id),
                                'description' => $parent_cat->description
                            ) ?>,
                    ,parent:<?php echo json_encode($data_of_parent); ?>
                    <?php endif;
                    endif;
                $childrenCategories = get_categories(
                    array( 'parent' => get_queried_object_id() )
                ); 
                    if (count($childrenCategories) > 0 ) : ?>
                    ,children:[
                    <?php foreach ( $childrenCategories as $child ) : 
                        $data_of_child = array(
                            'id' => $child->term_id,
                            'name' => $child->name,
                            'slug' => $child->slug,
                            'url' => get_term_link($child->term_id),
                            'description' => $child->description
                        );
                        echo json_encode($data_of_child); ?>,
                    <?php endforeach; ?>
                    ]
                    <?php endif; ?>
                <?php endif; ?>
                },
                postsPerPage:<?php echo $wp_query->post_count; ?>,
                foundPosts:<?php echo $wp_query->found_posts; ?>,
                posts:[
                    <?php while ( have_posts() ) : the_post();?>
                    <?php get_template_part('template-parts/encapsulate-post-to-json') ?>
                    <?php endwhile; ?>
                ]
            }
        }
    </script>
</head>
<body>
    <?php get_template_part('template-parts/general-content') ?>
</body>
</html>