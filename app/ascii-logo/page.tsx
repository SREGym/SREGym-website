export default function Page() {
  const fs = require("fs");
  const path = require("path");

  const logoPath = path.join(process.cwd(), "app", "assets", "ascii-logo.txt");
  const asciiLogo = fs.readFileSync(logoPath, "utf8");

  return (
    <div className="mx-auto p-0">
      <div className="flex h-[630px] w-[1200px] items-center justify-center bg-[#0a0a0a]">
        <pre className="font-mono text-2xl text-green-500">{asciiLogo}</pre>
      </div>
    </div>
  );
}
