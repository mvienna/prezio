import { api } from "boot/axios";

export const sendVerificationCode = async (email) => {
  return await api
    .post("/email/verification-code/send", {
      email: email,
    })
    .catch((error) => {
      throw error.response.data.error;
    });
};

export const checkVerificationCode = async (email, code) => {
  return await api
    .post("/email/verification-code/check", {
      email: email,
      code: code,
    })
    .catch((error) => {
      throw error.response.data.error;
    });
};
