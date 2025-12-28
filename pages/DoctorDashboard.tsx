import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { AppointmentStatus } from '../types';
import { Check, X, Clock, Plus, Trash2, Calendar as CalendarIcon, User as UserIcon } from 'lucide-react';

export const DoctorDashboard: React.FC = () => {
    const { appointments, updateAppointmentStatus, doctors, updateDoctorSlots } = useData();
    const { user } = useAuth();
    const [newSlot, setNewSlot] = useState('');

    // Get doctorId from logged-in user's profile
    const doctorId = user?.doctorId;
    const currentDoctor = doctorId ? doctors.find(d => d.id === doctorId) : null;
    const myAppointments = doctorId ? appointments.filter(a => a.doctorId === doctorId) : [];

    // If user is not linked to a doctor profile, show error
    if (!doctorId) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="text-center py-20">
                    <h1 className="text-2xl font-bold text-foreground mb-4">Doctor Profile Not Found</h1>
                    <p className="text-muted-foreground mb-4">
                        Your account is not linked to a doctor profile. Please contact an administrator.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        User ID: {user?.id}
                    </p>
                </div>
            </div>
        );
    }

    const handleAddSlot = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSlot && currentDoctor) {
            const updatedSlots = [...(currentDoctor.availableSlots || []), newSlot];
            updateDoctorSlots(doctorId, updatedSlots);
            setNewSlot('');
        }
    };

    const handleRemoveSlot = (slotToRemove: string) => {
        if (currentDoctor) {
            const updatedSlots = currentDoctor.availableSlots.filter(s => s !== slotToRemove);
            updateDoctorSlots(doctorId, updatedSlots);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <h1 className="text-3xl font-bold mb-2 text-foreground">Doctor Dashboard</h1>
            <p className="text-muted-foreground mb-8">Welcome back, {currentDoctor?.name || 'Doctor'}. Manage your schedule and patients.</p>

            <div className="grid gap-8 lg:grid-cols-[1fr_300px]">

                {/* Appointments Column */}
                <div className="space-y-6">
                    <Card className="border-border bg-card">
                        <CardHeader>
                            <CardTitle className="text-foreground flex items-center gap-2">
                                <CalendarIcon className="w-5 h-5" /> Appointment Requests
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 sm:p-6">
                            {/* MOBILE VIEW: Cards */}
                            <div className="block sm:hidden space-y-4 p-4">
                                {myAppointments.length === 0 ? (
                                    <p className="text-muted-foreground text-center py-4">No appointments found.</p>
                                ) : (
                                    myAppointments.map(appt => (
                                        <div key={appt.id} className="bg-muted/30 border border-border rounded-lg p-4 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                                                        <UserIcon className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-foreground">{appt.patientName}</p>
                                                        <p className="text-xs text-muted-foreground">ID: {appt.userId.slice(0, 5)}</p>
                                                    </div>
                                                </div>
                                                <Badge variant={
                                                    appt.status === AppointmentStatus.APPROVED ? 'success' :
                                                        appt.status === AppointmentStatus.CANCELLED ? 'destructive' : 'warning'
                                                }>
                                                    {appt.status}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-foreground/80 border-t border-border pt-3">
                                                <div className="flex items-center gap-1.5">
                                                    <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                                                    <span>{new Date(appt.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                                    <span>{appt.slot}</span>
                                                </div>
                                            </div>

                                            {appt.status === AppointmentStatus.PENDING && (
                                                <div className="grid grid-cols-2 gap-3 pt-2">
                                                    <Button size="sm" className="w-full bg-green-600 hover:bg-green-700" onClick={() => updateAppointmentStatus(appt.id, AppointmentStatus.APPROVED)}>
                                                        <Check className="w-4 h-4 mr-1" /> Approve
                                                    </Button>
                                                    <Button size="sm" variant="destructive" className="w-full" onClick={() => updateAppointmentStatus(appt.id, AppointmentStatus.CANCELLED)}>
                                                        <X className="w-4 h-4 mr-1" /> Reject
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* DESKTOP VIEW: Table */}
                            <div className="hidden sm:block w-full overflow-x-auto rounded-md border border-border">
                                <table className="w-full caption-bottom text-sm text-left min-w-[600px]">
                                    <thead className="[&_tr]:border-b bg-muted/50">
                                        <tr className="border-b border-border">
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Patient</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Date & Time</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myAppointments.map((appt) => (
                                            <tr key={appt.id} className="border-b border-border transition-colors hover:bg-muted/30">
                                                <td className="p-4 align-middle font-medium text-foreground">{appt.patientName}</td>
                                                <td className="p-4 align-middle text-foreground">
                                                    {new Date(appt.date).toLocaleDateString()} <br />
                                                    <span className="text-xs text-muted-foreground">{appt.slot}</span>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <Badge variant={
                                                        appt.status === AppointmentStatus.APPROVED ? 'success' :
                                                            appt.status === AppointmentStatus.CANCELLED ? 'destructive' : 'warning'
                                                    }>
                                                        {appt.status}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 align-middle text-right">
                                                    {appt.status === AppointmentStatus.PENDING ? (
                                                        <div className="flex justify-end gap-2">
                                                            <Button size="sm" className="bg-green-600 hover:bg-green-700 h-8 w-8 p-0" title="Approve" onClick={() => updateAppointmentStatus(appt.id, AppointmentStatus.APPROVED)}>
                                                                <Check className="h-4 w-4" />
                                                            </Button>
                                                            <Button size="sm" variant="destructive" className="h-8 w-8 p-0" title="Reject" onClick={() => updateAppointmentStatus(appt.id, AppointmentStatus.CANCELLED)}>
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground text-xs">Processed</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {myAppointments.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="p-4 text-center text-muted-foreground">No appointments found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar: Schedule Management */}
                <div className="space-y-6">
                    <Card className="border-border bg-card">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                                <Clock className="w-5 h-5" /> Manage Time Slots
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddSlot} className="flex gap-2 mb-4">
                                <Input
                                    placeholder="e.g. 11:30 AM"
                                    value={newSlot}
                                    onChange={e => setNewSlot(e.target.value)}
                                    required
                                    className="bg-background border-input"
                                />
                                <Button type="submit" size="icon"><Plus className="w-4 h-4" /></Button>
                            </form>

                            <div className="space-y-2">
                                {currentDoctor?.availableSlots?.length ? (
                                    currentDoctor.availableSlots.map(slot => (
                                        <div key={slot} className="flex items-center justify-between p-2 rounded-md bg-muted/50 border border-border">
                                            <span className="text-sm font-medium text-foreground">{slot}</span>
                                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive" onClick={() => handleRemoveSlot(slot)}>
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">No slots added.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
};