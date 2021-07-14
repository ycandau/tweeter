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

const createIcons = (...icons) =>
  icons.reduce((array, icon) => {
    array.push($('<i>').addClass(`fas fa-${icon}`));
    return array;
  }, []);

const createTweetElement = (tweet) => {
  const $header = $('<header>').append(
    $('<img>').attr('src', tweet.user.avatars),
    $('<div>').text(tweet.user.name),
    $('<div>').text(tweet.user.handle)
  );
  const $content = $('<div>').text(tweet.content.text);
  const $footer = $('<footer>').append(
    $('<div>').text(timeago.format(tweet.created_at)),
    $('<div>').append(createIcons('flag', 'retweet', 'heart'))
  );
  return $('<article>').append($header, $content, $footer).addClass('tweet');
};

// necessary to avoid element briefly showing on loadup
const setupErrorElem = () => {
  $('#error')
    .css({ display: 'flex' }) // starts as 'none' on loadup
    .append(createIcons('exclamation'), '<span>', createIcons('exclamation'))
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
  // Scroll does not bubble up so we use addEventListener()
  // and capture at the document level
  document.addEventListener(
    'scroll',
    (event) => {
      $('#to-top').addClass('reveal');
      console.log(Math.max($('html').scrollTop(), $('body').scrollTop()));
    },
    true
  );

  $('#to-top').click(() => {
    const dy = Math.max($('html').scrollTop(), $('body').scrollTop());
    const duration = Math.min(300, dy / 3);
    $('html, body')
      .animate({ scrollTop: 0 }, duration)
      .promise()
      .done(() => $('#to-top').removeClass('reveal'));
    console.log($('html').scrollTop(), $('body').scrollTop());
  });
};

//------------------------------------------------------------------------------
// Function calls when document is ready

$(document).ready(() => {
  setupErrorElem();
  setupSubmitListener();
  setupScrollListener();
  refreshTweets();
});
