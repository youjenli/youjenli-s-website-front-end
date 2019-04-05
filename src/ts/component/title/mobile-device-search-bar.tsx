import * as React from 'react';
import {isPlaceHolderOfInputSupported} from '../../service/featureDetection';

interface MobileDeviceSearchBarProps {
    searchBarWidth:number;
    searchBarHeight:number;
    fontSizeOfSearchHint:number;
    searchIconWidth:number;
    searchIconHeight:number;
    marginBottom:number;
}

interface MobileDeviceSearchBarState {
    placeHolderOfSearchField:string;
}

export default class MobileDeviceSearchBar extends React.Component<MobileDeviceSearchBarProps, MobileDeviceSearchBarState> {
    constructor(props){
        super(props);
        const input = document.createElement('input');
        if (!isPlaceHolderOfInputSupported()) {     
            this.removePlaceHolder = this.removePlaceHolder.bind(this);
            this.resetPlaceHolder = this.resetPlaceHolder.bind(this);
        }
        this.state = {
            placeHolderOfSearchField:'搜尋文章、分類、標籤...'
        }
    }
    searchField:HTMLInputElement
    removePlaceHolder() {
        /* 檢查欄位內容是否為預設填充物？ 是 => 移除，否 => 不處理 */
        // 要用 equals 比對內容時，tsc 總跟我說找不到這個方法，因此只好先用 ==
        if (this.searchField.value == this.state.placeHolderOfSearchField) {
            this.searchField.value = "";
            this.searchField.style.color = '#000000';
        }
    }
    resetPlaceHolder() {
        /* 檢查欄位內容是否已空白？ 是 => 加入填充物，否 => 不處理 */
        if (this.searchField.value == "") {
            this.searchField.value = this.state.placeHolderOfSearchField;
            this.searchField.style.color = '#BFBFBF';
        } else {
            if (this.searchField.style.color != '#000000') {
                this.searchField.style.color = '#000000';
            }         
        }
    }
    componentDidMount() {
        if (!isPlaceHolderOfInputSupported()) {
            this.searchField.style.color = '#BFBFBF';
        }
    }
    render() {
        const heightOfSearchField = this.props.searchBarHeight;
        const styleOfSearchBar = {
            height:`${this.props.searchBarHeight}px`,
            paddingLeft:`${(heightOfSearchField - this.props.searchIconHeight)/2}px`,
            marginBottom:`${this.props.marginBottom}px`
        };        
        
        const styleOfSearchField = {
            fontSize:`${this.props.fontSizeOfSearchHint}px`,
            height:`${heightOfSearchField}px`            
        }
        const styleOfSearchBtn = {
            width:`${heightOfSearchField}px`,
            height:`${heightOfSearchField}px`
        }
        
        const styleOfSearchIcon = {
            width:`${this.props.searchIconWidth}px`,
            height:`${this.props.searchIconHeight}px`
        }
        
        const searchFieldPlaceHolder = '搜尋文章、分類、標籤...';
        const titleOfSearchBtn = '查詢網站內容';
        const altOfSearchBtn = '點此處搜尋網站內容';

        return ( 
            <div className="search-bar" style={styleOfSearchBar} >
                { isPlaceHolderOfInputSupported ? 
                  <input type="text" style={styleOfSearchField}
                     placeholder={searchFieldPlaceHolder} /> :  
                  <input type="text" style={styleOfSearchField}
                      placeholder={searchFieldPlaceHolder} 
                      onFocus={() => {
                          this.removePlaceHolder();
                      }}
                      onBlur={() => {
                          this.resetPlaceHolder();
                      }}
                      defaultValue={searchFieldPlaceHolder} ref={ (ref) => {this.searchField = ref} }/>
                }
                <div className="search-btn mobile" title={titleOfSearchBtn} style={styleOfSearchBtn}>
                    <img  src="/img/search-btn-mobile.svg"
                        style={styleOfSearchIcon} alt={altOfSearchBtn}/>
                </div>                
            </div>
        );
    }
}