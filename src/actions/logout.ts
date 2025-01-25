"use server";

import { signOut } from "@/auth";

export const logout = async () => {
  try {
    // some server stuff
    await signOut();
  } catch (error) {
    console.error(error);
    return { error: "something went wrong" };
  }
};
