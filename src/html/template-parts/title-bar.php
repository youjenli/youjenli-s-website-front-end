<?php 
    /*
        這個樣板是用來提供標題列上面的重要連結給各資源頁面。
        原本我打算整合 wordpress 自訂選單的功能以實現這種功能，而不自行實現一套自訂選單，但是後來發現以下幾個問題：

        1. 我希望游標移到選單列的連結上面時，畫面上會出現連結的說明資訊，但據目前所知除非手動加資料到資料庫，
         或是另外開發擴充套件，否則 wordpress 似乎沒有提供辦法讓我儲存選單項目資訊。
         這部分功能必須要等到更深入了解 wordpress 以及它取得系統額外資訊的方式之後才能規劃解決方案。

        2. wordpress 的選單項目可以定義階層，這部分還不清楚 wordpress 是在哪個資料表、以什麼方式定義選單項目之間的關係。
           另外我也還沒有想好要不要有階層選單，要的話又該怎麼設計，因此先作罷。        

        綜合以上原因，最後我決定暫時先在此處寫死要送給客戶端的文章連結，
        等到後續研究完 wordpress 機制並規劃好整合自訂選單的方式之後再來調整這裡的做法。
    */
?>
<script type="text/javascript">
    window.wp.titleBar = {
        menuItems:[
            {
                name:'自我介紹',
                url:'https://www.google.com.tw',
                hint:'公開的簡單自我介紹，說說自己的學經歷、情感、志向、嗜好與興趣。',
                id:'cv',
                pathOfIcon:'img/curriculum-vitae.svg'
            },{
                name:'關於這網站',
                url:'https://www.google.com.tw',
                hint:'說明用來開發這個網站的工具、網站架構與感謝名單。',
                id:'about',
                pathOfIcon:'img/programming-code.svg'
            }
        ],
        searchLink:<?php echo json_encode(get_search_link()); ?>
    }
</script>