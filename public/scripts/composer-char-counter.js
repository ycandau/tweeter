// composer-char-counter.js

$(document).ready(function () {
  $('#tweet-text').on('input', function () {
    const count = 140 - $(this).val().length;
    const counter = $(this).next().children('output');
    counter.text(count);
    const [add, remove] = count >= 0 ? ['pos', 'neg'] : ['neg', 'pos'];
    counter.addClass(add).removeClass(remove);
  });
});
