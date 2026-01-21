import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const testimonials = [
  { text: "SafeRoute saved me from a massive pile-up last week! Forever grateful.", author: "Alex D." },
  { text: "The voice alerts are so timely. I never drive without it now.", author: "Sarah M." },
  { text: "Community validation makes this the most accurate app out there.", author: "Raj K." }
];

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Auto-slide testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const success = await login(data.email, data.password);
      if (success) {
        toast.success("Welcome back!");
        navigate('/dashboard');
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Cinematic Background Glows */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-alert/10 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Brand & Testimonials (Hidden on Mobile) */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden md:flex flex-col justify-center space-y-8"
        >
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Sparkles className="text-primary w-8 h-8" />
              <h1 className="text-5xl font-display font-bold text-white leading-tight">
                Welcome Back, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Safe Driver!</span>
              </h1>
            </div>
            <p className="text-xl text-text-secondary">Join 50k+ users navigating smarter every day.</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
            <AnimatePresence mode='wait'>
               <motion.div
                 key={activeTestimonial}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
                 transition={{ duration: 0.5 }}
               >
                 <p className="text-lg italic text-white mb-4">"{testimonials[activeTestimonial].text}"</p>
                 <div className="flex items-center space-x-2">
                   <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white">
                      {testimonials[activeTestimonial].author.charAt(0)}
                   </div>
                   <span className="text-sm font-semibold text-text-secondary">— {testimonials[activeTestimonial].author}</span>
                 </div>
               </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right Side: Login Form */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="w-full"
        >
          <div className="glass-panel p-8 md:p-10 rounded-3xl w-full max-w-md mx-auto">
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold text-white mb-2">Login</h2>
              <p className="text-text-secondary">Continue your safe journey</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex flex-col">
              
              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                  <input 
                    className={`input-field w-full pl-12 pr-4 py-3 rounded-xl ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="Enter your email"
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                  />
                </div>
                {errors.email && (
                  <span className="text-red-400 text-xs flex items-center gap-1 mt-1">
                    <AlertCircle size={12} /> {errors.email.message}
                  </span>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                  <input 
                    type={showPassword ? "text" : "password"}
                    className={`input-field w-full pl-12 pr-12 py-3 rounded-xl ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Enter password"
                    {...register("password", { required: "Password is required" })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                   <span className="text-red-400 text-xs flex items-center gap-1 mt-1">
                    <AlertCircle size={12} /> {errors.password.message}
                   </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-border-glass bg-input-bg text-primary focus:ring-primary focus:ring-offset-0" />
                  <span className="text-text-secondary group-hover:text-white transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-primary hover:text-white transition-colors font-medium">Forgot password?</a>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="btn-primary w-full py-3.5 rounded-xl font-bold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
            
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-glass"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-4 bg-[#1e1e1e] text-text-secondary rounded-full">Or continue with</span></div>
            </div>

            <button className="w-full bg-white text-black py-3 rounded-xl font-semibold flex items-center justify-center space-x-3 hover:bg-gray-100 transition-colors">
               <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.96-2.91l-3.86-3c-1.08.72-2.45 1.16-4.1 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24z"/><path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"/><path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>
               <span>Google</span>
            </button>

            <p className="mt-8 text-center text-text-secondary text-sm">
              Don't have an account? <Link to="/register" className="text-primary hover:text-white font-semibold transition-colors">Sign up</Link>
            </p>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
