/**
 * @param {string} fullName
 * @returns {{firstName: string, lastName: string}}
 */
export const splitFullName = (fullName: string) => {
  const trimmedName = fullName.trim();

  const lastSpaceIndex = trimmedName.lastIndexOf(" ");

  if (lastSpaceIndex === -1) {
    return {
      firstName: trimmedName,
      lastName: "",
    };
  }

  const lastName = trimmedName.substring(lastSpaceIndex + 1).trim();

  const firstName = trimmedName.substring(0, lastSpaceIndex).trim();

  return {
    firstName: firstName,
    lastName: lastName,
  };
};
