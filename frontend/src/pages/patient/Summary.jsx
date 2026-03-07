import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import StatusBadge from '../../components/ui/StatusBadge'
import AnimatedPage from '../../components/shared/AnimatedPage'
import {
    Pill, Stethoscope, RotateCcw, ShoppingCart,
    CheckCircle2, AlertCircle, IndianRupee, Clock, Package, FileText
} from 'lucide-react'

export default function Summary() {
    const navigate = useNavigate()
    const [confirmed, setConfirmed] = useState(false)

    // Read real OCR result from localStorage
    const ocrData = JSON.parse(localStorage.getItem('medikiosk_ocr_result') || 'null')
    const extractedText = ocrData?.extracted_text || ''
    const confidence = ocrData?.confidence || 0

    // Use real medicines from OCR, or empty array
    const medicines = useMemo(() => {
        if (ocrData?.medicines && ocrData.medicines.length > 0) {
            return ocrData.medicines.map((med, i) => ({
                name: med.name || `Medicine ${i + 1}`,
                dosage: med.dosage || '—',
                frequency: med.frequency || '—',
                duration: med.duration || '—',
                qty: 1,
                price: med.price || 0,
                available: med.available !== false,
                raw_line: med.raw_line || '',
            }))
        }
        return []
    }, [ocrData])

    const availableCount = medicines.filter(m => m.available).length
    const totalCost = medicines.reduce((a, m) => a + m.price * m.qty, 0)

    const handleDispense = () => {
        setConfirmed(true)
        setTimeout(() => navigate('/patient/dispensing'), 600)
    }

    const handleRescan = () => {
        localStorage.removeItem('medikiosk_ocr_result')
        localStorage.removeItem('medikiosk_prescription_image')
        navigate('/patient/upload')
    }

    return (
        <AnimatedPage>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-2">Prescription Summary</h1>
                <p className="text-dark-400">Review detected medicines before dispensing</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Extracted Text Card */}
                <Card variant="glass" hover={false} className="lg:col-span-2">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                            <FileText className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white">Extracted Prescription Text</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <StatusBadge
                                    status={confidence > 80 ? 'success' : confidence > 50 ? 'warning' : 'error'}
                                    label={`${confidence}% confidence`}
                                />
                            </div>
                        </div>
                    </div>
                    {extractedText ? (
                        <pre className="text-sm text-dark-300 bg-dark-800/50 rounded-lg p-4 font-mono whitespace-pre-wrap overflow-auto max-h-48 border border-dark-700">
                            {extractedText}
                        </pre>
                    ) : (
                        <p className="text-sm text-dark-500 italic">No text was extracted. Please try re-scanning with a clearer image.</p>
                    )}
                </Card>

                {/* Summary Stats */}
                <Card variant="accent" hover={false}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 rounded-xl bg-dark-800/50">
                            <Package className="w-5 h-5 text-primary-400 mx-auto mb-1" />
                            <p className="text-lg font-bold text-white">{medicines.length}</p>
                            <p className="text-xs text-dark-400">Detected</p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-dark-800/50">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                            <p className="text-lg font-bold text-white">{availableCount}</p>
                            <p className="text-xs text-dark-400">Available</p>
                        </div>
                    </div>
                </Card>

                {/* Medicine List */}
                <div className="lg:col-span-3 space-y-3">
                    {medicines.length > 0 ? (
                        medicines.map((med, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * i }}
                            >
                                <Card variant="default" hover={false}>
                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${med.available ? 'bg-primary-500/10 border border-primary-500/20' : 'bg-rose-500/10 border border-rose-500/20'}`}>
                                                <Pill className={`w-5 h-5 ${med.available ? 'text-primary-400' : 'text-rose-400'}`} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h4 className="font-semibold text-white">{med.name}</h4>
                                                    {med.dosage && med.dosage !== '—' && (
                                                        <span className="text-xs text-dark-400 bg-dark-800 px-2 py-0.5 rounded">{med.dosage}</span>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap gap-3 mt-1">
                                                    {med.frequency && med.frequency !== '—' && (
                                                        <span className="text-xs text-dark-400 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" /> {med.frequency}
                                                        </span>
                                                    )}
                                                    {med.duration && med.duration !== '—' && (
                                                        <span className="text-xs text-dark-400">Duration: {med.duration}</span>
                                                    )}
                                                </div>
                                                {med.raw_line && (
                                                    <p className="text-xs text-dark-500 mt-1 font-mono italic">"{med.raw_line}"</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {med.price > 0 && (
                                                <span className="text-sm font-semibold text-white flex items-center">
                                                    <IndianRupee className="w-3 h-3" />{(med.price * med.qty).toFixed(2)}
                                                </span>
                                            )}
                                            <StatusBadge
                                                status={med.available ? 'success' : 'error'}
                                                label={med.available ? 'In Stock' : 'Unavailable'}
                                            />
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))
                    ) : (
                        <Card variant="default" hover={false} className="!border-amber-500/30 !bg-amber-500/5">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-amber-300 font-medium">No medicines detected</p>
                                    <p className="text-xs text-dark-400 mt-1">The AI couldn't identify specific medicines from the text. Please check the extracted text above and try re-scanning with a clearer image.</p>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Verification Notice */}
                <Card variant="default" hover={false} className="lg:col-span-3 !border-primary-500/30 !bg-primary-500/5">
                    <div className="flex items-center gap-3">
                        <Stethoscope className="w-5 h-5 text-primary-400 flex-shrink-0" />
                        <p className="text-sm text-primary-300">
                            AI-extracted results should be verified by a healthcare professional before dispensing.
                        </p>
                    </div>
                </Card>

                {/* Total & Actions */}
                <Card variant="glass" hover={false} className="lg:col-span-3">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                <IndianRupee className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm text-dark-400">Estimated Total</p>
                                <p className="text-2xl font-bold text-white flex items-center">
                                    <IndianRupee className="w-5 h-5" />{totalCost.toFixed(2)}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <Button variant="secondary" icon={RotateCcw} onClick={handleRescan} className="flex-1 md:flex-none">
                                Re-scan
                            </Button>
                            {medicines.length > 0 && (
                                <Button variant="emerald" icon={ShoppingCart} size="lg" onClick={handleDispense} loading={confirmed} className="flex-1 md:flex-none">
                                    Confirm & Dispense
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </AnimatedPage>
    )
}
