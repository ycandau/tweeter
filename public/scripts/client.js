//------------------------------------------------------------------------------
// client.js
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Constants

const HOST = 'localhost';
const PORT = 8080;
const URL = `http://${HOST}:${PORT}/tweets`;

//------------------------------------------------------------------------------
// Function calls

$(() => refreshTweets());

//------------------------------------------------------------------------------
// DOM: Create an array of icons from string arguments

function createIcons(...icons) {
  return icons.reduce((array, icon) => {
    array.push($('<i>').addClass(`fas fa-${icon}`));
    return array;
  }, []);
}

//------------------------------------------------------------------------------
// DOM: Create an article containing a tweet

function createTweetElement(tweet) {
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
}

//------------------------------------------------------------------------------
// Ajax: Load tweets with a get request

function loadTweets() {
  return $.get(URL);
}

//------------------------------------------------------------------------------
// DOM: Render tweets from an array of tweet objects

function renderTweets(tweets) {
  const $container = $('#tweets-container').empty();
  [...tweets].forEach((tweet) => $container.prepend(createTweetElement(tweet)));
  // Assumes server data already sorted, otherwise use:
  // .sort((t1, t2) => t2.created_at - t1.created_at)
}

//------------------------------------------------------------------------------
// Refresh tweets: Combine load and render

function refreshTweets() {
  loadTweets()
    .then(renderTweets)
    .catch((err) => console.error(err));
}
