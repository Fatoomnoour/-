import React, { useState } from "react";
import {
  Mail,
  Lock,
  User as UserIcon,
  Sparkles,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import { User } from "../types";

interface AuthPageProps {
  onAuthSuccess: (user: User) => void;
  onGoogleLoginSimulate: (email: string, name: string) => Promise<void>;
}

interface LocalAccount {
  user: User;
  passwordHash: string;
}

const LOCAL_ACCOUNTS_KEY = "athar_ayah_local_accounts";
const CURRENT_USER_KEY = "athar_ayah_current_user";

export default function AuthPage({
  onAuthSuccess,
  onGoogleLoginSimulate,
}: AuthPageProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  // دخول تجريبي سريع
  const [googleEmail, setGoogleEmail] = useState(
    "kidscodinghub1512@gmail.com",
  );
  const [googleName, setGoogleName] = useState("أنس بن مالك");

  const isGitHubPages =
    typeof window !== "undefined" &&
    window.location.hostname.endsWith("github.io");

  const normalizeEmail = (value: string): string =>
    value.trim().toLowerCase();

  const createLocalUser = (
    userEmail: string,
    userName: string,
  ): User => {
    const normalizedEmail = normalizeEmail(userEmail);
    const cleanName =
      userName.trim() || normalizedEmail.split("@")[0] || "مستخدم أثر آية";

    return {
      id: `local-${normalizedEmail}`,
      name: cleanName,
      displayName: cleanName,
      email: normalizedEmail,
      photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        cleanName,
      )}&backgroundColor=059669`,
    } as User;
  };

  const hashLocalPassword = async (value: string): Promise<string> => {
    if (!window.crypto?.subtle) {
      throw new Error("المتصفح لا يدعم تسجيل الدخول المحلي الآمن");
    }

    const encodedValue = new TextEncoder().encode(value);
    const digest = await window.crypto.subtle.digest(
      "SHA-256",
      encodedValue,
    );

    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  };

  const readLocalAccounts = (): Record<string, LocalAccount> => {
    try {
      const storedAccounts = localStorage.getItem(LOCAL_ACCOUNTS_KEY);

      if (!storedAccounts) {
        return {};
      }

      const parsedAccounts = JSON.parse(storedAccounts);

      if (
        typeof parsedAccounts !== "object" ||
        parsedAccounts === null ||
        Array.isArray(parsedAccounts)
      ) {
        return {};
      }

      return parsedAccounts as Record<string, LocalAccount>;
    } catch {
      localStorage.removeItem(LOCAL_ACCOUNTS_KEY);
      return {};
    }
  };

  const saveLocalAccounts = (
    accounts: Record<string, LocalAccount>,
  ): void => {
    localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
  };

  const finishAuthentication = (user: User): void => {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    onAuthSuccess(user);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setError("");

    const normalizedEmail = normalizeEmail(email);
    const cleanName = name.trim();

    if (!normalizedEmail || !password || (isRegister && !cleanName)) {
      setError("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    if (password.length < 6) {
      setError("كلمة المرور يجب ألا تقل عن 6 أحرف");
      return;
    }

    setIsLoading(true);

    try {
      /*
       * GitHub Pages لا يشغّل Backend.
       * لذلك نستخدم حسابات محلية محفوظة داخل المتصفح.
       */
      if (isGitHubPages) {
        const accounts = readLocalAccounts();
        const passwordHash = await hashLocalPassword(password);

        if (isRegister) {
          if (accounts[normalizedEmail]) {
            throw new Error(
              "هذا البريد مسجل بالفعل على هذا الجهاز",
            );
          }

          const newUser = createLocalUser(
            normalizedEmail,
            cleanName,
          );

          accounts[normalizedEmail] = {
            user: newUser,
            passwordHash,
          };

          saveLocalAccounts(accounts);
          finishAuthentication(newUser);
          return;
        }

        const existingAccount = accounts[normalizedEmail];

        if (!existingAccount) {
          throw new Error(
            "الحساب غير موجود على هذا الجهاز. أنشئي حسابًا جديدًا أولًا",
          );
        }

        if (existingAccount.passwordHash !== passwordHash) {
          throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        }

        finishAuthentication(existingAccount.user);
        return;
      }

      /*
       * الوضع الطبيعي عندما يكون Express Backend منشورًا
       * على نفس الدومين.
       */
      const endpoint = isRegister
        ? "/api/auth/register"
        : "/api/auth/login";

      const requestBody = isRegister
        ? {
            email: normalizedEmail,
            name: cleanName,
            password,
          }
        : {
            email: normalizedEmail,
            password,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          "خادم تسجيل الدخول غير متاح على هذا الرابط",
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "حدث خطأ أثناء تسجيل الدخول",
        );
      }

      if (!data?.user) {
        throw new Error("استجابة تسجيل الدخول غير مكتملة");
      }

      finishAuthentication(data.user as User);
    } catch (caughtError: unknown) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "تعذر تسجيل الدخول";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSimulate = async (): Promise<void> => {
    setError("");

    const normalizedEmail = normalizeEmail(googleEmail);
    const cleanName =
      googleName.trim() ||
      normalizedEmail.split("@")[0] ||
      "مستخدم أثر آية";

    if (!normalizedEmail) {
      setError("الرجاء إدخال البريد الإلكتروني");
      return;
    }

    setIsLoading(true);

    try {
      /*
       * على GitHub Pages يكون هذا دخولًا تجريبيًا محليًا،
       * وليس تسجيل Google حقيقيًا.
       */
      if (isGitHubPages) {
        const localUser = createLocalUser(
          normalizedEmail,
          cleanName,
        );

        finishAuthentication(localUser);
        return;
      }

      await onGoogleLoginSimulate(normalizedEmail, cleanName);
    } catch (caughtError: unknown) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "حدث خطأ أثناء تسجيل الدخول التجريبي";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchMode = (): void => {
    setIsRegister((currentValue) => !currentValue);
    setError("");
    setPassword("");
  };

  const logoPath = `${import.meta.env.BASE_URL}logo.png`;

  return (
    <div
      className="min-h-screen bg-slate-50 px-4 py-12 font-sans dark:bg-slate-950 sm:px-6 lg:px-8"
      dir="rtl"
    >
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-md flex-col justify-center">
        <header className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-white text-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {!logoFailed ? (
              <img
                src={logoPath}
                alt="شعار أثر آية"
                className="h-full w-full object-contain"
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-emerald-600 to-teal-500">
                <BookOpen
                  className="h-8 w-8"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>

          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            {isRegister
              ? "إنشاء حساب جديد"
              : "تسجيل الدخول إلى أثر آية"}
          </h1>

          <p className="mt-2 text-xs leading-6 text-slate-500 dark:text-slate-400">
            {isRegister
              ? "ابدأ رحلتك مع القرآن الكريم وتابع وردك وحفظك"
              : "عد لمتابعة تدبراتك وتلاوتك اليومية ومراجعة حفظك"}
          </p>
        </header>

        <main className="mt-8">
          <div className="space-y-6 rounded-2xl border border-slate-100 bg-white px-6 py-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {isGitHubPages && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] leading-5 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-300">
                النسخة الحالية تعمل في وضع التجربة المحلية. الحساب
                والبيانات محفوظان على هذا المتصفح فقط.
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-xl border border-rose-100 bg-rose-50 p-3.5 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-400"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form
              className="space-y-4"
              onSubmit={handleSubmit}
              noValidate
            >
              {isRegister && (
                <div>
                  <label
                    htmlFor="full-name"
                    className="mb-1.5 block text-xs font-bold text-slate-600 dark:text-slate-400"
                  >
                    الاسم الكامل
                  </label>

                  <div className="relative">
                    <UserIcon
                      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                      aria-hidden="true"
                    />

                    <input
                      id="full-name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="اكتب اسمك"
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-3 pr-10 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-bold text-slate-600 dark:text-slate-400"
                >
                  البريد الإلكتروني
                </label>

                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />

                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="your-email@example.com"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-3 pr-10 text-left text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs font-bold text-slate-600 dark:text-slate-400"
                >
                  كلمة المرور
                </label>

                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />

                  <input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    autoComplete={
                      isRegister
                        ? "new-password"
                        : "current-password"
                    }
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-3 pr-10 text-left text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    dir="ltr"
                  />
                </div>

                {isRegister && (
                  <p className="mt-1.5 text-[10px] text-slate-400">
                    استخدمي 6 أحرف على الأقل.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 dark:focus:ring-offset-slate-900"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-b-white" />
                    <span>جاري التنفيذ...</span>
                  </>
                ) : (
                  <span>
                    {isRegister
                      ? "إنشاء الحساب وبدء التجربة"
                      : "تسجيل الدخول"}
                  </span>
                )}
              </button>
            </form>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100 dark:border-slate-800" />
              </div>

              <span className="relative bg-white px-3 text-[10px] font-bold text-slate-400 dark:bg-slate-900">
                أو
              </span>
            </div>

            <section className="space-y-3.5 rounded-2xl border border-emerald-100/60 bg-emerald-50/50 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/10">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400">
                <Sparkles className="h-4 w-4" />
                <h2 className="text-xs font-black">
                  الدخول التجريبي السريع
                </h2>
              </div>

              <p className="text-[10px] leading-5 text-slate-500 dark:text-slate-400">
                هذا دخول تجريبي محلي وليس تسجيل دخول Google حقيقيًا.
              </p>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="demo-email"
                    className="mb-1 block text-[9px] font-bold text-slate-500"
                  >
                    البريد التجريبي
                  </label>

                  <input
                    id="demo-email"
                    type="email"
                    value={googleEmail}
                    onChange={(event) =>
                      setGoogleEmail(event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-left text-[11px] text-slate-700 outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label
                    htmlFor="demo-name"
                    className="mb-1 block text-[9px] font-bold text-slate-500"
                  >
                    الاسم
                  </label>

                  <input
                    id="demo-name"
                    type="text"
                    value={googleName}
                    onChange={(event) =>
                      setGoogleName(event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-[11px] text-slate-700 outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSimulate}
                disabled={isLoading}
                className="flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="#EA4335"
                    d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.47 14.97 1 12 1 7.24 1 3.2 3.74 1.24 7.74l3.84 2.98C6.01 7.25 8.79 5.04 12 5.04z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.49 12.275c0-.818-.073-1.609-.21-2.375H12v4.51h6.46c-.277 1.48-1.11 2.73-2.36 3.58l3.65 2.83c2.14-1.97 3.4-4.88 3.4-8.545z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.08 14.72a7.126 7.126 0 010-4.44L1.24 7.3a11.97 11.97 0 000 9.4l3.84-2.98z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.24 0 5.97-1.08 7.96-2.91l-3.65-2.83c-1.01.68-2.31 1.09-3.96 1.09-3.21 0-5.99-2.21-6.92-5.17L1.24 16.7C3.2 20.26 7.24 23 12 23z"
                  />
                </svg>

                <span>الدخول إلى النسخة التجريبية</span>
              </button>
            </section>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={handleSwitchMode}
                className="cursor-pointer text-xs font-bold text-emerald-600 transition hover:underline dark:text-emerald-400"
              >
                {isRegister
                  ? "لديك حساب بالفعل؟ تسجيل الدخول"
                  : "ليس لديك حساب؟ إنشاء حساب جديد"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
