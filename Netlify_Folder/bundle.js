(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function contentProvider(){
    this.topStoriesArr = []
    this.pageCount = 0
    
    this.loadTopStories = async () => {
        let resp = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
        this.topStoriesArr = await resp.json()
        this.pageCount = Math.floor(this.topStoriesArr.length / 30)
    }
    this.getTopStories = async (page = 0) => {
        if(page <= this.pageCount){
            let startIndex = page*30
            let contentToRetrieve = this.topStoriesArr.slice(startIndex, startIndex+30)
            let contentArr = await Promise.all(contentToRetrieve.map(async (itemid) => {
                let details = await fetch(`https://hacker-news.firebaseio.com/v0/item/${itemid}.json`)
                return details.json()
            }))
            return contentArr
        }
    }
}

module.exports = {
    contentProvider
}
},{}],2:[function(require,module,exports){
const HTMLUtils = require('../Utils/htmlUtils')
const Content = require('./content')

const body = document.body
const loadSpinner = '<div class="loadingSpinner"></div>'
let currentPage = 0
let contentProvider

const pageSkeleton = `
<div id="mainCenteredPanel">
    <!--HEADER-->
    <header class="headerBar">
        <span class="leftContent">
            <svg width="22" height="23">
                <rect width="21" height="22" style="fill:rgb(255, 102, 0);stroke-width:2;stroke:rgb(255,255,255)" />
                <text x="4" y="17" fill="white">Y</text>
            </svg>
            <span class="maintitle">Hacker News</span>  
            <span>new</span> | <span>threads</span> | <span>past</span> | <span>comments</span> | <span>ask</span> | 
            <span>show</span> | <span>jobs</span> | <span>submit</span> 
        </span>
        <span class="rightContent">
            <span>Logged User</span> | logout
        </span>
    </header>

    <!--MAIN CONTENT-->
    <section class="contentSection">
        ${loadSpinner}
    </section>

    <div><button class="moreBtn">More</button></div>

    <!--FOOTER-->
    <footer class="footerBar">
        <span class="topContent">
            <span>Guidelines</span> | <span>FAQ</span> | <span>Lists</span> | <span>API</span> | <span>Security</span> | <span>Legal</span> | 
            <span>Apply to YC</span> | <span>Contact</span>
        </span>
        <span class="bottomContent">
            <label for="searchbox">Search</label>
            <input id="searchbox"></input>
        </span>
    </footer>
</div>
`


document.body.onload = async () => {
    body.innerHTML = pageSkeleton
    initializeEventHandlers()
    contentProvider = new Content.contentProvider()

    await contentProvider.loadTopStories()
    populateContentSection(HTMLUtils.createBasicContent(await contentProvider.getTopStories(), currentPage))
}

function populateContentSection(contentHTML) {
    document.querySelector('.contentSection').innerHTML = contentHTML
}
function resetContentSection() {
    document.querySelector('.contentSection').innerHTML = loadSpinner
}
function initializeEventHandlers() {
    document.querySelector('.moreBtn').onclick = async () => {
        currentPage += 1
        resetContentSection()
        populateContentSection(HTMLUtils.createBasicContent(await contentProvider.getTopStories(currentPage), currentPage))
    }
    document.querySelector('.maintitle').onclick = async () => {
        currentPage = 0
        resetContentSection()
        populateContentSection(HTMLUtils.createBasicContent(await contentProvider.getTopStories(currentPage), currentPage))
    }
}
},{"../Utils/htmlUtils":4,"./content":1}],3:[function(require,module,exports){
module.exports = require('sassify')('.headerBar {   background-color: #ff6600;   display: flex;   justify-content: space-between; }   .headerBar .maintitle {     font-weight: bold;     margin: 0 5px;     cursor: pointer; }   .headerBar img {     border: solid 1px white;     margin: 2px; }   .headerBar .leftContent {     display: flex; }   .headerBar .rightContent {     display: flex; }  .footerBar {   border-top: solid 1px #ff6600;   display: flex;   flex-direction: column;   align-items: center; }   .footerBar .topContent {     display: flex; }   .footerBar .bottomContent {     display: flex; }  .contentList {   padding: 5px; }   .contentList .listItem {     margin: 5px;     display: flex; }     .contentList .listItem .listNumber {       width: 1.7em; }     .contentList .listItem .listContent {       display: flex;       flex-direction: column; }       .contentList .listItem .listContent .listTitle {         font-size: 1em; }       .contentList .listItem .listContent .listFooter {         font-size: 0.8em;         color: #847878; }  body {   font-family: \'Times New Roman\', Times, serif; }  a {   text-decoration: none;   color: black; }   a:visited {     color: #847878; }  #mainCenteredPanel {   min-width: 796px;   width: 100%;   height: 100%; }   #mainCenteredPanel footer,   #mainCenteredPanel > section,   #mainCenteredPanel > div,   #mainCenteredPanel header {     width: 85%;     padding: 2px;     margin-left: auto;     margin-right: auto; }   #mainCenteredPanel footer,   #mainCenteredPanel > div,   #mainCenteredPanel > section {     background-color: #f6f6ef; }   #mainCenteredPanel > div button {     border: none;     background-color: inherit;     color: blue;     cursor: pointer; }   #mainCenteredPanel > div button:active,   #mainCenteredPanel > div button:focus,   #mainCenteredPanel > div button:focus:active {     background-image: none;     outline: 0;     box-shadow: none; }   #mainCenteredPanel .loadingSpinner {     border: 5px solid #f3f3f3;     border-top: 5px solid #ff6600;     border-bottom: 5px solid #ff6600;     border-radius: 50%;     width: 50px;     height: 50px;     margin-right: auto;     margin-left: auto;     animation: spin 2s linear infinite; }  @keyframes spin {   0% {     transform: rotate(0deg); }   100% {     transform: rotate(360deg); } } ');;
},{"sassify":7}],4:[function(require,module,exports){
const createBasicContent = (contentArr, currentPage) => {
    let contentHTML = `<section class="contentList">`
    contentArr.forEach((post, idx) => {
        contentHTML += (
            `<article class="listItem"> 
                <div class="listNumber">${(idx + 1) + (currentPage * 30)}. </div>
                <div class="listContent">
                    <div class="listTitle"><a target="_blank" href=${post.url}> ${post.title}</a> </div>
                    <div class="listFooter"> ${post.score} points by ${post.by} | ${post.descendants} comments</div>
                </div>
            </article>`
        )
    })
    return contentHTML + '</section>'
}

module.exports = {
    createBasicContent
}
},{}],5:[function(require,module,exports){
require('./SASS/main.scss')
require('./Components/layout')
},{"./Components/layout":2,"./SASS/main.scss":3}],6:[function(require,module,exports){
module.exports = function (css, customDocument) {
  var doc = customDocument || document;
  if (doc.createStyleSheet) {
    var sheet = doc.createStyleSheet()
    sheet.cssText = css;
    return sheet.ownerNode;
  } else {
    var head = doc.getElementsByTagName('head')[0],
        style = doc.createElement('style');

    style.type = 'text/css';

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(doc.createTextNode(css));
    }

    head.appendChild(style);
    return style;
  }
};

module.exports.byUrl = function(url) {
  if (document.createStyleSheet) {
    return document.createStyleSheet(url).ownerNode;
  } else {
    var head = document.getElementsByTagName('head')[0],
        link = document.createElement('link');

    link.rel = 'stylesheet';
    link.href = url;

    head.appendChild(link);
    return link;
  }
};

},{}],7:[function(require,module,exports){
module.exports = require('cssify');
},{"cssify":6}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6L1VzZXJzL2RpcGFuL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDb21wb25lbnRzL2NvbnRlbnQuanMiLCJDb21wb25lbnRzL2xheW91dC5qcyIsIlNBU1MvbWFpbi5zY3NzIiwiVXRpbHMvaHRtbFV0aWxzLmpzIiwibWFpbi5qcyIsIm5vZGVfbW9kdWxlcy9jc3NpZnkvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9zYXNzaWZ5L2xpYi9zYXNzaWZ5LWJyb3dzZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImZ1bmN0aW9uIGNvbnRlbnRQcm92aWRlcigpe1xyXG4gICAgdGhpcy50b3BTdG9yaWVzQXJyID0gW11cclxuICAgIHRoaXMucGFnZUNvdW50ID0gMFxyXG4gICAgXHJcbiAgICB0aGlzLmxvYWRUb3BTdG9yaWVzID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIGxldCByZXNwID0gYXdhaXQgZmV0Y2goJ2h0dHBzOi8vaGFja2VyLW5ld3MuZmlyZWJhc2Vpby5jb20vdjAvdG9wc3Rvcmllcy5qc29uJylcclxuICAgICAgICB0aGlzLnRvcFN0b3JpZXNBcnIgPSBhd2FpdCByZXNwLmpzb24oKVxyXG4gICAgICAgIHRoaXMucGFnZUNvdW50ID0gTWF0aC5mbG9vcih0aGlzLnRvcFN0b3JpZXNBcnIubGVuZ3RoIC8gMzApXHJcbiAgICB9XHJcbiAgICB0aGlzLmdldFRvcFN0b3JpZXMgPSBhc3luYyAocGFnZSA9IDApID0+IHtcclxuICAgICAgICBpZihwYWdlIDw9IHRoaXMucGFnZUNvdW50KXtcclxuICAgICAgICAgICAgbGV0IHN0YXJ0SW5kZXggPSBwYWdlKjMwXHJcbiAgICAgICAgICAgIGxldCBjb250ZW50VG9SZXRyaWV2ZSA9IHRoaXMudG9wU3Rvcmllc0Fyci5zbGljZShzdGFydEluZGV4LCBzdGFydEluZGV4KzMwKVxyXG4gICAgICAgICAgICBsZXQgY29udGVudEFyciA9IGF3YWl0IFByb21pc2UuYWxsKGNvbnRlbnRUb1JldHJpZXZlLm1hcChhc3luYyAoaXRlbWlkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGV0YWlscyA9IGF3YWl0IGZldGNoKGBodHRwczovL2hhY2tlci1uZXdzLmZpcmViYXNlaW8uY29tL3YwL2l0ZW0vJHtpdGVtaWR9Lmpzb25gKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRldGFpbHMuanNvbigpXHJcbiAgICAgICAgICAgIH0pKVxyXG4gICAgICAgICAgICByZXR1cm4gY29udGVudEFyclxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBjb250ZW50UHJvdmlkZXJcclxufSIsImNvbnN0IEhUTUxVdGlscyA9IHJlcXVpcmUoJy4uL1V0aWxzL2h0bWxVdGlscycpXHJcbmNvbnN0IENvbnRlbnQgPSByZXF1aXJlKCcuL2NvbnRlbnQnKVxyXG5cclxuY29uc3QgYm9keSA9IGRvY3VtZW50LmJvZHlcclxuY29uc3QgbG9hZFNwaW5uZXIgPSAnPGRpdiBjbGFzcz1cImxvYWRpbmdTcGlubmVyXCI+PC9kaXY+J1xyXG5sZXQgY3VycmVudFBhZ2UgPSAwXHJcbmxldCBjb250ZW50UHJvdmlkZXJcclxuXHJcbmNvbnN0IHBhZ2VTa2VsZXRvbiA9IGBcclxuPGRpdiBpZD1cIm1haW5DZW50ZXJlZFBhbmVsXCI+XHJcbiAgICA8IS0tSEVBREVSLS0+XHJcbiAgICA8aGVhZGVyIGNsYXNzPVwiaGVhZGVyQmFyXCI+XHJcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJsZWZ0Q29udGVudFwiPlxyXG4gICAgICAgICAgICA8c3ZnIHdpZHRoPVwiMjJcIiBoZWlnaHQ9XCIyM1wiPlxyXG4gICAgICAgICAgICAgICAgPHJlY3Qgd2lkdGg9XCIyMVwiIGhlaWdodD1cIjIyXCIgc3R5bGU9XCJmaWxsOnJnYigyNTUsIDEwMiwgMCk7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlOnJnYigyNTUsMjU1LDI1NSlcIiAvPlxyXG4gICAgICAgICAgICAgICAgPHRleHQgeD1cIjRcIiB5PVwiMTdcIiBmaWxsPVwid2hpdGVcIj5ZPC90ZXh0PlxyXG4gICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJtYWludGl0bGVcIj5IYWNrZXIgTmV3czwvc3Bhbj4gIFxyXG4gICAgICAgICAgICA8c3Bhbj5uZXc8L3NwYW4+IHwgPHNwYW4+dGhyZWFkczwvc3Bhbj4gfCA8c3Bhbj5wYXN0PC9zcGFuPiB8IDxzcGFuPmNvbW1lbnRzPC9zcGFuPiB8IDxzcGFuPmFzazwvc3Bhbj4gfCBcclxuICAgICAgICAgICAgPHNwYW4+c2hvdzwvc3Bhbj4gfCA8c3Bhbj5qb2JzPC9zcGFuPiB8IDxzcGFuPnN1Ym1pdDwvc3Bhbj4gXHJcbiAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwicmlnaHRDb250ZW50XCI+XHJcbiAgICAgICAgICAgIDxzcGFuPkxvZ2dlZCBVc2VyPC9zcGFuPiB8IGxvZ291dFxyXG4gICAgICAgIDwvc3Bhbj5cclxuICAgIDwvaGVhZGVyPlxyXG5cclxuICAgIDwhLS1NQUlOIENPTlRFTlQtLT5cclxuICAgIDxzZWN0aW9uIGNsYXNzPVwiY29udGVudFNlY3Rpb25cIj5cclxuICAgICAgICAke2xvYWRTcGlubmVyfVxyXG4gICAgPC9zZWN0aW9uPlxyXG5cclxuICAgIDxkaXY+PGJ1dHRvbiBjbGFzcz1cIm1vcmVCdG5cIj5Nb3JlPC9idXR0b24+PC9kaXY+XHJcblxyXG4gICAgPCEtLUZPT1RFUi0tPlxyXG4gICAgPGZvb3RlciBjbGFzcz1cImZvb3RlckJhclwiPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwidG9wQ29udGVudFwiPlxyXG4gICAgICAgICAgICA8c3Bhbj5HdWlkZWxpbmVzPC9zcGFuPiB8IDxzcGFuPkZBUTwvc3Bhbj4gfCA8c3Bhbj5MaXN0czwvc3Bhbj4gfCA8c3Bhbj5BUEk8L3NwYW4+IHwgPHNwYW4+U2VjdXJpdHk8L3NwYW4+IHwgPHNwYW4+TGVnYWw8L3NwYW4+IHwgXHJcbiAgICAgICAgICAgIDxzcGFuPkFwcGx5IHRvIFlDPC9zcGFuPiB8IDxzcGFuPkNvbnRhY3Q8L3NwYW4+XHJcbiAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwiYm90dG9tQ29udGVudFwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwic2VhcmNoYm94XCI+U2VhcmNoPC9sYWJlbD5cclxuICAgICAgICAgICAgPGlucHV0IGlkPVwic2VhcmNoYm94XCI+PC9pbnB1dD5cclxuICAgICAgICA8L3NwYW4+XHJcbiAgICA8L2Zvb3Rlcj5cclxuPC9kaXY+XHJcbmBcclxuXHJcblxyXG5kb2N1bWVudC5ib2R5Lm9ubG9hZCA9IGFzeW5jICgpID0+IHtcclxuICAgIGJvZHkuaW5uZXJIVE1MID0gcGFnZVNrZWxldG9uXHJcbiAgICBpbml0aWFsaXplRXZlbnRIYW5kbGVycygpXHJcbiAgICBjb250ZW50UHJvdmlkZXIgPSBuZXcgQ29udGVudC5jb250ZW50UHJvdmlkZXIoKVxyXG5cclxuICAgIGF3YWl0IGNvbnRlbnRQcm92aWRlci5sb2FkVG9wU3RvcmllcygpXHJcbiAgICBwb3B1bGF0ZUNvbnRlbnRTZWN0aW9uKEhUTUxVdGlscy5jcmVhdGVCYXNpY0NvbnRlbnQoYXdhaXQgY29udGVudFByb3ZpZGVyLmdldFRvcFN0b3JpZXMoKSwgY3VycmVudFBhZ2UpKVxyXG59XHJcblxyXG5mdW5jdGlvbiBwb3B1bGF0ZUNvbnRlbnRTZWN0aW9uKGNvbnRlbnRIVE1MKSB7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGVudFNlY3Rpb24nKS5pbm5lckhUTUwgPSBjb250ZW50SFRNTFxyXG59XHJcbmZ1bmN0aW9uIHJlc2V0Q29udGVudFNlY3Rpb24oKSB7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGVudFNlY3Rpb24nKS5pbm5lckhUTUwgPSBsb2FkU3Bpbm5lclxyXG59XHJcbmZ1bmN0aW9uIGluaXRpYWxpemVFdmVudEhhbmRsZXJzKCkge1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vcmVCdG4nKS5vbmNsaWNrID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIGN1cnJlbnRQYWdlICs9IDFcclxuICAgICAgICByZXNldENvbnRlbnRTZWN0aW9uKClcclxuICAgICAgICBwb3B1bGF0ZUNvbnRlbnRTZWN0aW9uKEhUTUxVdGlscy5jcmVhdGVCYXNpY0NvbnRlbnQoYXdhaXQgY29udGVudFByb3ZpZGVyLmdldFRvcFN0b3JpZXMoY3VycmVudFBhZ2UpLCBjdXJyZW50UGFnZSkpXHJcbiAgICB9XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWFpbnRpdGxlJykub25jbGljayA9IGFzeW5jICgpID0+IHtcclxuICAgICAgICBjdXJyZW50UGFnZSA9IDBcclxuICAgICAgICByZXNldENvbnRlbnRTZWN0aW9uKClcclxuICAgICAgICBwb3B1bGF0ZUNvbnRlbnRTZWN0aW9uKEhUTUxVdGlscy5jcmVhdGVCYXNpY0NvbnRlbnQoYXdhaXQgY29udGVudFByb3ZpZGVyLmdldFRvcFN0b3JpZXMoY3VycmVudFBhZ2UpLCBjdXJyZW50UGFnZSkpXHJcbiAgICB9XHJcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJ3Nhc3NpZnknKSgnLmhlYWRlckJhciB7ICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmNjYwMDsgICBkaXNwbGF5OiBmbGV4OyAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjsgfSAgIC5oZWFkZXJCYXIgLm1haW50aXRsZSB7ICAgICBmb250LXdlaWdodDogYm9sZDsgICAgIG1hcmdpbjogMCA1cHg7ICAgICBjdXJzb3I6IHBvaW50ZXI7IH0gICAuaGVhZGVyQmFyIGltZyB7ICAgICBib3JkZXI6IHNvbGlkIDFweCB3aGl0ZTsgICAgIG1hcmdpbjogMnB4OyB9ICAgLmhlYWRlckJhciAubGVmdENvbnRlbnQgeyAgICAgZGlzcGxheTogZmxleDsgfSAgIC5oZWFkZXJCYXIgLnJpZ2h0Q29udGVudCB7ICAgICBkaXNwbGF5OiBmbGV4OyB9ICAuZm9vdGVyQmFyIHsgICBib3JkZXItdG9wOiBzb2xpZCAxcHggI2ZmNjYwMDsgICBkaXNwbGF5OiBmbGV4OyAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47ICAgYWxpZ24taXRlbXM6IGNlbnRlcjsgfSAgIC5mb290ZXJCYXIgLnRvcENvbnRlbnQgeyAgICAgZGlzcGxheTogZmxleDsgfSAgIC5mb290ZXJCYXIgLmJvdHRvbUNvbnRlbnQgeyAgICAgZGlzcGxheTogZmxleDsgfSAgLmNvbnRlbnRMaXN0IHsgICBwYWRkaW5nOiA1cHg7IH0gICAuY29udGVudExpc3QgLmxpc3RJdGVtIHsgICAgIG1hcmdpbjogNXB4OyAgICAgZGlzcGxheTogZmxleDsgfSAgICAgLmNvbnRlbnRMaXN0IC5saXN0SXRlbSAubGlzdE51bWJlciB7ICAgICAgIHdpZHRoOiAxLjdlbTsgfSAgICAgLmNvbnRlbnRMaXN0IC5saXN0SXRlbSAubGlzdENvbnRlbnQgeyAgICAgICBkaXNwbGF5OiBmbGV4OyAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyB9ICAgICAgIC5jb250ZW50TGlzdCAubGlzdEl0ZW0gLmxpc3RDb250ZW50IC5saXN0VGl0bGUgeyAgICAgICAgIGZvbnQtc2l6ZTogMWVtOyB9ICAgICAgIC5jb250ZW50TGlzdCAubGlzdEl0ZW0gLmxpc3RDb250ZW50IC5saXN0Rm9vdGVyIHsgICAgICAgICBmb250LXNpemU6IDAuOGVtOyAgICAgICAgIGNvbG9yOiAjODQ3ODc4OyB9ICBib2R5IHsgICBmb250LWZhbWlseTogXFwnVGltZXMgTmV3IFJvbWFuXFwnLCBUaW1lcywgc2VyaWY7IH0gIGEgeyAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTsgICBjb2xvcjogYmxhY2s7IH0gICBhOnZpc2l0ZWQgeyAgICAgY29sb3I6ICM4NDc4Nzg7IH0gICNtYWluQ2VudGVyZWRQYW5lbCB7ICAgbWluLXdpZHRoOiA3OTZweDsgICB3aWR0aDogMTAwJTsgICBoZWlnaHQ6IDEwMCU7IH0gICAjbWFpbkNlbnRlcmVkUGFuZWwgZm9vdGVyLCAgICNtYWluQ2VudGVyZWRQYW5lbCA+IHNlY3Rpb24sICAgI21haW5DZW50ZXJlZFBhbmVsID4gZGl2LCAgICNtYWluQ2VudGVyZWRQYW5lbCBoZWFkZXIgeyAgICAgd2lkdGg6IDg1JTsgICAgIHBhZGRpbmc6IDJweDsgICAgIG1hcmdpbi1sZWZ0OiBhdXRvOyAgICAgbWFyZ2luLXJpZ2h0OiBhdXRvOyB9ICAgI21haW5DZW50ZXJlZFBhbmVsIGZvb3RlciwgICAjbWFpbkNlbnRlcmVkUGFuZWwgPiBkaXYsICAgI21haW5DZW50ZXJlZFBhbmVsID4gc2VjdGlvbiB7ICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjZmNmVmOyB9ICAgI21haW5DZW50ZXJlZFBhbmVsID4gZGl2IGJ1dHRvbiB7ICAgICBib3JkZXI6IG5vbmU7ICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBpbmhlcml0OyAgICAgY29sb3I6IGJsdWU7ICAgICBjdXJzb3I6IHBvaW50ZXI7IH0gICAjbWFpbkNlbnRlcmVkUGFuZWwgPiBkaXYgYnV0dG9uOmFjdGl2ZSwgICAjbWFpbkNlbnRlcmVkUGFuZWwgPiBkaXYgYnV0dG9uOmZvY3VzLCAgICNtYWluQ2VudGVyZWRQYW5lbCA+IGRpdiBidXR0b246Zm9jdXM6YWN0aXZlIHsgICAgIGJhY2tncm91bmQtaW1hZ2U6IG5vbmU7ICAgICBvdXRsaW5lOiAwOyAgICAgYm94LXNoYWRvdzogbm9uZTsgfSAgICNtYWluQ2VudGVyZWRQYW5lbCAubG9hZGluZ1NwaW5uZXIgeyAgICAgYm9yZGVyOiA1cHggc29saWQgI2YzZjNmMzsgICAgIGJvcmRlci10b3A6IDVweCBzb2xpZCAjZmY2NjAwOyAgICAgYm9yZGVyLWJvdHRvbTogNXB4IHNvbGlkICNmZjY2MDA7ICAgICBib3JkZXItcmFkaXVzOiA1MCU7ICAgICB3aWR0aDogNTBweDsgICAgIGhlaWdodDogNTBweDsgICAgIG1hcmdpbi1yaWdodDogYXV0bzsgICAgIG1hcmdpbi1sZWZ0OiBhdXRvOyAgICAgYW5pbWF0aW9uOiBzcGluIDJzIGxpbmVhciBpbmZpbml0ZTsgfSAgQGtleWZyYW1lcyBzcGluIHsgICAwJSB7ICAgICB0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKTsgfSAgIDEwMCUgeyAgICAgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTsgfSB9ICcpOzsiLCJjb25zdCBjcmVhdGVCYXNpY0NvbnRlbnQgPSAoY29udGVudEFyciwgY3VycmVudFBhZ2UpID0+IHtcclxuICAgIGxldCBjb250ZW50SFRNTCA9IGA8c2VjdGlvbiBjbGFzcz1cImNvbnRlbnRMaXN0XCI+YFxyXG4gICAgY29udGVudEFyci5mb3JFYWNoKChwb3N0LCBpZHgpID0+IHtcclxuICAgICAgICBjb250ZW50SFRNTCArPSAoXHJcbiAgICAgICAgICAgIGA8YXJ0aWNsZSBjbGFzcz1cImxpc3RJdGVtXCI+IFxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpc3ROdW1iZXJcIj4keyhpZHggKyAxKSArIChjdXJyZW50UGFnZSAqIDMwKX0uIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpc3RDb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpc3RUaXRsZVwiPjxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9JHtwb3N0LnVybH0+ICR7cG9zdC50aXRsZX08L2E+IDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaXN0Rm9vdGVyXCI+ICR7cG9zdC5zY29yZX0gcG9pbnRzIGJ5ICR7cG9zdC5ieX0gfCAke3Bvc3QuZGVzY2VuZGFudHN9IGNvbW1lbnRzPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9hcnRpY2xlPmBcclxuICAgICAgICApXHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIGNvbnRlbnRIVE1MICsgJzwvc2VjdGlvbj4nXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgY3JlYXRlQmFzaWNDb250ZW50XHJcbn0iLCJyZXF1aXJlKCcuL1NBU1MvbWFpbi5zY3NzJylcclxucmVxdWlyZSgnLi9Db21wb25lbnRzL2xheW91dCcpIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzLCBjdXN0b21Eb2N1bWVudCkge1xuICB2YXIgZG9jID0gY3VzdG9tRG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG4gIGlmIChkb2MuY3JlYXRlU3R5bGVTaGVldCkge1xuICAgIHZhciBzaGVldCA9IGRvYy5jcmVhdGVTdHlsZVNoZWV0KClcbiAgICBzaGVldC5jc3NUZXh0ID0gY3NzO1xuICAgIHJldHVybiBzaGVldC5vd25lck5vZGU7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGhlYWQgPSBkb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXSxcbiAgICAgICAgc3R5bGUgPSBkb2MuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcblxuICAgIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuXG4gICAgaWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcbiAgICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgICB9IGVsc2Uge1xuICAgICAgc3R5bGUuYXBwZW5kQ2hpbGQoZG9jLmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICAgIH1cblxuICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgIHJldHVybiBzdHlsZTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuYnlVcmwgPSBmdW5jdGlvbih1cmwpIHtcbiAgaWYgKGRvY3VtZW50LmNyZWF0ZVN0eWxlU2hlZXQpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlU3R5bGVTaGVldCh1cmwpLm93bmVyTm9kZTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0sXG4gICAgICAgIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW5rJyk7XG5cbiAgICBsaW5rLnJlbCA9ICdzdHlsZXNoZWV0JztcbiAgICBsaW5rLmhyZWYgPSB1cmw7XG5cbiAgICBoZWFkLmFwcGVuZENoaWxkKGxpbmspO1xuICAgIHJldHVybiBsaW5rO1xuICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCdjc3NpZnknKTsiXX0=
