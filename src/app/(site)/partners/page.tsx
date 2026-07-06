import { Container } from "@/components/ui";
import Image from "next/image";
import { getDict } from "@/lib/i18n/server";

export default function PartnersPage() {
  const dict = getDict();
  const t = dict.partners;

  return (
    <main className="min-h-screen bg-sand/20 pb-24 pt-32 md:pb-32 md:pt-40">
      <Container>
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center md:mb-24">
            <h1 className="font-display text-4xl leading-tight text-oak md:text-6xl">
              {t.title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-oak/70">
              {t.intro}
            </p>
          </div>
          
          <div className="flex flex-col gap-8">
            <div className="flex flex-col items-center gap-6 rounded-[2.25rem] border border-oak/10 bg-ivory p-8 shadow-sm md:flex-row md:items-start md:gap-12 md:p-12">
              <div className="flex w-full flex-col items-center justify-center md:w-1/3 md:items-start">
                <div className="relative h-24 w-48">
                  {/* User provided logo in chat, assuming they place it here */}
                  <Image
                    src="/images/quickclean.png"
                    alt="QuickClean"
                    fill
                    className="object-contain object-center md:object-left"
                  />
                </div>
              </div>
              <div className="space-y-4 text-center md:w-2/3 md:pt-4 md:text-left">
                <h3 className="font-display text-2xl text-oak">QuickClean</h3>
                <p className="text-lg leading-relaxed text-oak/80">
                  {t.quickCleanDescription}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-6 rounded-[2.25rem] border border-oak/10 bg-ivory p-8 shadow-sm md:flex-row md:items-start md:gap-12 md:p-12">
              <div className="flex w-full flex-col items-center justify-center md:w-1/3 md:items-start">
                <div className="relative h-24 w-48">
                  {/* User provided logo in chat, assuming they place it here */}
                  <Image
                    src="/images/atlantic.svg"
                    alt="Atlantic"
                    fill
                    className="object-contain object-center md:object-left"
                  />
                </div>
              </div>
              <div className="space-y-4 text-center md:w-2/3 md:pt-4 md:text-left">
                <h3 className="font-display text-2xl text-oak">Atlantic</h3>
                <p className="text-lg leading-relaxed text-oak/80">
                  {t.atlanticDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
