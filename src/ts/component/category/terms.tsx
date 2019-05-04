export function titleOfPageOfCategory(query:string):string {
    return `歸類在「${query}」的文章...`;
}

export function descriptionOfCategory(name:string, desc:string):string {
    return `${name}：${desc}`;
}

export function categoryDoesNotHaveDescription() {
    return '此分類沒有相關說明。';
}

export function parentOfCategoryOrTag(parentName:string):string {
    return `母分類是「${parentName}」。`;
}

export function categoryDoesNotHaveParent() {
    return '此分類沒有母分類。';
}

export function countOfArticlesSubjectToCategoryOrTag(categoryName:string, count:number):string {
    return `共有 ${count} 篇分類到「${categoryName}」的文章。`;
}

export let noPostUnderThisCategory = '目前沒有隸屬於此分類的文章。';