import bcrypt from "bcrypt";

/**
 *  Hashing utility function
 * @module utils/hash
 * @params {string} password
 * @params {number} saltRounds
 * @returns {Promise<string>}
 */

export const hashPassword = async (password: string, saltRounds = 10): Promise<string> => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};
