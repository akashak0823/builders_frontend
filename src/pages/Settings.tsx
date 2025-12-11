import React from 'react';
import Card from '../components/Card';

import { Bell, Lock, User, Globe, Moon } from 'lucide-react';

const Settings: React.FC = () => {


    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-montserrat font-bold text-navy-900">Settings</h2>
                <p className="text-bluegrey-500">Manage your application preferences</p>
            </div>

            <div className="space-y-6">
                <Card title="Account Settings">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-light-100 rounded-xl">
                            <div className="flex items-center">
                                <div className="p-3 bg-white rounded-lg mr-4 shadow-sm text-navy-900">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-navy-900">Profile Information</p>
                                    <p className="text-xs text-bluegrey-500">Update your name and email</p>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-navy-900 hover:bg-slate-50 transition-colors">
                                Edit
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-light-100 rounded-xl">
                            <div className="flex items-center">
                                <div className="p-3 bg-white rounded-lg mr-4 shadow-sm text-navy-900">
                                    <Lock size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-navy-900">Change Password</p>
                                    <p className="text-xs text-bluegrey-500">Update your security credentials</p>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-navy-900 hover:bg-slate-50 transition-colors">
                                Update
                            </button>
                        </div>
                    </div>
                </Card>

                <Card title="Preferences">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-light-100 rounded-xl">
                            <div className="flex items-center">
                                <div className="p-3 bg-white rounded-lg mr-4 shadow-sm text-navy-900">
                                    <Bell size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-navy-900">Notifications</p>
                                    <p className="text-xs text-bluegrey-500">Manage email and push notifications</p>
                                </div>
                            </div>
                            <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                <input type="checkbox" name="toggle" id="toggle1" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                                <label htmlFor="toggle1" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-light-100 rounded-xl">
                            <div className="flex items-center">
                                <div className="p-3 bg-white rounded-lg mr-4 shadow-sm text-navy-900">
                                    <Moon size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-navy-900">Dark Mode</p>
                                    <p className="text-xs text-bluegrey-500">Switch between light and dark themes</p>
                                </div>
                            </div>
                            <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                <input type="checkbox" name="toggle" id="toggle2" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                                <label htmlFor="toggle2" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-light-100 rounded-xl">
                            <div className="flex items-center">
                                <div className="p-3 bg-white rounded-lg mr-4 shadow-sm text-navy-900">
                                    <Globe size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-navy-900">Language</p>
                                    <p className="text-xs text-bluegrey-500">Select your preferred language</p>
                                </div>
                            </div>
                            <select className="bg-white border border-slate-200 text-navy-900 text-sm rounded-lg focus:ring-gold-400 focus:border-gold-400 block p-2.5">
                                <option>English</option>
                                <option>Hindi</option>
                                <option>Spanish</option>
                            </select>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Settings;
