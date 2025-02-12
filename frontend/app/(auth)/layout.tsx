import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-800 opacity-90" />
        <Image
          src="/images/auth-background.jpg"
          alt="Authentication background"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <Image
            src="/images/logo-white.png"
            alt="CrimeAlert Logo"
            width={80}
            height={80}
            className="mb-8"
          />
          <h1 className="text-4xl font-bold mb-6">Welcome to CrimeAlert</h1>
          <p className="text-xl text-center max-w-md">
            Join our community to help make your neighborhood safer. Report and
            track incidents in real-time.
          </p>
        </div>
      </div>

      {/* Right side - Auth Forms */}
      <main className="flex-1 flex flex-col justify-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
          {/* Logo for mobile view */}
          <div className="lg:hidden flex justify-center mb-8">
            <Image
              src="/images/logo.png"
              alt="CrimeAlert Logo"
              width={60}
              height={60}
            />
          </div>

          {/* Auth form content */}
          {children}

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} CrimeAlert. All rights reserved.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
