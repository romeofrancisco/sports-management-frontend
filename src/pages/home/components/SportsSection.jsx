import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const sports = [
  "Basketball",
  "Volleyball",
  "Swimming",
  "Taekwondo",
  "Table Tennis",
  "Badminton",
  "Football",
  "Chess",
];

const sportsImages = [
  "https://res.cloudinary.com/dzebi1atl/image/upload/v1764843028/assets/591465304_1404743477833891_1926459002178898204_n_v66ddv.jpg",
  "https://res.cloudinary.com/dzebi1atl/image/upload/v1764843028/assets/589789069_1845757402996242_4047753683090640923_n_i1cf76.jpg",
  "https://res.cloudinary.com/dzebi1atl/image/upload/v1764843028/assets/591239270_810954241933371_571631130098765216_n_nsl1xh.jpg",
];

const SportsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const intervalRef = useRef(null);

  // Preload all images
  useEffect(() => {
    const imagePromises = sportsImages.map((src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = resolve;
      });
    });

    Promise.all(imagePromises).then(() => setImagesLoaded(true));
  }, []);

  // Auto-advance carousel only after images are loaded
  useEffect(() => {
    if (!imagesLoaded) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sportsImages.length);
    }, 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [imagesLoaded]);

  const goToPrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + sportsImages.length) % sportsImages.length
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % sportsImages.length);
  };

  return (
    <section className="py-16 lg:py-24 bg-muted/30" id="sports">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
              Our Sports
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-6">
              <span className="text-primary">Varsity</span> Sports Programs
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              UPHSD Molino Campus athletes represent the university in various
              intercollegiate competitions, showcasing excellence in sports
              while upholding the values of discipline, teamwork, and
              sportsmanship.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Our sports management system supports all varsity programs,
              providing tools for coaches and athletes to track progress, manage
              schedules, and achieve peak performance.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              {sports.map((sport, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors cursor-default"
                >
                  {sport}
                </span>
              ))}
            </div>
          </div>

          {/* Carousel with stacked cards effect */}
          <div className="relative h-[350px] lg:h-[400px] dark:brightness-60">
            {/* Main carousel */}
            <div 
              className="relative h-full rounded-2xl overflow-hidden"
              style={{ backgroundImage: `url(${sportsImages[0]})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              {/* Images */}
              <div className="relative h-full w-full">
                {sportsImages.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Sports ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                      index === currentIndex ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>

              {/* Navigation arrows */}
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors backdrop-blur-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors backdrop-blur-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dots indicator */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                {sportsImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "bg-white w-6"
                        : "bg-white/50 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SportsSection;
