import { SignIn } from "@clerk/clerk-react";

export default function Login() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-[#111318]">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-40" style={{
        backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }}></div>

      <div className="relative z-10 w-full max-w-md p-4">
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "w-full shadow-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a2230]",
              headerTitle: "text-[#111318] dark:text-white",
              headerSubtitle: "text-slate-600 dark:text-slate-400",
              formButtonPrimary: "bg-primary hover:bg-blue-600 text-sm normal-case",
              socialButtonsBlockButton: "border-slate-200 dark:border-slate-700 text-[#111318] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800",
              formFieldLabel: "text-[#111318] dark:text-white",
              formFieldInput: "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[#111318] dark:text-white",
              footerActionLink: "text-primary hover:text-blue-600"
            }
          }}
          signUpUrl="/signup"
          forceRedirectUrl="/"
        />
      </div>
    </div>
  );
}