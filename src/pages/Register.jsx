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

  const strength = password ? Math.min(4, Math.floor(password.length / 3)) : 0; // Simple strength for UI demo
  const strengthColor = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#15803d'];

  const vehicleOptions = [
    { id: 'car', label: 'Car', icon: Car },
    { id: 'bike', label: 'Two-Wheeler', icon: Bike },
    { id: 'truck', label: 'Heavy Vehicle', icon: Truck },
  ];

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4 relative overflow-hidden">
       {/* Cinematic Background Glows */}
       <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-[10%] right-[10%] w-[35%] h-[35%] bg-alert/10 rounded-full blur-[100px] animate-pulse"></div>
         <div className="absolute bottom-[10%] left-[10%] w-[35%] h-[35%] bg-primary/20 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Branding */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden md:flex flex-col justify-center space-y-8"
        >
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Sparkles className="text-alert w-8 h-8" />
              <h1 className="text-5xl font-display font-bold text-white leading-tight">
                Join the Safe <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-alert to-amber-200">Driving Community</span>
              </h1>
            </div>
            <p className="text-xl text-text-secondary">50k+ users trust us for their daily commute.</p>
          </div>
          
           <div className="glass-panel p-8 rounded-2xl flex items-center justify-center space-x-6">
              <div className="text-4xl">🚗</div>
              <div className="text-4xl">🚕</div>
              <div className="text-4xl">🚙</div>
              <p className="text-text-secondary font-medium">Navigate smarter, drive safer.</p>
           </div>
        </motion.div>

        {/* Right Side: Form */}
        <motion.div
           initial={{ opacity: 0, x: 50 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8 }}
           className="w-full"
        >
          <div className="glass-panel p-8 md:p-10 rounded-3xl w-full max-w-lg mx-auto">
             <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold text-white mb-2">Create Account</h2>
              <div className="flex items-center justify-center space-x-2 mt-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step === i ? 'w-8 bg-primary' : step > i ? 'w-4 bg-primary/50' : 'w-4 bg-white/10'}`}></div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <AnimatePresence mode='wait'>
                
                {/* STEP 1: Personal Info */}
                {step === 1 && (
                  <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-5">
                    
                    {['Name', 'Email', 'Phone'].map((field) => (
                      <div key={field} className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">{field}</label>
                        <div className="relative">
                          {field === 'Name' && <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />}
                          {field === 'Email' && <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />}
                          {field === 'Phone' && <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />}
                          
                          <input 
                            className={`input-field w-full pl-12 pr-4 py-3 rounded-xl ${errors[field.toLowerCase()] ? 'border-red-500' : ''}`}
                            placeholder={`Enter ${field.toLowerCase()}`}
                            {...register(field.toLowerCase(), { 
                              required: `${field} is required`,
                              ...(field === 'Email' && { pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } }),
                              ...(field === 'Phone' && { minLength: { value: 10, message: "Invalid phone" } })
                            })}
                          />
                        </div>
                        {errors[field.toLowerCase()] && <span className="text-red-400 text-xs flex items-center gap-1"><AlertCircle size={12} /> {errors[field.toLowerCase()].message}</span>}
                      </div>
                    ))}

                    <button type="button" onClick={nextStep} className="btn-primary w-full py-3.5 rounded-xl font-bold flex items-center justify-center space-x-2">
                      <span>Next Step</span> <ArrowRight size={20} />
                    </button>
                  </motion.div>
                )}

                {/* STEP 2: Password */}
                {step === 2 && (
                  <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-5">
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                          <input 
                            type={showPassword ? "text" : "password"}
                            className={`input-field w-full pl-12 pr-12 py-3 rounded-xl`}
                            placeholder="Create password"
                            {...register("password", { required: "Required", minLength: { value: 6, message: "Min 6 chars" } })}
                          />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white">
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                        {password && <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mt-2"><div className="h-full transition-all duration-300" style={{ width: `${(strength / 4) * 100}%`, backgroundColor: strengthColor[strength] }}></div></div>}
                     </div>

                     <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">Confirm Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                          <input type="password" className="input-field w-full pl-12 pr-4 py-3 rounded-xl" placeholder="Confirm password" {...register("confirmPassword", { validate: v => v === password || "Match failed" })} />
                        </div>
                     </div>

                     <div className="flex space-x-3">
                        <button type="button" onClick={prevStep} className="flex-1 py-3.5 rounded-xl border border-border-glass text-text-primary hover:bg-white/5 font-medium">Back</button>
                        <button type="button" onClick={nextStep} className="flex-1 btn-primary py-3.5 rounded-xl font-bold">Next</button>
                     </div>
                  </motion.div>
                )}

                {/* STEP 3: Vehicle */}
                {step === 3 && (
                   <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                      <label className="text-sm font-medium text-text-secondary block">Select Vehicle Type</label>
                      <div className="grid grid-cols-3 gap-3">
                        {vehicleOptions.map((opt) => (
                           <button
                             key={opt.id}
                             type="button"
                             onClick={() => setSelectedVehicle(opt.id)}
                             className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${selectedVehicle === opt.id ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-border-glass text-text-secondary hover:bg-white/10'}`}
                           >
                              <opt.icon size={28} />
                              <span className="text-xs font-semibold mt-2">{opt.label}</span>
                           </button>
                        ))}
                      </div>

                      <div className="flex items-start space-x-3">
                         <input type="checkbox" className="mt-1 w-4 h-4 rounded border-border-glass bg-input-bg text-primary focus:ring-primary" {...register("terms", { required: true })} />
                         <span className="text-xs text-text-secondary">I agree to the <a href="#" className="text-primary">Terms</a> & <a href="#" className="text-primary">Privacy Policy</a>.</span>
                      </div>

                      <div className="flex space-x-3">
                        <button type="button" onClick={prevStep} className="flex-1 py-3.5 rounded-xl border border-border-glass text-text-primary hover:bg-white/5 font-medium">Back</button>
                        <button type="submit" disabled={isLoading} className="flex-1 btn-primary py-3.5 rounded-xl font-bold flex items-center justify-center space-x-2">
                           {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><span>Finish</span> <Check size={20} /></>}
                        </button>
                     </div>
                   </motion.div>
                )}

              </AnimatePresence>
            </form>

            <p className="mt-8 text-center text-text-secondary text-sm">
              Already have an account? <Link to="/login" className="text-primary hover:text-white font-semibold transition-colors">Login</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
