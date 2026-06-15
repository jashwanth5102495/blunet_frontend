import { LogoCloud } from "./ui/logo-cloud-2";

const TechnologiesCarousel = () => {
  return (
    <section className="bg-black py-24 relative overflow-hidden border-t border-gray-800">
      <div className="min-h-[50vh] w-full flex flex-col items-center justify-center px-4">
        <div className="relative mx-auto grid max-w-5xl w-full">
          <h2 className="mb-16 text-center font-semibold text-gray-400 tracking-tight text-xl md:text-3xl">
            Technologies we <span className="font-bold text-white">build</span> with.
          </h2>

          <LogoCloud />
        </div>
      </div>
    </section>
  );
};

export default TechnologiesCarousel;
