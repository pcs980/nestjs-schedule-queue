import { CacheModule, Module } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { TweetsController } from './tweets.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Tweet } from './entities/tweet.entity';
import { TweetCounterService } from './tweet-counter/tweet-counter.service';

@Module({
  imports: [SequelizeModule.forFeature([Tweet]), CacheModule.register()],
  controllers: [TweetsController],
  providers: [TweetsService, TweetCounterService],
})
export class TweetsModule {}
