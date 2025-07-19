import React, { useState } from 'react';
import { Briefcase, FileText, Camera, CheckCircle, XCircle, Loader, ArrowLeft, User } from 'lucide-react';

// Define Gold DAO color palette
const colors = {
  darkBackground: '#0D0D0D',
  cardBackground: '#1A1A1A',
  goldPrimary: '#FFD700',
  whiteText: '#FFFFFF',
  lightGrey: '#B0B0B0',
  greenSuccess: '#28A745',
  redError: '#DC3545',
};

// Reusable Button component
const Button = ({ children, icon: Icon, onClick, className = '', type = 'button', disabled = false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center justify-center px-6 py-3 rounded-full font-semibold text-lg transition-all duration-300 ease-in-out
                bg-gradient-to-r from-[${colors.goldPrimary}] to-yellow-600 text-black
                hover:from-yellow-600 hover:to-[${colors.goldPrimary}] hover:shadow-xl
                focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-50 w-full mb-2
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                ${className}`}
  >
    {Icon && <Icon size={20} className="mr-2" />}
    {children}
  </button>
);

export default function KycLegalEntityPage() {
  const [companyName, setCompanyName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [registrationDocumentFile, setRegistrationDocumentFile] = useState(null);
  const [proofOfAddressFile, setProofOfAddressFile] = useState(null);
  const [authorizedSignatoryName, setAuthorizedSignatoryName] = useState('');
  const [authorizedSignatoryIdFile, setAuthorizedSignatoryIdFile] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle file input changes
  const handleFileChange = (setter) => (e) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  // Simulated KYC submission function for Legal Entity
  const handleSubmitKyc = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    if (!companyName || !cnpj || !registrationDocumentFile || !proofOfAddressFile || !authorizedSignatoryName || !authorizedSignatoryIdFile) {
      setError('Please fill in all required fields and upload all necessary files.');
      setLoading(false);
      return;
    }

    // In a real application, you would upload files to a storage service (e.g., Firebase Storage, S3)
    // and then send the URLs to your backend.
    // For this simulation, we'll just use placeholder URLs.
    const registrationDocURL = 'https://example.com/company_registration_placeholder.pdf';
    const proofOfAddressURL = 'https://example.com/company_address_placeholder.pdf';
    const signatoryIdURL = 'https://example.com/signatory_id_placeholder.pdf';

    // TODO: Integrate with backend /api/kyc/pj
    // const payload = {
    //   companyName,
    //   cnpj,
    //   registrationDocumentUrl: registrationDocURL,
    //   proofOfAddressUrl: proofOfAddressURL,
    //   authorizedSignatory: {
    //     name: authorizedSignatoryName,
    //     idDocumentUrl: signatoryIdURL,
    //   },
    // };
    /*
    try {
      const response = await fetch('/api/kyc/pj', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer YOUR_JWT_TOKEN` // Include auth token
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (result.success) {
        setSuccessMessage('KYC for Legal Entity submitted successfully! Your verification is pending review.');
        // Optionally clear form or navigate
      } else {
        setError(result.error || 'KYC submission failed. Please try again.');
      }
    } catch (err) {
      console.error('KYC submission error:', err);
      setError('An unexpected error occurred during submission. Please try again.');
    } finally {
      setLoading(false);
    }
    */

    // Simulated success for demonstration
    setTimeout(() => {
      setSuccessMessage('KYC for Legal Entity submitted successfully! Your verification is pending review.');
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: colors.darkBackground }}>
      <div className="w-full max-w-lg bg-[rgba(26,26,26,0.98)] p-8 rounded-xl shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => window.location.href = '/dashboard'} className="text-[${colors.lightGrey}] hover:text-[${colors.goldPrimary}] transition-colors duration-200">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-3xl font-bold text-center flex-grow" style={{ color: colors.goldPrimary }}>
            KYC Verification (Legal Entity)
          </h2>
          <div className="w-6"></div> {/* Spacer for alignment */}
        </div>

        {successMessage && (
          <div className="mb-6 p-4 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.greenSuccess, color: colors.whiteText }}>
            <CheckCircle size={24} className="mr-3" />
            <p className="text-lg">{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.redError, color: colors.whiteText }}>
            <XCircle size={24} className="mr-3" />
            <p className="text-lg">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmitKyc}>
          <div className="mb-6">
            <label htmlFor="companyName" className="block mb-2 text-lg" style={{ color: colors.lightGrey }}>
              Company Name
            </label>
            <div className="flex items-center bg-[#181818] rounded-lg p-3">
              <Briefcase size={20} color={colors.goldPrimary} className="mr-3" />
              <input
                id="companyName"
                type="text"
                className="bg-transparent outline-none w-full text-white placeholder-gray-500"
                placeholder="Your company's legal name"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="cnpj" className="block mb-2 text-lg" style={{ color: colors.lightGrey }}>
              CNPJ / Company Registration Number
            </label>
            <div className="flex items-center bg-[#181818] rounded-lg p-3">
              <FileText size={20} color={colors.goldPrimary} className="mr-3" />
              <input
                id="cnpj"
                type="text"
                className="bg-transparent outline-none w-full text-white placeholder-gray-500"
                placeholder="e.g., 00.000.000/0000-00 or equivalent"
                value={cnpj}
                onChange={e => setCnpj(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="registrationDocumentUpload" className="block mb-2 text-lg" style={{ color: colors.lightGrey }}>
              Upload Company Registration Document
            </label>
            <div className="flex items-center bg-[#181818] rounded-lg p-3 cursor-pointer">
              <FileText size={20} color={colors.goldPrimary} className="mr-3" />
              <input
                id="registrationDocumentUpload"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange(setRegistrationDocumentFile)}
                className="hidden"
                required
              />
              <span className="text-white w-full">
                {registrationDocumentFile ? registrationDocumentFile.name : 'Choose file (Image or PDF)'}
              </span>
              <button
                type="button"
                onClick={() => document.getElementById('registrationDocumentUpload').click()}
                className="ml-auto px-4 py-2 bg-yellow-600 text-black rounded-md hover:bg-yellow-700 transition-colors"
              >
                Browse
              </button>
            </div>
            <p className="text-sm mt-2" style={{ color: colors.lightGrey }}>
              Accepted formats: JPG, PNG, PDF. Max size: 5MB.
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="proofOfAddressUpload" className="block mb-2 text-lg" style={{ color: colors.lightGrey }}>
              Upload Proof of Company Address
            </label>
            <div className="flex items-center bg-[#181818] rounded-lg p-3 cursor-pointer">
              <FileText size={20} color={colors.goldPrimary} className="mr-3" />
              <input
                id="proofOfAddressUpload"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange(setProofOfAddressFile)}
                className="hidden"
                required
              />
              <span className="text-white w-full">
                {proofOfAddressFile ? proofOfAddressFile.name : 'Choose file (Utility bill, bank statement, etc.)'}
              </span>
              <button
                type="button"
                onClick={() => document.getElementById('proofOfAddressUpload').click()}
                className="ml-auto px-4 py-2 bg-yellow-600 text-black rounded-md hover:bg-yellow-700 transition-colors"
              >
                Browse
              </button>
            </div>
            <p className="text-sm mt-2" style={{ color: colors.lightGrey }}>
              Accepted formats: JPG, PNG, PDF. Max size: 5MB.
            </p>
          </div>

          <div className="mb-6 border-t border-gray-700 pt-6 mt-6">
            <h3 className="text-xl font-semibold mb-4" style={{ color: colors.whiteText }}>Authorized Signatory Details</h3>
            <div className="mb-4">
              <label htmlFor="signatoryName" className="block mb-2 text-lg" style={{ color: colors.lightGrey }}>
                Full Name of Authorized Signatory
              </label>
              <div className="flex items-center bg-[#181818] rounded-lg p-3">
                <User size={20} color={colors.goldPrimary} className="mr-3" />
                <input
                  id="signatoryName"
                  type="text"
                  className="bg-transparent outline-none w-full text-white placeholder-gray-500"
                  placeholder="Full name of person authorized to sign"
                  value={authorizedSignatoryName}
                  onChange={e => setAuthorizedSignatoryName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="signatoryIdUpload" className="block mb-2 text-lg" style={{ color: colors.lightGrey }}>
                Upload Authorized Signatory's ID Document
              </label>
              <div className="flex items-center bg-[#181818] rounded-lg p-3 cursor-pointer">
                <FileText size={20} color={colors.goldPrimary} className="mr-3" />
                <input
                  id="signatoryIdUpload"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange(setAuthorizedSignatoryIdFile)}
                  className="hidden"
                  required
                />
                <span className="text-white w-full">
                  {authorizedSignatoryIdFile ? authorizedSignatoryIdFile.name : 'Choose file (Image or PDF)'}
                </span>
                <button
                  type="button"
                  onClick={() => document.getElementById('signatoryIdUpload').click()}
                  className="ml-auto px-4 py-2 bg-yellow-600 text-black rounded-md hover:bg-yellow-700 transition-colors"
                >
                  Browse
                </button>
              </div>
              <p className="text-sm mt-2" style={{ color: colors.lightGrey }}>
                Accepted formats: JPG, PNG, PDF. Max size: 5MB.
              </p>
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? (
              <span className="flex items-center">
                <Loader size={20} className="animate-spin mr-2" /> Submitting...
              </span>
            ) : (
              'Submit for Verification'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-base" style={{ color: colors.lightGrey }}>
            Need to verify as an Individual?{' '}
            <a href="/kyc/pf" className="text-base font-medium hover:underline" style={{ color: colors.goldPrimary }}>
              Click here
            </a>
          </p>
        </div>
      </div>
      <script src="https://cdn.tailwindcss.com"></script>
      <script dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          theme: {
            extend: {
              fontFamily: {
                inter: ['Inter', 'sans-serif'],
              },
              colors: {
                darkBackground: '${colors.darkBackground}',
                cardBackground: '${colors.cardBackground}',
                goldPrimary: '${colors.goldPrimary}',
                blueAccent: '${colors.blueAccent}',
                whiteText: '${colors.whiteText}',
                lightGrey: '${colors.lightGrey}',
                greenSuccess: '${colors.greenSuccess}',
                redError: '${colors.redError}',
              }
            }
          }
        }
      `}} />
    </div>
  );
}
