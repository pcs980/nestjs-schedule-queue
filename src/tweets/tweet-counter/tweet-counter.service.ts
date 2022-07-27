import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { Cache } from 'cache-manager';
import { Tweet } from '../entities/tweet.entity';

@Injectable()
export class TweetCounterService {
  private LIMIT = 10;

  constructor(
    @InjectModel(Tweet)
    private tweetModel: typeof Tweet,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  @Interval(5000)
  async countTweets(): Promise<Tweet[]> {
    console.log('looking for tweets');
    const cachedOffset = await this.cacheManager.get<number>('tweet-offset');
    const offset = cachedOffset === undefined ? 0 : cachedOffset;
    console.log('offset', offset);

    const tweets = await this.tweetModel.findAll({
      offset,
      limit: this.LIMIT,
    });

    console.log('tweets found', tweets.length);
    if (tweets.length === this.LIMIT) {
      this.cacheManager.set('tweet-offset', offset + this.LIMIT, {
        ttl: 1 * 60 * 10,
      });
      console.log('10 more tweets found');
    }
    return tweets;
  }
}
