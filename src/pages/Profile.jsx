import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Calendar,
  Camera,
} from "lucide-react";
import { authService } from "../services/authService";
import Spinner from "../components/ui/Spinner";
import { toast } from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const ProfileField = ({ icon: Icon, label, value, color = "blue" }) => (
  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
    <div className={`p-2 bg-${color}-100 rounded-lg flex-shrink-0`}>
      <Icon className={`w-5 h-5 text-${color}-600`} />
    </div>
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-800 mt-0.5">
        {value || (
          <span className="text-gray-400 font-normal">Not provided</span>
        )}
      </p>
    </div>
  </div>
);

const getRoleBadgeColor = (role) => {
  const map = {
    super_admin: "bg-purple-100 text-purple-700 border border-purple-200",
    center_admin: "bg-blue-100 text-blue-700 border border-blue-200",
    teacher: "bg-green-100 text-green-700 border border-green-200",
    parents: "bg-orange-100 text-orange-700 border border-orange-200",
    student: "bg-teal-100 text-teal-700 border border-teal-200",
  };
  return map[role] || "bg-gray-100 text-gray-700 border border-gray-200";
};

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' or 'security'

  // Profile Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await authService.me();
      const user = data.data ?? data;
      setProfile(user);
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const data = new FormData();
      data.append("name", formData.name);
      data.append("phone", formData.phone);
      data.append("address", formData.address);
      if (imageFile) {
        data.append("profile_image", imageFile);
      }

      await authService.updateProfile(data);
      toast.success("Profile updated successfully");
      setIsEditing(false);
      setImageFile(null);
      setImagePreview(null);
      fetchProfile();
    } catch (error) {
      console.error("Update failed:", error);
      const message =
        error.response?.data?.message || "Failed to update profile";
      toast.error(message);
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwordData.new_password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setUpdating(true);
      await authService.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        new_password_confirmation: passwordData.new_password_confirmation,
      });
      toast.success("Password changed successfully");
      setPasswordData({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
    } catch (error) {
      console.error("Password change failed:", error);
      const message =
        error.response?.data?.message || "Failed to change password";
      toast.error(message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20 text-gray-500">
        <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>Could not load profile information.</p>
      </div>
    );
  }

  const photoUrl = imagePreview || profile.profile_photo_path || null;

  const formattedRole = profile.role
    ?.replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const joinDate = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl shadow-blue-100">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={profile.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center border-4 border-white shadow-lg">
                <User className="w-12 h-12 text-white/80" />
              </div>
            )}
            {isEditing && (
              <label
                htmlFor="profile-image-upload"
                className="absolute -bottom-1 -right-1 bg-blue-400 rounded-full p-2 border-2 border-white cursor-pointer hover:bg-blue-500 transition-colors"
                title="Change Photo"
              >
                <Camera className="w-4 h-4 text-white" />
                <input
                  id="profile-image-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            )}
            {!isEditing && (
              <div className="absolute -bottom-1 -right-1 bg-blue-400 rounded-full p-1.5 border-2 border-white">
                <Camera className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <p className="text-blue-100 text-sm mt-0.5">{profile.email}</p>
              </div>
              <div>
                {!isEditing && activeTab === "profile" && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-colors border border-white/20"
                  >
                    Edit Profile
                  </button>
                )}
                {isEditing && (
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-colors border border-white/20"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(profile.role)} bg-white/90`}
              >
                <Shield className="w-3 h-3 mr-1" />
                {formattedRole}
              </span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${profile.is_active ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"} bg-white/90`}
              >
                {profile.is_active ? "● Active" : "● Inactive"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
        <button
          onClick={() => {
            setActiveTab("profile");
            setIsEditing(false);
          }}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
            activeTab === "profile"
              ? "bg-blue-600 text-white shadow-md shadow-blue-100"
              : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          Personal Info
        </button>
        <button
          onClick={() => {
            setActiveTab("security");
            setIsEditing(false);
          }}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
            activeTab === "security"
              ? "bg-blue-600 text-white shadow-md shadow-blue-100"
              : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          Security
        </button>
      </div>

      {/* Content Area */}
      {activeTab === "profile" ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              Profile Information
            </h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center"
              >
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
                    placeholder="Enter your address"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setImagePreview(null);
                    setImageFile(null);
                    setFormData({
                      name: profile.name || "",
                      phone: profile.phone || "",
                      address: profile.address || "",
                    });
                  }}
                  className="px-6 py-2 border border-gray-200 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
                  disabled={updating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center disabled:opacity-70"
                  disabled={updating}
                >
                  {updating ? (
                    <>
                      <Spinner
                        size="sm"
                        className="mr-2 border-white/30 border-t-white"
                      />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ProfileField
                icon={User}
                label="Full Name"
                value={profile.name}
              />
              <ProfileField
                icon={Mail}
                label="Email Address"
                value={profile.email}
                color="indigo"
              />
              <ProfileField
                icon={Phone}
                label="Phone Number"
                value={profile.phone}
                color="green"
              />
              <ProfileField
                icon={MapPin}
                label="Address"
                value={profile.address}
                color="orange"
              />
              <ProfileField
                icon={Shield}
                label="Role"
                value={formattedRole}
                color="purple"
              />
              {joinDate && (
                <ProfileField
                  icon={Calendar}
                  label="Member Since"
                  value={joinDate}
                  color="teal"
                />
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Security Settings
          </h3>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                name="current_password"
                value={passwordData.current_password}
                onChange={handlePasswordInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                placeholder="Enter current password"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                  placeholder="At least 6 characters"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="new_password_confirmation"
                  value={passwordData.new_password_confirmation}
                  onChange={handlePasswordInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                  placeholder="Repeat new password"
                  required
                />
              </div>
            </div>
            <div className="pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center disabled:opacity-70"
                disabled={updating}
              >
                {updating ? (
                  <>
                    <Spinner
                      size="sm"
                      className="mr-2 border-white/30 border-t-white"
                    />
                    Updating Password...
                  </>
                ) : (
                  "Change Password"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;
