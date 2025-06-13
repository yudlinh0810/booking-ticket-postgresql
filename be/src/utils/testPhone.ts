const testPhone = (phone: string): boolean => {
  const phonePattern = /^\d{10,15}$/;
  return typeof phone === "string" && phonePattern.test(phone);
};

export default testPhone;
