import { useState } from "react";
import ThemeCarousel from "@/components/themes/theme1";

export default function PortfolioPage() {
  const [selectedTheme, setSelectedTheme] = useState("theme1");

  return (
    <div className="h-screen w-full flex flex-col items-center">
      <h1 className="text-2xl mb-4">Select a Theme</h1>
      <ThemeCarousel setSelectedTheme={setSelectedTheme} />
      <p className="mt-4">Selected Theme: {selectedTheme}</p>
    </div>
  );
}
