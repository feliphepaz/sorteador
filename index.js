const btn = document.querySelector("[data-get]");

const token = 'EAALyCMbsjBMBAHx2X87cvPJY1m1qXUzzmNZCqZCyVFiaJlFddimCf9XVWlwZC8E1dc9HLnS2bU040t6j9dcZAyhmV6o8p6kYxtsnfIE92YrsZCkbzNUKchKK7wY6wpx0bChZAnqf5RMBAo1LSRFwfHn0SZBOgybWaqaKPZCmN0Dujm61vva11NGc0MHB0InvYIlpsPmLyCrZBamOUoInWw26kz1D1BcqUNcZCLIXbzNPMNgQZDZD';

const tokenEB = 'IGQVJWYVc2eUVVRk01X3BoMGRMM1lVMTVDZAVBDTWlTUm9SQUhxNGR2aHlvQlVTQW5PbS1ZAOXJGZA1haNk1vTmRBS3RLTTR6QWFNX1ppbEQzY3pvNmpVckt2SkVPdWo5TkE1TkVSaVFDVmIwZA0p0NFVVagZDZD';

async function fetchAPI() {
  btn.classList.add('active');

  // Get Account ID
  const responseAccount = await fetch(
    `https://graph.facebook.com/v12.0/me/accounts?access_token=${token}`
  );
  const resolveAccount = await responseAccount.json();
  const getAccount = resolveAccount.data[0].id;


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
    `https://graph.instagram.com/me/media?access_token=${tokenEB}&fields=media_url,media_type,caption,permalink`
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

async function buildComment(userCommentId, textComment) {
  const responseUserComment = await fetch(`https://graph.facebook.com/v12.0/${userCommentId}?fields=username&access_token=${token}`);
  const resolveUserComment = await responseUserComment.json();
  const userComment = resolveUserComment.username;
  const formatComment = `@${userComment}: ${textComment}`;
  const match = textComment.match(/\B@\w+/g);
  if (match) {
    if (match.length === 2 && match[0 || 1] !== '@codelariagencia') {
      console.log(userComment);
    }
  }
}

async function getAllComments(postId) {
  const responseComments = await fetch(`https://graph.facebook.com/v12.0/${postId}?fields=comments&access_token=${token}`);
  const resolveComments = await responseComments.json();
  const comments = resolveComments.comments.data;
  comments.forEach(comment => {
    buildComment(comment.id, comment.text);
  })
}

btn.addEventListener("click", fetchAPI);
