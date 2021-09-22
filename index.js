const btn = document.querySelector("[data-get]");
const btnSort = document.querySelector("[data-sort]");
const inputNumber = document.querySelector("[data-number]");

const token = 'EAALyCMbsjBMBANOPLPZCqF0fvZAVIwZCbO4DksY617TTrfJDSN4mOzY8bIlGG6yZCLPbT1dJ4R4iJ3wFgZBuGXSEYhbK84rmIuAql2l8wb928EEJQ61iIKMJ1KvGmCzS4AXIcVHr9ZAy8FV3qoESUbbl8n6PZC2n3BNvgbKse6oeREZCvaIVOL7ENr7JHKfjZAVA9UFNi9g9KqR84gZBeJYmiOoTBRvZCgR5yAfMcbQ0mCgYgZDZD';

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

  getImages.slice(0,5).forEach((image) => {
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
const result = document.querySelector(".result");

async function buildComment(userCommentId, textComment, winnerId, numberOfWinners) {
  btnSort.classList.add('active');
  const responseUserComment = await fetch(`https://graph.facebook.com/v12.0/${userCommentId}?fields=username&access_token=${token}`);
  const resolveUserComment = await responseUserComment.json();
  const userComment = resolveUserComment.username;
  const match = textComment.match(/\B@\w+/g);
  if (match) {
    if (match.length >= 2) {
      winners.push(userComment);
      setTimeout(() => {
        result.style.display = 'block';
        if (winnerId === winners.length - 1) {
          const uniqWinners = [...new Set(winners)];
          const sort = uniqWinners.sort(() => Math.random() - Math.random()).slice(0, numberOfWinners);
          if (sort === []) {
            const li = document.createElement('li');
            li.innerText = 'Deu erro, tenta novamente!!!';
            resultUl.appendChild(li);
          } else {
            const n = 5;

            const sliceArrayOfWinners = new Array(Math.ceil(sort.length / n)).fill().map(_ => sort.splice(0, n));
            
            sliceArrayOfWinners.forEach((rst) => {
              const ul = document.createElement('ul');
              result.appendChild(ul);
              rst.forEach((item) => {
                const li = document.createElement('li');
                li.innerText = `@${item}`;
                ul.appendChild(li);
                console.log(ul);
              })
            })

          }
        }
      }, 2000)
    }
  }
}

async function getAllComments(postId) {
  const responseCommentsPage = [];
  const resolveCommentsPage = [];
  const commentsPage = [];
  
  responseCommentsPage[1] = await fetch(`https://graph.facebook.com/v12.0/${postId}?fields=comments.limit(100)&access_token=${token}`);
  resolveCommentsPage[1] = await responseCommentsPage[1].json();
  commentsPage[1] = resolveCommentsPage[1].comments.data;
  console.log(commentsPage[1]);
  responseCommentsPage[2] = await fetch(resolveCommentsPage[1].comments.paging.next);
  resolveCommentsPage[2] = await responseCommentsPage[2].json();
  commentsPage[2] = resolveCommentsPage[2].data;
  console.log(commentsPage[2]);

  let condicao = 3;
  while (condicao) {
    let condicaoMenos = condicao - 1;
    if (resolveCommentsPage[condicaoMenos].paging === undefined) {
      break;
    }
    responseCommentsPage[condicao] = await fetch(resolveCommentsPage[condicaoMenos].paging.next);
    resolveCommentsPage[condicao] = await responseCommentsPage[condicao].json();
    commentsPage[condicao] = resolveCommentsPage[condicao].data;
    console.log(commentsPage[condicao]);
    condicao++;
  }

  const allComments = [];
  for (i = 1; i < condicao; i++) {
    allComments.push(...commentsPage[i]);
  }

  console.log(allComments);

  let inputValue = '';
  inputNumber.addEventListener('change', () => {
    inputValue = inputNumber.value;
    inputNumber.classList.add('active');
  })
  btnSort.addEventListener('click', () => {
    allComments.forEach((item, index) => {
      buildComment(item.id, item.text ,index, inputValue);
    })
  })
}

btn.addEventListener("click", fetchAPI);
