"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);
  console.log("Existing user", existingUser);

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  console.log("before query");
  console.log("Data to insert:", { name, email, password: hashedPassword });

  const user = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  console.log("user", user);

  const generateVerificationToken = await getVerificationTokenByEmail(email);
  await sendVerificationEmail(
    generateVerificationToken!.email,
    generateVerificationToken!.token
  );

  return { success: "Confirmation email sent!" };
};
