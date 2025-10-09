import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/userService';
import { toast } from 'react-toastify';
import LoadingSpinner from '../common/LoadingSpinner';
import Input from '../common/Input';
import Button from '../common/Button';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    profile: {
      licenseNumber: '',
      address: '',
      dateOfBirth: ''
    }
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        profile: {
          licenseNumber: user.profile?.licenseNumber || '',
          address: user.profile?.address || '',
          dateOfBirth: user.profile?.dateOfBirth ? user.profile.dateOfBirth.split('T')[0] : ''
        }
      });
      setAvatarPreview(user.profile?.avatar || '');
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('profile.')) {
      const profileField = name.split('.')[1];
      setProfile(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [profileField]: value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('phoneNumber', profile.phoneNumber);
      formData.append('profile[licenseNumber]', profile.profile.licenseNumber);
      formData.append('profile[address]', profile.profile.address);
      formData.append('profile[dateOfBirth]', profile.profile.dateOfBirth);
      
      if (avatar) {
        formData.append('avatar', avatar);
      }

      const response = await userService.updateProfile(formData);
      updateUser(response.data.user);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
          <p className="text-sm text-gray-600">Update your account information and personal details</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              name="name"
              value={profile.name}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={profile.email}
              disabled
              className="bg-gray-50"
            />
            <Input
              label="Phone Number"
              name="phoneNumber"
              value={profile.phoneNumber}
              onChange={handleInputChange}
              required
            />
            <Input
              label="License Number"
              name="profile.licenseNumber"
              value={profile.profile.licenseNumber}
              onChange={handleInputChange}
            />
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                name="profile.address"
                value={profile.profile.address}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your address"
              />
            </div>
            <Input
              label="Date of Birth"
              name="profile.dateOfBirth"
              type="date"
              value={profile.profile.dateOfBirth}
              onChange={handleInputChange}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              loading={updating}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Update Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;