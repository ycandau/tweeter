// composer.js

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

const onInput = () => {
  const $textarea = $('#tweet-text');
  const count = 140 - $textarea.val().length;
  const $counter = $textarea.next().children('output').text(count);
  if (count < 0) return $counter.addClass('neg');
  $counter.removeClass('neg');
};

const onTweetSubmit = (event) => {
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

const scrollToTop = (maxDuration) => {
  // duration is first proportional then capped
  const duration = Math.min(maxDuration, $(document).scrollTop() / 3);
  $('html, body').animate({ scrollTop: 0 }, duration);
};

const onComposeClick = () => {
  const $newTweet = $('#new-tweet');
  if ($newTweet.is(':visible')) {
    $('#tweet-text').blur();
    $newTweet.slideUp(300);
  } else {
    scrollToTop(300);
    $newTweet.slideDown(300);
    $('#tweet-text').focus();
  }
};

const onToTopClick = () => {
  scrollToTop(300);
  const $newTweet = $('#new-tweet');
  if (!$newTweet.is(':visible')) {
    $newTweet.slideDown(300);
  }
  $('#tweet-text').focus();
};

const onScroll = () => {
  if (!$(document).scrollTop()) {
    $('#to-top').fadeOut(300);
    $('#compose').fadeIn(300);
  } else {
    $('#to-top').fadeIn(300);
    $('#compose').fadeOut(300);
  }
};

//------------------------------------------------------------------------------
// Call when document is ready

$(document).ready(() => {
  // General init
  setupErrorDisplay();

  // Listeners
  $('#tweet-text').on('input', onInput);
  $('#new-tweet').submit(onTweetSubmit);
  $('#compose').click(onComposeClick);
  $('#to-top').click(onToTopClick);
  $(document).scroll(onScroll);
});
