'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface HiringManagerProfile {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  phone: string;
  location: string;
  bio: string;
  avatar: string;
}

// Initial profile data
const initialProfile: HiringManagerProfile = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@company.com',
  department: 'Human Resources',
  role: 'Hiring Manager',
  phone: '+1 (555) 123-4567',
  location: 'New York, NY',
  bio: 'Experienced hiring manager with a focus on building strong teams and finding the best talent.',
  avatar: ''
};

export default function HiringManagerProfilePage() {
  const [profile, setProfile] = useState<HiringManagerProfile>(() => {
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem('hiringManagerProfile');
      return savedProfile ? JSON.parse(savedProfile) : initialProfile;
    }
    return initialProfile;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<HiringManagerProfile>(profile);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hiringManagerProfile', JSON.stringify(profile));
    }
  }, [profile]);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    setPreviewImage(null);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
    setPreviewImage(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewImage(base64String);
        setEditedProfile({ ...editedProfile, avatar: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start space-x-6">
          <div className="flex-shrink-0">
            {isEditing ? (
              <div className="relative">
                <div 
                  className="h-24 w-24 rounded-full bg-emerald-50 flex items-center justify-center cursor-pointer overflow-hidden"
                  onClick={triggerFileInput}
                >
                  {previewImage || profile.avatar ? (
                    <Image
                      src={previewImage || profile.avatar}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-2xl text-emerald-700 font-semibold">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div className="absolute bottom-0 right-0 bg-emerald-600 text-white p-1 rounded-full cursor-pointer hover:bg-emerald-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </div>
              </div>
            ) : (
              <div className="h-24 w-24 rounded-full bg-emerald-50 flex items-center justify-center overflow-hidden">
                {profile.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-2xl text-emerald-700 font-semibold">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    className="block w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                    className="block w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editedProfile.phone}
                    onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                    className="block w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={editedProfile.location}
                    onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                    className="block w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={editedProfile.bio}
                    onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                    rows={3}
                    className="block w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{profile.name}</h2>
                  <p className="text-sm text-gray-600">{profile.role}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-sm text-gray-600">{profile.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone</p>
                    <p className="text-sm text-gray-600">{profile.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Department</p>
                    <p className="text-sm text-gray-600">{profile.department}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Location</p>
                    <p className="text-sm text-gray-600">{profile.location}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Bio</p>
                  <p className="text-sm text-gray-600 mt-1">{profile.bio}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 