import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';

export default function SSOCallback() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-[#020617]">
            <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            <AuthenticateWithRedirectCallback />
        </div>
    );
}
