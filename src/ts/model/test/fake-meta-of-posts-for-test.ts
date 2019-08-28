import {MetaDataOfPost} from '../posts';
import {Category, Tag} from '../terms';

export const fakeDate = new Date();
fakeDate.setFullYear(2019);
fakeDate.setMonth(4);
fakeDate.setDate(10);

export const fakeCategory1:Category = {
    id:1,
    name:'分類一',
    url:'https://www.google.com.tw',
    description:'分類一的說明'
};
export const fakeCategory2:Category = {
    id:2,
    name:'分類二',
    url:'https://www.google.com.tw',
    description:'分類二的說明'
};
export const fakeCategory3:Category = {
    id:3,
    name:'分類三',
    url:'https://www.google.com.tw',
    description:'分類三的說明'
};
export const aFewOfFakeCategories = [fakeCategory1,fakeCategory2,fakeCategory3];

export const plentyOfFakeCategories:Category[] = [];

for (let i = 0 ; i < 28 ; i ++) {
    plentyOfFakeCategories.push({
        id:i,
        name:`分類${i}`,
        url:'https://www.google.com.tw',
        description:`分類${i}的說明`
    });
}

export const fakeTag1:Tag = {
    id:-1,
    name:'標籤一',
    url:'https://www.google.com.tw',
    description:'標籤一的說明'
};
export const fakeTag2:Tag = {
    id:-2,
    name:'標籤二',
    url:'https://www.google.com.tw',
    description:'標籤二的說明'
}
export const fakeTag3:Tag = {
    id:-3,
    name:'標籤三',
    url:'https://www.google.com.tw',
    description:'標籤三的說明'
}
export const aFewOfFakeTags = [fakeTag1, fakeTag2, fakeTag3];

export const plentyOfFakeTags:Tag[] = [];

for (let i = 0 ; i < 28 ; i ++) {
    plentyOfFakeTags.push({
        id:i,
        name:`標籤${i}`,
        url:'https://www.google.com.tw',
        description:`標籤${i}的說明`
    });
}

export const listOfMetaDataOfFakePosts:MetaDataOfPost[] = [
    {
        id:1,
        title:'諸葛亮舌戰群儒，魯子敬力排眾議',
        url:'https://www.google.com.tw',
        slug:'fakePost1',
        date:fakeDate,
        modified:fakeDate,
        tags:[],
        categories:aFewOfFakeCategories,
        thumbnail:{
            url:'img/afternoon-tea-time.jpeg'
        }
    },
    {
        id:2,
        title:'諸葛亮舌戰群儒，魯子敬力排眾議',
        url:'https://www.google.com.tw',
        slug:'fakePost2',
        date:fakeDate,
        tags:[],
        categories:[],
        thumbnail:{
            url:'img/bookcase.jpeg'
        }
    },
    {
        id:3,
        title:'諸葛亮舌戰群儒，魯子敬力排眾議。',
        url:'https://www.google.com.tw',
        slug:'fakePost3',
        date:fakeDate,
        modified:fakeDate,
        categories:aFewOfFakeCategories,
        tags:aFewOfFakeTags,
        excerpt:'卻說魯肅、孔明辭了玄德、劉琦，登舟望柴桑郡來。二人在舟中共議，魯肅謂孔明曰：「先生見孫將軍，切不可實言曹操兵多將廣。」孔明曰：「不須子敬叮嚀，亮自有...卻說魯肅、孔明辭了玄德、劉琦，登舟望柴桑郡來。二人在舟中共議，魯肅謂孔明曰：「先生見孫將軍，切不可實言曹操兵多將廣。」孔明曰：「不須子敬叮嚀，亮自有。'
    },
    {
        id:4,
        title:'諸葛亮舌戰群儒，魯子敬力排眾議。',
        url:'https://www.google.com.tw',
        slug:'fakePost4',
        date:fakeDate,
        tags:aFewOfFakeTags.concat(aFewOfFakeTags).concat(aFewOfFakeTags)
        .concat(aFewOfFakeTags).concat(aFewOfFakeTags).concat(aFewOfFakeTags),
        categories:[],
        excerpt:'卻說魯肅、孔明辭了玄德、劉琦，登舟望柴桑郡來。二人在舟中共議，魯肅謂孔明曰：「先生見孫將軍，切不可實言曹操兵多將廣。」孔明曰：「不須子敬叮嚀，亮自有...'
    },
    {
        id:5,
        title:'諸葛亮舌戰群儒，魯子敬力排眾議',
        url:'https://www.google.com.tw',
        slug:'fakePost5',
        date:fakeDate,
        modified:fakeDate,
        categories:aFewOfFakeCategories.concat(aFewOfFakeCategories)
                    .concat(aFewOfFakeCategories).concat(aFewOfFakeCategories)
                    .concat(aFewOfFakeCategories).concat(aFewOfFakeCategories),
        tags:[],
        thumbnail:{
            url:'img/glimpse-of-code.png'
        }
    },{
        id:6,
        title:'諸葛亮舌戰群儒，魯子敬力排眾議。諸葛亮舌戰群儒，魯子敬力排眾議。',
        url:'https://www.google.com.tw',
        slug:'fakePOst6',
        date:fakeDate,
        categories:aFewOfFakeCategories,
        tags:[],
        thumbnail:{
            url:'img/bookcase.jpeg'
        }
    },
    {
        id:7,
        title:'諸葛亮舌戰群儒，魯子敬力排眾議',
        url:'https://www.google.com.tw',
        slug:'fakePost7',
        date:fakeDate,
        categories:aFewOfFakeCategories.concat(aFewOfFakeCategories)
                    .concat(aFewOfFakeCategories).concat(aFewOfFakeCategories)
                    .concat(aFewOfFakeCategories).concat(aFewOfFakeCategories),
        tags:[]
    }, {
        id:8,
        title:'諸葛亮舌戰群儒，魯子敬力排眾議。諸葛亮舌戰群儒，魯子敬力排眾議。諸葛亮舌戰群儒，魯子敬力排眾議。諸葛亮舌戰群儒，魯子敬力排眾議。諸葛亮舌戰群儒，魯子敬力排眾議。諸葛亮舌戰群儒，魯子敬力排眾議',
        url:'https://www.google.com.tw',
        slug:'fakePost8',
        date:fakeDate,
        categories:aFewOfFakeCategories,
        tags:[],
        excerpt:'卻說魯肅、孔明辭了玄德、劉琦，登舟望柴桑郡來。二人在舟中共議，魯肅謂孔明曰：「先生見孫將軍，切不可實言曹操兵多將廣。」孔明曰：「不須子敬叮嚀，亮自有'
    },
    {
        id:9,
        title:'諸葛亮舌戰群儒，魯子敬力排眾議',
        url:'https://www.google.com.tw',
        slug:'fakePost9',
        date:fakeDate,
        modified:fakeDate,
        categories:[],
        tags:[],
        thumbnail:{
            url:'img/afternoon-tea-time.jpeg'
        }
    }
];