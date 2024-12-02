"use client";

import { login } from "@/lib/actions";
import React, { useActionState } from "react";

export default function Login() {
  const [state, loginAction] = useActionState(login, undefined);

  return (
    <form className="max-w-[400px] mx-auto" action={loginAction}>
      <div className="flex flex-col">
        <label htmlFor="username">Username</label>
        <input className="bg-gray-100 border" type="text" name="username" id="username" />
        {state?.errors?.username && (
          <span className="text-red-500">{state.errors.username[0]}</span>
        )}
      </div>
      <div className="flex flex-col">
        <label htmlFor="password">Password</label>
        <input className="bg-gray-100 border" type="password" name="password" id="password" />
        {state?.errors?.password && (
          <span className="text-red-500">{state.errors.password[0]}</span>
        )}
      </div>
      <button className="mt-2 bg-blue-500" type="submit">
        Login
      </button>
    </form>
  );
}
