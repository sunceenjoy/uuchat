import React, { Component } from 'react';
import '../static/css/shortcut.css';

let shortCutLists = [];

class ShortList extends Component{
    selectClick = (e) => {
        e.stopPropagation();
        this.props.shortCutSelecterClick(document.querySelector('.s-'+this.props.num+' .key-value').innerHTML);
    }
    render(){
        let {num, name, value} = this.props;
        return (
            <li className={'s-'+num+' '+(num<=0 ? 'on' : '')} onClick={this.selectClick}>
                <span className="key-name">{';'+name}</span>
                <span className="key-value">{value.replace(/(^\s*)/g, '')}</span>
            </li>
        );
    }
}

class ShortEmpty extends Component{
    render(){
        return (
            <div className="short-empty">
                You have not setting Shortcuts, you can setting some on the settings tab.
            </div>
        );
    }
}

class ChatShortcut extends Component{

    constructor(){
        super();
        this.state = {
            fetchList: shortCutLists
        };
    }

    componentDidMount(){
        this.getShortCutsList();
    }

    getShortCutsList = () => {
        let _self = this;

        if(shortCutLists.length > 0){
            let newSC = localStorage.getItem("newShortcut");
            if(newSC){
                let newScObj = JSON.parse(newSC);
                shortCutLists.unshift(newScObj);
                localStorage.setItem('newShortcut', "");
            }
            localStorage.setItem("shortcutList", JSON.stringify(shortCutLists));
            this.setState({
                fetchList: shortCutLists
            });
            return;
        }
        fetch('/shortcuts/cs/'+this.props.csid+'/all')
            .then((d)=>d.json())
            .then((data)=>{
                if(data.code === 200){
                    shortCutLists = data.msg
                    localStorage.setItem("shortcutList", JSON.stringify(shortCutLists));
                    _self.setState({
                        fetchList: shortCutLists
                    });
                }
            })
            .catch((e)=>{});
    }

    render(){
        let {fetchList} = this.state,
            {matchText, shortCutSelecterClick} = this.props,
            shortListArr = [];

        for(let i = 0, l = fetchList.length; i < l; i++){
            let matchReg= new RegExp(matchText.slice(1), 'ig'),
                s = fetchList[i];

            if(matchReg.test(s.shortcut)){
                shortListArr.push(s);
            }
        }

        return (
            <div className="shortcut">
                <div className="short-head">
                    <span class="navigate-shortcuts">Navigate ↑ and ↓</span>
                    <span class="hotkey-shortcuts">
                        &nbsp; &nbsp;<strong>Enter</strong> or <strong>Tab</strong> to select
                    </span>
                </div>
                <div className="short-list">
                    <ul className="shortListUl">
                        {shortListArr.map((s, i)=>
                            <ShortList key={i} num={i} name={s.shortcut} value={s.msg} shortCutSelecterClick={shortCutSelecterClick} />
                        )}
                    </ul>
                </div>
                {(shortCutLists.length === 0) && <ShortEmpty />}
            </div>
        );

    }

}


export default ChatShortcut;