/* global markdown */

// old.reddit.com
function oldReddit () {
  const commentReferences = document.getElementsByClassName('deleted')
  const deletedComments = Array.from(commentReferences)

  if (deletedComments.length === 0) {
    return
  }
  const deletedIDs = deletedComments.map(comment => (
    comment.getAttribute('data-permalink').split('/')[6]
  ))

  // > 100 removed comments ->  crash ? check twoXChromosomes
  window.fetch(`https://api.pushshift.io/reddit/search/comment/?ids=${deletedIDs.join()}&fields=author,body,id`)
    .then(data => data.json())
    .then(data => {
      const retrievedComments = data.data
      deletedIDs.forEach((id, index) => {
        const commentElement = commentReferences[index]
        const retrievedComment = retrievedComments.find(comment => comment.id === id)

        if (retrievedComment === undefined) {
          console.log('Removeddit live - could not match comment with id', id)
          return
        }

        // Have to markdown parse this....
        commentElement.getElementsByClassName('md')[0].innerHTML = markdown.toHTML(retrievedComment.body)
        commentElement.classList.remove('collapsed')
        commentElement.classList.add('spam')
        commentElement.getElementsByClassName('usertext')[0].classList.remove('grayed')

        // Convert [deleted] to link to the comment author
        const authorElement = commentElement.getElementsByClassName('tagline')[0].children[1]
        const newAuthorElement = document.createElement('a')
        newAuthorElement.className = 'author may-blank'
        newAuthorElement.innerHTML = retrievedComment.author
        newAuthorElement.href = `/user/${retrievedComment.author}`

        commentElement.getElementsByClassName('flat-list')[0].innerHTML = `
          <li class="first">
            <a href="${commentElement.getAttribute('data-permalink')}" data-event-action="permalink" class="bylink" rel="nofollow">
              permalink
            </a>
          </li>
        `

        authorElement.parentNode.replaceChild(newAuthorElement, authorElement)
      })
    })
}

function newReddit () {
  document.getElementsByClassName('ifvGlZ')
}

oldReddit()
newReddit()
// new reddit
// MutationoObserver
//   document - subtree - setTimeout

