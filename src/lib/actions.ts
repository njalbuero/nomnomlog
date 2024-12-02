"use server";

import { z } from "zod";
import { sql } from "@vercel/postgres";
import bcrypt from "bcrypt";

const UserSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(50, "Password must be at most 50 characters long"),
  email: z.string().email("Invalid email format"),
});

const LoginSchema = UserSchema.omit({
  email: true,
});

const RegisterSchema = UserSchema.extend({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(50, "Password must be at most 50 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one digit")
    .regex(/[\W_]/, "Password must contain at least one special character"),
});

export async function login(prevState: unknown, formData: FormData) {
  "use server";

  const rawFormData = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  const validatedFields = LoginSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid form data",
    };
  }

  try {
    const { username, password } = validatedFields.data;
    const result = await sql`SELECT * FROM users WHERE username = ${username}`;
    const user = result.rows[0];

    if (!user) {
      return {
        errors: { username: ["Invalid username or password"] },
        message: "Invalid username or password",
      };
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    console.log(user, passwordMatch);
  } catch (error) {
    console.error(error);
  }
}
