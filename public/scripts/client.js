/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function () {
  $('.tweet')
    .children('footer')
    .children()
    .first()
    .text(timeago.format(1473245023718));
});
