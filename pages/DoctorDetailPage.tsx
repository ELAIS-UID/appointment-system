import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Calendar } from '../components/ui/Calendar';
import { Calendar as CalendarIcon, CheckCircle, MapPin, Award, ChevronDown } from 'lucide-react';
import { AppointmentStatus } from '../types';
import { format } from 'date-fns';

export const DoctorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { doctors, addAppointment, appointments } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const calendarRef = useRef<HTMLDivElement>(null);

  const doctor = doctors.find(d => d.id === id);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!doctor) {
    return <div className="container mx-auto py-20 text-center text-muted-foreground">Doctor not found</div>;
  }

  const dateString = format(selectedDate, 'yyyy-MM-dd');

  // Calculate Available Slots
  const bookedSlots = appointments
    .filter(a => a.doctorId === doctor.id && a.date === dateString && a.status !== AppointmentStatus.CANCELLED)
    .map(a => a.slot);

  const availableSlots = doctor.availableSlots.filter(slot => !bookedSlots.includes(slot));

  const handleBook = () => {
    if (!user) {
      navigate('/login?redirect=/doctor/' + id);
      return;
    }
    if (!selectedSlot) return;
    
    addAppointment({
        userId: user.id,
        doctorId: doctor.id,
        patientName: user.name,
        date: dateString,
        slot: selectedSlot,
    });
    setBookingSuccess(true);
    setTimeout(() => {
        navigate('/dashboard/user');
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-20 max-w-5xl animate-in fade-in duration-500 overflow-x-hidden">
      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        {/* Sidebar / Image */}
        <div className="space-y-6">
            <div className="aspect-[3/4] overflow-hidden rounded-xl border border-border bg-muted shadow-sm relative group">
                <img 
                    src={doctor.imageUrl} 
                    alt={doctor.name} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
            </div>
            <div className="flex flex-col gap-3 p-4 rounded-lg bg-card border border-border">
                 <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                        <Award className="w-4 h-4" />
                    </div>
                    <span>{doctor.experience} Years Experience</span>
                 </div>
                 <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                         <MapPin className="w-4 h-4" />
                    </div>
                    <span>New York Medical Center</span>
                 </div>
            </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-8">
            <div>
                <Badge className="mb-3 px-3 py-1 text-sm">{doctor.specialization}</Badge>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4 break-words">{doctor.name}</h1>
                <p className="text-muted-foreground text-lg leading-relaxed">{doctor.description}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-card border-border md:col-span-2">
                    <CardContent className="p-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2 text-foreground">
                            <CalendarIcon className="w-4 h-4 text-primary" /> Select Date & Time
                        </h3>
                        
                        <div className="mb-6 relative" ref={calendarRef}>
                             <div 
                                className="flex items-center justify-between p-3 border border-input rounded-md cursor-pointer hover:border-primary transition-colors bg-background"
                                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                             >
                                <span className="text-sm font-medium">
                                    {format(selectedDate, 'EEEE, MMMM do, yyyy')}
                                </span>
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                             </div>
                             
                             {isCalendarOpen && (
                                <div className="absolute top-12 left-0 z-50 animate-in fade-in zoom-in-95 duration-200">
                                    <Calendar 
                                        selectedDate={selectedDate}
                                        onSelect={(d) => {
                                            setSelectedDate(d);
                                            setSelectedSlot(null);
                                            setIsCalendarOpen(false);
                                        }}
                                        minDate={new Date()}
                                    />
                                </div>
                             )}
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm font-medium text-muted-foreground">Available Slots</p>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                {availableSlots.length > 0 ? (
                                    availableSlots.map(slot => (
                                        <button 
                                            key={slot} 
                                            onClick={() => setSelectedSlot(slot)}
                                            className={`
                                                text-center p-2 rounded-md border text-sm cursor-pointer transition-all
                                                ${selectedSlot === slot 
                                                    ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-105' 
                                                    : 'border-input bg-background/50 hover:border-primary hover:text-primary'}
                                            `}
                                        >
                                            <div className="font-bold text-xs md:text-sm whitespace-nowrap">{slot}</div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="col-span-full p-4 text-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border">
                                        No slots available for this date.
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <div className="mt-auto pt-6 border-t border-border">
                {bookingSuccess ? (
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">Appointment request sent successfully! Redirecting...</span>
                    </div>
                ) : (
                    <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-muted/30 rounded-xl border border-border gap-4">
                        <div className="text-center sm:text-left">
                            <p className="font-medium text-muted-foreground">Consultation Fee</p>
                            <p className="text-3xl font-bold text-foreground">$150</p>
                        </div>
                        <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                            <Button 
                                size="lg" 
                                onClick={handleBook} 
                                className="w-full sm:w-auto h-12 text-base shadow-lg"
                                disabled={!selectedSlot}
                            >
                                {user ? 'Confirm Booking' : 'Log in to Book'}
                            </Button>
                            {!selectedSlot && <span className="text-xs text-destructive font-medium self-center sm:self-end">Please select a time slot</span>}
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};