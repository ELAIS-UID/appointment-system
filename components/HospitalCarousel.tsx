import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { ChevronLeft, ChevronRight, MapPin, CheckCircle2 } from 'lucide-react';
import { Hospital } from '../types';

interface HospitalCarouselProps {
  hospitals: Hospital[];
}

export const HospitalCarousel: React.FC<HospitalCarouselProps> = ({ hospitals }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    let interval: any;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % hospitals.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, hospitals.length]);

  const next = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % hospitals.length);
  };

  const prev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + hospitals.length) % hospitals.length);
  };

  if (!hospitals || hospitals.length === 0) return null;

  const currentHospital = hospitals[currentIndex];
  if (!currentHospital) return null;

  return (
    <div className="relative w-full mx-auto">
      <Card className="overflow-hidden border border-border bg-card/80 backdrop-blur-md shadow-2xl shadow-black/50 transform transition-all hover:scale-[1.01] duration-300">
        <div className="h-72 w-full bg-zinc-800 relative">
          <img
            src={currentHospital.imageUrl}
            alt={currentHospital.name}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute top-4 right-4">
            <Badge variant="success" className="flex items-center gap-1 shadow-md bg-green-500/20 text-green-400 border border-green-500/50 backdrop-blur-md px-3 py-1 text-xs">
              <CheckCircle2 className="w-3 h-3" /> Verified
            </Badge>
          </div>
        </div>
        <CardContent className="p-6 relative">
          <h3 className="font-bold text-2xl text-foreground mb-2 truncate">{currentHospital.name}</h3>
          <div className="flex items-center text-muted-foreground text-sm mb-4">
            <MapPin className="w-4 h-4 mr-2 text-primary" />
            <span className="truncate">{currentHospital.location}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentHospital.badges.map(badge => (
              <Badge key={badge} variant="secondary" className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-1">{badge}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <button
        onClick={prev}
        className="absolute top-1/2 -left-6 -translate-y-1/2 bg-background/80 backdrop-blur border border-border text-foreground shadow-lg rounded-full p-3 hover:bg-accent transition-colors z-30 hover:scale-110"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute top-1/2 -right-6 -translate-y-1/2 bg-background/80 backdrop-blur border border-border text-foreground shadow-lg rounded-full p-3 hover:bg-accent transition-colors z-30 hover:scale-110"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="flex justify-center mt-8 gap-2">
        {hospitals.map((_, idx) => (
          <div
            key={idx}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-primary w-6' : 'bg-muted-foreground/30'}`}
          />
        ))}
      </div>
    </div>
  );
};