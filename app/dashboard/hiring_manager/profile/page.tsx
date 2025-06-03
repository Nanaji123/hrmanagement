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
    <div className="min-h-screen bg-gradient-to-b from-[#050d25] to-[#0d1021] px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-3xl mx-auto rounded-3xl p-1 bg-gradient-to-br from-cyan-400/40 via-blue-700/30 to-transparent shadow-[0_0_60px_#00f7ff50]">
        <div className="rounded-3xl bg-[#0e101c] p-8 md:p-12 flex flex-col gap-8 shadow-[0_0_40px_#00f7ff30] border border-[#2e314d]">
          {isEditing ? (
            <>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="h-28 w-28 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-4xl font-bold text-white shadow-[0_0_30px_#00f7ff80] border-4 border-[#101325]">
                    {editedProfile.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </div>
                  <div className="flex flex-col gap-2">
                    <input
                      className="text-3xl md:text-4xl font-extrabold text-cyan-200 bg-transparent border-b border-cyan-400 focus:outline-none mb-1"
                      value={editedProfile.name}
                      onChange={e => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    />
                    <input
                      className="text-base text-[#9aa0b4] font-medium bg-transparent border-b border-cyan-400 focus:outline-none mb-1"
                      value={editedProfile.role}
                      onChange={e => setEditedProfile({ ...editedProfile, role: e.target.value })}
                    />
                    <input
                      className="text-sm text-[#5f6b8b] bg-transparent border-b border-cyan-400 focus:outline-none"
                      value={editedProfile.department}
                      onChange={e => setEditedProfile({ ...editedProfile, department: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-cyan-300 mb-1">Email:</span>
                    <input
                      className="text-[#9aa0b4] bg-transparent border-b border-cyan-400 focus:outline-none"
                      value={editedProfile.email}
                      onChange={e => setEditedProfile({ ...editedProfile, email: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-cyan-300 mb-1">Phone:</span>
                    <input
                      className="text-[#9aa0b4] bg-transparent border-b border-cyan-400 focus:outline-none"
                      value={editedProfile.phone}
                      onChange={e => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-cyan-300 mb-1">Department:</span>
                    <input
                      className="text-[#9aa0b4] bg-transparent border-b border-cyan-400 focus:outline-none"
                      value={editedProfile.department}
                      onChange={e => setEditedProfile({ ...editedProfile, department: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-cyan-300 mb-1">Location:</span>
                    <input
                      className="text-[#9aa0b4] bg-transparent border-b border-cyan-400 focus:outline-none"
                      value={editedProfile.location}
                      onChange={e => setEditedProfile({ ...editedProfile, location: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="font-semibold text-cyan-300">Bio:</span>
                    <textarea
                      className="ml-2 text-[#9aa0b4] bg-transparent border-b border-cyan-400 focus:outline-none w-full"
                      value={editedProfile.bio}
                      onChange={e => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-6 justify-end mt-6">
                <button
                  onClick={handleSave}
                  className="px-6 py-3 gap-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-[0_0_15px_#00f7ff80] hover:opacity-90 transition text-lg"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 gap-6 bg-gray-700 text-white font-semibold rounded-xl hover:bg-gray-600 transition text-lg"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="h-28 w-28 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-4xl font-bold text-white shadow-[0_0_30px_#00f7ff80] border-4 border-[#101325]">
                    {profile.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-cyan-200 drop-shadow-[0_0_10px_#00f7ff]">{profile.name}</h1>
                    <p className="text-base text-[#9aa0b4] font-medium">{profile.role}</p>
                    <p className="text-sm text-[#5f6b8b]">{profile.department}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setEditedProfile(profile);
                    setIsEditing(true);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-[0_0_15px_#00f7ff80] hover:opacity-90 transition text-lg"
                >
                  Edit Profile
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
                <div className="space-y-4">
                  <p><span className="font-semibold text-cyan-300">Email:</span> <span className="text-[#9aa0b4]">{profile.email}</span></p>
                  <p><span className="font-semibold text-cyan-300">Phone:</span> <span className="text-[#9aa0b4]">{profile.phone || '-'}</span></p>
                  <p><span className="font-semibold text-cyan-300">Department:</span> <span className="text-[#9aa0b4]">{profile.department}</span></p>
                  <p><span className="font-semibold text-cyan-300">Location:</span> <span className="text-[#9aa0b4]">{profile.location || '-'}</span></p>
                </div>
                <div className="space-y-4">
                  <p><span className="font-semibold text-cyan-300">Bio:</span> <span className="text-[#9aa0b4]">{profile.bio}</span></p>
                  {/* Add more fields as needed */}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}