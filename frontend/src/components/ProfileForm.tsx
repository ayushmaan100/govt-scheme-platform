// src/components/ProfileForm.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile } from '@/types';
import { checkEligibility } from '@/lib/api';
import {
  User, MapPin, Briefcase, IndianRupee,
  ChevronRight, ChevronLeft, Loader2, AlertCircle
} from 'lucide-react';

// ── All Indian States ───────────────────────────────────
const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli',
  'Daman and Diu','Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry',
];

// ── Form Steps Config ───────────────────────────────────
const STEPS = [
  { id: 1, title: 'Personal Info',  titleHi: 'व्यक्तिगत जानकारी', icon: User },
  { id: 2, title: 'Location',       titleHi: 'स्थान',              icon: MapPin },
  { id: 3, title: 'Occupation',     titleHi: 'व्यवसाय',            icon: Briefcase },
  { id: 4, title: 'Financial',      titleHi: 'आर्थिक जानकारी',    icon: IndianRupee },
];

// ── Income brackets (UX-friendly) ──────────────────────
const INCOME_BRACKETS = [
  { label: 'Below ₹50,000/year',         labelHi: '₹50,000/वर्ष से कम',         value: 40000  },
  { label: '₹50,000 – ₹1,00,000/year',  labelHi: '₹50,000 – ₹1,00,000/वर्ष',  value: 75000  },
  { label: '₹1,00,000 – ₹1,50,000/year',labelHi: '₹1,00,000 – ₹1,50,000/वर्ष',value: 125000 },
  { label: '₹1,50,000 – ₹2,50,000/year',labelHi: '₹1,50,000 – ₹2,50,000/वर्ष',value: 200000 },
  { label: '₹2,50,000 – ₹5,00,000/year',labelHi: '₹2,50,000 – ₹5,00,000/वर्ष',value: 375000 },
  { label: 'Above ₹5,00,000/year',       labelHi: '₹5,00,000/वर्ष से अधिक',    value: 600000 },
];

interface Props {
  isHindi: boolean;
}

// ── Reusable Field Components ───────────────────────────

function Label({ en, hi, isHindi, required }: { en: string; hi: string; isHindi: boolean; required?: boolean }) {
  return (
    <label className={`block text-sm font-medium text-slate-300 mb-2 ${isHindi ? 'font-hindi' : ''}`}>
      {isHindi ? hi : en}
      {required && <span className="text-saffron-400 ml-1">*</span>}
    </label>
  );
}

function OptionGrid({ options, value, onChange, columns = 2 }: {
  options: { value: string; label: string; labelHi?: string; icon?: string }[];
  value: string;
  onChange: (v: string) => void;
  columns?: number;
}) {
  return (
    <div className={`grid gap-2 ${columns === 3 ? 'grid-cols-3' : columns === 4 ? 'grid-cols-4' : 'grid-cols-2'}`}>
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`
            relative flex flex-col items-center gap-1.5 p-3 rounded-xl border text-sm font-medium
            transition-all duration-150
            ${value === opt.value
              ? 'bg-saffron-500/15 border-saffron-500/60 text-saffron-300'
              : 'bg-white/[0.03] border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300'
            }
          `}
        >
          {opt.icon && <span className="text-xl">{opt.icon}</span>}
          <span className="text-xs text-center leading-tight">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

function YesNoToggle({ value, onChange, isHindi }: {
  value: boolean | undefined;
  onChange: (v: boolean) => void;
  isHindi: boolean;
}) {
  return (
    <div className="flex gap-2">
      {[
        { v: true,  en: 'Yes', hi: 'हाँ' },
        { v: false, en: 'No',  hi: 'नहीं' },
      ].map(opt => (
        <button
          key={String(opt.v)}
          type="button"
          onClick={() => onChange(opt.v)}
          className={`
            flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all
            ${value === opt.v
              ? 'bg-saffron-500/15 border-saffron-500/60 text-saffron-300'
              : 'bg-white/[0.03] border-white/10 text-slate-400 hover:border-white/20'
            }
          `}
        >
          <span className={isHindi ? 'font-hindi' : ''}>{isHindi ? opt.hi : opt.en}</span>
        </button>
      ))}
    </div>
  );
}

// ── Main Form Component ─────────────────────────────────

export function ProfileForm({ isHindi }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState<Partial<UserProfile>>({
    hasBankAccount: true,
  });

  const set = (field: keyof UserProfile, value: unknown) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  // ── Step Validation ─────────────────────────────────
  const canProceed = (): boolean => {
    if (step === 1) return !!(profile.age && profile.gender && profile.caste);
    if (step === 2) return !!profile.state;
    if (step === 3) return !!profile.occupation;
    if (step === 4) return profile.annualIncome !== undefined;
    return true;
  };

  // ── Submit ──────────────────────────────────────────
  const handleSubmit = async () => {
    if (!canProceed()) return;
    setLoading(true);
    setError(null);

    try {
      const fullProfile = profile as UserProfile;
      const result = await checkEligibility(fullProfile);

      // Store result in sessionStorage → results page reads it
      sessionStorage.setItem('eligibility_result', JSON.stringify(result));
      sessionStorage.setItem('eligibility_hindi', String(isHindi));
      router.push('/results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  // ── Progress ────────────────────────────────────────
  const progress = (step / STEPS.length) * 100;

  return (
    <div className="w-full max-w-lg mx-auto">

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((s) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                transition-all duration-300
                ${s.id < step  ? 'bg-saffron-500 text-white' : ''}
                ${s.id === step ? 'bg-saffron-500/20 border-2 border-saffron-500 text-saffron-400' : ''}
                ${s.id > step  ? 'bg-white/5 border border-white/10 text-slate-600' : ''}
              `}>
                {s.id < step ? '✓' : s.id}
              </div>
              {s.id < STEPS.length && (
                <div className={`
                  h-px flex-1 w-12 transition-all duration-500
                  ${s.id < step ? 'bg-saffron-500' : 'bg-white/8'}
                `} />
              )}
            </div>
          ))}
        </div>
        <div className="h-1 bg-white/8 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-saffron-600 to-saffron-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className={`text-xs text-slate-500 mt-2 ${isHindi ? 'font-hindi' : ''}`}>
          {isHindi
            ? `चरण ${step} / ${STEPS.length} — ${STEPS[step-1].titleHi}`
            : `Step ${step} of ${STEPS.length} — ${STEPS[step-1].title}`}
        </p>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-sm">

        {/* ─── STEP 1: Personal Info ─────────────────── */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-up">
            <h2 className={`text-lg font-semibold text-white ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? 'आपकी व्यक्तिगत जानकारी' : 'Tell us about yourself'}
            </h2>

            {/* Age */}
            <div>
              <Label en="Your Age" hi="आपकी आयु" isHindi={isHindi} required />
              <input
                type="number"
                min={5} max={100}
                placeholder={isHindi ? 'आयु (वर्षों में)' : 'Enter your age'}
                value={profile.age || ''}
                onChange={e => set('age', parseInt(e.target.value) || undefined)}
                className="
                  w-full px-4 py-3 rounded-xl
                  bg-white/5 border border-white/10
                  text-white placeholder-slate-600
                  focus:border-saffron-500/60 focus:bg-white/8
                  outline-none transition-all text-sm
                "
              />
            </div>

            {/* Gender */}
            <div>
              <Label en="Gender" hi="लिंग" isHindi={isHindi} required />
              <OptionGrid
                columns={3}
                value={profile.gender || ''}
                onChange={v => set('gender', v)}
                options={[
                  { value: 'male',   label: isHindi ? 'पुरुष'    : 'Male',   icon: '👨' },
                  { value: 'female', label: isHindi ? 'महिला'    : 'Female', icon: '👩' },
                  { value: 'other',  label: isHindi ? 'अन्य'     : 'Other',  icon: '🧑' },
                ]}
              />
            </div>

            {/* Caste */}
            <div>
              <Label en="Category" hi="श्रेणी" isHindi={isHindi} required />
              <OptionGrid
                columns={4}
                value={profile.caste || ''}
                onChange={v => set('caste', v)}
                options={[
                  { value: 'general', label: isHindi ? 'सामान्य' : 'General' },
                  { value: 'OBC',     label: 'OBC' },
                  { value: 'SC',      label: 'SC' },
                  { value: 'ST',      label: 'ST' },
                ]}
              />
            </div>
          </div>
        )}

        {/* ─── STEP 2: Location ──────────────────────── */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-up">
            <h2 className={`text-lg font-semibold text-white ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? 'आप कहाँ रहते हैं?' : 'Where do you live?'}
            </h2>

            {/* State */}
            <div>
              <Label en="State / UT" hi="राज्य / केंद्र शासित प्रदेश" isHindi={isHindi} required />
              <select
                value={profile.state || ''}
                onChange={e => set('state', e.target.value)}
                className="
                  w-full px-4 py-3 rounded-xl
                  bg-white/5 border border-white/10
                  text-white
                  focus:border-saffron-500/60 focus:bg-white/8
                  outline-none transition-all text-sm
                  appearance-none cursor-pointer
                "
              >
                <option value="" disabled className="bg-slate-900">
                  {isHindi ? 'राज्य चुनें' : 'Select your state'}
                </option>
                {STATES.map(s => (
                  <option key={s} value={s} className="bg-slate-900">{s}</option>
                ))}
              </select>
            </div>

            {/* Ration Card */}
            <div>
              <Label en="Do you have a Ration Card?" hi="क्या आपके पास राशन कार्ड है?" isHindi={isHindi} />
              <YesNoToggle
                value={profile.hasRationCard}
                onChange={v => set('hasRationCard', v)}
                isHindi={isHindi}
              />
            </div>

            {/* BPL */}
            <div>
              <Label
                en="Is your household BPL (Below Poverty Line)?"
                hi="क्या आपका परिवार BPL (गरीबी रेखा से नीचे) है?"
                isHindi={isHindi}
              />
              <YesNoToggle
                value={profile.isBplHousehold}
                onChange={v => set('isBplHousehold', v)}
                isHindi={isHindi}
              />
            </div>
          </div>
        )}

        {/* ─── STEP 3: Occupation ────────────────────── */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-up">
            <h2 className={`text-lg font-semibold text-white ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? 'आप क्या करते हैं?' : 'What do you do?'}
            </h2>

            <div>
              <Label en="Occupation" hi="व्यवसाय" isHindi={isHindi} required />
              <OptionGrid
                columns={2}
                value={profile.occupation || ''}
                onChange={v => set('occupation', v)}
                options={[
                  { value: 'farmer',       label: isHindi ? 'किसान'          : 'Farmer',         icon: '🌾' },
                  { value: 'student',      label: isHindi ? 'छात्र'          : 'Student',        icon: '📚' },
                  { value: 'worker',       label: isHindi ? 'कामगार'         : 'Worker',         icon: '⚒️' },
                  { value: 'unemployed',   label: isHindi ? 'बेरोजगार'       : 'Unemployed',     icon: '🔍' },
                  { value: 'self_employed',label: isHindi ? 'स्व-रोजगार'     : 'Self-Employed',  icon: '💼' },
                  { value: 'other',        label: isHindi ? 'अन्य'           : 'Other',          icon: '🧑' },
                ]}
              />
            </div>

            {/* Conditional: Student → studying? */}
            {profile.occupation === 'student' && (
              <div className="animate-fade-in">
                <Label
                  en="Are you currently enrolled in school/college?"
                  hi="क्या आप वर्तमान में स्कूल/कॉलेज में हैं?"
                  isHindi={isHindi}
                />
                <YesNoToggle
                  value={profile.isCurrentlyStudying}
                  onChange={v => set('isCurrentlyStudying', v)}
                  isHindi={isHindi}
                />
              </div>
            )}

            {/* Conditional: Farmer → land area */}
            {profile.occupation === 'farmer' && (
              <div className="animate-fade-in">
                <Label
                  en="Land area (in acres, approximate)"
                  hi="भूमि क्षेत्र (एकड़ में, अनुमानित)"
                  isHindi={isHindi}
                />
                <input
                  type="number"
                  min={0} step={0.5}
                  placeholder={isHindi ? 'एकड़ में भूमि' : 'e.g. 2.5'}
                  value={profile.landAreaAcres || ''}
                  onChange={e => set('landAreaAcres', parseFloat(e.target.value) || undefined)}
                  className="
                    w-full px-4 py-3 rounded-xl
                    bg-white/5 border border-white/10
                    text-white placeholder-slate-600
                    focus:border-saffron-500/60 focus:bg-white/8
                    outline-none transition-all text-sm
                  "
                />
              </div>
            )}
          </div>
        )}

        {/* ─── STEP 4: Financial ─────────────────────── */}
        {step === 4 && (
          <div className="space-y-5 animate-fade-up">
            <h2 className={`text-lg font-semibold text-white ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? 'आर्थिक जानकारी' : 'Financial Details'}
            </h2>

            {/* Income bracket */}
            <div>
              <Label
                en="Annual household income (approximate)"
                hi="वार्षिक घरेलू आय (अनुमानित)"
                isHindi={isHindi}
                required
              />
              <div className="space-y-2">
                {INCOME_BRACKETS.map(bracket => (
                  <button
                    key={bracket.value}
                    type="button"
                    onClick={() => set('annualIncome', bracket.value)}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm
                      transition-all duration-150
                      ${profile.annualIncome === bracket.value
                        ? 'bg-saffron-500/15 border-saffron-500/60 text-saffron-300'
                        : 'bg-white/[0.03] border-white/8 text-slate-400 hover:border-white/15'
                      }
                    `}
                  >
                    <span className={isHindi ? 'font-hindi' : ''}>
                      {isHindi ? bracket.labelHi : bracket.label}
                    </span>
                    {profile.annualIncome === bracket.value && (
                      <span className="text-saffron-400">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Bank account */}
            <div>
              <Label
                en="Do you have a bank account?"
                hi="क्या आपके पास बैंक खाता है?"
                isHindi={isHindi}
              />
              <YesNoToggle
                value={profile.hasBankAccount}
                onChange={v => set('hasBankAccount', v)}
                isHindi={isHindi}
              />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              className="
                flex items-center gap-2 px-4 py-2.5 rounded-xl
                bg-white/5 border border-white/10 hover:border-white/20
                text-slate-300 text-sm font-medium
                transition-all
              "
            >
              <ChevronLeft className="w-4 h-4" />
              {isHindi ? 'वापस' : 'Back'}
            </button>
          )}

          {step < STEPS.length ? (
            <button
              type="button"
              onClick={() => canProceed() && setStep(s => s + 1)}
              disabled={!canProceed()}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                font-semibold text-sm transition-all
                ${canProceed()
                  ? 'bg-saffron-500 hover:bg-saffron-400 text-white'
                  : 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/8'
                }
              `}
            >
              {isHindi ? 'आगे बढ़ें' : 'Continue'}
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canProceed() || loading}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                font-semibold text-sm transition-all
                ${canProceed() && !loading
                  ? 'bg-saffron-500 hover:bg-saffron-400 text-white'
                  : 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/8'
                }
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isHindi ? 'जाँच हो रही है...' : 'Checking…'}
                </>
              ) : (
                <>
                  {isHindi ? 'योजनाएं देखें' : 'Find My Schemes'}
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}