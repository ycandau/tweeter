// client.js

// @todo:
// - focus on submit button
// - timing of error render when message switches
// - use display: none rather than visibility, or try out $.hide()

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

// Used only once, could refactor out, kept here for separation of tasks
const loadTweets = () => $.get(URL);

const renderTweets = (tweets) => {
  $container = $('#tweets-container').empty();
  [...tweets] // avoid mutating in general
    .forEach((tweet) => $container.prepend(createTweetElement(tweet)));
  // Assumes server data already sorted, otherwise use:
  // .sort((t1, t2) => t2.created_at - t1.created_at)
};

const refreshTweets = () => {
  loadTweets()
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

const scrollTop = () =>
  document.documentElement.scrollTop || // for cross-browser compatibility
  document.body.scrollTop ||
  window.pageYOffset ||
  0;

const setupScrollListener = () => {
  // Use addEventListener() because scroll does not bubble up
  // and capture at the document level
  document.addEventListener(
    'scroll',
    () => {
      if (scrollTop()) {
        $('#to-top').fadeIn(300);
        return;
      }
      $('#to-top').fadeOut(300); // fade at top
    },
    true
  );
};

const setupScrollButtonListener = () => {
  $('#to-top').click(() => {
    const duration = Math.min(300, scrollTop() / 3);
    $('html, body') // for cross-browser compatibility
      .animate({ scrollTop: 0 }, duration);
  });
};

//------------------------------------------------------------------------------
// Function calls when document is ready

$(document).ready(() => {
  setupErrorElem();
  setupSubmitListener();
  setupScrollListener();
  setupScrollButtonListener();
  refreshTweets();
});
