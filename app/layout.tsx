import "./globals.css";
import ClientWrapper from "./client-wrapper";

export const metadata = {
  title: "Flashcard Frenzy",
  description: "Multiplayer Flashcard Game with Supabase + MongoDB",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
