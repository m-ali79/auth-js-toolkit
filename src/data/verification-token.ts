"use server";

import { db } from "@/lib/db";

export const getVerificationTokenbyToken = async (token: string) => {
  try {
    return await db.verificationToken.findUnique({
      where: { token },
    });
  } catch {
    null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    return await db.verificationToken.findFirst({
      where: { email },
    });
  } catch {
    null;
  }
};
