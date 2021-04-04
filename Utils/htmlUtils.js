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