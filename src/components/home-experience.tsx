import Image from "next/image";
import { Container } from "@/components/ui";

const chapters = [
  { number: "01", eyebrow: "Arrival", title: "Your day keeps moving.", copy: "We arrive prepared, protect the surrounding landscape, and work around the rhythm of your property." },
  { number: "02", eyebrow: "The ritual", title: "Every surface comes back to life.", copy: "Material-aware pressure, considered treatments, and eyes trained to see where buildup likes to hide." },
  { number: "03", eyebrow: "The return", title: "And then, the exhale.", copy: "The stone looks brighter. The entrance feels cared for. Your home makes the right first impression again." },
];

export function ExperienceSequence() {
  return (
    <section className="bg-ivory py-24 md:py-36" aria-labelledby="beaumont-way-title">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-cinnamon">The Beaumont way</p>
            <h2 id="beaumont-way-title" className="mt-6 max-w-xl text-balance font-display text-[clamp(3.2rem,6vw,6rem)] leading-[0.9] text-oak">
              Considered care,
              <span className="block italic text-ochre">without the theatre.</span>
            </h2>
          </div>
          <p className="max-w-xl text-lg font-medium leading-relaxed text-soil/75 lg:justify-self-end">
            A clear arrival, careful work, and a property left ready to enjoy. No complicated choreography and no scrolling tricks—just the standard you expected in the first place.
          </p>
        </div>

        <div className="mt-16 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative min-h-[28rem] overflow-hidden rounded-[2rem] bg-oak md:min-h-[38rem] md:rounded-[3rem]">
            <Image src="/images/pressure-washed-patio-placeholder.png" alt="Freshly restored stone patio and pool surround" fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-soil/55 via-transparent to-transparent" />
            <p className="absolute bottom-8 left-8 max-w-xs font-display text-3xl leading-tight text-ivory md:bottom-10 md:left-10 md:text-4xl">Care you notice. Service you barely have to.</p>
          </div>

          <ol className="divide-y divide-oak/15 border-y border-oak/15">
            {chapters.map((chapter) => (
              <li key={chapter.number} className="grid gap-5 py-8 sm:grid-cols-[4.5rem_1fr] md:py-10">
                <div>
                  <span className="font-display text-2xl text-ochre">{chapter.number}</span>
                  <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-soil/45">{chapter.eyebrow}</p>
                </div>
                <div>
                  <h3 className="font-display text-3xl leading-tight text-oak md:text-4xl">{chapter.title}</h3>
                  <p className="mt-3 max-w-md text-sm font-medium leading-relaxed text-soil/70 md:text-base">{chapter.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
