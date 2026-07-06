import { Container } from "@/components/ui";
import { getDict } from "@/lib/i18n/server";

export default function TermsPage() {
  const dict = getDict();
  const t = dict.terms;

  return (
    <main className="min-h-screen bg-sand/20 pb-24 pt-32 md:pb-32 md:pt-40">
      <Container>
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center md:mb-24">
            <h1 className="font-display text-4xl leading-tight text-oak md:text-6xl">
              {t.pageTitle}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-oak/70">
              {t.intro}
            </p>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6 rounded-[2.25rem] border border-oak/10 bg-ivory p-8 shadow-sm md:flex-row md:gap-12 md:p-12">
              <div className="md:w-1/3">
                <span className="font-display text-2xl text-ochre">01</span>
                <h3 className="mt-2 font-display text-2xl text-oak">{t.estimatesTitle}</h3>
              </div>
              <div className="space-y-4 md:w-2/3 md:pt-10">
                <p className="text-lg leading-relaxed text-oak/80">
                  {t.estimatesBodyA}
                </p>
                <p className="text-lg leading-relaxed text-oak/80">
                  {t.estimatesBodyB}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6 rounded-[2.25rem] border border-oak/10 bg-ivory p-8 shadow-sm md:flex-row md:gap-12 md:p-12">
              <div className="md:w-1/3">
                <span className="font-display text-2xl text-ochre">02</span>
                <h3 className="mt-2 font-display text-2xl text-oak">{t.executionTitle}</h3>
              </div>
              <div className="space-y-4 md:w-2/3 md:pt-10">
                <p className="text-lg leading-relaxed text-oak/80">
                  {t.executionBodyA}
                </p>
                <p className="text-lg leading-relaxed text-oak/80">
                  {t.executionBodyB}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6 rounded-[2.25rem] border border-oak/10 bg-ivory p-8 shadow-sm md:flex-row md:gap-12 md:p-12">
              <div className="md:w-1/3">
                <span className="font-display text-2xl text-ochre">03</span>
                <h3 className="mt-2 font-display text-2xl text-oak">{t.cancellationsTitle}</h3>
              </div>
              <div className="space-y-4 md:w-2/3 md:pt-10">
                <p className="text-lg leading-relaxed text-oak/80">
                  {t.cancellationsBody}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
