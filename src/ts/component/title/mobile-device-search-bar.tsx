/// <reference path="../../model/global-vars.d.ts"/>
import * as React from 'react';
import {isPlaceHolderOfInputSupported} from '../../service/featureDetection';
import * as terms from './terms';
import { performSearch } from '../../index';

interface MobileDeviceSearchBarProps {
    width:number;
    height:number;
    fontSizeOfSearchHint:number;
    searchIconWidth:number;
    searchIconHeight:number;
}

interface MobileDeviceSearchBarState {
    placeHolderOfSearchField:string;
}

export default class MobileDeviceSearchBar extends React.Component<MobileDeviceSearchBarProps, MobileDeviceSearchBarState> {
    constructor(props){
        super(props);
        if (!isPlaceHolderOfInputSupported()) {     
            this.removePlaceHolder = this.removePlaceHolder.bind(this);
            this.resetPlaceHolder = this.resetPlaceHolder.bind(this);
        }
        this.state = {
            placeHolderOfSearchField:'搜尋文章、分類、標籤...'
        }
        this.onSearchButtonClicked = this.onSearchButtonClicked.bind(this);
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
    onSearchButtonClicked() {
        performSearch(this.searchField.value, null);
    }
    render() {
        const heightOfSearchField = this.props.height;
        const styleOfSearchBar = {
            height:`${this.props.height}px`,
            paddingLeft:`${(heightOfSearchField - this.props.searchIconHeight)/2}px`
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
        
        return ( 
            <div className="search-bar" style={styleOfSearchBar} >
                { isPlaceHolderOfInputSupported ? 
                  <input type="text" style={styleOfSearchField} placeholder={terms.searchFieldPlaceHolder} 
                      ref={ ref => this.searchField = ref } /> : 
                  <input type="text" style={styleOfSearchField}
                      placeholder={terms.searchFieldPlaceHolder} 
                      onFocus={() => {
                          this.removePlaceHolder();
                      }}
                      onBlur={() => {
                          this.resetPlaceHolder();
                      }}
                      defaultValue={terms.searchFieldPlaceHolder} ref={ ref => this.searchField = ref }/>
                }
                <div className="search-btn" title={terms.titleOfSearchBtn} style={styleOfSearchBtn}>
                    <img  src={window.wp.themeUrl + "img/search-btn-mobile.svg"}
                        style={styleOfSearchIcon} alt={terms.altOfSearchIcon}/>
                </div>                
            </div>
        );
    }
}