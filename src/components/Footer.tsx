import { legalDisclaimer } from "@/lib/format";

export function Footer() {
  return (
    <footer className="bg-white py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm text-slate-500 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row">
          <p className="font-semibold text-slate-800">LegalPage AI</p>
          <p>English-only AI legal page drafts for indie makers and digital businesses.</p>
        </div>
        <p>{legalDisclaimer}</p>
      </div>
    </footer>
  );
}
