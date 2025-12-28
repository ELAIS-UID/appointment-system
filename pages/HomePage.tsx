import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { HospitalCarousel } from '../components/HospitalCarousel';
import { InfiniteBrandStrip } from '../components/InfiniteBrandStrip';
import { Star, Clock, ArrowRight, Search, ShieldCheck, Users, Activity } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { doctors, hospitals, brands } = useData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter active doctors based on search term
  const filteredDoctors = doctors.filter(d => 
      d.isActive && (
          d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          d.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handleScrollToDoctors = () => {
      document.getElementById('doctors-list')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToHospitals = () => {
    document.getElementById('hospital-highlight')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-40 border-b border-border/40">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 bg-grid-small-white/[0.2] -top-20 opacity-50" />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        
        {/* Spotlight Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 blur-[120px] rounded-full opacity-30 pointer-events-none" />

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-24 items-center">
            
            {/* Left Column: Text & CTA */}
            <div className="flex flex-col justify-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="space-y-6 text-center lg:text-left">
                <div className="flex justify-center lg:justify-start">
                    <Badge variant="outline" className="w-fit py-1.5 px-3 bg-secondary/50 backdrop-blur border-border text-muted-foreground">
                    <span className="relative flex h-2 w-2 mr-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Accepting New Patients
                    </Badge>
                </div>
                
                <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-7xl text-foreground leading-[1.1]">
                  Health care <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground">
                    Simplified.
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground max-w-[600px] mx-auto lg:mx-0 leading-relaxed">
                  Connect with top-tier specialists and premium hospitals. 
                  Experience the future of medical appointments with strictly verified practitioners.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="h-12 px-8 text-base shadow-lg w-full sm:w-auto" onClick={handleScrollToDoctors}>
                  Book Appointment
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 text-base border-border hover:bg-accent hover:text-accent-foreground w-full sm:w-auto" onClick={handleScrollToHospitals}>
                  Browse Hospitals
                </Button>
              </div>

              {/* Minimal Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border text-center lg:text-left">
                  <div>
                      <h4 className="text-2xl font-bold text-foreground">10k+</h4>
                      <p className="text-xs md:text-sm text-muted-foreground">Active Patients</p>
                  </div>
                  <div>
                      <h4 className="text-2xl font-bold text-foreground">500+</h4>
                      <p className="text-xs md:text-sm text-muted-foreground">Verified Doctors</p>
                  </div>
                  <div>
                      <h4 className="text-2xl font-bold text-foreground">99%</h4>
                      <p className="text-xs md:text-sm text-muted-foreground">Satisfaction</p>
                  </div>
              </div>
            </div>
            
            {/* Right Column: Interactive Component */}
            <div id="hospital-highlight" className="relative mx-auto lg:ml-auto w-full flex justify-center lg:justify-end animate-in fade-in zoom-in duration-1000 delay-200">
                <div className="w-full max-w-[600px] relative">
                  <HospitalCarousel hospitals={hospitals} />
                  
                  {/* Floating Trust Card (Decoration) */}
                  <div className="hidden md:flex absolute -bottom-10 -left-10 bg-card border border-border p-4 rounded-xl shadow-2xl items-center gap-3 animate-bounce duration-[3000ms] z-20">
                      <div className="bg-green-500/20 p-2 rounded-full text-green-500">
                          <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Security</p>
                          <p className="font-bold text-base text-foreground">HIPAA Compliant</p>
                      </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Infinite Trust Strip */}
      <section className="py-10 border-b border-border/40 bg-muted/10">
          <div className="container mx-auto px-4">
             <p className="text-center text-xs md:text-sm font-medium text-muted-foreground mb-8 tracking-widest uppercase">Powering the best teams</p>
             <InfiniteBrandStrip brands={brands} />
          </div>
      </section>

      {/* Doctor Listing Section */}
      <section id="doctors-list" className="py-16 md:py-24 bg-background relative">
        <div className="container px-4 md:px-6 mx-auto">
          {/* Header - Fixed Alignment for Mobile */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 md:mb-12 gap-6">
            <div className="space-y-2 w-full">
                <h2 className="text-3xl font-bold tracking-tighter md:text-5xl text-foreground">Our Specialists</h2>
                <p className="text-muted-foreground max-w-[500px] text-base">
                World-class care, right at your fingertips.
                </p>
            </div>
            
            {/* Search Bar - Full width on mobile, right aligned on desktop */}
            <div className="relative w-full md:max-w-xs group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                <input 
                  type="search" 
                  placeholder="Search specialist..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex h-12 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring transition-all"
                />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300">
                    <CardHeader className="p-0">
                    <div className="aspect-[4/5] w-full overflow-hidden bg-muted relative cursor-pointer" onClick={() => navigate(`/doctor/${doctor.id}`)}>
                        <img 
                        src={doctor.imageUrl} 
                        alt={doctor.name} 
                        className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                        <div className="absolute bottom-3 left-3">
                            <h3 className="font-bold text-lg text-white leading-tight">{doctor.name}</h3>
                            <p className="text-xs text-zinc-300 font-medium">{doctor.specialization}</p>
                        </div>
                    </div>
                    </CardHeader>
                    <CardContent className="p-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded">
                            <Clock className="w-3 h-3" />
                            <span>Next: Today, 2pm</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span>4.9</span>
                        </div>
                    </div>
                    <Button className="w-full" onClick={() => navigate(`/doctor/${doctor.id}`)}>
                            Book Now
                    </Button>
                    </CardContent>
                </Card>
                ))
            ) : (
                <div className="col-span-full py-20 text-center text-muted-foreground">
                    <p>No doctors found matching "{searchTerm}"</p>
                    <Button variant="link" onClick={() => setSearchTerm('')}>Clear Search</Button>
                </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};