// client.js

//------------------------------------------------------------------------------
// Constants

const host = 'localhost';
const port = 8080;
const url = `http://${host}:${port}/tweets`;

//------------------------------------------------------------------------------
// Functions

const createTweetElement = (tweet) =>
  $(`<article class="tweet">
      <header>
        <img src="${tweet.user.avatars}" />
        <div>${tweet.user.name}</div>
        <div>${tweet.user.handle}</div>
      </header>
      <div>${tweet.content.text}</div>
      <footer>
        <div>${timeago.format(tweet.created_at)}</div>
        <div>
          <i class="fas fa-flag"></i>
          <i class="fas fa-retweet"></i>
          <i class="fas fa-heart"></i>
        </div>
      </footer>
    </article>`);

const renderTweets = (tweets) => {
  $container = $('#tweets-container');
  tweets.forEach((tweet) => $container.append(createTweetElement(tweet)));
};

const loadTweets = () => $.get(url);

const setSubmitListener = () =>
  $('#new-tweet form').submit(function (event) {
    event.preventDefault();
    $.post(url, $(this).serialize());
  });

//------------------------------------------------------------------------------
// Function calls when document is ready

$(document).ready(() => {
  setSubmitListener();
  loadTweets()
    .then(renderTweets)
    .catch((err) => console.error(err));
});
