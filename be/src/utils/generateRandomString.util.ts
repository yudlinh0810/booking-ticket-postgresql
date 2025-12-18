import crypto from "crypto";

/**
 * Genarate a cryptographically secure string of random characters
 * @params length : The desired length of the string
 * @params chars : The characters allowed to be used (default is uppercase, lowercase, digits)
 * @returns A random string
 */

export const generateRandomString = (length: number = 16, chars?: string): string => {
  const defaultChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  const characterSet = chars || defaultChars;
  const characterSetLength = characterSet.length;

  if (characterSetLength === 0) {
    throw new Error("The character set must not be empty");
  }

  const randomBytes = crypto.randomBytes(length);
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = randomBytes[i] % characterSetLength;

    result += characterSet.charAt(randomIndex);
  }

  return result;
};
