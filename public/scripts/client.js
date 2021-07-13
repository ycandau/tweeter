// client.js

const createTweetElement = (tweet) => {
  return $(`
    <article class="tweet">
      <header>
        <img src="${tweet.user.avatars}" />
        <div>${tweet.user.name}</div>
        <div>${tweet.user.handle}</div>
      </header>
      <div>${tweet.content.text}</div>
      <footer>
        <div>${timeago.format(tweet.created_at)}</div>
        <div>
          <i class="fas fa-flag"></i>
          <i class="fas fa-retweet"></i>
          <i class="fas fa-heart"></i>
        </div>
      </footer>
    </article>`);
};

const renderTweets = (tweets) => {
  $container = $('#tweets-container');
  tweets.forEach((tweet) => $container.append(createTweetElement(tweet)));
};

//------------------------------------------------------------------------------
// Testing

const aTweet = {
  user: {
    name: 'Newton',
    avatars: 'https://i.imgur.com/73hZDYK.png',
    handle: '@SirIsaac',
  },
  content: {
    text: 'If I have seen further it is by standing on the shoulders of giants',
  },
  created_at: 1461116232227,
};

$(document).ready(() => {
  renderTweets([aTweet, aTweet, aTweet]);
});
