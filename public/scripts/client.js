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

const escape = (str) => $('<div>').text(str).html();

const createTweetElement = (tweet) =>
  $(`<article class="tweet">
      <header>
        <img src="${tweet.user.avatars}" />
        <div>${escape(tweet.user.name)}</div>
        <div>${escape(tweet.user.handle)}</div>
      </header>
      <div>${escape(tweet.content.text)}</div>
      <footer>
        <div>${timeago.format(tweet.created_at)}</div>
        <div>
          <i class="fas fa-flag"></i>
          <i class="fas fa-retweet"></i>
          <i class="fas fa-heart"></i>
        </div>
      </footer>
    </article>`);

// necessary to avoid element briefly showing on loadup
const setupErrorElem = () => {
  $('#error')
    .css({ display: 'flex' }) // starts as 'none' on loadup
    .append('<i class="fas fa-exclamation"></i>')
    .append(`<span></span>`)
    .append('<i class="fas fa-exclamation"></i>')
    .slideUp(0);
};

const processError = (msg) => {
  const $error = $('#error').slideDown(200);
  $error.children('span').text(msg);
  $error.next().next().focus();
};

const renderTweets = (tweets) => {
  $container = $('#tweets-container').empty();
  [...tweets] // avoid mutating in general
    .sort((t1, t2) => t2.created_at - t1.created_at)
    .forEach((tweet) => $container.append(createTweetElement(tweet)));
};

const refreshTweets = () => {
  $.get(URL)
    .then(renderTweets)
    .catch((err) => console.error(err));
};

const setupSubmitListener = () => {
  $('#new-tweet').submit(function (event) {
    event.preventDefault();
    const $textarea = $(this).children('textarea');
    const msg = $textarea.val();

    // Validation
    $('#error').slideUp(200);
    if (!msg) {
      return processError('Empty tweet: You gotta say something.');
    }
    if (msg.length > 140) {
      return processError('Tweet too long: Keep it under 140 characters.');
    }

    // Happy
    $.post(URL, $(this).serialize()).then(refreshTweets); // async
    $textarea.val(''); // sync
    $(this).children('footer').children('output').text(140);
  });
};

const setupScrollListener = () => {
  // Scroll does not bubble up so we use native addEventListener() method
  // and capture at the document level
  document.addEventListener(
    'scroll',
    function (event) {
      console.log('scrolling', event.target);
    },
    { capture: true }
  );
};

//------------------------------------------------------------------------------
// Function calls when document is ready

$(document).ready(() => {
  setupErrorElem();
  setupSubmitListener();
  setupScrollListener();
  refreshTweets();
});
