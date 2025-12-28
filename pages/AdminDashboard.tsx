import React, { useState, useRef } from 'react';
import { useData } from '../context/DataContext';
import { Tabs } from '../components/ui/Tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { AppointmentStatus } from '../types';
import { Eye, EyeOff, Plus, Trash2, X, ShieldCheck, Upload, Loader2, ImageIcon } from 'lucide-react';
import { uploadImage } from '../services/cloudinary';

const DoctorsTable = () => {
    const { doctors, toggleDoctorStatus, addDoctor, deleteDoctor } = useData();
    const [newDocName, setNewDocName] = useState('');
    const [newDocSpec, setNewDocSpec] = useState('');
    const [newDocExp, setNewDocExp] = useState('5');
    const [newDocDesc, setNewDocDesc] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddDoctor = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            let imageUrl = `https://picsum.photos/200/200?random=${Math.floor(Math.random() * 100)}`;

            if (imageFile) {
                imageUrl = await uploadImage(imageFile);
            }

            await addDoctor({
                name: newDocName,
                specialization: newDocSpec || 'General Practitioner',
                experience: parseInt(newDocExp) || 5,
                description: newDocDesc || `Expert in ${newDocSpec || 'general medicine'}`,
                isActive: true,
                imageUrl,
                availableSlots: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"]
            });

            // Reset form
            setNewDocName('');
            setNewDocSpec('');
            setNewDocExp('5');
            setNewDocDesc('');
            setImageFile(null);
            setImagePreview(null);
            setIsFormOpen(false);
        } catch (error) {
            console.error('Error adding doctor:', error);
            alert('Failed to add doctor. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteDoctor = async (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to permanently delete ${name}?`)) {
            await deleteDoctor(id);
        }
    };

    const resetForm = () => {
        setNewDocName('');
        setNewDocSpec('');
        setNewDocExp('5');
        setNewDocDesc('');
        setImageFile(null);
        setImagePreview(null);
        setIsFormOpen(false);
    };

    return (
        <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-col items-center gap-6 pb-8 border-b border-border">
                <CardTitle className="text-3xl font-bold text-center tracking-tight text-foreground">Manage Doctors</CardTitle>
                {!isFormOpen && (
                    <Button
                        size="lg"
                        onClick={() => setIsFormOpen(true)}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg font-semibold px-8"
                    >
                        <Plus className="h-5 w-5 mr-2" /> Add Doctor
                    </Button>
                )}
            </CardHeader>
            <CardContent className="pt-8">
                {isFormOpen && (
                    <div className="mb-8 p-6 rounded-2xl bg-muted/30 border border-border animate-in fade-in slide-in-from-top-4">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="font-semibold text-lg text-foreground">Add New Specialist</h4>
                            <Button variant="ghost" size="icon" onClick={resetForm} className="h-8 w-8 hover:bg-muted rounded-full"><X className="w-4 h-4" /></Button>
                        </div>
                        <form onSubmit={handleAddDoctor} className="grid gap-6">
                            {/* Image Upload Section */}
                            <div className="flex items-start gap-6">
                                <div
                                    className="relative w-32 h-32 rounded-xl border-2 border-dashed border-border bg-muted/30 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors overflow-hidden group"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {imagePreview ? (
                                        <>
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Upload className="w-6 h-6 text-white" />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                            <ImageIcon className="w-8 h-8" />
                                            <span className="text-xs">Upload Photo</span>
                                        </div>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                        className="hidden"
                                    />
                                </div>
                                <div className="flex-1 grid gap-4">
                                    <Input
                                        label="Doctor Name"
                                        value={newDocName}
                                        onChange={(e) => setNewDocName(e.target.value)}
                                        required
                                        placeholder="e.g. Dr. Sarah Smith"
                                        className="bg-background border-input h-11"
                                        autoFocus
                                        disabled={isUploading}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Specialization"
                                            value={newDocSpec}
                                            onChange={(e) => setNewDocSpec(e.target.value)}
                                            required
                                            placeholder="e.g. Cardiologist"
                                            className="bg-background border-input h-11"
                                            disabled={isUploading}
                                        />
                                        <Input
                                            label="Experience (Years)"
                                            type="number"
                                            min="1"
                                            max="50"
                                            value={newDocExp}
                                            onChange={(e) => setNewDocExp(e.target.value)}
                                            required
                                            placeholder="5"
                                            className="bg-background border-input h-11"
                                            disabled={isUploading}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Input
                                label="Description"
                                value={newDocDesc}
                                onChange={(e) => setNewDocDesc(e.target.value)}
                                placeholder="Brief description of expertise..."
                                className="bg-background border-input h-11"
                                disabled={isUploading}
                            />

                            <div className="flex justify-end gap-3 pt-2">
                                <Button type="button" variant="ghost" onClick={resetForm} disabled={isUploading} className="hover:bg-muted text-muted-foreground hover:text-foreground">Cancel</Button>
                                <Button type="submit" className="min-w-[140px]" disabled={isUploading}>
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Adding...
                                        </>
                                    ) : (
                                        'Confirm Add'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Table */}
                <div className="rounded-xl border border-border overflow-x-auto">
                    <table className="w-full text-sm text-left min-w-[600px]">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Doctor</th>
                                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Specialization</th>
                                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Status</th>
                                <th className="h-12 px-6 align-middle font-medium text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {doctors.map((doc) => (
                                <tr key={doc.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <img src={doc.imageUrl} alt={doc.name} className="w-10 h-10 rounded-full object-cover bg-muted" />
                                            <div>
                                                <p className="font-medium text-foreground">{doc.name}</p>
                                                <p className="text-xs text-muted-foreground">{doc.experience} years exp.</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 text-muted-foreground">{doc.specialization}</td>
                                    <td className="p-6">
                                        <Badge variant={doc.isActive ? 'success' : 'secondary'} className={doc.isActive ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20" : "bg-muted text-muted-foreground border-border"}>
                                            {doc.isActive ? 'Active' : 'Hidden'}
                                        </Badge>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => toggleDoctorStatus(doc.id)} className="h-8 w-8 text-muted-foreground hover:text-foreground" title={doc.isActive ? "Hide Doctor" : "Show Doctor"}>
                                                {doc.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteDoctor(doc.id, doc.name)} className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" title="Delete Doctor">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {doctors.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-muted-foreground">
                                        No doctors found. Add your first doctor above.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};

const BrandsTable = () => {
    const { brands, addBrand, removeBrand } = useData();
    const [newBrandName, setNewBrandName] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleAddBrand = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newBrandName.trim()) {
            setIsAdding(true);
            await addBrand(newBrandName);
            setNewBrandName('');
            setIsAdding(false);
        }
    };

    return (
        <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="border-b border-border pb-6">
                <CardTitle className="text-xl font-bold text-foreground">Manage Partner Brands</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <form onSubmit={handleAddBrand} className="flex gap-4 items-end mb-8 max-w-lg">
                    <Input
                        label="New Brand Name"
                        value={newBrandName}
                        onChange={e => setNewBrandName(e.target.value)}
                        required
                        placeholder="e.g. Health Plus"
                        className="bg-background border-input"
                        disabled={isAdding}
                    />
                    <Button type="submit" disabled={isAdding}>
                        {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                        {isAdding ? '' : 'Add'}
                    </Button>
                </form>

                <div className="rounded-xl border border-border overflow-x-auto">
                    <table className="w-full text-sm text-left min-w-[500px]">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">ID</th>
                                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Brand Name</th>
                                <th className="h-12 px-6 align-middle font-medium text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {brands.map((brand) => (
                                <tr key={brand.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="p-6 font-mono text-xs text-muted-foreground">{brand.id.slice(0, 8)}...</td>
                                    <td className="p-6 font-medium text-foreground">{brand.name}</td>
                                    <td className="p-6 text-right">
                                        <Button variant="ghost" size="sm" onClick={() => removeBrand(brand.id)} className="hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {brands.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="p-12 text-center text-muted-foreground">
                                        No brands found. Add your first partner brand above.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};

const AllAppointmentsTable = () => {
    const { appointments, doctors } = useData();
    return (
        <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="border-b border-border pb-6">
                <CardTitle className="text-xl font-bold text-foreground">All Appointments System-Wide</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="rounded-xl border border-border overflow-x-auto">
                    <table className="w-full text-sm text-left min-w-[600px]">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Patient</th>
                                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Doctor</th>
                                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Date/Time</th>
                                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {appointments.map((appt) => (
                                <tr key={appt.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="p-6 font-medium text-foreground">{appt.patientName}</td>
                                    <td className="p-6 text-muted-foreground">{doctors.find(d => d.id === appt.doctorId)?.name || 'Unknown'}</td>
                                    <td className="p-6">
                                        <div className="text-foreground">{appt.date}</div>
                                        <div className="text-xs text-muted-foreground">{appt.slot}</div>
                                    </td>
                                    <td className="p-6">
                                        <Badge variant="outline" className={`
                                            ${appt.status === AppointmentStatus.APPROVED ? 'text-green-500 border-green-500/20 bg-green-500/10' : ''}
                                            ${appt.status === AppointmentStatus.PENDING ? 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10' : ''}
                                            ${appt.status === AppointmentStatus.CANCELLED ? 'text-red-500 border-red-500/20 bg-red-500/10' : ''}
                                        `}>
                                            {appt.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                            {appointments.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-muted-foreground">
                                        No appointments found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};

export const AdminDashboard: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Portal</h1>
            </div>

            <Tabs
                tabs={[
                    { id: 'doctors', label: 'Doctors', content: <DoctorsTable /> },
                    { id: 'brands', label: 'Partners', content: <BrandsTable /> },
                    { id: 'appointments', label: 'Appointments', content: <AllAppointmentsTable /> }
                ]}
            />
        </div>
    );
};