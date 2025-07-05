'use client';

import { AtSymbolIcon, ExclamationCircleIcon, KeyIcon } from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { useActionState } from "react";
import {authenticate } from "@/lib/actions";
import { Button } from "@/app/ui-components/button";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const callbackUrl = useSearchParams().get('callbackUrl') || "/dashboard";
  // new URL(window.location.href);
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined); // Added state management

  return (
    <form className="space-y-3" action={formAction} >
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className="text-2xl mb-3 text-gray-900">
          Please sign-in to your account to continue.
        </h1>
        <div className="w-full">
          <div>
            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900"
            htmlFor="email">
              Email address
            </label>
            <div className="relative">
              <input type="email" id="email" name="email" required
              className="peer block w-full rounded-md border border-gray-200
              py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500" />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2
              -translate-y-1/2 h-[18px] w-[18px] text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900"
            htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input type="password" id="password" name="password" required
              className="peer block w-full rounded-md border border-gray-200
              py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              minLength={6} />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2
              -translate-y-1/2 h-[18px] w-[18px] text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <input type="hidden" name="redirectTo" value={callbackUrl} />
        <Button className="mt-4 w-full" aria-disabled={isPending}>
          Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
        {/* <button type="submit" aria-disabled={false} className="mt-4 w-full flex
        h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium
        text-white transition-colors hover:bg-blue-400 focus-visible:outline
        focus-visible:outline-2 focus-visible:outline-offset-2
        focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed
        aria-disabled:opacity-50" >
          Sign-in
        </button> */}
      </div>
    </form>
  );
}
