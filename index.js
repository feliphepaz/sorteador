const btn = document.querySelector("[data-get]");

const token = 'EAALyCMbsjBMBAN5gwxsivC6Kq1Q8jJUhiAMQZB92JfrJofgpcArReFThtBcOIJvNHRWudDSPP2LjcBKxjOkx7l9ltMRFnyVm3HjdbGbh4RAJeTaWexdCbPONIMCmmwRDf2ZBgHmR6tfrZAifhUr6CxwsHncQUbInQ0RnS7qpNObrmwmFSamdD69ZBvS8kO2Q1h0ZBobZAyq9Pgm9yLj6v5EiFCdyWkGvAzhha53Sr7SAZDZD';

const tokenPacha = 'IGQVJXWUFTUDFLQTRiellZAZAVNYLU5aUVlXZATJMUXg1OWRJNVY5QTkyX2doekhKNGQ3YWxwbkJpb04taTg1NHVVOGtjamVsWV9DMWRRMk5KVlQ4OXpWNW1oVnZAZAQjBWeXJKeUlVbklvaUF5U2VZAN0VlcQZDZD';

async function fetchAPI(e) {

  btn.classList.add('active');
  const getAccount = e.target.id;

  // Get Instagram Account ID
  const responseInstagramAccount = await fetch(
    `https://graph.facebook.com/v12.0/${getAccount}?fields=instagram_business_account&access_token=${token}`
  );
  const resolveInstagramAccount = await responseInstagramAccount.json();
  const getInstagramAccount = resolveInstagramAccount.instagram_business_account.id;

  // Get Posts ID
  const responsePosts = await fetch(
    `https://graph.facebook.com/v12.0/${getInstagramAccount}?fields=media&access_token=${token}`
  );
  const resolvePosts = await responsePosts.json();
  const getPosts = resolvePosts.media.data;

  // Get Posts Images
  const responseImages = await fetch(
    `https://graph.instagram.com/me/media?access_token=${tokenPacha}&fields=media_url,media_type,caption,permalink`
  );
  const resolveImages = await responseImages.json();
  const getImages = resolveImages.data;

  const posts = document.querySelector('.posts');
  posts.style.display = 'block';
  const imagesContainer = document.querySelector('.posts ul');

  getImages.forEach((image) => {
    const imgUrl = image.media_url;
    const li = document.createElement('li');
    const img = document.createElement('img');
    li.appendChild(img);
    img.src = imgUrl;
    imagesContainer.appendChild(li);
  })

  const imgPosts = document.querySelectorAll('.posts ul li img');
  const postsLi = document.querySelectorAll('.posts ul li');
  imgPosts.forEach((img, imgId) => {
    img.addEventListener('click', (e) => {
      postsLi[imgId].classList.add('active');
      getAllComments(getPosts[imgId].id);
      const qtd = document.querySelector('.qtd');
      qtd.style.display = 'block'
    })
  })
}

const winners = [];

async function buildComment(userCommentId, textComment, winnerId) {
  const responseUserComment = await fetch(`https://graph.facebook.com/v12.0/${userCommentId}?fields=username&access_token=${token}`);
  const resolveUserComment = await responseUserComment.json();
  const userComment = resolveUserComment.username;
  const match = textComment.match(/\B@\w+/g);
  if (match) {
    if (match.length === 2 && match[0 || 1] !== '@opacha_oficial') {
      winners.push(userComment);
        if (winnerId === winners.length - 1) {
          const uniqWinners = [...new Set(winners)];
          const sort = uniqWinners.sort(() => Math.random() - Math.random()).slice(0, 40);
        }
    }
  }
}

async function getAllComments(postId) {
  const responseComments = await fetch(`https://graph.facebook.com/v12.0/${postId}?fields=comments.limit(100)&access_token=${token}`);
  const resolveComments = await responseComments.json();
  const comments = resolveComments.comments.data;
  const tst = await fetch(resolveComments.comments.paging.next);
  const resolveTst = await tst.json();
  console.log(resolveTst.data);
  comments.forEach((comment, index) => {
    buildComment(comment.id, comment.text, index);
  })
}

btn.addEventListener("click", fetchAPI);
