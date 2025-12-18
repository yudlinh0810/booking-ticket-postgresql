import { redisClient } from "@/config/redis";
import { AuthCacheService } from "./authCache.service";
import { UserCacheService } from "./userCache.service";
import { ConfigCacheService } from "./configCache.service";
import { MasterDataCacheService } from "./masterDataCache.service";
import { TripCacheService } from "./tripCache.service";
import { ReviewCacheService } from "./reviewCache.service";

const authCacheService = new AuthCacheService(redisClient);
const userCacheService = new UserCacheService(redisClient);
const configCacheService = new ConfigCacheService(redisClient);
const masterDataCacheService = new MasterDataCacheService(redisClient);
const reviewCacheService = new ReviewCacheService(redisClient);
const tripCacheService = new TripCacheService(redisClient);

export {
  authCacheService,
  userCacheService,
  configCacheService,
  masterDataCacheService,
  reviewCacheService,
  tripCacheService,
};
