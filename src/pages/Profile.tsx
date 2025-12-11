import React from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import { User, Mail, Shield } from 'lucide-react';

const Profile: React.FC = () => {
    const { user } = useAuth();

    if (!user) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-montserrat font-bold text-navy-900">My Profile</h2>
                <p className="text-bluegrey-500">Manage your account settings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="md:col-span-1">
                    <Card className="text-center p-8">
                        <div className="w-24 h-24 bg-navy-900 rounded-full mx-auto mb-4 flex items-center justify-center text-gold-400 text-3xl font-bold">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <h3 className="text-xl font-bold text-navy-900 mb-1">{user.name}</h3>
                        <p className="text-bluegrey-500 text-sm mb-4">{user.role}</p>
                        <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                            Active
                        </div>
                    </Card>
                </div>

                {/* Details */}
                <div className="md:col-span-2">
                    <Card title="Personal Information">
                        <div className="space-y-6">
                            <div className="flex items-center p-4 bg-light-100 rounded-xl">
                                <div className="p-3 bg-white rounded-lg mr-4 shadow-sm text-navy-900">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-bluegrey-500 uppercase font-bold">Full Name</p>
                                    <p className="font-medium text-navy-900">{user.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center p-4 bg-light-100 rounded-xl">
                                <div className="p-3 bg-white rounded-lg mr-4 shadow-sm text-navy-900">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-bluegrey-500 uppercase font-bold">Email Address</p>
                                    <p className="font-medium text-navy-900">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center p-4 bg-light-100 rounded-xl">
                                <div className="p-3 bg-white rounded-lg mr-4 shadow-sm text-navy-900">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-bluegrey-500 uppercase font-bold">Role</p>
                                    <p className="font-medium text-navy-900 capitalize">{user.role}</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Profile;
