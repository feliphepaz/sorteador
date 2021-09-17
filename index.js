// IGQVJWRGRhTjJCRzd6X21RUFZA5VVEwYVVuOHdUbzd1S0Q3QlhzUkhUSFZADRmRXNXNsTzdtQk91aEx6cGZAIUjNMam1ZARnd3Mmp6alIxX0wzYVB5b3hyM3FFNlkzVEdobmtRelNJMWt3VnVDSDgtQ0ZAMSwZDZD
//
const btn = document.querySelector(".btn");
const ul = document.querySelector(".ul");

async function fetchApi() {
  const response = await fetch(
    "https://graph.facebook.com/v11.0/18007017787323916/comments?access_token=EAALyCMbsjBMBAIcUcmUAfEbZBw35FtW4zpVxSyrOZAIBha9uNKAcLtp34b0ZBZArFC8fBgCD54Xd4aK490mdwS2MBpW6Jf8U9y2r74U8ZAulHkRKZBdGZCz26iNZCvKV6L67G3lVRniVSbEhrLfsb6y2aJ2DVtQPC0FNdBeEQcHwZBHUzQ9DlMXkMMEF8DEbn5ZCrcAuCZC9ZAhoAHJDtZAPIqIf1EGWsSeVlZAf5SGAQzfChZCxAZDZD"
  );
  const resolve = await response.json();
  resolve.data.forEach((txt) => {
    const li = document.createElement("li");
    li.innerText = txt.text;
    ul.appendChild(li);
  });
}

btn.addEventListener("click", fetchApi);
