"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name } = validatedFields.data;

  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return { error: "Email already in use!" };
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    try {
      const verificationToken = await generateVerificationToken(email);
      if (!verificationToken) {
        return { error: "Failed to generate verification token" };
      }

      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
      );

      return { success: "Confirmation email sent!" };
    } catch (emailError) {
      console.error("Email verification error:", emailError);

      return {
        success:
          "Account created but email verification failed. please continue by going to /signin route",
      };
    }
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Something went wrong. please try again" };
  }
};
