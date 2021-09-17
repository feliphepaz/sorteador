const btn = document.querySelector(".btn");
const ul = document.querySelector(".ul");

const token = 'EAALyCMbsjBMBAIcUcmUAfEbZBw35FtW4zpVxSyrOZAIBha9uNKAcLtp34b0ZBZArFC8fBgCD54Xd4aK490mdwS2MBpW6Jf8U9y2r74U8ZAulHkRKZBdGZCz26iNZCvKV6L67G3lVRniVSbEhrLfsb6y2aJ2DVtQPC0FNdBeEQcHwZBHUzQ9DlMXkMMEF8DEbn5ZCrcAuCZC9ZAhoAHJDtZAPIqIf1EGWsSeVlZAf5SGAQzfChZCxAZDZD';

async function fetchApi() {
  const responseAccount = await fetch(
    `https://graph.facebook.com/v12.0/me/accounts?access_token=${token}`
  );
  const resolveAccount = await responseAccount.json();
  const codelari = resolveAccount.data[0].id;

  const responseInstagram = await fetch(
    `https://graph.facebook.com/v12.0/${codelari}?fields=instagram_business_account&access_token=${token}`
  );
  const resolveInstagram = await responseInstagram.json();
  const codelariInstagram = resolveInstagram.instagram_business_account.id;

  const responseMedia = await fetch(
    `https://graph.facebook.com/v12.0/${codelariInstagram}?fields=media&access_token=${token}`
  );
  const resolveMedia = await responseMedia.json();
  console.log(resolveMedia.media.data);
}

btn.addEventListener("click", fetchApi);
