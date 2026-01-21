import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle, ArrowRight, ArrowLeft, Check, Car, Truck, Bike, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState('car');
  
  const { register, handleSubmit, trigger, watch, formState: { errors } } = useForm();
  const password = watch("password");

  const nextStep = async () => {
    let valid = false;
    if (step === 1) {
      valid = await trigger(['name', 'email', 'phone']);
    } else if (step === 2) {
      valid = await trigger(['password', 'confirmPassword']);
    }
    
    if (valid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      profile: {
        vehicleType: selectedVehicle
      }
    };

    try {
      await registerAuth(payload);
      navigate('/dashboard');
    } catch (error) {
      // handled by auth context
    } finally {
      setIsLoading(false);
    }
  };

  const getStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length > 6) score++;
    if (pass.match(/[A-Z]/)) score++;
    if (pass.match(/[0-9]/)) score++;
    if (pass.match(/[^A-Za-z0-9]/)) score++;
    return score;
  };
  
  const strength = getStrength(password);
  const strengthColor = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#15803d'];
  const strengthLabel = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];

  const vehicleOptions = [
    { id: 'car', label: 'Car', icon: Car },
    { id: 'bike', label: 'Two-Wheeler', icon: Bike },
    { id: 'truck', label: 'Heavy Vehicle', icon: Truck },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 right-1/4 w-96 h-96 bg-[#F59E0B]/30 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#8B5CF6]/20 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden md:block space-y-8"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="text-[#F59E0B]" size={32} />
              <h1 className="text-5xl font-display font-bold">
                Join the Safe<br />
                <span className="text-gradient-amber">Driving Community</span>
              </h1>
            </div>
            <p className="text-xl text-gray-400">
              50K+ users trust us for their daily commute.
            </p>
          </div>

          {/* Visual Representation */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-8 text-center"
          >
            <div className="text-6xl space-x-4">
              🚗 🚕 🚙
            </div>
            <p className="mt-4 text-gray-400">Navigate smarter, drive safer</p>
          </motion.div>
        </motion.div>

        {/* Right Side - Multi-step Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          <div className="glass-card rounded-2xl p-8 space-y-6 soft-shadow">
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-display font-bold">Create Account</h2>
              <p className="text-gray-400">Step {step} of 3</p>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center space-x-2">
              {[1, 2, 3].map(i => (
                <div 
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    step === i ? 'w-12 bg-[#8B5CF6]' : 
                    step > i ? 'w-8 bg-[#8B5CF6]/50' : 
                    'w-8 bg-white/10'
                  }`}
                />
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <AnimatePresence mode='wait'>
                {/* Step 1: Personal Info */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input 
                          className={`glass-input w-full pl-12 ${errors.name ? 'border-red-500' : ''}`}
                          placeholder="Enter full name"
                          {...register("name", { required: "Name is required" })}
                        />
                      </div>
                      {errors.name && (
                        <p className="text-red-500 text-sm flex items-center space-x-1">
                          <AlertCircle size={14} />
                          <span>{errors.name.message}</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input 
                          className={`glass-input w-full pl-12 ${errors.email ? 'border-red-500' : ''}`}
                          placeholder="Enter email address"
                          {...register("email", { 
                            required: "Email is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email"
                            }
                          })}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm flex items-center space-x-1">
                          <AlertCircle size={14} />
                          <span>{errors.email.message}</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input 
                          className={`glass-input w-full pl-12 ${errors.phone ? 'border-red-500' : ''}`}
                          placeholder="Enter phone number"
                          {...register("phone", { 
                            required: "Phone is required",
                            minLength: { value: 10, message: "Valid phone number required" }
                          })}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-sm flex items-center space-x-1">
                          <AlertCircle size={14} />
                          <span>{errors.phone.message}</span>
                        </p>
                      )}
                    </div>

                    <button type="button" onClick={nextStep} className="btn-violet w-full flex items-center justify-center space-x-2">
                      <span>Next Step</span>
                      <ArrowRight size={20} />
                    </button>
                  </motion.div>
                )}

                {/* Step 2: Password */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Create Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input 
                          type={showPassword ? "text" : "password"}
                          className={`glass-input w-full pl-12 pr-12 ${errors.password ? 'border-red-500' : ''}`}
                          placeholder="Enter password"
                          {...register("password", { 
                            required: "Password is required",
                            minLength: { value: 6, message: "Min 6 characters" }
                          })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      
                      {/* Strength Bar */}
                      {password && (
                        <div className="space-y-1">
                          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full transition-all duration-300"
                              style={{ 
                                width: `${(strength / 4) * 100}%`, 
                                backgroundColor: strengthColor[strength] 
                              }}
                            />
                          </div>
                          <p className="text-xs" style={{ color: strengthColor[strength] }}>
                            {strengthLabel[strength]}
                          </p>
                        </div>
                      )}
                      
                      {errors.password && (
                        <p className="text-red-500 text-sm flex items-center space-x-1">
                          <AlertCircle size={14} />
                          <span>{errors.password.message}</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input 
                          type="password"
                          className={`glass-input w-full pl-12 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                          placeholder="Re-enter password"
                          {...register("confirmPassword", { 
                            required: "Confirm password",
                            validate: val => val === password || "Passwords do not match"
                          })}
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm flex items-center space-x-1">
                          <AlertCircle size={14} />
                          <span>{errors.confirmPassword.message}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex space-x-3">
                      <button 
                        type="button" 
                        onClick={prevStep} 
                        className="btn-glass flex-1 flex items-center justify-center space-x-2"
                      >
                        <ArrowLeft size={20} />
                        <span>Back</span>
                      </button>
                      <button 
                        type="button" 
                        onClick={nextStep} 
                        className="btn-violet flex-1 flex items-center justify-center space-x-2"
                      >
                        <span>Next</span>
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Vehicle & Terms */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-300">Select Vehicle Type</label>
                      <div className="grid grid-cols-3 gap-3">
                        {vehicleOptions.map(({ id, label, icon: Icon }) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setSelectedVehicle(id)}
                            className={`glass-card rounded-xl p-4 flex flex-col items-center space-y-2 transition-all duration-200 ${
                              selectedVehicle === id 
                                ? 'border-2 border-[#8B5CF6] bg-[#8B5CF6]/10' 
                                : 'border border-white/10 hover:border-white/20'
                            }`}
                          >
                            <Icon 
                              size={32} 
                              className={selectedVehicle === id ? 'text-[#8B5CF6]' : 'text-gray-400'}
                            />
                            <span className={`text-sm font-medium ${
                              selectedVehicle === id ? 'text-[#8B5CF6]' : 'text-gray-400'
                            }`}>
                              {label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 mt-0.5 rounded border-gray-600 bg-[#1A1A1A] text-[#8B5CF6] focus:ring-[#8B5CF6] focus:ring-offset-0"
                          {...register("terms", { required: "Terms acceptance is required" })}
                        />
                        <span className="text-sm text-gray-400">
                          I agree to the{' '}
                          <a href="#" className="text-[#8B5CF6] hover:text-[#C084FC]">Terms of Service</a>
                          {' '}and{' '}
                          <a href="#" className="text-[#8B5CF6] hover:text-[#C084FC]">Privacy Policy</a>.
                        </span>
                      </label>
                      {errors.terms && (
                        <p className="text-red-500 text-sm flex items-center space-x-1">
                          <AlertCircle size={14} />
                          <span>{errors.terms.message}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex space-x-3">
                      <button 
                        type="button" 
                        onClick={prevStep} 
                        className="btn-glass flex-1"
                      >
                        Back
                      </button>
                      <button 
                        type="submit" 
                        disabled={isLoading}
                        className="btn-violet flex-1 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Check size={20} />
                            <span>Register</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-gray-400 pt-4 border-t border-white/10">
              Already have an account?{' '}
              <Link to="/login" className="text-[#8B5CF6] hover:text-[#C084FC] font-semibold transition-colors">
                Login
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
