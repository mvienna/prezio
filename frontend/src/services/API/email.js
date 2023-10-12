import { api } from "boot/axios";

export const sendVerificationCode = async (email, isNewEmail = false) => {
  return await api
    .post("/email/verification-code/send", {
      email: email,
      isNewEmail: isNewEmail,
    })
    .catch((error) => {
      throw error.response.data.message;
    });
};

export const checkVerificationCode = async (
  email,
  code,
  generateTempToken = true
) => {
  return await api
    .post("/email/verification-code/check", {
      email: email,
      code: code,
      generateTempToken: generateTempToken,
    })
    .catch((error) => {
      throw error.response.data.message;
    });
};
