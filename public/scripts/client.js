// client.js

// @todo:
// - Style submit button (bug on focus)
// - Style scroll-to-top button

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

onTweetSubmit = (event) => {
  event.preventDefault();
  const $form = $('#new-tweet');
  const $textarea = $form.children('textarea');
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
  $.post(URL, $form.serialize()).then(refreshTweets); // async
  $textarea.val(''); // sync
  $form.children('footer').children('output').text(140);
};

const scrollTop = () =>
  // for cross-browser compatibility
  document.documentElement.scrollTop ||
  document.body.scrollTop ||
  window.pageYOffset ||
  0;

const scrollToTop = (maxDuration) => () => {
  // duration is first proportional then capped
  const duration = Math.min(maxDuration, scrollTop() / 3);
  $('html, body').animate({ scrollTop: 0 }, duration);
};

const onComposeClick = () => {
  const $newTweet = $('#new-tweet');
  if ($newTweet.is(':visible')) {
    $('#tweet-text').blur();
    $newTweet.slideUp(300);
  } else {
    scrollToTop(300)();
    $newTweet.slideDown(300);
    $('#tweet-text').focus();
  }
};

const onScroll = () => {
  if (!scrollTop()) {
    $('#to-top').fadeOut(300); // fade when at top
  } else {
    $('#to-top').fadeIn(300);
  }
};

//------------------------------------------------------------------------------
// Function calls when document is ready

$(document).ready(() => {
  // General init
  setupErrorDisplay();

  // Listeners
  $('#new-tweet').submit(onTweetSubmit);
  $('#to-top').click(scrollToTop(300));
  $('#compose').click(onComposeClick);

  // For scroll (does not bubble up):
  // Use addEventListener() and capture at the document level
  document.addEventListener('scroll', onScroll, true);

  refreshTweets();
});
