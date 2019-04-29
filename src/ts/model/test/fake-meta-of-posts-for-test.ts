import {MetaOfPost, CategoryOfPost, TagOfPost} from '../post';

export let fakeDate = new Date();
fakeDate.setFullYear(2019);
fakeDate.setMonth(4);
fakeDate.setDate(10);

const fakeCategory1:CategoryOfPost = {
    id:1,
    name:'分類一',
    url:'https://www.google.com.tw',
    description:'分類一的說明'
};
const fakeCategory2:CategoryOfPost = {
    id:2,
    name:'分類二',
    url:'https://www.google.com.tw',
    description:'分類二的說明'
};
const fakeCategory3:CategoryOfPost = {
    id:3,
    name:'分類三',
    url:'https://www.google.com.tw',
    description:'分類三的說明'
};
export const aFewOfFakeCategories = [fakeCategory1,fakeCategory2,fakeCategory3];

export const plentyOfFakeCategories:CategoryOfPost[] = [];

for (let i = 0 ; i < 28 ; i ++) {
    plentyOfFakeCategories.push({
        id:i,
        name:`分類${i}`,
        url:'https://www.google.com.tw',
        description:`分類${i}的說明`
    });
}

const fakeTag1:TagOfPost = {
    id:-1,
    name:'標籤一',
    url:'https://www.google.com.tw',
    description:'標籤一的說明'
};
const fakeTag2:TagOfPost = {
    id:-2,
    name:'標籤二',
    url:'https://www.google.com.tw',
    description:'標籤二的說明'
}
const fakeTag3:TagOfPost = {
    id:-3,
    name:'標籤三',
    url:'https://www.google.com.tw',
    description:'標籤三的說明'
}
export const aFewOfFakeTags = [fakeTag1, fakeTag2, fakeTag3];

export const plentyOfFakeTags:TagOfPost[] = [];

for (let i = 0 ; i < 28 ; i ++) {
    plentyOfFakeTags.push({
        id:i,
        name:`標籤${i}`,
        url:'https://www.google.com.tw',
        description:`標籤${i}的說明`
    });
}

export const listOfMetaDataOfFakePosts:MetaOfPost[] = [
    {
        id:1,
        urlOfPost:'https://www.google.com.tw',
        date:fakeDate,
        modified:fakeDate,
        categories:aFewOfFakeCategories,
        title:'諸葛亮舌戰群儒，魯子敬力排眾議',
        imageUrl:'/img/afternoon-tea-time.jpeg'
    },
    {
        id:2,
        urlOfPost:'https://www.google.com.tw',
        date:fakeDate,
        title:'諸葛亮舌戰群儒，魯子敬力排眾議',
        imageUrl:'/img/bookcase.jpeg'
    },
    {
        id:3,
        urlOfPost:'https://www.google.com.tw',
        date:fakeDate,
        modified:fakeDate,
        categories:aFewOfFakeCategories,
        tags:aFewOfFakeTags,
        title:'諸葛亮舌戰群儒，魯子敬力排眾議。',
        excerpt:'卻說魯肅、孔明辭了玄德、劉琦，登舟望柴桑郡來。二人在舟中共議，魯肅謂孔明曰：「先生見孫將軍，切不可實言曹操兵多將廣。」孔明曰：「不須子敬叮嚀，亮自有...卻說魯肅、孔明辭了玄德、劉琦，登舟望柴桑郡來。二人在舟中共議，魯肅謂孔明曰：「先生見孫將軍，切不可實言曹操兵多將廣。」孔明曰：「不須子敬叮嚀，亮自有。'
    },
    {
        id:4,
        urlOfPost:'https://www.google.com.tw',
        date:fakeDate,
        tags:aFewOfFakeTags.concat(aFewOfFakeTags).concat(aFewOfFakeTags)
        .concat(aFewOfFakeTags).concat(aFewOfFakeTags).concat(aFewOfFakeTags),
        title:'諸葛亮舌戰群儒，魯子敬力排眾議。',
        excerpt:'卻說魯肅、孔明辭了玄德、劉琦，登舟望柴桑郡來。二人在舟中共議，魯肅謂孔明曰：「先生見孫將軍，切不可實言曹操兵多將廣。」孔明曰：「不須子敬叮嚀，亮自有...'
    },
    {
        id:5,
        urlOfPost:'https://www.google.com.tw',
        date:fakeDate,
        modified:fakeDate,
        categories:aFewOfFakeCategories.concat(aFewOfFakeCategories)
                    .concat(aFewOfFakeCategories).concat(aFewOfFakeCategories)
                    .concat(aFewOfFakeCategories).concat(aFewOfFakeCategories),
        title:'諸葛亮舌戰群儒，魯子敬力排眾議',
        imageUrl:'/img/glimpse-of-code.png'
    },{
        id:6,
        urlOfPost:'https://www.google.com.tw',
        date:fakeDate,
        categories:aFewOfFakeCategories,
        title:'諸葛亮舌戰群儒，魯子敬力排眾議。諸葛亮舌戰群儒，魯子敬力排眾議。',
        imageUrl:'/img/bookcase.jpeg'
    },
    {
        id:7,
        urlOfPost:'https://www.google.com.tw',
        date:fakeDate,
        categories:aFewOfFakeCategories.concat(aFewOfFakeCategories)
                    .concat(aFewOfFakeCategories).concat(aFewOfFakeCategories)
                    .concat(aFewOfFakeCategories).concat(aFewOfFakeCategories),
        title:'諸葛亮舌戰群儒，魯子敬力排眾議'
    }, {
        id:8,
        urlOfPost:'https://www.google.com.tw',
        date:fakeDate,
        categories:aFewOfFakeCategories,
        tags:[],
        title:'諸葛亮舌戰群儒，魯子敬力排眾議。諸葛亮舌戰群儒，魯子敬力排眾議。諸葛亮舌戰群儒，魯子敬力排眾議。諸葛亮舌戰群儒，魯子敬力排眾議。諸葛亮舌戰群儒，魯子敬力排眾議。諸葛亮舌戰群儒，魯子敬力排眾議',
        excerpt:'卻說魯肅、孔明辭了玄德、劉琦，登舟望柴桑郡來。二人在舟中共議，魯肅謂孔明曰：「先生見孫將軍，切不可實言曹操兵多將廣。」孔明曰：「不須子敬叮嚀，亮自有'
    },
    {
        id:9,
        urlOfPost:'https://www.google.com.tw',
        date:fakeDate,
        modified:fakeDate,
        title:'諸葛亮舌戰群儒，魯子敬力排眾議',
        imageUrl:'/img/afternoon-tea-time.jpeg'
    }
];