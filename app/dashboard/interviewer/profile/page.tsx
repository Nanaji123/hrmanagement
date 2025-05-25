"use client";

import React, { useState, useEffect } from "react";

interface InterviewerProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  expertise: string[];
  totalInterviews: number;
  averageRating: number;
  completedInterviews: number;
  upcomingInterviews: number;
  joinDate: string;
  bio: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<InterviewerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/interviewer/profile");
      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();
      setProfile(data);
      setEditName(data.name);
      setEditBio(data.bio);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/interviewer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, bio: editBio }),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      const updated = await response.json();
      setProfile(updated);
      setIsEditing(false);
    } catch (err) {
      alert("Error saving profile: " + (err instanceof Error ? err.message : err));
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-sm p-4 bg-red-50 rounded-md">
          <p className="text-red-600 font-semibold mb-2">Error Loading Profile</p>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchProfile}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  if (!profile)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Profile not found.</p>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-md mt-10">
      <div className="flex items-center space-x-6 mb-6">
        <div className="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center text-4xl font-bold text-gray-700">
          {profile.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </div>
        <div>
          {isEditing ? (
            <input
              className="text-4xl font-bold text-gray-900 border-b border-gray-400 focus:outline-none focus:border-gray-400"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          ) : (
            <h1 className="text-4xl font-bold text-gray-900">{profile.name}</h1>
          )}
          <p className="text-gray-600">{profile.role}</p>
          <p className="text-gray-600">{profile.department}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
        <div className="space-y-4">
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Expertise:</strong> {profile.expertise.join(", ")}
          </p>
          <p>
            <strong>Join Date:</strong> {profile.joinDate}
          </p>
          <p>
            <strong>Bio:</strong>{" "}
            {isEditing ? (
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:border-gray-300"
                rows={4}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
              />
            ) : (
              profile.bio
            )}
          </p>
        </div>
        <div className="space-y-4">
          <p>
            <strong>Total Interviews:</strong> {profile.totalInterviews}
          </p>
          <p>
            <strong>Completed Interviews:</strong> {profile.completedInterviews}
          </p>
          <p>
            <strong>Upcoming Interviews:</strong> {profile.upcomingInterviews}
          </p>
          <p>
            <strong>Average Rating:</strong> {profile.averageRating.toFixed(1)}
          </p>
        </div>
      </div>

      <div className="mt-8 flex space-x-4">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditName(profile.name);
                setEditBio(profile.bio);
              }}
              className="px-6 py-3 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
} 