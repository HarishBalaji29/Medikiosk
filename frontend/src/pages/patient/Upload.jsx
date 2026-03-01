import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import AnimatedPage from '../../components/shared/AnimatedPage'
import {
    Camera, Upload as UploadIcon, Image, Brain,
    AlertCircle, X, FileImage, Lightbulb, Check
} from 'lucide-react'

export default function Upload() {
    const navigate = useNavigate()
    const fileRef = useRef(null)
    const [preview, setPreview] = useState(null)
    const [dragOver, setDragOver] = useState(false)
    const [error, setError] = useState(false)

    const handleFile = (file) => {
        if (!file) return
        if (!file.type.startsWith('image/')) {
            setError(true)
            return
        }
        const reader = new FileReader()
        reader.onload = (e) => setPreview(e.target.result)
        reader.readAsDataURL(file)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragOver(false)
        handleFile(e.dataTransfer.files[0])
    }

    const handleProcess = () => {
        navigate('/patient/processing')
    }

    const tips = [
        'Ensure the prescription is well-lit',
        'Capture the entire document',
        'Avoid shadows and reflections',
        'Hold the camera steady',
    ]

    return (
        <AnimatedPage>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-2">Upload Prescription</h1>
                <p className="text-dark-400">Capture or upload your prescription for AI analysis</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upload Zone */}
                <Card variant="accent" span={2} hover={false} className="!p-0">
                    <div
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        className={`
              relative min-h-[400px] flex flex-col items-center justify-center p-8
              rounded-2xl border-2 border-dashed transition-all duration-300 m-2
              ${dragOver ? 'border-primary-500 bg-primary-500/5' : 'border-dark-700/50 hover:border-dark-600'}
              ${preview ? '!border-solid !border-emerald-500/30' : ''}
            `}
                    >
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
                                        <img src={preview} alt="Prescription" className="max-h-[280px] rounded-xl border border-dark-700 shadow-xl" />
                                        <button
                                            onClick={() => setPreview(null)}
                                            className="absolute -top-2 -right-2 w-8 h-8 bg-dark-800 border border-dark-600 rounded-full flex items-center justify-center hover:bg-rose-500/20 hover:text-rose-400 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 mb-4">
                                        <Check className="w-4 h-4 text-emerald-400" />
                                        <p className="text-sm text-emerald-400">Image ready for processing</p>
                                    </div>
                                    <Button onClick={handleProcess} icon={Brain} size="lg">
                                        Process with AI
                                    </Button>
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
                                        animate={{ y: [0, -8, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-dark-800 border border-dark-700 flex items-center justify-center"
                                    >
                                        <FileImage className="w-10 h-10 text-dark-500" />
                                    </motion.div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Drop your prescription here</h3>
                                    <p className="text-sm text-dark-400 mb-6">or use the buttons below</p>
                                    <div className="flex flex-wrap items-center justify-center gap-3">
                                        <Button icon={Camera} variant="secondary" size="lg" onClick={() => fileRef.current?.click()}>
                                            Camera Capture
                                        </Button>
                                        <Button icon={UploadIcon} size="lg" onClick={() => fileRef.current?.click()}>
                                            Upload Image
                                        </Button>
                                    </div>
                                    <input
                                        ref={fileRef}
                                        type="file"
                                        accept="image/*"
                                        capture="environment"
                                        className="hidden"
                                        onChange={(e) => handleFile(e.target.files[0])}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </Card>

                {/* Tips */}
                <Card variant="glass" hover={false}>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                        <Lightbulb className="w-5 h-5 text-amber-400" />
                        Upload Tips
                    </h3>
                    <div className="space-y-3">
                        {tips.map((tip, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className="flex items-start gap-3 p-3 rounded-lg bg-dark-800/30"
                            >
                                <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs font-bold text-amber-400">{i + 1}</span>
                                </div>
                                <p className="text-sm text-dark-300">{tip}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-6 p-4 rounded-xl bg-primary-500/5 border border-primary-500/20">
                        <p className="text-sm text-primary-400 font-medium mb-1">Supported Formats</p>
                        <p className="text-xs text-dark-400">JPG, PNG, WEBP — Max 10MB</p>
                    </div>
                </Card>
            </div>

            {/* Error Modal */}
            <Modal isOpen={error} onClose={() => setError(false)} title="Image Error">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/10 flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-rose-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Unable to process image</h3>
                    <p className="text-sm text-dark-400 mb-6">The uploaded image is unclear or in an unsupported format. Please try again with a clearer image.</p>
                    <Button onClick={() => setError(false)} variant="secondary" className="w-full">
                        Try Again
                    </Button>
                </div>
            </Modal>
        </AnimatedPage>
    )
}
