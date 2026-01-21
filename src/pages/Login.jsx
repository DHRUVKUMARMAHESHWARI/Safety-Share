import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Eye, EyeOff, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';
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
        <div className={styles.container}>
            {/* Visual Side */}
            <div className={styles.visualSide}>
                <div className={`${styles.shape} ${styles.shape1}`}></div>
                <div className={`${styles.shape} ${styles.shape2}`}></div>
                <div className={`${styles.shape} ${styles.shape3}`}></div>
                
                <div className={styles.visualContent}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1>Welcome Back,<br/>Safe Driver!</h1>
                        <p>Join 50k+ users navigating smarter everyday.</p>
                        
                        {/* Testimonial Carousel */}
                        <div style={{ height: '80px', marginTop: '40px' }}>
                            <AnimatePresence mode='wait'>
                                <motion.div 
                                    key={activeTestimonial}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <p style={{ fontStyle: 'italic', fontSize: '1rem', marginBottom: '10px' }}>
                                        "{testimonials[activeTestimonial].text}"
                                    </p>
                                    <small>- {testimonials[activeTestimonial].author}</small>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Form Side */}
            <div className={styles.formSide}>
                <motion.div 
                    className={styles.formCard}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className={styles.header}>
                        <span className={styles.logo}>SafeRoute</span>
                        <h2>Login</h2>
                        <p>Continue your safe journey</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles.formGroup}>
                            <label>Phone or Email</label>
                            <div className={styles.inputWrapper}>
                                <User className={styles.icon} size={20} />
                                <input 
                                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
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
                                <span className={styles.errorMessage}>
                                    <AlertCircle size={14} /> {errors.email.message}
                                </span>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label>Password</label>
                            <div className={styles.inputWrapper}>
                                <Lock className={styles.icon} size={20} />
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                                    placeholder="Enter password"
                                    {...register("password", { required: "Password is required" })}
                                />
                                <button
                                    type="button"
                                    className={styles.passwordToggle}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && (
                                <span className={styles.errorMessage}>
                                    <AlertCircle size={14} /> {errors.password.message}
                                </span>
                            )}
                        </div>

                        <div className={styles.actions}>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" className={styles.checkbox} />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className={styles.forgotLink}>Forgot password?</a>
                        </div>

                        <button 
                            type="submit" 
                            className={styles.submitBtn} 
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className={styles.spinner}></div>
                            ) : (
                                <>Sign In <ArrowRight size={20} /></>
                            )}
                        </button>
                    </form>

                    <div className={styles.divider}>
                        <span>Or continue with</span>
                    </div>

                    <button className={styles.socialBtn}>
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
                            <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.96-2.91l-3.86-3c-1.08.72-2.45 1.16-4.1 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24z"/>
                            <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"/>
                            <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
                        </svg>
                        Google
                    </button>

                    <div className={styles.footer}>
                        Don't have an account? <Link to="/register" className={styles.link}>Sign up</Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
