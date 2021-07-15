// client.js

// @todo:
// - focus on submit button

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

// Used only once, could refactor out, kept here for separation of tasks
const loadTweets = () => $.get(URL);

const renderTweets = (tweets) => {
  $container = $('#tweets-container').empty();
  [...tweets].forEach((tweet) => $container.prepend(createTweetElement(tweet)));
  // Assumes server data already sorted, otherwise use:
  // .sort((t1, t2) => t2.created_at - t1.created_at)
};

const refreshTweets = () => {
  loadTweets()
    .then(renderTweets)
    .catch((err) => console.error(err));
};

const setupErrorDisplay = () => {
  $('#error')
    .css({ display: 'flex' }) // set to 'none' on loadup to hide before script
    .append(createIcons('exclamation'), '<span>', createIcons('exclamation'))
    .hide(0);
};

const displayError = (msg) => {
  const $error = $('#error');
  $error.slideUp(0).slideDown(200);
  $error.next().next().focus();
  $error.children('span').text(msg);
};

const setupSubmitListener = () => {
  $('#new-tweet').submit(function (event) {
    event.preventDefault();
    const $textarea = $(this).children('textarea');
    const text = $textarea.val();

    const errorMsg = !text
      ? 'Empty tweet: You gotta say something.'
      : text.length > 140
      ? 'Tweet too long: Keep it under 140 characters.'
      : '';

    if (errorMsg) {
      displayError(errorMsg);
      return;
    }

    // Happy
    $('#error').slideUp(200);
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
  setupErrorDisplay();
  setupSubmitListener();
  setupScrollListener();
  setupScrollButtonListener();
  refreshTweets();
});
