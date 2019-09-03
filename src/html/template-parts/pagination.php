<?php 
    /*
      此程式的用途是提供內容分頁的連結格式以及分頁功能的設定給客戶端。
      這樣各資源頁面的樣板才能夠產生分頁連結。
      
      實現分頁功能的方法：

      前提
      *. 分頁基礎路徑 (pagination base) 在相同的 session 之中保持不變。
      *. 分頁佔位符號不變，例如 %_%。
      *. 分頁符號 (format) 不變，例如 page/%#%。
      *. 分頁數值填充欄位不變，例如 %#%。

      產生分頁步驟
      1. 頁面載入後，調用 pagination 模組取得分頁佔位符號、分頁符號、填充欄位。
      2. 各功能模組在初始化時，透過 pagination 取得分頁基礎。
      3. 切換分頁時，各功能模組提供分頁基礎給 pagination 模組產生分頁的連結。
    */
    
    /*
        若資源無分頁，則 $wp_query->max_num_pages 會是零，因此需要加判斷式判斷它是否為零，不是的話才要代入這項變數的值。
    */
    $totalPages = isset( $wp_query->max_num_pages ) && $wp_query->max_num_pages > 0 ? $wp_query->max_num_pages : 1;
    $currentPage = get_query_var( 'paged' ) ? intval( get_query_var( 'paged' ) ) : 1;
    $end_size = 3;
    $mid_size = 2;

    //註: 以上兩項數值僅供參考，各資源頁可按顯示大小決定要呈現的頁數。

    $pagination = youjenli_get_pagelink_format();
    $add_args_of_pages = $pagination['add_args'];
    $baseUrl = $pagination['base'];
    $pagination_format = $pagination['format'];
    $items_per_page = $wp_query->post_count;

    $paginationConfig = array(
        'placeHolderForPageIndicator' => '%_%', //指示分頁欄位的符號。這是從 general-template.php 的 paginate_links 函式抄出來的。
        'placeHolderForPage' => '%#%', //指數頁碼欄位的符號。這是從 general-template.php 的 paginate_links 函式抄出來的。
        'pageIndicator' => $pagination_format, //分頁的符號，例如 page/%#%,
        'addArgs' => $add_args_of_pages//要額外提供給連結的請求參數
    );

    $paginationData = array(
        'baseUrl' => $baseUrl, //此頁面的基本路徑，例如 https://host_name/category/it-tech/it-tech-note/%_%。 %_% 是指出分頁符號位置的佔位符號。
        'totalPages' => $totalPages, //總頁數
        'currentPage' => $currentPage, //此請求要查閱的頁數
        'endSize' => $end_size, //連結列表末端要出現的頁數
        'midSize' => $mid_size, //連結中間區段要出現的頁數
        'itemsPerPage' => $items_per_page //目前分頁包含的資料筆數
    );
?>
<script>
    window.wp['paginationSettings'] = <?php echo json_encode($paginationConfig) ?>;
    window.wp['pagination'] = <?php echo json_encode($paginationData) ?>;
</script>