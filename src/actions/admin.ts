"use server";

import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export const admin = async () => {
  try {
    const role = await currentRole();

    if (role === UserRole.ADMIN) {
      return { success: "Allowed Server Action!" };
    }

    return { error: "Forbidden Server Action!" };
  } catch (error) {
    console.error(error);
    return { error: "something went wrong" };
  }
};
