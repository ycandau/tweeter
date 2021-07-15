// composer-char-counter.js

$(document).ready(function () {
  $('#tweet-text').on('input', function () {
    const count = 140 - $(this).val().length;
    const $counter = $(this).next().children('output').text(count);
    if (count < 0) return $counter.addClass('neg');
    $counter.removeClass('neg');
  });
});
