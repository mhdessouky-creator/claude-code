import snoowrap from 'snoowrap';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Reddit MCP Server
 */
class RedditMCP {
  constructor() {
    this.client = null;
  }

  /**
   * Initialize Reddit API
   */
  async initialize() {
    try {
      this.client = new snoowrap({
        userAgent: process.env.REDDIT_USER_AGENT || 'MCP-Reddit-Bot/1.0',
        clientId: process.env.REDDIT_CLIENT_ID,
        clientSecret: process.env.REDDIT_CLIENT_SECRET,
        username: process.env.REDDIT_USERNAME,
        password: process.env.REDDIT_PASSWORD,
      });

      return { success: true, message: 'Reddit initialized successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Submit a post
   */
  async submitPost({ subreddit, title, text, url, kind = 'self' }) {
    try {
      const submission = await this.client.getSubreddit(subreddit).submitSelfpost({
        title,
        text: kind === 'self' ? text : undefined,
        url: kind === 'link' ? url : undefined,
      });

      return { success: true, postId: submission.id, url: submission.url };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Submit a comment
   */
  async submitComment({ postId, text }) {
    try {
      const comment = await this.client.getSubmission(postId).reply(text);
      return { success: true, commentId: comment.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get hot posts
   */
  async getHotPosts({ subreddit, limit = 10 }) {
    try {
      const posts = await this.client.getSubreddit(subreddit).getHot({ limit });
      const simplified = posts.map(p => ({
        id: p.id,
        title: p.title,
        author: p.author.name,
        score: p.score,
        numComments: p.num_comments,
        url: p.url,
        selftext: p.selftext,
      }));

      return { success: true, posts: simplified };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get new posts
   */
  async getNewPosts({ subreddit, limit = 10 }) {
    try {
      const posts = await this.client.getSubreddit(subreddit).getNew({ limit });
      const simplified = posts.map(p => ({
        id: p.id,
        title: p.title,
        author: p.author.name,
        score: p.score,
        numComments: p.num_comments,
        url: p.url,
        selftext: p.selftext,
      }));

      return { success: true, posts: simplified };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get top posts
   */
  async getTopPosts({ subreddit, time = 'day', limit = 10 }) {
    try {
      const posts = await this.client.getSubreddit(subreddit).getTop({ time, limit });
      const simplified = posts.map(p => ({
        id: p.id,
        title: p.title,
        author: p.author.name,
        score: p.score,
        numComments: p.num_comments,
        url: p.url,
        selftext: p.selftext,
      }));

      return { success: true, posts: simplified };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Search posts
   */
  async searchPosts({ query, subreddit, limit = 10 }) {
    try {
      const results = subreddit
        ? await this.client.getSubreddit(subreddit).search({ query, limit })
        : await this.client.search({ query, limit });

      const simplified = results.map(p => ({
        id: p.id,
        title: p.title,
        author: p.author.name,
        subreddit: p.subreddit.display_name,
        score: p.score,
        numComments: p.num_comments,
        url: p.url,
      }));

      return { success: true, posts: simplified };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get post details
   */
  async getPost({ postId }) {
    try {
      const post = await this.client.getSubmission(postId).fetch();
      return {
        success: true,
        post: {
          id: post.id,
          title: post.title,
          author: post.author.name,
          subreddit: post.subreddit.display_name,
          score: post.score,
          numComments: post.num_comments,
          url: post.url,
          selftext: post.selftext,
          created: new Date(post.created_utc * 1000).toISOString(),
        },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get comments for a post
   */
  async getComments({ postId, limit = 10 }) {
    try {
      const submission = await this.client.getSubmission(postId);
      const comments = await submission.comments.fetchMore({ amount: limit });

      const simplified = comments.slice(0, limit).map(c => ({
        id: c.id,
        author: c.author.name,
        body: c.body,
        score: c.score,
        created: new Date(c.created_utc * 1000).toISOString(),
      }));

      return { success: true, comments: simplified };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Upvote a post
   */
  async upvote({ postId }) {
    try {
      await this.client.getSubmission(postId).upvote();
      return { success: true, message: 'Post upvoted successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Downvote a post
   */
  async downvote({ postId }) {
    try {
      await this.client.getSubmission(postId).downvote();
      return { success: true, message: 'Post downvoted successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user info
   */
  async getUserInfo({ username }) {
    try {
      const user = await this.client.getUser(username).fetch();
      return {
        success: true,
        user: {
          name: user.name,
          linkKarma: user.link_karma,
          commentKarma: user.comment_karma,
          created: new Date(user.created_utc * 1000).toISOString(),
        },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get subreddit info
   */
  async getSubredditInfo({ subreddit }) {
    try {
      const sub = await this.client.getSubreddit(subreddit).fetch();
      return {
        success: true,
        subreddit: {
          name: sub.display_name,
          title: sub.title,
          description: sub.public_description,
          subscribers: sub.subscribers,
          created: new Date(sub.created_utc * 1000).toISOString(),
        },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get available tools
   */
  getTools() {
    return [
      'submitPost',
      'submitComment',
      'getHotPosts',
      'getNewPosts',
      'getTopPosts',
      'searchPosts',
      'getPost',
      'getComments',
      'upvote',
      'downvote',
      'getUserInfo',
      'getSubredditInfo',
    ];
  }
}

export default RedditMCP;
