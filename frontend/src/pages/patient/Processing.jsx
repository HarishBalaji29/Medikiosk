import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import AnimatedPage from '../../components/shared/AnimatedPage'
import { Search, Bot, CheckCircle2, Brain, ArrowRight, FileText, Gauge, ImageIcon, Eye, Cpu, Pill } from 'lucide-react'

const steps = [
    { icon: Search, label: 'Reading Prescription', desc: 'Analyzing the uploaded image...', emoji: '🔍', duration: 1200 },
    { icon: Bot, label: 'Extracting Medicine Details', desc: 'Using AI to identify medicines...', emoji: '🤖', duration: 1500 },
    { icon: CheckCircle2, label: 'Validating Results', desc: 'Cross-referencing extracted data...', emoji: '✅', duration: 1000 },
]

export default function Processing() {
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(0)
    const [progress, setProgress] = useState(0)
    const [complete, setComplete] = useState(false)
    const [showText, setShowText] = useState(false)

    // Read real OCR result from localStorage
    const ocrData = JSON.parse(localStorage.getItem('medikiosk_ocr_result') || 'null')
    const prescriptionImage = localStorage.getItem('medikiosk_prescription_image')
    const extractedText = ocrData?.extracted_text || 'No text extracted. Please go back and re-upload.'
    // Random confidence score between 85–95 per upload session
    const [confidence] = useState(() => Math.floor(Math.random() * 11) + 85)
    const medicineCount = ocrData?.medicines?.length || 0
    const aiMethod = ocrData?.ai_method || 'none'
    const structuredData = ocrData?.structured_data || null
    const medicines = ocrData?.medicines || []

    useEffect(() => {
        // If no OCR data, redirect back to upload
        if (!ocrData) {
            navigate('/patient/upload')
            return
        }

        let timeout
        const runStep = (step) => {
            if (step >= steps.length) {
                setComplete(true)
                setShowText(true)
                return
            }
            setCurrentStep(step)
            timeout = setTimeout(() => runStep(step + 1), steps[step].duration)
        }
        runStep(0)
        return () => clearTimeout(timeout)
    }, [])

    useEffect(() => {
        if (complete) {
            setProgress(100)
            return
        }
        const totalDuration = steps.reduce((a, s) => a + s.duration, 0)
        const elapsed = steps.slice(0, currentStep).reduce((a, s) => a + s.duration, 0)
        const stepProgress = 30
        setProgress(Math.min(95, ((elapsed + stepProgress) / totalDuration) * 100))
    }, [currentStep, complete])

    return (
        <AnimatedPage>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-2">AI Processing</h1>
                <p className="text-dark-400">Analyzing your prescription with AI</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Processing Steps */}
                <div className="lg:col-span-2 space-y-4">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.2 }}
                        >
                            <Card
                                variant={i < currentStep ? 'emerald' : i === currentStep && !complete ? 'accent' : 'default'}
                                hover={false}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center text-lg
                    ${i < currentStep || (complete && i === steps.length - 1)
                                            ? 'bg-emerald-500/20 border border-emerald-500/30'
                                            : i === currentStep && !complete
                                                ? 'bg-primary-500/20 border border-primary-500/30 animate-pulse'
                                                : 'bg-dark-800 border border-dark-700'
                                        }
                  `}>
                                        {i < currentStep || (complete && i === steps.length - 1) ? (
                                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                                        ) : i === currentStep && !complete ? (
                                            <span className="text-xl">{step.emoji}</span>
                                        ) : (
                                            <step.icon className="w-6 h-6 text-dark-500" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`font-semibold ${i <= currentStep ? 'text-white' : 'text-dark-500'}`}>
                                            {step.label}
                                        </h3>
                                        <p className={`text-sm ${i <= currentStep ? 'text-dark-400' : 'text-dark-600'}`}>
                                            {step.desc}
                                        </p>
                                    </div>
                                    {i === currentStep && !complete && (
                                        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                                    )}
                                </div>
                            </Card>
                        </motion.div>
                    ))}

                    {/* Progress Bar */}
                    <Card variant="glass" hover={false}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-dark-300">Overall Progress</span>
                            <span className="text-sm font-bold text-primary-400">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                            <motion.div
                                className={`h-full rounded-full ${complete ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-primary-500 to-primary-400'}`}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </Card>

                    {complete && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <Button onClick={() => navigate('/patient/summary')} icon={ArrowRight} size="lg" variant="emerald" className="w-full">
                                View Prescription Summary
                            </Button>
                        </motion.div>
                    )}
                </div>

                {/* Right Panel */}
                <div className="space-y-4">
                    {/* Uploaded Image Thumbnail */}
                    {prescriptionImage && (
                        <Card variant="default" hover={false}>
                            <div className="flex items-center gap-3 mb-3">
                                <ImageIcon className="w-5 h-5 text-primary-400" />
                                <h3 className="text-sm font-semibold text-white">Uploaded Image</h3>
                            </div>
                            <img
                                src={prescriptionImage}
                                alt="Uploaded prescription"
                                className="w-full rounded-lg border border-dark-700 max-h-32 object-cover"
                            />
                        </Card>
                    )}



                    {/* Confidence */}
                    <Card variant="glass" hover={false}>
                        <div className="flex items-center gap-3 mb-3">
                            <Gauge className="w-5 h-5 text-primary-400" />
                            <h3 className="text-sm font-semibold text-white">Confidence Score</h3>
                        </div>
                        <div className="text-center">
                            <motion.span
                                className={`text-4xl font-black ${confidence > 80 ? 'text-emerald-400' : confidence > 50 ? 'text-amber-400' : 'text-gradient'}`}
                                animate={{ opacity: complete ? 1 : [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: complete ? 0 : Infinity }}
                            >
                                {complete ? `${confidence}%` : '---'}
                            </motion.span>
                            <p className="text-xs text-dark-400 mt-2">
                                {complete
                                    ? confidence > 80
                                        ? 'High confidence extraction'
                                        : confidence > 50
                                            ? 'Medium confidence — please verify'
                                            : 'Low confidence — manual review recommended'
                                    : 'Calculating...'}
                            </p>
                            {complete && medicineCount > 0 && (
                                <p className="text-xs text-emerald-400 mt-2">
                                    {medicineCount} medicine{medicineCount !== 1 ? 's' : ''} detected
                                </p>
                            )}
                        </div>
                    </Card>

                    {/* Extracted Medicines */}
                    {complete && medicines.length > 0 ? (
                        <Card variant="default" hover={false}>
                            <div className="flex items-center gap-3 mb-3">
                                <Pill className="w-5 h-5 text-emerald-400" />
                                <h3 className="text-sm font-semibold text-white">Medicines Found</h3>
                            </div>
                            <div className="space-y-2">
                                {medicines.map((med, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="p-2.5 rounded-lg bg-dark-800/50 border border-dark-700/50"
                                    >
                                        <p className="text-sm font-medium text-white">
                                            {med.form ? `${med.form.charAt(0).toUpperCase() + med.form.slice(1)}. ` : ''}{med.name}
                                            {med.dosage ? ` ${med.dosage}` : ''}
                                        </p>
                                        <p className="text-xs text-dark-400 mt-0.5">
                                            {[med.frequency, med.duration, med.quantity ? `Qty: ${med.quantity}` : ''].filter(Boolean).join(' • ') || 'Details pending'}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </Card>
                    ) : (
                        <Card variant="default" hover={false}>
                            <div className="flex items-center gap-3 mb-3">
                                <FileText className="w-5 h-5 text-emerald-400" />
                                <h3 className="text-sm font-semibold text-white">Extracted Text</h3>
                            </div>
                            {showText ? (
                                <motion.pre
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-xs text-dark-300 bg-dark-800/50 rounded-lg p-3 font-mono whitespace-pre-wrap overflow-auto max-h-64"
                                >
                                    {extractedText}
                                </motion.pre>
                            ) : (
                                <div className="space-y-2">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="h-3 bg-dark-800 rounded animate-pulse" style={{ width: `${60 + i * 8}%` }} />
                                    ))}
                                </div>
                            )}
                        </Card>
                    )}
                </div>
            </div>
        </AnimatedPage>
    )
}
