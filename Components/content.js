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