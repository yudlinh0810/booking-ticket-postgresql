import { redisClient, RedisClient } from "./../config/redis";
/**
 * @param {object} user - Đối tượng người dùng chứa thông tin người dùng.
 * @param {string} access_token - Mã thông báo truy cập.
 * @param {string} refresh_token - Mã thông báo làm mới.
 * @param {number} accessTokenExpiresInSeconds - Thời gian hết hạn của mã thông báo truy cập (dưới dạng timestamp).
 * @param {number} refreshTokenExpiresInSeconds - Thời gian hết hạn của mã thông báo làm mới (dưới dạng timestamp).
 * @param {object} redisClient - Đối tượng khách hàng Redis để lưu trữ mã thông báo.
 * @returns {Promise<void>} - Trả về một Promise không có giá trị.
 */

export const setTokensInRedis = async (
  user: { email: string; role: string },
  access_token: string,
  refresh_token: string,
  accessTokenExpiresInSeconds: number,
  refreshTokenExpiresInSeconds: number,
  redisClient: RedisClient
): Promise<void> => {
  const sessionKey = `session_${user.email}`;
  const refreshKey = `refresh_${user.email}`;
  await redisClient.set(sessionKey, access_token, { EX: accessTokenExpiresInSeconds });
  await redisClient.set(refreshKey, refresh_token, { EX: refreshTokenExpiresInSeconds });
  return;
};
