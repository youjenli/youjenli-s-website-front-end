import * as React from 'react';

export function titleOfPageOfCategory(query:string):string {
    return `歸類在「${query}」的文章...`;
}

export const categoryDoesNotHaveDescription = '此分類沒有相關說明。';

export class ParentCategory extends React.Component {
    render() {
        return (
            <React.Fragment>
                母分類是「{this.props.children}」。
            </React.Fragment>
        );
    }
}

export function learnMoreAboutThisCategoryAndRelatedPosts(nameOfCategory:string) {
    return `了解「${nameOfCategory}」分類以及底下的文章。`;
};

export function cannotFindAnyCategoryCorrespondingToGivenPath(path:string) {
    return `沒有對應路徑「${path}」的分類。`;
}

export function invalidPathForArchiveOfCategory(path:string) {
    return `您要連線的路徑「${path}」格式不正確，系統無法解析，因此重新導向至首頁。請調整後再重新發送。`;
}

export function didNotSuccessfullyGetTheCategoryCorrespondingToGivenPath(path:string) {
    return `未順利取得對應路徑「${path}」的分類資訊。`;
};

export const thereforeTheHomePageIsPresentedToYou = '因此呈現首頁內容給您參考。'

export const pleaseTryAgainToAccessThisCategoryLater = '請稍後再嘗試存取此分類。';

export const categoryDoesNotHaveParent = '此分類沒有母分類。';

export function countOfArticlesSubjectToCategory(count:number):string {
    if (count == 0) {
        return `此分類沒有文章`;
    } else {
        return `此分類共有 ${count} 篇文章。`;
    }
}

export let noPostUnderThisCategory = '目前沒有隸屬於此分類的文章。';