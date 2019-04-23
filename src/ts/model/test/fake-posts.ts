import {Post} from '../post';
import {fakeDate, fakeCategories, fakeTags} from './fake-meta-of-posts-for-test';

const defaultToc = 
`<ol id="toc">
<li><a href="#p2">聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a>
    <ol>
        <li><a href="#p2">聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a>
            <ol>
                <li><a>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a>
                    <ol>
                        <li><a>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a>
                            <ol>
                                <li>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</li>
                                <li><a>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
                                <li><a>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
                                <li><a>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
                                <li><a>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
                                <li><a>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
                                <li><a>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
                                <li><a>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
                                <li><a>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
                                <li><a>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
                                <li><a>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
                            </ol>
                        </li>
                        <li><a>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
                        <li><a>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
                        <li><a>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
                        <li><a>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
                        <li><a>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
                        <li><a>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
                        <li><a>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
                        <li><a>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
                        <li><a>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
                        <li><a>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
                    </ol>
                </li>
                <li><a>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
                <li><a>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
                <li><a>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
                <li><a>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
                <li><a>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
                <li><a>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
                <li><a>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
                <li><a>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
                <li><a>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
                <li><a>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
            </ol>
        </li>
        <li><a href="#p2">聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
        <li><a href="#p2">聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
        <li><a href="#p2">聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
        <li><a href="#p2">聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
        <li><a href="#p2">聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
        <li><a href="#p2">聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
        <li><a href="#p2">聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
        <li><a href="#p2">聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
        <li><a href="#p2">聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li>
        <li><a href="#p2">聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。</a></li> 
    </ol>    
</li>
<li><a href="#p2">卻說魯肅、孔明辭了玄德、劉琦，玄</a></li>
<li><a href="#p3">卻說魯肅、孔明辭了玄德、劉琦，玄</a></li>
<li><a href="#p4">卻說魯肅、孔明辭了玄德、劉琦，玄</a></li>
<li><a href="#p5">卻說魯肅、孔明辭了玄德、劉琦，玄</a></li>
<li><a>卻說魯肅、孔明辭了玄德、劉琦，玄</a></li>
<li><a>卻說魯肅、孔明辭了玄德、劉琦，玄</a></li>
<li><a>卻說魯肅、孔明辭了玄德、劉琦，玄</a></li>
<li><a>卻說魯肅、孔明辭了玄德、劉琦，玄</a></li>
<li><a>卻說魯肅、孔明辭了玄德、劉琦，玄</a></li>
<li><a>卻說魯肅、孔明辭了玄德、劉琦，玄</a></li>
<li><a>卻說魯肅、孔明辭了玄德、劉琦，玄</a></li>
</ol>`;

export const fakePostWithSubjectAndImg:Post = {
    id:9,
    urlOfPost:'https://www.google.com.tw',
    categories:fakeCategories,
    tags:fakeTags,
    date:fakeDate,
    modified:fakeDate,
    title:'有主旨且有圖片',
    imageUrl:'/img/afternoon-tea-time.jpeg',
    content:`
    <div class="subject">
    弟子不必不如師，師不必賢於弟子。聞道有先後，術業有專攻，如是而已。
    </div>
    ${defaultToc}
    <h1 name="p1">師說</h1>
    <p>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。孔子曰：“三人行，則必有我師”。
    是故弟子不必不如師，師不必賢於弟子。聞道有先後，術業有專攻，如是而已。
    李氏子蟠，年十七，好古文，六藝經傳皆通習之，不拘於時，學於余。余嘉其能行古道，作《師說》以貽之。</p>
    
    <h2 name="p2">師說</h2>
    <p>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。孔子曰：“三人行，則必有我師”。
    是故弟子不必不如師，師不必賢於弟子。聞道有先後，術業有專攻，如是而已。
    李氏子蟠，年十七，好古文，六藝經傳皆通習之，不拘於時，學於余。余嘉其能行古道，作《師說》以貽之。</p>
    
    <h3 name="p3">師說</h3>
    <p>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。孔子曰：“三人行，則必有我師”。
    是故弟子不必不如師，師不必賢於弟子。聞道有先後，術業有專攻，如是而已。
    李氏子蟠，年十七，好古文，六藝經傳皆通習之，不拘於時，學於余。余嘉其能行古道，作《師說》以貽之。</p>
    
    <h4 name="p4">師說</h4>
    <p>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。孔子曰：“三人行，則必有我師”。
    是故弟子不必不如師，師不必賢於弟子。聞道有先後，術業有專攻，如是而已。
    李氏子蟠，年十七，好古文，六藝經傳皆通習之，不拘於時，學於余。余嘉其能行古道，作《師說》以貽之。</p>
    
    <h5 name="p5">師說</h5>
    <p>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。孔子曰：“三人行，則必有我師”。
    是故弟子不必不如師，師不必賢於弟子。聞道有先後，術業有專攻，如是而已。
    李氏子蟠，年十七，好古文，六藝經傳皆通習之，不拘於時，學於余。余嘉其能行古道，作《師說》以貽之。</p>`
}

export const fakePostWithSubjectButWithoutImg:Post = {
    id:9,
    urlOfPost:'https://www.google.com.tw',
    categories:fakeCategories,
    tags:fakeTags,
    date:fakeDate,
    modified:fakeDate,
    title:'有主旨但無圖片',
    content:`
    <div class="subject">
    弟子不必不如師，師不必賢於弟子。聞道有先後，術業有專攻，如是而已。
    </div>
    ${defaultToc}
    <h1 name="p1">師說</h1>
    <p>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。孔子曰：“三人行，則必有我師”。
    是故弟子不必不如師，師不必賢於弟子。聞道有先後，術業有專攻，如是而已。
    李氏子蟠，年十七，好古文，六藝經傳皆通習之，不拘於時，學於余。余嘉其能行古道，作《師說》以貽之。</p>
    
    <h2 name="p2">師說</h2>
    <p>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。孔子曰：“三人行，則必有我師”。
    是故弟子不必不如師，師不必賢於弟子。聞道有先後，術業有專攻，如是而已。
    李氏子蟠，年十七，好古文，六藝經傳皆通習之，不拘於時，學於余。余嘉其能行古道，作《師說》以貽之。</p>
    
    <h3 name="p3">師說</h3>
    <p>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。孔子曰：“三人行，則必有我師”。
    是故弟子不必不如師，師不必賢於弟子。聞道有先後，術業有專攻，如是而已。
    李氏子蟠，年十七，好古文，六藝經傳皆通習之，不拘於時，學於余。余嘉其能行古道，作《師說》以貽之。</p>
    
    <h4 name="p4">師說</h4>
    <p>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。孔子曰：“三人行，則必有我師”。
    是故弟子不必不如師，師不必賢於弟子。聞道有先後，術業有專攻，如是而已。
    李氏子蟠，年十七，好古文，六藝經傳皆通習之，不拘於時，學於余。余嘉其能行古道，作《師說》以貽之。</p>
    
    <h5 name="p5">師說</h5>
    <p>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。孔子曰：“三人行，則必有我師”。
    是故弟子不必不如師，師不必賢於弟子。聞道有先後，術業有專攻，如是而已。
    李氏子蟠，年十七，好古文，六藝經傳皆通習之，不拘於時，學於余。余嘉其能行古道，作《師說》以貽之。</p>`
}

export const fakePostWithoutSubjectButWithImg:Post = {
    id:9,
    urlOfPost:'https://www.google.com.tw',
    categories:fakeCategories,
    tags:fakeTags,
    date:fakeDate,
    modified:fakeDate,
    title:'無主旨但有圖片',
    imageUrl:'/img/afternoon-tea-time.jpeg',
    content:`
    ${defaultToc}
    <h1 name="p1">師說</h1>
    <p>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。孔子曰：“三人行，則必有我師”。
    是故弟子不必不如師，師不必賢於弟子。聞道有先後，術業有專攻，如是而已。
    李氏子蟠，年十七，好古文，六藝經傳皆通習之，不拘於時，學於余。余嘉其能行古道，作《師說》以貽之。</p>
    
    <h2 name="p2">師說</h2>
    <p>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。孔子曰：“三人行，則必有我師”。
    是故弟子不必不如師，師不必賢於弟子。聞道有先後，術業有專攻，如是而已。
    李氏子蟠，年十七，好古文，六藝經傳皆通習之，不拘於時，學於余。余嘉其能行古道，作《師說》以貽之。</p>
    
    <h3 name="p3">師說</h3>
    <p>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。孔子曰：“三人行，則必有我師”。
    是故弟子不必不如師，師不必賢於弟子。聞道有先後，術業有專攻，如是而已。
    李氏子蟠，年十七，好古文，六藝經傳皆通習之，不拘於時，學於余。余嘉其能行古道，作《師說》以貽之。</p>
    
    <h4 name="p4">師說</h4>
    <p>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。孔子曰：“三人行，則必有我師”。
    是故弟子不必不如師，師不必賢於弟子。聞道有先後，術業有專攻，如是而已。
    李氏子蟠，年十七，好古文，六藝經傳皆通習之，不拘於時，學於余。余嘉其能行古道，作《師說》以貽之。</p>
    
    <h5 name="p5">師說</h5>
    <p>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。孔子曰：“三人行，則必有我師”。
    是故弟子不必不如師，師不必賢於弟子。聞道有先後，術業有專攻，如是而已。
    李氏子蟠，年十七，好古文，六藝經傳皆通習之，不拘於時，學於余。余嘉其能行古道，作《師說》以貽之。</p>`
}

export const fakePostWithoutSubjectAndImg:Post = {
    id:9,
    urlOfPost:'https://www.google.com.tw',
    categories:fakeCategories,
    tags:fakeTags,
    date:fakeDate,
    modified:fakeDate,
    title:'無主旨且無圖片',
    content:`
    ${defaultToc}
    <h1 name="p1">師說</h1>
    <p>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。孔子曰：“三人行，則必有我師”。
    是故弟子不必不如師，師不必賢於弟子。聞道有先後，術業有專攻，如是而已。
    李氏子蟠，年十七，好古文，六藝經傳皆通習之，不拘於時，學於余。余嘉其能行古道，作《師說》以貽之。</p>
    
    <h2 name="p2">師說</h2>
    <p>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。孔子曰：“三人行，則必有我師”。
    是故弟子不必不如師，師不必賢於弟子。聞道有先後，術業有專攻，如是而已。
    李氏子蟠，年十七，好古文，六藝經傳皆通習之，不拘於時，學於余。余嘉其能行古道，作《師說》以貽之。</p>
    
    <h3 name="p3">師說</h3>
    <p>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。孔子曰：“三人行，則必有我師”。
    是故弟子不必不如師，師不必賢於弟子。聞道有先後，術業有專攻，如是而已。
    李氏子蟠，年十七，好古文，六藝經傳皆通習之，不拘於時，學於余。余嘉其能行古道，作《師說》以貽之。</p>
    
    <h4 name="p4">師說</h4>
    <p>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。孔子曰：“三人行，則必有我師”。
    是故弟子不必不如師，師不必賢於弟子。聞道有先後，術業有專攻，如是而已。
    李氏子蟠，年十七，好古文，六藝經傳皆通習之，不拘於時，學於余。余嘉其能行古道，作《師說》以貽之。</p>
    
    <h5 name="p5">師說</h5>
    <p>聖人無常師。孔子師郯子、萇弘、師襄、老聃。郯子之徒，其賢不及孔子。孔子曰：“三人行，則必有我師”。
    是故弟子不必不如師，師不必賢於弟子。聞道有先後，術業有專攻，如是而已。
    李氏子蟠，年十七，好古文，六藝經傳皆通習之，不拘於時，學於余。余嘉其能行古道，作《師說》以貽之。</p>`
}

export const listOfFakePosts:Post[] = [fakePostWithSubjectAndImg, fakePostWithSubjectButWithoutImg, 
                                        fakePostWithoutSubjectButWithImg, fakePostWithoutSubjectAndImg];