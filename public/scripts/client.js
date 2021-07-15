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

//------------------------------------------------------------------------------
// Call when document is ready

$(document).ready(() => {
  refreshTweets();
});
