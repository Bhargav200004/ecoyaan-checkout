import React from "react";
import Head from "next/head";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = "Ecoyaan – Sustainable Shopping",
  description = "Shop sustainable eco-friendly products",
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
          {children}
        </main>
        <footer className="border-t bg-white py-6">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© 2024 Ecoyaan · Sustainable choices for a better planet 🌿</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Layout;
