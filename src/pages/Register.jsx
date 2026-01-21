import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle, ArrowRight, ArrowLeft, Check, Car, Truck, Bike } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';
import toast from 'react-hot-toast';

const Register = () => {
    const { register: registerAuth } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState('car');
    
    // React Hook Form
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
            // Confetti or success handling
            // toast handles success message
            navigate('/dashboard');
        } catch (error) {
           // handled by auth context
        } finally {
            setIsLoading(false);
        }
    };

    // Password strength logic
    const getStrength = (pass) => {
        if (!pass) return 0;
        let score = 0;
        if (pass.length > 6) score++;
        if (pass.match(/[A-Z]/)) score++;
        if (pass.match(/[0-9]/)) score++;
        if (pass.match(/[^A-Za-z0-9]/)) score++;
        return score; // 0-4
    };
    
    const strength = getStrength(password);
    const strengthColor = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#15803d'];

    return (
        <div className={styles.container}>
            {/* Left Side - Register Visuals */}
            <div className={styles.visualSide} style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                 <div className={`${styles.shape} ${styles.shape1}`}></div>
                 <div className={`${styles.shape} ${styles.shape3}`}></div>
                 
                 <div className={styles.visualContent} style={{ zIndex: 10 }}>
                     <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                     >
                        <h1>Join the Safe<br/>Driving Community</h1>
                        <p>50K+ users trust us for their daily commute.</p>
                     </motion.div>
                     
                     <div style={{ marginTop: '50px' }}>
                         {/* Simple visual representation of cars */}
                         <motion.div 
                            style={{ fontSize: '4rem', display: 'flex', gap: '20px', justifyContent: 'center' }}
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                         >
                             🚗 🚕 🚙
                         </motion.div>
                     </div>
                 </div>
            </div>

            {/* Right Side - Multi-step Form */}
            <div className={styles.formSide}>
                <div className={styles.formCard}>
                    <div className={styles.header}>
                        <h2>Create Account</h2>
                        <p>Step {step} of 3</p>
                    </div>

                    <div className={styles.stepsIndicator}>
                        {[1, 2, 3].map(i => (
                            <div 
                                key={i} 
                                className={`${styles.stepDot} ${step === i ? styles.stepActive : ''} ${step > i ? styles.stepCompleted : ''}`}
                            ></div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <AnimatePresence mode='wait'>
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className={styles.formGroup}>
                                        <label>Full Name</label>
                                        <div className={styles.inputWrapper}>
                                            <User size={20} className={styles.icon} />
                                            <input 
                                                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                                                placeholder="Enter full name"
                                                {...register("name", { required: "Name is required" })}
                                            />
                                        </div>
                                        {errors.name && <span className={styles.errorMessage}>{errors.name.message}</span>}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Email Address</label>
                                        <div className={styles.inputWrapper}>
                                            <Mail size={20} className={styles.icon} />
                                            <input 
                                                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
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
                                        {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Phone Number</label>
                                        <div className={styles.inputWrapper}>
                                            <Phone size={20} className={styles.icon} />
                                            <input 
                                                className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                                                placeholder="Enter phone number" 
                                                {...register("phone", { 
                                                    required: "Phone is required",
                                                    minLength: { value: 10, message: "Valid phone number required" }
                                                })}
                                            />
                                        </div>
                                        {errors.phone && <span className={styles.errorMessage}>{errors.phone.message}</span>}
                                    </div>

                                    <button type="button" onClick={nextStep} className={styles.submitBtn}>
                                        Next Step <ArrowRight size={20} />
                                    </button>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className={styles.formGroup}>
                                        <label>Create Password</label>
                                        <div className={styles.inputWrapper}>
                                            <Lock size={20} className={styles.icon} />
                                            <input 
                                                type={showPassword ? "text" : "password"}
                                                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                                                placeholder="Enter password"
                                                {...register("password", { 
                                                    required: "Password is required",
                                                    minLength: { value: 6, message: "Min 6 characters" }
                                                })}
                                            />
                                            <button type="button" className={styles.passwordToggle} onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                        {/* Strength Bar */}
                                        <div style={{ height: '4px', width: '100%', background: '#e5e7eb', marginTop: '8px', borderRadius: '2px', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${(strength / 4) * 100}%`, background: strengthColor[strength], transition: 'all 0.3s' }}></div>
                                        </div>
                                        {errors.password && <span className={styles.errorMessage}>{errors.password.message}</span>}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Confirm Password</label>
                                        <div className={styles.inputWrapper}>
                                            <Lock size={20} className={styles.icon} />
                                            <input 
                                                type="password"
                                                className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                                                placeholder="Re-enter password"
                                                {...register("confirmPassword", { 
                                                    required: "Confirm password",
                                                    validate: val => val === password || "Passwords do not match"
                                                })}
                                            />
                                        </div>
                                        {errors.confirmPassword && <span className={styles.errorMessage}>{errors.confirmPassword.message}</span>}
                                    </div>

                                    <div className={styles.btnRow}>
                                        <button type="button" onClick={prevStep} className={`${styles.submitBtn} ${styles.btnSecondary}`} style={{ background: '#f3f4f6', color: '#374151' }}>
                                            <ArrowLeft size={20} /> Back
                                        </button>
                                        <button type="button" onClick={nextStep} className={styles.submitBtn}>
                                            Next <ArrowRight size={20} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <label style={{ display: 'block', marginBottom: '16px', fontWeight: '500' }}>Select Vehicle Type</label>
                                    <div className={styles.vehicleGrid}>
                                        <div 
                                            className={`${styles.vehicleOption} ${selectedVehicle === 'car' ? styles.vehicleSelected : ''}`}
                                            onClick={() => setSelectedVehicle('car')}
                                        >
                                            <Car size={32} color={selectedVehicle === 'car' ? '#6366f1' : '#6b7280'} />
                                            <p>Car</p>
                                        </div>
                                        <div 
                                            className={`${styles.vehicleOption} ${selectedVehicle === 'bike' ? styles.vehicleSelected : ''}`}
                                            onClick={() => setSelectedVehicle('bike')}
                                        >
                                            <Bike size={32} color={selectedVehicle === 'bike' ? '#6366f1' : '#6b7280'} />
                                            <p>Two-Wheeler</p>
                                        </div>
                                        <div 
                                            className={`${styles.vehicleOption} ${selectedVehicle === 'truck' ? styles.vehicleSelected : ''}`}
                                            onClick={() => setSelectedVehicle('truck')}
                                        >
                                            <Truck size={32} color={selectedVehicle === 'truck' ? '#6366f1' : '#6b7280'} />
                                            <p>Heavy Vehicle</p>
                                        </div>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.checkboxLabel} style={{ alignItems: 'flex-start' }}>
                                            <input 
                                                type="checkbox" 
                                                className={styles.checkbox} 
                                                style={{ marginTop: '4px' }}
                                                {...register("terms", { required: "Terms acceptance is required" })}
                                            />
                                            <span style={{ fontSize: '0.9rem' }}>I agree to the <a href="#" className={styles.link}>Terms of Service</a> and <a href="#" className={styles.link}>Privacy Policy</a>.</span>
                                        </label>
                                        {errors.terms && <span className={styles.errorMessage}>{errors.terms.message}</span>}
                                    </div>

                                    <div className={styles.btnRow}>
                                        <button type="button" onClick={prevStep} className={`${styles.submitBtn}`} style={{ background: '#f3f4f6', color: '#374151' }}>
                                            Back
                                        </button>
                                        <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                                            {isLoading ? <div className={styles.spinner}></div> : <><Check size={20} /> Register</>}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>

                    <div className={styles.footer}>
                        Already have an account? <Link to="/login" className={styles.link}>Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
