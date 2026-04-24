import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../context/ToastContext'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import AnimatedPage from '../../components/shared/AnimatedPage'
import api from '../../services/api'
import {
    Camera, Upload as UploadIcon, Image, Brain,
    AlertCircle, X, FileImage, Lightbulb, Check, Loader2,
    Scan, Cpu, Sparkles, CloudUpload, ShieldCheck
} from 'lucide-react'

/* ── Scanner corner brackets ── */
function ScannerFrame({ active }) {
    return (
        <div className="absolute inset-0 pointer-events-none">
            {[['top-3 left-3', 'border-t-2 border-l-2'],
            ['top-3 right-3', 'border-t-2 border-r-2'],
            ['bottom-3 left-3', 'border-b-2 border-l-2'],
            ['bottom-3 right-3', 'border-b-2 border-r-2']
            ].map(([pos, border], i) => (
                <motion.div
                    key={i}
                    className={`absolute ${pos} w-7 h-7 ${border} rounded-sm ${active ? 'border-primary-400' : 'border-dark-600'}`}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.08, duration: 0.25, ease: 'easeOut' }}
                />
            ))}
        </div>
    )
}

/* ── AI Processing Steps ── */
const steps = [
    { id: 'upload', label: 'Uploading image', icon: CloudUpload },
    { id: 'ocr', label: 'Extracting text (OCR)', icon: Scan },
    { id: 'ai', label: 'AI structuring data', icon: Cpu },
    { id: 'validate', label: 'Validating medicines', icon: ShieldCheck },
]

function ProcessingSteps({ currentStep }) {
    const stepOrder = ['upload', 'ocr', 'ai', 'validate']
    const currentIdx = stepOrder.indexOf(currentStep)

    return (
        <div className="w-full max-w-xs space-y-3">
            {steps.map((step, i) => {
                const done = i < currentIdx
                const active = i === currentIdx
                const waiting = i > currentIdx
                return (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 ${active ? 'bg-primary-500/10 border border-primary-500/25' : done ? 'bg-emerald-500/5' : 'opacity-40'}`}
                    >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${done ? 'bg-emerald-500/20' : active ? 'bg-primary-500/20' : 'bg-dark-800'}`}>
                            {done
                                ? <Check className="w-4 h-4 text-emerald-400" />
                                : active
                                    ? <Loader2 className="w-4 h-4 text-primary-400 animate-spin" />
                                    : <step.icon className="w-4 h-4 text-dark-500" />
                            }
                        </div>
                        <span className={`text-sm font-medium transition-colors ${done ? 'text-emerald-400' : active ? 'text-white' : 'text-dark-500'}`}>
                            {step.label}
                        </span>
                        {done && <Check className="w-3.5 h-3.5 text-emerald-400 ml-auto" />}
                        {active && <div className="ml-auto flex gap-0.5">{[0, 1, 2].map(d => (
                            <motion.div key={d} className="w-1 h-1 rounded-full bg-primary-400"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1, delay: d * 0.2, repeat: Infinity }} />
                        ))}</div>}
                    </motion.div>
                )
            })}
        </div>
    )
}

const tips = [
    { text: 'Ensure the prescription is well-lit', icon: '💡' },
    { text: 'Capture the entire document without cropping', icon: '📄' },
    { text: 'Avoid shadows and reflections on the paper', icon: '🌟' },
    { text: 'Hold the camera steady for a sharp image', icon: '📷' },
    { text: 'Max file size: 10MB · JPG, PNG, WEBP accepted', icon: '📁' },
]

export default function Upload() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const toast = useToast()
    const fileRef = useRef(null)
    const [preview, setPreview] = useState(null)
    const [file, setFile] = useState(null)
    const [dragOver, setDragOver] = useState(false)
    const [error, setError] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [processing, setProcessing] = useState(false)
    const [currentStep, setCurrentStep] = useState('upload')

    const handleFile = (f) => {
        if (!f) return
        if (!f.type.startsWith('image/')) {
            setErrorMsg('Please upload an image file (JPG, PNG, WEBP)')
            setError(true)
            return
        }
        if (f.size > 10 * 1024 * 1024) {
            setErrorMsg('Image too large. Maximum size is 10MB.')
            setError(true)
            return
        }
        setFile(f)
        const reader = new FileReader()
        reader.onload = (e) => setPreview(e.target.result)
        reader.readAsDataURL(f)
        toast('Image loaded — ready for AI processing', 'success')
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragOver(false)
        handleFile(e.dataTransfer.files[0])
    }

    const simulateStep = (step, delay) => new Promise(res => setTimeout(() => { setCurrentStep(step); res() }, delay))

    const handleProcess = async () => {
        if (!file && !preview) return
        setProcessing(true)
        setCurrentStep('upload')

        try {
            // Simulate step progression
            await simulateStep('ocr', 1200)
            await simulateStep('ai', 2000)
            await simulateStep('validate', 3500)

            const formData = new FormData()
            if (file) {
                formData.append('file', file)
            } else {
                const response = await fetch(preview)
                const blob = await response.blob()
                formData.append('file', blob, 'prescription.jpg')
            }

            const result = await api.post('/patient/prescriptions/scan', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-User-Id': user?.id ? String(user.id) : '',
                },
                timeout: 120000,
            })

            localStorage.setItem('medikiosk_ocr_result', JSON.stringify(result.data))
            localStorage.setItem('medikiosk_prescription_image', preview)
            toast('Prescription processed successfully!', 'success')
            navigate('/patient/processing')
        } catch (err) {
            console.error('OCR Error:', err)
            const detail = err.response?.data?.detail || 'Failed to process image. Please try again.'
            setErrorMsg(detail)
            setError(true)
            setProcessing(false)
            toast('Processing failed — please try again', 'error')
        }
    }

    return (
        <AnimatedPage>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                    <Scan className="w-6 h-6 text-primary-400" />
                    Upload Prescription
                </h1>
                <p className="text-dark-400">AI-powered OCR extracts medicines instantly</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── Drop Zone ── */}
                <div className="lg:col-span-2">
                    <div
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        className={`relative min-h-[420px] flex flex-col items-center justify-center p-8 rounded-2xl border-2 transition-all duration-300 ${dragOver ? 'border-primary-500 bg-primary-500/5 scale-[1.01]' : preview ? 'border-emerald-500/40 bg-emerald-500/5 border-solid' : 'border-dashed border-dark-700/60 bg-dark-900/40 hover:border-dark-600 hover:bg-dark-900/60'}`}
                        style={{ backdropFilter: 'blur(12px)' }}
                    >
                        {/* Scanner corners (always shown) */}
                        <ScannerFrame active={!!preview || dragOver} />

                        {/* Scanning sweep line */}
                        {processing && (
                            <motion.div
                                className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary-400 to-transparent z-10 pointer-events-none"
                                initial={{ top: '10%' }}
                                animate={{ top: ['10%', '90%', '10%'] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            />
                        )}

                        <AnimatePresence mode="wait">
                            {preview ? (
                                <motion.div
                                    key="preview"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="w-full text-center"
                                >
                                    <div className="relative inline-block mb-4">
                                        <img
                                            src={preview} alt="Prescription"
                                            className="max-h-[260px] rounded-xl border border-dark-700 shadow-2xl"
                                        />
                                        {!processing && (
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                onClick={() => { setPreview(null); setFile(null) }}
                                                className="absolute -top-2 -right-2 w-8 h-8 bg-dark-800 border border-dark-600 rounded-full flex items-center justify-center hover:bg-rose-500/20 hover:text-rose-400 text-dark-400 transition-all shadow-lg"
                                            >
                                                <X className="w-4 h-4" />
                                            </motion.button>
                                        )}
                                    </div>

                                    {processing ? (
                                        <div className="flex flex-col items-center gap-4">
                                            <ProcessingSteps currentStep={currentStep} />
                                            <p className="text-xs text-dark-500 mt-1">This may take up to 60 seconds...</p>
                                        </div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex flex-col items-center gap-3"
                                        >
                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                                <span className="text-sm text-emerald-400 font-medium">Image ready for processing</span>
                                            </div>
                                            <Button onClick={handleProcess} icon={Brain} size="lg">
                                                Process with AI
                                            </Button>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="upload"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="text-center"
                                >
                                    <motion.div
                                        animate={dragOver ? { scale: 1.2 } : { y: [0, -10, 0] }}
                                        transition={dragOver ? { duration: 0.2 } : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                                        className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-dark-800 border border-dark-700 flex items-center justify-center"
                                    >
                                        {dragOver
                                            ? <Sparkles className="w-10 h-10 text-primary-400" />
                                            : <FileImage className="w-10 h-10 text-dark-500" />
                                        }
                                    </motion.div>
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        {dragOver ? 'Release to upload!' : 'Drop your prescription here'}
                                    </h3>
                                    <p className="text-sm text-dark-400 mb-6">or choose an option below</p>
                                    <div className="flex flex-wrap items-center justify-center gap-3">
                                        <Button icon={Camera} variant="secondary" size="lg"
                                            onClick={() => fileRef.current?.click()}>
                                            Camera Capture
                                        </Button>
                                        <Button icon={UploadIcon} size="lg"
                                            onClick={() => fileRef.current?.click()}>
                                            Upload Image
                                        </Button>
                                    </div>
                                    <input
                                        ref={fileRef} type="file" accept="image/*"
                                        capture="environment" className="hidden"
                                        onChange={(e) => handleFile(e.target.files[0])}
                                    />
                                    <p className="text-xs text-dark-600 mt-4">JPG · PNG · WEBP · Max 10MB</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* ── Tips panel ── */}
                <div className="space-y-4">
                    <div className="rounded-2xl border border-dark-700/50 p-5"
                        style={{ background: 'rgba(24,24,27,0.7)', backdropFilter: 'blur(12px)' }}>
                        <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
                            <Lightbulb className="w-4 h-4 text-amber-400" /> Upload Tips
                        </h3>
                        <div className="space-y-3">
                            {tips.map((tip, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + i * 0.08 }}
                                    className="flex items-start gap-2.5 p-2.5 rounded-lg bg-dark-800/30 hover:bg-dark-800/50 transition-colors"
                                >
                                    <span className="text-base flex-shrink-0">{tip.icon}</span>
                                    <p className="text-xs text-dark-300 leading-relaxed">{tip.text}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>


                </div>
            </div>

            {/* Error Modal */}
            <Modal isOpen={error} onClose={() => setError(false)} title="Processing Error">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/10 flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-rose-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Unable to process image</h3>
                    <p className="text-sm text-dark-400 mb-6">{errorMsg || 'The uploaded image is unclear or unsupported. Please try a clearer image.'}</p>
                    <Button onClick={() => setError(false)} variant="secondary" className="w-full">Try Again</Button>
                </div>
            </Modal>
        </AnimatedPage>
    )
}
