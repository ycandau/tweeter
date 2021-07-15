//------------------------------------------------------------------------------
// listeners.js
//------------------------------------------------------------------------------

// Immediately invoked function expression to avoid contaminating global scope

(($) => {
  //----------------------------------------------------------------------------
  // Constants

  const MAX_LENGTH = 3; //140;

  //----------------------------------------------------------------------------
  // Function calls

  setupErrorDisplay();

  // Set up listeners
  $('#tweet-text').on('input', onInput);
  $('#new-tweet').on('submit', onTweetSubmit);
  $('#compose').on('click', onComposeClick);
  $('#to-top').on('click', onToTopClick);
  $(document).on('scroll', onScroll);

  //----------------------------------------------------------------------------
  // Helper: Scroll to top

  const scrollToTop = (maxDuration) => {
    // Duration is first proportional then capped
    const duration = Math.min(maxDuration, $(document).scrollTop() / 3);
    $('html, body').animate({ scrollTop: 0 }, duration);
  };

  //----------------------------------------------------------------------------
  // Init: Set up the div used for error display

  function setupErrorDisplay() {
    const exclamation = '<i class="fas fa-exclamation"></i>';
    $('#error')
      .css({ display: 'flex' }) // override initial { display: none }
      .append(`${exclamation}<span></span>${exclamation}`)
      .hide(0);
  }

  //----------------------------------------------------------------------------
  // Helper: Display error

  function displayError(msg) {
    const $error = $('#error');
    $error.slideUp(0).slideDown(200);
    $error.next().next().focus();
    $error.children('span').text(msg);
  }

  //----------------------------------------------------------------------------
  // Callback: Input events from textarea
  // Update counter and negative class

  function onInput() {
    const count = MAX_LENGTH - $(this).val().length;
    const $counter = $(this).next().children('output').text(count);
    if (count < 0) return $counter.addClass('invalid');
    $counter.removeClass('invalid');
  }

  //----------------------------------------------------------------------------
  // Callback: Submit events from form
  // Check for validity, then post if valid

  function onTweetSubmit(event) {
    event.preventDefault();

    const $textarea = $(this).children('textarea');
    const text = $textarea.val();

    const errorMsg = !text
      ? 'Empty tweet: You gotta say something.'
      : text.length > MAX_LENGTH
      ? `Tweet too long: Keep it under ${MAX_LENGTH} characters.`
      : '';

    if (errorMsg) {
      displayError(errorMsg);
      return;
    }

    // Happy
    $('#error').slideUp(200);
    $.post(URL, $(this).serialize()).then(refreshTweets); // async
    $textarea.val(''); // sync
    $(this).children('footer').children('output').text(MAX_LENGTH);
  }

  //----------------------------------------------------------------------------
  // Callback: Click events from compose button
  // Toggle [blur/focus] and [slideUp/slideDown], scroll up if necessary

  function onComposeClick() {
    const $newTweet = $('#new-tweet');
    if ($newTweet.is(':visible')) {
      $('#tweet-text').blur();
      $newTweet.slideUp(300);
    } else {
      scrollToTop(300);
      $newTweet.slideDown(300);
      $('#tweet-text').focus();
    }
  }

  //----------------------------------------------------------------------------
  // Callback: Click events from scroll to top button
  // Scroll, slidedown if necessary, focus

  function onToTopClick() {
    scrollToTop(300);
    const $newTweet = $('#new-tweet');
    if (!$newTweet.is(':visible')) {
      $newTweet.slideDown(300);
    }
    $('#tweet-text').focus();
  }

  //----------------------------------------------------------------------------
  // Callback: Click events from scrolling
  // Toggle between two navigation buttons

  function onScroll() {
    if (!$(document).scrollTop()) {
      $('#to-top').fadeOut(300);
      $('#compose').fadeIn(300);
    } else {
      $('#to-top').fadeIn(300);
      $('#compose').fadeOut(300);
    }
  }
})(jQuery);
