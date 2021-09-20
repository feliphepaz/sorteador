const btn = document.querySelector(".btn");

const token = 'EAALyCMbsjBMBAIZBqyvLg5D8JfOZBWYZCruE4WBTBZBlwXwNBk5vwmGRHqMUcNGUnIQy2n4NZA7ce9p5hlkcYRO5V53SohDCwfKAg1gQOe90FVgVENRzoasd0rAYblUfTQpkIqUsDWLcXdFBsUjfR2HTBJRsCv9pZADQZBF2SLYYsZBs2kFeW6WO4GjZAAveMYVG0tTtShfEGbnH62EqP58JfNHvZBNjvozAgPxa9ZBXHevLAZDZD';

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
  imgPosts.forEach((img, imgId) => {
    img.addEventListener('click', () => {
      getAllComments(getPosts[imgId].id);
    })
  })
}

async function buildComment(userComment, textComment) {
  const responseUserComment = await fetch(`https://graph.facebook.com/v12.0/${userComment}?fields=username&access_token=${token}`);
  const resolveUserComment = await responseUserComment.json();
  const formatComment = `@${resolveUserComment.username}: ${textComment}`
  console.log(formatComment);
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
