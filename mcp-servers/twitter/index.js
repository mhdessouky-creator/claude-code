import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config();

/**
 * X (Twitter) MCP Server
 */
class TwitterMCP {
  constructor() {
    this.client = null;
  }

  /**
   * Initialize Twitter API
   */
  async initialize() {
    try {
      this.client = new TwitterApi({
        appKey: process.env.TWITTER_API_KEY,
        appSecret: process.env.TWITTER_API_SECRET,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessSecret: process.env.TWITTER_ACCESS_SECRET,
      });

      return { success: true, message: 'Twitter initialized successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Post a tweet
   */
  async tweet({ text, mediaIds = [] }) {
    try {
      const tweet = await this.client.v2.tweet({
        text,
        ...(mediaIds.length > 0 && { media: { media_ids: mediaIds } }),
      });

      return { success: true, tweet };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Reply to a tweet
   */
  async reply({ tweetId, text }) {
    try {
      const tweet = await this.client.v2.tweet({
        text,
        reply: { in_reply_to_tweet_id: tweetId },
      });

      return { success: true, tweet };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete a tweet
   */
  async deleteTweet({ tweetId }) {
    try {
      await this.client.v2.deleteTweet(tweetId);
      return { success: true, message: 'Tweet deleted successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Like a tweet
   */
  async likeTweet({ tweetId }) {
    try {
      const me = await this.client.v2.me();
      await this.client.v2.like(me.data.id, tweetId);
      return { success: true, message: 'Tweet liked successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Unlike a tweet
   */
  async unlikeTweet({ tweetId }) {
    try {
      const me = await this.client.v2.me();
      await this.client.v2.unlike(me.data.id, tweetId);
      return { success: true, message: 'Tweet unliked successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Retweet
   */
  async retweet({ tweetId }) {
    try {
      const me = await this.client.v2.me();
      await this.client.v2.retweet(me.data.id, tweetId);
      return { success: true, message: 'Retweeted successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Search tweets
   */
  async searchTweets({ query, maxResults = 10 }) {
    try {
      const tweets = await this.client.v2.search(query, {
        max_results: maxResults,
      });

      return { success: true, tweets: tweets.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user timeline
   */
  async getUserTimeline({ username, maxResults = 10 }) {
    try {
      const user = await this.client.v2.userByUsername(username);
      const tweets = await this.client.v2.userTimeline(user.data.id, {
        max_results: maxResults,
      });

      return { success: true, tweets: tweets.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get my timeline
   */
  async getMyTimeline({ maxResults = 10 }) {
    try {
      const me = await this.client.v2.me();
      const tweets = await this.client.v2.userTimeline(me.data.id, {
        max_results: maxResults,
      });

      return { success: true, tweets: tweets.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Follow a user
   */
  async followUser({ username }) {
    try {
      const me = await this.client.v2.me();
      const user = await this.client.v2.userByUsername(username);
      await this.client.v2.follow(me.data.id, user.data.id);

      return { success: true, message: `Now following @${username}` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Unfollow a user
   */
  async unfollowUser({ username }) {
    try {
      const me = await this.client.v2.me();
      const user = await this.client.v2.userByUsername(username);
      await this.client.v2.unfollow(me.data.id, user.data.id);

      return { success: true, message: `Unfollowed @${username}` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user info
   */
  async getUserInfo({ username }) {
    try {
      const user = await this.client.v2.userByUsername(username, {
        'user.fields': ['description', 'created_at', 'public_metrics', 'profile_image_url'],
      });

      return { success: true, user: user.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Upload media
   */
  async uploadMedia({ mediaPath }) {
    try {
      const mediaId = await this.client.v1.uploadMedia(mediaPath);
      return { success: true, mediaId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get available tools
   */
  getTools() {
    return [
      'tweet',
      'reply',
      'deleteTweet',
      'likeTweet',
      'unlikeTweet',
      'retweet',
      'searchTweets',
      'getUserTimeline',
      'getMyTimeline',
      'followUser',
      'unfollowUser',
      'getUserInfo',
      'uploadMedia',
    ];
  }
}

export default TwitterMCP;
