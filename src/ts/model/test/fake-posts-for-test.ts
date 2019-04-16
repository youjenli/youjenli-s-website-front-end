import {Post} from '../post';
import { lastModified } from '../../component/home/recentPosts/terms';

const fakeDate = new Date();
fakeDate.setFullYear(2019);
fakeDate.setMonth(4);
fakeDate.setDate(10);

const fakeCategory1 = {
    id:1,
    name:'分類一',
    url:'https://www.google.com.tw'
};
const fakeCategory2 = {
    id:2,
    name:'分類二',
    url:'https://www.google.com.tw'
};
const fakeCategory3 = {
    id:3,
    name:'分類三',
    url:'https://www.google.com.tw'
};
const fakeCategories = [fakeCategory1,fakeCategory2,fakeCategory3];

const fakeTag1 = {
    id:-1,
    name:'標籤一',
    url:'https://www.google.com.tw'
};
const fakeTag2 = {
    id:-2,
    name:'標籤二',
    url:'https://www.google.com.tw'
}
const fakeTag3 = {
    id:-3,
    name:'標籤三',
    url:'https://www.google.com.tw'
}
const fakeTags = [fakeTag1, fakeTag2, fakeTag3];

export const posts:Post[] = [
    {
        id:1,
        urlOfPost:'https://www.google.com.tw',
        date:fakeDate,
        modified:fakeDate,
        categories:fakeCategories,
        title:'諸葛亮舌戰群儒，魯子敬力排眾議',
        imageUrl:'/img/afternoon-tea-time.jpeg'
    },
    {
        id:2,
        urlOfPost:'https://www.google.com.tw',
        date:fakeDate,
        modified:fakeDate,
        categories:fakeCategories,
        title:'諸葛亮舌戰群儒，魯子敬力排眾議',
        imageUrl:'/img/bookcase.jpeg'
    },
    {
        id:3,
        urlOfPost:'https://www.google.com.tw',
        date:fakeDate,
        modified:fakeDate,
        categories:fakeCategories,
        tags:fakeTags,
        title:'諸葛亮舌戰群儒，魯子敬力排眾議。',
        excerpt:'卻說魯肅、孔明辭了玄德、劉琦，登舟望柴桑郡來。二人在舟中共議，魯肅謂孔明曰：「先生見孫將軍，切不可實言曹操兵多將廣。」孔明曰：「不須子敬叮嚀，亮自有...卻說魯肅、孔明辭了玄德、劉琦，登舟望柴桑郡來。二人在舟中共議，魯肅謂孔明曰：「先生見孫將軍，切不可實言曹操兵多將廣。」孔明曰：「不須子敬叮嚀，亮自有。'
    },
    {
        id:4,
        urlOfPost:'https://www.google.com.tw',
        date:fakeDate,
        categories:[],
        tags:fakeCategories,
        title:'諸葛亮舌戰群儒，魯子敬力排眾議。',
        excerpt:'卻說魯肅、孔明辭了玄德、劉琦，登舟望柴桑郡來。二人在舟中共議，魯肅謂孔明曰：「先生見孫將軍，切不可實言曹操兵多將廣。」孔明曰：「不須子敬叮嚀，亮自有...'
    },
    {
        id:5,
        urlOfPost:'https://www.google.com.tw',
        date:fakeDate,
        modified:fakeDate,
        categories:fakeCategories.concat(fakeCategories)
                    .concat(fakeCategories).concat(fakeCategories)
                    .concat(fakeCategories).concat(fakeCategories),
        title:'諸葛亮舌戰群儒，魯子敬力排眾議',
        imageUrl:'/img/glimpse-of-code.png'
    },{
        id:6,
        urlOfPost:'https://www.google.com.tw',
        date:fakeDate,
        categories:fakeCategories,
        title:'諸葛亮舌戰群儒，魯子敬力排眾議。諸葛亮舌戰群儒，魯子敬力排眾議。',
        imageUrl:'/img/bookcase.jpeg'
    },
    {
        id:7,
        urlOfPost:'https://www.google.com.tw',
        date:fakeDate,
        categories:fakeCategories.concat(fakeCategories)
                    .concat(fakeCategories).concat(fakeCategories)
                    .concat(fakeCategories).concat(fakeCategories),
        tags:[],
        title:'諸葛亮舌戰群儒，魯子敬力排眾議',
        excerpt:'卻說魯肅、孔明辭了玄德、劉琦，登舟望柴桑郡來。二人在舟中共議，魯肅謂孔明曰：「先生見孫將軍，切不可實言曹操兵多將廣。」孔明曰：「不須子敬叮嚀，亮自有'
    }, {
        id:8,
        urlOfPost:'https://www.google.com.tw',
        date:fakeDate,
        categories:fakeCategories,
        tags:fakeTags.concat(fakeTags).concat(fakeTags)
                    .concat(fakeTags).concat(fakeTags).concat(fakeTags),
        title:'諸葛亮舌戰群儒，魯子敬力排眾議。諸葛亮舌戰群儒，魯子敬力排眾議。諸葛亮舌戰群儒，魯子敬力排眾議。諸葛亮舌戰群儒，魯子敬力排眾議。諸葛亮舌戰群儒，魯子敬力排眾議。諸葛亮舌戰群儒，魯子敬力排眾議',
        excerpt:'卻說魯肅、孔明辭了玄德、劉琦，登舟望柴桑郡來。二人在舟中共議，魯肅謂孔明曰：「先生見孫將軍，切不可實言曹操兵多將廣。」孔明曰：「不須子敬叮嚀，亮自有'
    },
    {
        id:9,
        urlOfPost:'https://www.google.com.tw',
        date:fakeDate,
        modified:fakeDate,
        categories:fakeCategories,
        title:'諸葛亮舌戰群儒，魯子敬力排眾議',
        imageUrl:'/img/afternoon-tea-time.jpeg'
    }
];