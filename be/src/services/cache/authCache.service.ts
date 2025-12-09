import { BaseCacheService } from "./baseCache.service";

export class AuthCacheService extends BaseCacheService {
  private OTP_TTL = 60 * 5;

  private getSessionKey(userId: number): string {
    return `session:${userId}`;
  }

  private getRefreshKey(userId: number): string {
    return `refresh:${userId}`;
  }

  public async cacheSession(userId: number, accessToken: string, accessExp: number): Promise<void> {
    try {
      await this.setKey(this.getSessionKey(userId), accessToken, accessExp);
    } catch (error) {
      throw error;
    }
  }

  public async cacheRefreshToken(
    userId: number,
    refreshToken: string,
    refreshExp: number
  ): Promise<void> {
    try {
      await this.setKey(this.getSessionKey(userId), refreshToken, refreshExp);
    } catch (error) {
      throw error;
    }
  }

  // trường hợp login/register
  public async cacheTokens(
    userId: number,
    accessToken: string,
    refreshToken: string,
    accessExp: number,
    refreshExp: number
  ): Promise<void> {
    try {
      await this.setKey(this.getSessionKey(userId), accessToken, accessExp);
      await this.setKey(this.getRefreshKey(userId), refreshToken, refreshExp);
    } catch (error) {
      throw error;
    }
  }

  public async deleteToken(userId: number): Promise<void> {
    try {
      const sessionKey = `session_${userId}`,
        refreshKey = `refresh_${userId}`;
      await Promise.all([this.deleteKey(sessionKey), this.deleteKey(refreshKey)]);
    } catch (error) {
      console.error("err delete token", error);
      throw error;
    }
  }

  async setOtp(emailOrPhone: string, otpCode: string): Promise<void> {
    await this.setKey(`auth:otp:${emailOrPhone}`, otpCode, this.OTP_TTL);
  }

  async verifyOtp(emailOrPhone: string, inputOtp: string): Promise<boolean> {
    const storedOtp = await this.getKey(`auth:otp:${emailOrPhone}`);
    if (!storedOtp) return false;

    // So sánh OTP, nếu đúng thì return true
    return storedOtp === inputOtp;
  }

  // Xóa ngay sau khi verify thành công để không dùng lại được
  async deleteOtp(emailOrPhone: string): Promise<void> {
    await this.deleteKey(`auth:otp:${emailOrPhone}`);
  }
}
