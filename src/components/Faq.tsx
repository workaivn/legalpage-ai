const questions = [
  {
    question: "Are the generated documents legally guaranteed?",
    answer:
      "No. LegalPage AI creates AI-generated drafts and does not provide legal advice or legal guarantees. Review every document with a qualified professional before publishing.",
  },
  {
    question: "Which documents can I generate?",
    answer:
      "The MVP generates a Privacy Policy, Terms of Service, Refund Policy, and Cookie Policy from one structured form.",
  },
  {
    question: "Where is project data stored?",
    answer:
      "There is no database in v1. Form data is sent to the server route for generation and is not saved by the app.",
  },
  {
    question: "Can I edit the result?",
    answer:
      "Yes. Copy the Markdown or download Markdown and HTML files, then edit the drafts in your site, CMS, or codebase.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="border-t border-slate-200 bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-9">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">FAQ</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Questions founders ask first
          </h2>
        </div>
        <div className="grid gap-4">
          {questions.map((item) => (
            <div key={item.question} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-semibold text-slate-950">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
