import * as React from 'react';
import {isPlaceHolderOfInputSupported} from '../../service/featureDetection';
import * as terms from './terms';

interface ExternalScreenSearchBarProps {
    width:number;
    height:number;
    top:number;
    right:number;
    fontSizeOfFeatureLink:number;
    fontSizeOfSearchHint:number;
    borderRadius:number;
    toggleSearchBarState:() => void;
}

interface ExternalScreenSearchBarState {
    placeHolderOfSearchField:string;
}

export default class ExternalScreenSearchBar extends React.Component<ExternalScreenSearchBarProps, ExternalScreenSearchBarState> {
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
            this.searchField.style.color = '#9C9C9C';
        } else {
            if (this.searchField.style.color != '#000000') {
                this.searchField.style.color = '#000000';
            }         
        }
    }
    componentDidMount() {
        if (!isPlaceHolderOfInputSupported()) {
            this.searchField.style.color = '#9C9C9C';
        }
    }
    render() {
        const searchBarStyle = {
            top:this.props.top + "px",
            right:this.props.right + "px"
        }
        const borderRadius = this.props.borderRadius;
        const searchFieldStyle = {
            width:(this.props.width - borderRadius) + "px",
            height:this.props.height + "px",
            borderRadius:`${borderRadius}px`,
            paddingLeft:`${borderRadius}px`,
            marginRight:`${this.props.fontSizeOfFeatureLink * 0.5}px`,
            fontSize:`${this.props.fontSizeOfSearchHint}px`
        }
        
        const searchBtnStyle = {
            width:this.props.height + "px",
            height:this.props.height + "px"
        }
        return (
            <div className="search-bar" style={searchBarStyle}>
                {this.props.children}
                { isPlaceHolderOfInputSupported() ? 
                    <input style={searchFieldStyle}  type="text" 
                            onFocus={this.props.toggleSearchBarState}
                            onBlur={this.props.toggleSearchBarState} 
                            placeholder={terms.searchFieldPlaceHolder} /> :
                    <input style={searchFieldStyle}  type="text" 
                        onFocus={() => {
                            this.props.toggleSearchBarState();
                            this.removePlaceHolder();
                        }}
                        onBlur={() => {
                            this.props.toggleSearchBarState();
                            this.resetPlaceHolder();
                        }}
                        defaultValue={terms.searchFieldPlaceHolder} ref={ (ref) => {this.searchField = ref} } />
                }                
                <img className="search-btn" src="/img/search-btn.svg" style={searchBtnStyle} title={terms.titleOfSearchBtn} 
                    alt={terms.altOfSearchIcon}/>
            </div>
        );//註:不能為了刪減網頁大小而刪除 search-btn svg 圖示的 width, height 和 viewBox ，否則它可能會不受外框的拘束而卡掉更多的空間。
    }    
}