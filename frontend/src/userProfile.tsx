import React, { useState, useEffect } from 'react';
import { fetchUserProfile, updateUserProfile, fetchSubscriptionOverview, changePassword, type UserProfileDto, type SubscriptionOverviewDto } from './services/profileApi';

interface UserProfileProps {
  onNavigate?: (view: 'home' | 'dashboard' | 'library' | 'courses' | 'sessions' | 'forums' | 'profile' | 'subscription') => void;
  initialTab?: 'profile' | 'subscription' | 'security';
}

export default function UserProfile({ onNavigate: _onNavigate, initialTab = 'profile' }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'subscription' | 'security'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionOverviewDto | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  const [skillLevel, setSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [preferredGenres, setPreferredGenres] = useState<string[]>(['Jazz', 'Classical']);

  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchUserProfile().then((data) => {
      setProfile(data);
      setName(data.name);
      setAvatarUrl(data.avatarUrl);
      setBio(data.bio);
      setSkillLevel(data.skillLevel);
      setPreferredGenres(data.preferredGenres);
    });
    fetchSubscriptionOverview().then((sub) => setSubscription(sub));
  }, []);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await updateUserProfile({
      name,
      avatarUrl,
      bio,
      skillLevel,
      preferredGenres
    });
    setProfile(updated);
    showAlert('success', 'Your profile details have been saved successfully!');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showAlert('error', 'New passwords do not match!');
      return;
    }
    if (newPassword.length < 6) {
      showAlert('error', 'Password must be at least 6 characters long.');
      return;
    }
    const res = await changePassword({ currentPassword, newPassword, confirmPassword });
    if (res.success) {
      showAlert('success', 'Your password has been updated!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      showAlert('error', res.message);
    }
  };

  const toggleGenre = (genre: string) => {
    if (preferredGenres.includes(genre)) {
      setPreferredGenres(preferredGenres.filter((g) => g !== genre));
    } else {
      setPreferredGenres([...preferredGenres, genre]);
    }
  };

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const allGenres = ['Jazz', 'Classical', 'Pop', 'Gospel', 'Blues', 'Contemporary'];

  return (
    <main className="pt-16 pb-24 flex-grow relative overflow-hidden bg-[#eedcd5]">
      <div className="max-w-[1000px] mx-auto px-6 relative z-10 space-y-8">
        {/* Profile Header Card */}
        <div className="bg-white/80 backdrop-blur-md border border-[#dfa38f]/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center gap-6">
          <img
            src={avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80'}
            alt={name}
            className="w-24 h-24 rounded-full object-cover border-2 border-[#dfa38f] shadow-lg"
          />
          <div className="space-y-1 text-center md:text-left flex-grow">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h1 className="font-display-lg text-2xl font-bold text-[#4a372e]">{name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#dfa38f]/20 text-[#854d38] text-[10px] font-extrabold uppercase border border-[#dfa38f]/30">
                {skillLevel}
              </span>
            </div>
            <p className="text-xs text-[#8b7368]">{profile?.email || 'student@example.com'}</p>
            <p className="text-xs text-[#6e5a51] max-w-lg mt-2">{bio}</p>
          </div>
        </div>

        {/* System Alert */}
        {alert && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs ${
              alert.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {alert.type === 'success' ? 'check_circle' : 'error'}
            </span>
            {alert.message}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#dfa38f]/20 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'profile' ? 'bg-[#dfa38f] text-white shadow-md' : 'bg-white/70 text-[#6a564d] hover:bg-[#ffe5db]/40'
            }`}
          >
            Profile Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('subscription')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'subscription' ? 'bg-[#dfa38f] text-white shadow-md' : 'bg-white/70 text-[#6a564d] hover:bg-[#ffe5db]/40'
            }`}
          >
            Subscription Plan
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'security' ? 'bg-[#dfa38f] text-white shadow-md' : 'bg-white/70 text-[#6a564d] hover:bg-[#ffe5db]/40'
            }`}
          >
            Security & Password
          </button>
        </div>

        {/* TAB 1: Profile Details */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSave} className="bg-white/80 backdrop-blur-md border border-[#dfa38f]/30 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#6a564d]">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 p-2.5 border border-[#dfa38f]/30 rounded-xl text-xs text-[#4a372e]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#6a564d]">Avatar Image URL</label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full mt-1 p-2.5 border border-[#dfa38f]/30 rounded-xl text-xs text-[#4a372e]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#6a564d]">Musical Bio & Goals</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full mt-1 p-2.5 border border-[#dfa38f]/30 rounded-xl text-xs text-[#4a372e]"
                rows={3}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#6a564d]">Piano Skill Level</label>
              <div className="flex items-center gap-3 mt-2">
                {(['Beginner', 'Intermediate', 'Advanced'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSkillLevel(level)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      skillLevel === level ? 'bg-[#dfa38f] text-white border-[#dfa38f]' : 'bg-white text-[#6a564d] border-[#dfa38f]/30'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#6a564d]">Preferred Music Genres</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {allGenres.map((genre) => {
                  const selected = preferredGenres.includes(genre);
                  return (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => toggleGenre(genre)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                        selected ? 'bg-[#dfa38f] text-white border-[#dfa38f]' : 'bg-gray-50 text-gray-600 border-gray-200'
                      }`}
                    >
                      {selected ? '✓ ' : '+ '} {genre}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              style={{ backgroundImage: 'linear-gradient(135deg, #dfa38f 0%, #ab7e66 100%)' }}
              className="px-6 py-3 rounded-xl text-white text-xs font-bold uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Save Profile Changes
            </button>
          </form>
        )}

        {/* TAB 2: Subscription Plan */}
        {activeTab === 'subscription' && (
          <div className="bg-white/80 backdrop-blur-md border border-[#dfa38f]/30 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#dfa38f]/20 pb-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider">
                  Active Subscription
                </span>
                <h3 className="font-display-sm text-xl font-bold text-[#4a372e] mt-1">{subscription?.planName}</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#8b7368]">Billing Renewal</span>
                <p className="font-bold text-sm text-[#4a372e]">
                  {subscription?.renewalDate ? new Date(subscription.renewalDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#ffe5db]/40 to-[#dfa38f]/10 border border-[#dfa38f]/20">
                <span className="text-xs text-[#8b7368]">Indonesian Price</span>
                <p className="text-xl font-bold text-[#4a372e]">Rp {subscription?.priceIDR.toLocaleString('id-ID')}</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#ffe5db]/40 to-[#dfa38f]/10 border border-[#dfa38f]/20">
                <span className="text-xs text-[#8b7368]">Global Price</span>
                <p className="text-xl font-bold text-[#4a372e]">${subscription?.priceUSD} / Year</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Security & Password */}
        {activeTab === 'security' && (
          <form onSubmit={handlePasswordSubmit} className="bg-white/80 backdrop-blur-md border border-[#dfa38f]/30 rounded-2xl p-6 shadow-xl space-y-4 max-w-md">
            <h3 className="font-bold text-[#4a372e] text-base">Change Password</h3>

            <div>
              <label className="text-xs font-bold text-[#6a564d]">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full mt-1 p-2.5 border border-[#dfa38f]/30 rounded-xl text-xs text-[#4a372e]"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#6a564d]">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full mt-1 p-2.5 border border-[#dfa38f]/30 rounded-xl text-xs text-[#4a372e]"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#6a564d]">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full mt-1 p-2.5 border border-[#dfa38f]/30 rounded-xl text-xs text-[#4a372e]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#dfa38f] hover:bg-[#ab7e66] text-white text-xs font-bold uppercase rounded-xl transition-all shadow-md cursor-pointer"
            >
              Update Password
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
