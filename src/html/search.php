<?php 
    /*
        搜尋 /search

        除了網站標頭資訊以外，總計要提供下列資訊:
        1. 搜尋名稱
        2. 共有幾筆紀錄
            文章?、分類、標籤。
        3. 搜尋結果
            * 文章
                標題、分類、標籤、摘要
            * 分類
                名稱、描述
            * 標籤
                名稱、描述
    */
?>
<!DOCTYPE html>
<html>
<head>
    <?php get_template_part('template-parts/general-header');
          $searchQuery = get_search_query(); 
          
          /*
            以下區域是要了解目前所在的分頁以便適當地挑選出要呈現的分類與標籤查詢結果。
          */
          if ( get_query_var('paged') ) {
            $paged = get_query_var('paged');
          } else if ( get_query_var('page') ) {
            $paged = get_query_var('page');
          } else {
            $paged = 1;
          }

          //分類和標籤在特定頁裡要呈現的數目
          $taxonomies_per_page = 14;
          $generalOffset = $taxonomies_per_page * ($paged - 1);
    ?>
    <script>
        window.wp.search = {
            query:<?php echo json_encode($searchQuery) ?>,
            publications:{
                totalItems:<?php echo $wp_query->found_posts ?>,
                itemsInCurrentPage:[
                <?php while ( have_posts() ) {
                    the_post(); 
                    /*
                        這邊原則上除了 post 和 page 以外不會有其型態的發表物，
                        因此只根據 post_type 決定產生 json 物件的模組。
                    */
                    if ( 'post' == get_post_type() ) {
                        get_template_part('template-parts/encapsulate-post-to-json');
                    } else {
                        get_template_part('template-parts/encapsulate-page-to-json');
                    }
                }?>]
            },
            <?php 
            /*
                第一次查詢是為了解符合條件的分類總數
            */
            $total_amount_of_categories = count( get_terms( array(
                'taxonomy' => 'category',
                'name__like' => $searchQuery,
                'hide_empty' => false
            ) ) );

            $selectedSegmentOfTaxonomy = $paged;
            $offset = $generalOffset;
            if ( $generalOffset >= $total_amount_of_categories ) {
                $selectedSegmentOfTaxonomy = floor( $total_amount_of_categories / $taxonomies_per_page );
                $offset = $taxonomies_per_page * $selectedSegmentOfTaxonomy;
            }
            $terms = get_terms( array(
                'taxonomy' => 'category',
                'name__like' => $searchQuery,
                'hide_empty' => false,
                'offset' => $offset,
                'number' => $taxonomies_per_page
              ) );
            if ( !is_wp_error($terms) && count($terms) > 0 ) : 
            $listOfCategories = array();
            foreach ( $terms as $category ) {
                $listOfCategories[] = array(
                    'id' => $category->term_id,
                    'name' => $category->name,
                    'url' => get_term_link($category->term_id, $category->taxonomy),
                    'description' => $category->description
                );
            }
            $dataOfCategories = array(
                'totalPages' => ceil( $total_amount_of_categories / $taxonomies_per_page ),
                'currentPage' => $selectedSegmentOfTaxonomy,
                'totalItems' => $total_amount_of_categories,
                'itemsPerPage' => $taxonomies_per_page,
                'itemsInCurrentPage' => $listOfCategories,
            );
            ?>
            categories:<?php echo json_encode($dataOfCategories); ?>,
            <?php else: ?>
            categories:{
                totalPages:0,
                currentPage:0,
                totalItems:0,
                itemsPerPage:0,
                itemsInCurrentPage:[]
            },
            <?php endif; ?>
            <?php 
            /*
                第一次查詢是為了解符合條件的分類總數
            */
            $total_amount_of_tags = count( get_terms( array(
                'taxonomy' => 'post_tag',
                'name__like' => $searchQuery,
                'hide_empty' => false
            ) ) );

            $selectedSegmentOfTaxonomy = $paged;
            $offset = $generalOffset;
            if ( $generalOffset >= $total_amount_of_tags ) {
                $selectedSegmentOfTaxonomy = floor( $total_amount_of_tags / $taxonomies_per_page );
                $offset = $taxonomies_per_page * $selectedSegmentOfTaxonomy;
            }
            $terms = get_terms(array(
                'taxonomy' => 'post_tag',
                'name__like' => $searchQuery,
                'hide_empty' => false,
                'offset' => $offset,
                'number' => $taxonomies_per_page
              ));
            if ( !is_wp_error($terms) && count($terms) > 0 ) : 
            $listOfTags = array();
            foreach ($terms as $tag ) {
                $listOfTags[] = array(
                    'id' => $tag->term_id,
                    'name' => $tag->name,
                    'url' => get_term_link($tag->term_id, $tag->taxonomy),
                    'description' => $tag->description
                );
            }
            $dataOfTags = array(
                'totalPages' => ceil( $total_amount_of_tags / $taxonomies_per_page ),
                'currentPage' => $selectedSegmentOfTaxonomy,
                'totalItems' => $total_amount_of_tags,
                'itemsPerPage' => $taxonomies_per_page,
                'itemsInCurrentPage' => $listOfTags
            );
            ?>
            tags:<?php echo json_encode($dataOfTags); ?>
            <?php else: ?>
            tags:{
                totalPages:0,
                currentPage:0,
                totalItems:0,
                itemsPerPage:0,
                itemsInCurrentPage:[]
            }
            <?php endif; ?>
        }
    </script>
</head>
<body>
    <?php get_template_part('template-parts/general-content') ?>
</body>
</html>