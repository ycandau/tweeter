// client.js

// @todo:
// - focus on submit button
// - wrap long tweets in tweet article

//------------------------------------------------------------------------------
// Constants

const HOST = 'localhost';
const PORT = 8080;
const URL = `http://${HOST}:${PORT}/tweets`;

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
  $container = $('#tweets-container').empty();
  [...tweets] // avoid mutating in general
    .sort((t1, t2) => t2.created_at - t1.created_at)
    .forEach((tweet) => $container.append(createTweetElement(tweet)));
};

const refreshTweets = () =>
  $.get(URL)
    .then(renderTweets)
    .catch((err) => console.error(err));

const setSubmitListener = () => {
  $('#new-tweet > form').submit(function (event) {
    event.preventDefault();
    const $textarea = $(this).children('textarea');
    const msg = $textarea.val();
    if (!msg) {
      $textarea.focus();
      alert('Empty tweet');
      return;
    }
    if (msg.length > 140) {
      $textarea.focus();
      alert('Tweet too long');
      return;
    }
    $.post(URL, $(this).serialize()).then(refreshTweets); // async

    // Reset form: OK to do synchronously
    $textarea.val('');
    $(this).children('footer').children('output').text(140);
  });
};

//------------------------------------------------------------------------------
// Function calls when document is ready

$(document).ready(() => {
  setSubmitListener();
  refreshTweets();
});
