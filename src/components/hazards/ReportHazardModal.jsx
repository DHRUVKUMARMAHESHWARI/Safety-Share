import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { reportHazard } from '../../services/hazardService';
import { FaExclamationTriangle, FaCarCrash, FaRoad, FaShieldAlt, FaWater, FaHardHat, FaTimes, FaCamera, FaTrash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ReportHazardModal.module.css';

const HAZARD_TYPES = [
    { id: 'pothole', label: 'Pothole', icon: FaExclamationTriangle, color: '#f97316' },
    { id: 'accident', label: 'Accident', icon: FaCarCrash, color: '#ef4444' },
    { id: 'roadblock', label: 'Roadblock', icon: FaRoad, color: '#eab308' },
    { id: 'police_checking', label: 'Police', icon: FaShieldAlt, color: '#3b82f6' },
    { id: 'waterlogging', label: 'Waterlog', icon: FaWater, color: '#06b6d4' },
    { id: 'construction', label: 'Work', icon: FaHardHat, color: '#f59e0b' },
];

const ReportHazardModal = ({ location, onClose, onSuccess, preSelectedType }) => {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            severity: 'medium',
            type: preSelectedType || ''
        }
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const selectedType = watch('type');
    const photoFile = watch('photo');

    // Update preview when file changes
    useEffect(() => {
        if (photoFile && photoFile[0]) {
            const url = URL.createObjectURL(photoFile[0]);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [photoFile]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('type', data.type);
            formData.append('severity', data.severity);
            formData.append('description', data.description);
            // Pass location as JSON string
            formData.append('location', JSON.stringify(location));
            
            if (data.photo && data.photo[0]) {
                formData.append('photo', data.photo[0]);
            }

            await reportHazard(formData);
            toast.success('Hazard reported successfully!');
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || 'Failed to report hazard');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <motion.div 
                className={styles.modal}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
            >
                <div className={styles.header}>
                    <h3>Report Hazard</h3>
                    <button onClick={onClose} className={styles.closeBtn}><FaTimes /></button>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <div className={styles.section}>
                        <label>Hazard Type</label>
                        <div className={styles.grid}>
                            {HAZARD_TYPES.map(t => (
                                <button
                                    key={t.id}
                                    type="button"
                                    className={`${styles.typeBtn} ${selectedType === t.id ? styles.selected : ''}`}
                                    onClick={() => setValue('type', t.id)}
                                    style={{ 
                                        borderColor: selectedType === t.id ? t.color : '',
                                        background: selectedType === t.id ? `${t.color}15` : '' 
                                    }}
                                >
                                    <t.icon color={t.color} size={24} />
                                    <span>{t.label}</span>
                                </button>
                            ))}
                        </div>
                        <input type="hidden" {...register('type', { required: 'Select a type' })} />
                        {errors.type && <span className={styles.error}>{errors.type.message}</span>}
                    </div>

                    <div className={styles.section}>
                        <label>Severity</label>
                        <div className={styles.pillGroup}>
                             {['low', 'medium', 'high', 'critical'].map(sev => (
                                 <label key={sev} className={`${styles.pill} ${watch('severity') === sev ? styles.pillActive : ''}`}>
                                     <input 
                                         type="radio" 
                                         value={sev} 
                                         {...register('severity')} 
                                         className="hidden" 
                                     />
                                     {sev.charAt(0).toUpperCase() + sev.slice(1)}
                                 </label>
                             ))}
                        </div>
                    </div>

                    <div className={styles.section}>
                        <label>Description</label>
                        <textarea 
                            {...register('description')} 
                            className={styles.textarea} 
                            placeholder="Add generic details..."
                            rows={3}
                        />
                    </div>
                    
                    <div className={styles.section}>
                         <label>Add Photo</label>
                         <div className={styles.photoUpload}>
                             {!previewUrl ? (
                                <label className={styles.uploadBtn}>
                                    <FaCamera size={24} />
                                    <span>Upload</span>
                                    <input type="file" accept="image/*" {...register('photo')} hidden />
                                </label>
                             ) : (
                                 <div className={styles.previewContainer}>
                                     <img src={previewUrl} alt="Preview" />
                                     <button type="button" onClick={() => { setValue('photo', null); setPreviewUrl(null); }}>
                                         <FaTrash />
                                     </button>
                                 </div>
                             )}
                         </div>
                    </div>

                    <button 
                        type="submit" 
                        className={styles.submitBtn} 
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Reporting...' : 'Submit Report'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

ReportHazardModal.propTypes = {
    location: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    preSelectedType: PropTypes.string
};

export default ReportHazardModal;
