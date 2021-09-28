const btn = document.querySelector("[data-get]");
const btnSort = document.querySelector("[data-sort]");
const inputNumber = document.querySelector("[data-number]");
const accessBtn = document.querySelector('.access-form .btn');
const tokenInput = document.querySelector('.token-input');
const login = document.querySelector('.login');
const access = document.querySelector('.access');

let token = '';

const tokenPacha = 'IGQVJXWUFTUDFLQTRiellZAZAVNYLU5aUVlXZATJMUXg1OWRJNVY5QTkyX2doekhKNGQ3YWxwbkJpb04taTg1NHVVOGtjamVsWV9DMWRRMk5KVlQ4OXpWNW1oVnZAZAQjBWeXJKeUlVbklvaUF5U2VZAN0VlcQZDZD';

tokenInput.addEventListener('change', () => {
  tokenInput.classList.add('active');
})

accessBtn.addEventListener('click', () => {
  const errorAccess = document.querySelector('.error-access');
  if (tokenInput.value === '' || tokenInput.value.length < 90) {
    errorAccess.style.display = 'block'
  } else {
    errorAccess.style.display = 'none'
    token = tokenInput.value;
    accessBtn.classList.add('active');
    login.classList.remove('active-step');
    login.style.display = 'none';
    access.classList.add('active-step')
  }
})

async function fetchAPI(e) {

  btn.classList.add('active');
  btn.disabled = true;
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
  posts.classList.add('active-step');
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
    img.addEventListener('click', choiceImg);
    function choiceImg() {
      postsLi[imgId].classList.add('active');
      verifyComments(getPosts[imgId].id);
      isClass();
    }
  })

  function isClass() {
    postsLi.forEach((post) => {
      if (!post.classList.contains('active')) {
        post.style.display = 'none';
      }
    })
  }
}

async function verifyComments(postId) {
  const responseIsComment = await fetch(`https://graph.facebook.com/v12.0/${postId}?fields=comments.limit(100)&access_token=${token}`);
  const resolveIsComment = await responseIsComment.json();
  const isComments = resolveIsComment.comments;
  if (isComments) {
    getAllComments(postId);
  } else {
    const error = document.querySelector('.error');
    error.style.display = 'block';
  }
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
        loading[1].style.display = 'none'
        result.classList.add('active-step-flex');
        if (winnerId === winners.length - 1) {
          const uniqWinners = [...new Set(winners)];
          const sort = uniqWinners.sort(() => Math.random() - Math.random()).slice(0, numberOfWinners);
          const n = 5;

          const sliceArrayOfWinners = new Array(Math.ceil(sort.length / n)).fill().map(_ => sort.splice(0, n));
          
          sliceArrayOfWinners.forEach((rst) => {
            const ul = document.createElement('ul');
            result.appendChild(ul);
            rst.forEach((item) => {
              const li = document.createElement('li');
              li.innerText = `@${item}`;
              ul.appendChild(li);
            })
          })

          if (numberOfWinners > +uniqWinners.length) {
            const exceedWinners = document.querySelector('.result .error');
            exceedWinners.style.display = 'block'
          }

          const nav = document.querySelector('.result nav');
          nav.style.display = 'flex';

          // Navegation

          const navBtn = document.querySelectorAll(".nav-btn");
          const resultUl = document.querySelectorAll('.result ul');

          if (+numberOfWinners >= 6) {
            navBtn.forEach(function (btn) {
              btn.addEventListener("click", handleNav);
            });
          } else {
            navBtn.forEach(function (btn) {
              btn.style.display = 'none';
            });
          }

          resultUl.forEach((ul) => {
            ul.style.display = 'none';
          })
          resultUl[0].style.display = 'block';

          let iNav = 0;
          const nPages = document.querySelector('.n-pages');
          nPages.innerText = `${iNav + 1}/${sliceArrayOfWinners.length}`
          function handleNav(e) {
            e.preventDefault();
            if (e.target.innerText === 'Próximo') {
              if (iNav < (sliceArrayOfWinners.length - 1)) {
                iNav++
                resultUl.forEach((ul) => {
                  ul.style.display = 'none';
                })
                resultUl[iNav].style.display = 'block';
                resultUl[iNav].style.animation = 'nextStep 1s forwards';
                nPages.innerText = `${iNav + 1}/${sliceArrayOfWinners.length}`
              }
            } else {
              if (iNav > 0) {
                iNav--
                resultUl.forEach((ul) => {
                  ul.style.display = 'none';
                })
                resultUl[iNav].style.animation = 'previousStep 1s forwards';
                resultUl[iNav].style.display = 'block';
                nPages.innerText = `${iNav + 1}/${sliceArrayOfWinners.length}`
              }
            }
          }
        }
      }, 2000)
    }
  }
}

const loading = document.querySelectorAll('.loading');

async function getAllComments(postId) {
  loading[0].style.display = 'block';
  const responseCommentsPage = [];
  const resolveCommentsPage = [];
  const commentsPage = [];
  
  responseCommentsPage[1] = await fetch(`https://graph.facebook.com/v12.0/${postId}?fields=comments.limit(100)&access_token=${token}`);
  resolveCommentsPage[1] = await responseCommentsPage[1].json();
  const isComments = resolveCommentsPage[1].comments;
  commentsPage[1] = resolveCommentsPage[1].comments.data;
  const isPagination = resolveCommentsPage[1].comments.paging;

  if (isPagination) {
    responseCommentsPage[2] = await fetch(resolveCommentsPage[1].comments.paging.next);
    resolveCommentsPage[2] = await responseCommentsPage[2].json();
    commentsPage[2] = resolveCommentsPage[2].data;
  }

  let condicao = 3;

  while (condicao) {
    if (resolveCommentsPage[2]) {
      let condicaoMenos = condicao - 1;
      if (resolveCommentsPage[condicaoMenos].paging === undefined) {
        break;
      }
      responseCommentsPage[condicao] = await fetch(resolveCommentsPage[condicaoMenos].paging.next);
      resolveCommentsPage[condicao] = await responseCommentsPage[condicao].json();
      commentsPage[condicao] = resolveCommentsPage[condicao].data;
      condicao++;
    } else {
      break;
    }
  }

  const allComments = [];

  if (isPagination && resolveCommentsPage[2]) {
    for (i = 1; i < condicao; i++) {
      if (resolveCommentsPage[2]) {
        allComments.push(...commentsPage[i]);
      }
    }
  } else if(isPagination) {
    allComments.push(...commentsPage[1], ...commentsPage[2]);
  } else {
    allComments.push(...commentsPage[1]);
  }

  loading[0].style.display = 'none';
  const qtd = document.querySelector('.qtd');
  qtd.classList.add('active-step');

  const nComments = document.querySelector('.n-comments');
  if (allComments.length === 1) {
    nComments.innerText = `${allComments.length} comentário encontrado`;
  } else {
    nComments.innerText = `${allComments.length} comentários encontrados`;
  }

  let inputValue = '';
  inputNumber.addEventListener('change', () => {
    inputValue = inputNumber.value;
    inputNumber.classList.add('active');
  })
  btnSort.addEventListener('click', () => {
    loading[1].style.display = 'block'
    if (allComments) {
      allComments.forEach((item, index) => {
        buildComment(item.id, item.text ,index, inputValue);
      })
    }
    setTimeout(() => {
      const rUl = document.querySelector('.result ul');
      const errorResult = document.querySelector('.error-result');
      if (!rUl) {
        loading[1].style.display = 'none'
        errorResult.style.display = 'block';
      }
    },5000)
  })
}

btn.addEventListener("click", fetchAPI);
