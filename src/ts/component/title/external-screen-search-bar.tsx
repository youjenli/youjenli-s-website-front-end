import * as React from 'react';

interface ExternalScreenSearchBarProps {
    width:number;
    height:number;
    top:number;
    right:number;
    fontSizeOfFeatureLink:number;
    toggleSearchBarState:() => void;
}

interface ExternalScreenSearchBarState {
    placeHolderOfSearchField:string;
}

export default class ExternalScreenSearchBar extends React.Component<ExternalScreenSearchBarProps, ExternalScreenSearchBarState> {
    constructor(props){
        super(props);
        const input = document.createElement('input');
        if (!input.placeholder) {
            this.shouldUsePlaceHolderAttr = true;            
            this.removePlaceHolder = this.removePlaceHolder.bind(this);
            this.resetPlaceHolder = this.resetPlaceHolder.bind(this);
        }
        this.state = {
            placeHolderOfSearchField:'搜尋文章、分類、標籤...'
        }  
    }
    shouldUsePlaceHolderAttr:boolean = false
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
            //todo 重設之後，若游標未離開，接下來編輯時應自動刪除，但這要怎麼做？
        } else {
            if (this.searchField.style.color != '#000000') {
                this.searchField.style.color = '#000000';
            }         
        }
    }
    componentDidMount() {
        if (!this.shouldUsePlaceHolderAttr) {
            this.searchField.style.color = '#9C9C9C';
        }
    }
    render() {
        const searchBarStyle = {
            top:this.props.top + "px",
            right:this.props.right + "px"
        }
        const searchFieldStyle = {
            width:this.props.width + "px",
            height:this.props.height + "px",
            /*
            註: sketch app 上面設計輸入欄位的圓弧度是 `7`，但是單位不明，
            而我猜測單位是 px ，因此在計算 弧度設定/欄位寬度 得到 0.0336 的比例之後，
            此處在得到欄位寬度後乘以 0.04 求弧度的 px 單位。
            */
            borderRadius:`${this.props.width * 0.04}px`,
            //搜尋欄位需要功能連結字體的大小來計算它和搜尋按鈕的間距大小。
            marginRight:`${this.props.fontSizeOfFeatureLink * 0.5}px`
        }
        const searchFieldPlaceHolder = '搜尋文章、分類、標籤...';
        const titleOfSearchBtn = '搜尋按鈕';  
        const searchBtnStyle = {
            width:this.props.height + "px",
            height:this.props.height + "px"
        }
        return (
            <div id="search-bar" style={searchBarStyle}>
                {this.props.children}
                { this.shouldUsePlaceHolderAttr ? 
                    <input id="search-field" style={searchFieldStyle}  type="text" 
                            onFocus={this.props.toggleSearchBarState}
                            onBlur={this.props.toggleSearchBarState} 
                            placeholder={searchFieldPlaceHolder} /> :
                    <input id="search-field" style={searchFieldStyle}  type="text" 
                        onFocus={() => {
                            this.props.toggleSearchBarState();
                            this.removePlaceHolder();
                        }}
                        onBlur={() => {
                            this.props.toggleSearchBarState();
                            this.resetPlaceHolder();
                        }}
                        defaultValue={searchFieldPlaceHolder} ref={ (ref) => {this.searchField = ref} } />
                }                
                <img id="search-btn" src="/img/search-btn.svg" style={searchBtnStyle} title={titleOfSearchBtn} 
                    alt="點此按鈕搜尋網站的內容"/>
            </div>
        );
    }    
}