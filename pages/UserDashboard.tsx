import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Tabs } from '../components/ui/Tabs';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { AppointmentStatus } from '../types';
import { Calendar, Clock, User as UserIcon, Activity, Heart, Weight, TrendingUp, MoreHorizontal, ArrowUpRight, Trash2, Eye } from 'lucide-react';

// Responsive QuickStat Component
const QuickStat = ({ icon: Icon, label, value, subtext }: any) => (
    <Card className="bg-card border-border shadow-sm overflow-hidden relative group backdrop-blur-md">
        <CardContent className="p-4 md:p-6 flex md:block items-center justify-between">
            {/* Icon Section */}
            <div className="flex items-center justify-center p-3 rounded-2xl bg-muted text-foreground md:w-fit md:mb-4 md:rounded-lg ring-1 ring-border md:ring-0">
                <Icon className="w-5 h-5 text-primary" />
            </div>

            {/* Text Section */}
            <div className="text-right md:text-left">
                <div className="flex items-center justify-end md:justify-start gap-1 mb-1 md:absolute md:top-6 md:right-6">
                   {subtext && <span className="text-[10px] font-bold uppercase tracking-wider text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                       {subtext} <TrendingUp className="w-3 h-3" />
                   </span>}
                </div>
                <div className="text-xl md:text-2xl font-bold text-foreground tracking-tight leading-none mb-1">{value}</div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</div>
            </div>
        </CardContent>
    </Card>
);

// Extracted Component
const AppointmentList = ({ statusFilter, appointments, doctors }: { statusFilter?: AppointmentStatus[], appointments: any[], doctors: any[] }) => {
    const { updateAppointmentStatus } = useData();
    const navigate = useNavigate();
    
    const getDoctorName = (id: string) => doctors.find(d => d.id === id)?.name || 'Unknown Doctor';
    const getDoctorSpecialty = (id: string) => doctors.find(d => d.id === id)?.specialization || 'General';

    const handleCancel = (id: string) => {
        if(window.confirm('Are you sure you want to cancel this appointment?')) {
            updateAppointmentStatus(id, AppointmentStatus.CANCELLED);
        }
    };

    const handleViewDetails = (id: string) => {
        alert(`Showing details for appointment ID: ${id}\n(This is a demo feature)`);
    };

    const filtered = statusFilter 
      ? appointments.filter(a => statusFilter.includes(a.status))
      : appointments;

    if (filtered.length === 0) {
        return (
          <div className="flex flex-col items-center justify-center py-12 md:py-16 border border-dashed border-border rounded-xl bg-muted/20">
              <Calendar className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground mb-3" />
              <p className="text-sm md:text-base text-muted-foreground">No appointments found.</p>
              {statusFilter?.includes(AppointmentStatus.APPROVED) && (
                  <Button variant="link" onClick={() => navigate('/')} className="mt-2 text-primary">Book an appointment</Button>
              )}
          </div>
        )
    }

    return (
        <div className="space-y-3">
            {filtered.map(appt => (
                <div key={appt.id} className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all shadow-sm">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors flex-shrink-0">
                              <UserIcon className="w-4 h-4 md:w-5 md:h-5" />
                          </div>
                          <div className="overflow-hidden">
                              <h4 className="font-semibold text-foreground truncate text-sm md:text-base">{getDoctorName(appt.doctorId)}</h4>
                              <p className="text-xs text-muted-foreground truncate">{getDoctorSpecialty(appt.doctorId)}</p>
                          </div>
                    </div>
                    
                    <div className="flex flex-row sm:flex-col md:flex-row items-center gap-4 sm:gap-6 text-xs md:text-sm text-muted-foreground w-full sm:w-auto border-t sm:border-t-0 border-border pt-3 sm:pt-0 justify-between sm:justify-center">
                        <div className="flex items-center gap-2">
                           <Calendar className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                           <span className="font-medium">{new Date(appt.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Clock className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                           <span className="font-medium">{appt.slot}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <Badge variant="outline" className={`
                          ${appt.status === AppointmentStatus.APPROVED ? 'text-green-500 border-green-500/30 bg-green-500/10' : ''}
                          ${appt.status === AppointmentStatus.PENDING ? 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10' : ''}
                          ${appt.status === AppointmentStatus.CANCELLED ? 'text-destructive border-destructive/30 bg-destructive/10' : ''}
                      `}>
                          {appt.status}
                      </Badge>
                      
                      {appt.status === AppointmentStatus.PENDING ? (
                          <Button 
                            size="icon" 
                            variant="destructive" 
                            className="h-8 w-8 hover:bg-destructive/90" 
                            onClick={() => handleCancel(appt.id)}
                            title="Cancel Appointment"
                          >
                              <Trash2 className="w-4 h-4" />
                          </Button>
                      ) : (
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="text-muted-foreground hover:text-foreground h-8 w-8"
                            onClick={() => handleViewDetails(appt.id)}
                            title="View Details"
                          >
                              <Eye className="w-4 h-4" />
                          </Button>
                      )}
                    </div>
                </div>
            ))}
        </div>
    )
};

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { appointments, doctors } = useData();
  const navigate = useNavigate();

  const myAppointments = appointments.filter(a => a.userId === user?.id);
  const upcomingCount = myAppointments.filter(a => [AppointmentStatus.APPROVED, AppointmentStatus.PENDING].includes(a.status)).length;
  
  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-5xl overflow-x-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Welcome back, {user?.name.split(' ')[0]}</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">Here is your daily health overview.</p>
          </div>
          <Button 
            className="w-full sm:w-auto flex items-center justify-center gap-2 shadow-sm"
            onClick={() => navigate('/')}
          >
              New Appointment <ArrowUpRight className="w-4 h-4" />
          </Button>
      </div>

      {/* Health Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-10">
           <QuickStat icon={Calendar} label="Upcoming" value={upcomingCount} />
           <QuickStat icon={Heart} label="Heart Rate" value="72 bpm" subtext="Normal" />
           <QuickStat icon={Weight} label="Weight" value="68 kg" subtext="-2 kg" />
           <QuickStat icon={Activity} label="Status" value="Active" />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-semibold text-foreground">Appointments</h2>
            <Button 
                variant="link" 
                className="sm:hidden text-primary p-0 h-auto text-sm"
                onClick={() => navigate('/')}
            >
                New +
            </Button>
        </div>
        
        <Tabs 
            className="w-full"
            defaultTab="upcoming"
            tabs={[
                {
                    id: 'upcoming',
                    label: 'Upcoming',
                    content: <div className="mt-4 md:mt-6"><AppointmentList statusFilter={[AppointmentStatus.APPROVED, AppointmentStatus.PENDING]} appointments={myAppointments} doctors={doctors} /></div>
                },
                {
                    id: 'history',
                    label: 'History',
                    content: <div className="mt-4 md:mt-6"><AppointmentList statusFilter={[AppointmentStatus.CANCELLED]} appointments={myAppointments} doctors={doctors} /></div>
                }
            ]}
        />
      </div>
    </div>
  );
};