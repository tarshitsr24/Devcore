import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api, { getAssetUrl } from '../services/api';
import ImageCropModal from '../components/ImageCropModal';
import { Building2, Mail, Globe, Linkedin, MapPin, User, CheckCircle2, AlertCircle, Save, Upload } from 'lucide-react';

export default function OrganizationProfile() {
  const { user } = useAuth();

  const [orgName, setOrgName] = useState('');
  const [logo, setLogo] = useState('');
  const [logoPreview, setLogoPreview] = useState('');
  const [officialEmail, setOfficialEmail] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [linkedIn, setLinkedIn] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [cropImage, setCropImage] = useState(null);

  useEffect(() => {
    fetchOrgProfile();
  }, []);

  const fetchOrgProfile = async () => {
    try {
      const res = await api.get('/profile/organization');
      if (res.data.success && res.data.profile) {
        const p = res.data.profile;
        setOrgName(p.orgName || user?.fullName || '');
        setLogo(p.logo || '');
        setLogoPreview(getAssetUrl(p.logo || ''));
        setOfficialEmail(p.officialEmail || user?.email || '');
        setDescription(p.description || '');
        setWebsite(p.website || '');
        setLinkedIn(p.linkedIn || '');
        setIndustry(p.industry || 'Technology');
        setLocation(p.location || '');
        setContactPerson(p.contactPerson || '');
        setIsVerified(p.isVerified || false);
      }
    } catch (err) {
      console.error('Fetch org profile error:', err);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCropImage({ file, url: URL.createObjectURL(file) });
    e.target.value = '';
  };

  const handleCroppedLogoUpload = async (file) => {

    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    setError('');

    try {
      const res = await api.post('/profile/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setLogo(res.data.url);
        setLogoPreview(URL.createObjectURL(file));
        setMessage('Company logo uploaded successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Company logo upload failed.');
    } finally {
      setUploading(false);
      if (cropImage?.url) URL.revokeObjectURL(cropImage.url);
      setCropImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const payload = {
        orgName,
        logo,
        officialEmail,
        description,
        website,
        linkedIn,
        industry,
        location,
        contactPerson
      };

      const res = await api.put('/profile/organization', payload);
      if (res.data.success) {
        setMessage('Organization profile updated successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating organization profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* HEADER */}
      <div className="p-6 sm:p-8 rounded-md bg-white border border-[#E4E4E7] flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#09090B]">Organization Profile</h1>
          <p className="text-xs text-[#71717A]">Manage company details, logo, and official recruiter profile</p>
        </div>

        {isVerified ? (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Verified Company</span>
          </span>
        ) : (
          <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded border border-amber-200">
            Pending Admin Verification
          </span>
        )}
      </div>

      {message && (
        <div className="p-4 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 rounded-md bg-white border border-[#E4E4E7] space-y-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#52525B]">Organization Name</label>
            <input
              type="text"
              required
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-sm focus:bg-white focus:border-[#09090B] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#52525B]">Official Email</label>
            <input
              type="email"
              required
              value={officialEmail}
              onChange={(e) => setOfficialEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-sm focus:bg-white focus:border-[#09090B] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#52525B]">Company Logo</label>
            <div className="flex items-center gap-3">
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Company logo preview"
                  className="w-12 h-12 shrink-0 rounded-full object-cover border border-[#E4E4E7]"
                  onError={() => setLogoPreview('')}
                />
              )}
              <div className="flex min-w-0 flex-1 gap-2">
                <input
                  type="text"
                  value={logo}
                  onChange={(e) => {
                    setLogo(e.target.value);
                    setLogoPreview(getAssetUrl(e.target.value));
                  }}
                  placeholder="https://example.com/logo.png"
                  className="min-w-0 flex-1 px-4 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-sm focus:bg-white focus:border-[#09090B] focus:outline-none"
                />
                <label className="shrink-0 cursor-pointer px-3 py-2.5 rounded-md bg-[#09090B] hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-white" />
                  <span>From device</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleLogoUpload}
                    disabled={uploading}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>
            <p className="text-[11px] text-[#71717A]">Upload a JPG, PNG, or WebP image.</p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#52525B]">Industry / Domain</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="Software & Cloud Services"
              className="w-full px-4 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-sm focus:bg-white focus:border-[#09090B] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#52525B]">Headquarters / Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Bengaluru, India"
              className="w-full px-4 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-sm focus:bg-white focus:border-[#09090B] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#52525B]">Recruiter / Contact Person</label>
            <input
              type="text"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder="HR Lead / Technical Manager"
              className="w-full px-4 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-sm focus:bg-white focus:border-[#09090B] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#52525B]">Website URL</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://company.com"
              className="w-full px-4 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-sm focus:bg-white focus:border-[#09090B] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#52525B]">LinkedIn Company Page</label>
            <input
              type="url"
              value={linkedIn}
              onChange={(e) => setLinkedIn(e.target.value)}
              placeholder="https://linkedin.com/company/name"
              className="w-full px-4 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-sm focus:bg-white focus:border-[#09090B] focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#52525B]">Organization Overview & Mission</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide a brief overview of your company, mission, and work culture..."
            className="w-full px-4 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-sm focus:bg-white focus:border-[#09090B] focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-md bg-[#09090B] hover:bg-black text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Save className="w-4 h-4 text-white" />
              <span>Save Organization Profile</span>
            </>
          )}
        </button>

      </form>

      {cropImage && (
        <ImageCropModal
          image={cropImage}
          onCancel={(cropError) => {
            if (cropImage.url) URL.revokeObjectURL(cropImage.url);
            setCropImage(null);
            if (cropError) setError(cropError);
          }}
          onComplete={handleCroppedLogoUpload}
        />
      )}
    </div>
  );
}
