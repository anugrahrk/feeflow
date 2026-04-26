import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

export const metadata: Metadata = {
    title: "FeeFlow - Fees, without friction.",
    description: "One platform to pay every fee—securely, automatically, on time. Pay tuition centers, institutes, organizations, and authorities—unified.",
    keywords: ["fee payment", "automated payments", "tuition fees", "institutional payments", "recurring payments"],
    authors: [{ name: "FeeFlow" }],
    openGraph: {
        title: "FeeFlow - Fees, without friction.",
        description: "One platform to pay every fee—securely, automatically, on time.",
        type: "website",
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={`${inter.variable} antialiased`}>
                {children}
            </body>
        </html>
    );
}
