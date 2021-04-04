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