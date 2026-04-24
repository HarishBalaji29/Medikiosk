import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import AnimatedPage from '../../components/shared/AnimatedPage'
import { CheckCircle2, Download, Home, Pill, Clock, Hash, Calendar, Info } from 'lucide-react'
import api from '../../services/api'

export default function Success() {
    const navigate = useNavigate()
    const [showNotification, setShowNotification] = useState(false)

    // Auto-hide notification
    useEffect(() => {
        if (showNotification) {
            const timer = setTimeout(() => setShowNotification(false), 3000)
            return () => clearTimeout(timer)
        }
    }, [showNotification])

    const receiptItems = useMemo(() => {
        const ocrData = JSON.parse(localStorage.getItem('medikiosk_ocr_result') || 'null')
        if (ocrData?.medicines?.length) {
            return ocrData.medicines
                .filter(m => m.available !== false)
                .map(m => {
                    const mockPrice = Math.floor(Math.random() * 150) + 50
                    return {
                        name: `${m.name} ${m.dosage || ''}`.trim(),
                        qty: 1,
                        price: m.price || mockPrice
                    }
                })
        }
        return []
    }, [])

    const totalAmount = receiptItems.reduce((sum, item) => sum + (item.price * item.qty), 0)

    const now = new Date()
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
    const txnId = `TXN-${Date.now().toString().slice(-5)}`

    const handleGoHome = () => {
        // Clear OCR data on completion
        localStorage.removeItem('medikiosk_ocr_result')
        localStorage.removeItem('medikiosk_prescription_image')
        navigate('/patient/dashboard')
    }

    const handleDownloadReceipt = async () => {
        const doc = new jsPDF()

        // Colors
        const primaryColor = [16, 185, 129] // Emerald 500
        const darkColor = [30, 41, 59]      // Slate 800
        const lightColor = [100, 116, 139]  // Slate 500

        // Header
        doc.setFontSize(24)
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
        doc.text('MEDIKIOSK', 14, 22)
        
        doc.setFontSize(10)
        doc.setTextColor(lightColor[0], lightColor[1], lightColor[2])
        doc.text('Smart Medicine Dispensing System', 14, 28)

        // Receipt Title & Txn ID
        doc.setFontSize(16)
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2])
        doc.text('DISPENSING RECEIPT', 14, 45)
        
        doc.setFontSize(10)
        doc.text(`Transaction ID: ${txnId}`, 140, 45)

        // Date & Time
        doc.setDrawColor(226, 232, 240) // Slate 200
        doc.line(14, 50, 196, 50)
        
        doc.text(`Date: ${dateStr}`, 14, 60)
        doc.text(`Time: ${timeStr}`, 14, 66)
        doc.text(`Total Items: ${receiptItems.length}`, 140, 60)

        // Table
        const tableColumn = ["#", "Medicine Name", "Qty", "Price (Rs)"]
        const tableRows = []

        receiptItems.forEach((item, index) => {
            const rowData = [
                (index + 1).toString(),
                item.name,
                item.qty.toString(),
                item.price.toFixed(2)
            ]
            tableRows.push(rowData)
        })

        autoTable(doc, {
            startY: 75,
            head: [tableColumn],
            body: tableRows,
            theme: 'striped',
            headStyles: {
                fillColor: primaryColor,
                textColor: [255, 255, 255],
                fontStyle: 'bold',
            },
            styles: {
                fontSize: 10,
                cellPadding: 6,
            },
            columnStyles: {
                0: { cellWidth: 15 },
                1: { cellWidth: 'auto' },
                2: { cellWidth: 20, halign: 'center' },
                3: { cellWidth: 30, halign: 'right' }
            }
        })

        // Footer
        const finalY = doc.lastAutoTable?.finalY || 75
        
        // Total Amount
        doc.setFontSize(12)
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2])
        doc.text(`Total Amount: Rs. ${totalAmount.toFixed(2)}`, 140, finalY + 10)

        doc.setTextColor(lightColor[0], lightColor[1], lightColor[2])
        doc.setFontSize(10)
        doc.text('Thank you for using Medikiosk!', 14, finalY + 25)
        doc.setFontSize(8)
        doc.text('This is an electronically generated receipt.', 14, finalY + 31)

        const pdfFilename = `Medikiosk_Receipt_${txnId}.pdf`
        
        try {
            // 1. Trigger browser download
            doc.save(pdfFilename)

            // 2. Try to Send to Backend to save locally on Desktop & Supabase Storage
            try {
                const pdfBlob = doc.output('blob')
                const formData = new FormData()
                formData.append('file', pdfBlob, pdfFilename)

                await api.post('/patient/receipts/upload', formData)
                console.log("Receipt successfully backed up to Desktop & Supabase.")
            } catch (err) {
                console.error("Failed to backup receipt to server:", err)
            }

            // 3. Show UI notification (will show as long as doc.save succeeded)
            setShowNotification(true)
        } catch (error) {
            console.error("Failed to generate PDF:", error)
        }
    }

    return (
        <AnimatedPage>
            <div className="max-w-2xl mx-auto py-8">
                {/* Success Animation */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                    className="text-center mb-8"
                >
                    <motion.div
                        animate={{
                            boxShadow: [
                                '0 0 0 0 rgba(16, 185, 129, 0.4)',
                                '0 0 0 40px rgba(16, 185, 129, 0)',
                            ],
                        }}
                        transition={{ duration: 1.5, repeat: 2 }}
                        className="w-24 h-24 mx-auto mb-6 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.5, type: 'spring' }}
                        >
                            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                        </motion.div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="text-3xl font-bold text-white mb-2"
                    >
                        Medicine Dispensed Successfully!
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        className="text-dark-400"
                    >
                        Your prescription has been processed and medicines are ready
                    </motion.p>
                </motion.div>

                {/* Receipt Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                >
                    <Card variant="glass" hover={false}>
                        <div className="border-b border-dark-700/50 pb-4 mb-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-white">Dispensing Receipt</h3>
                                <span className="text-xs text-dark-400 bg-dark-800 px-3 py-1 rounded-full">
                                    #{txnId}
                                </span>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-dark-500" />
                                <div>
                                    <p className="text-xs text-dark-400">Date</p>
                                    <p className="text-sm font-medium text-white">{dateStr}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-dark-500" />
                                <div>
                                    <p className="text-xs text-dark-400">Time</p>
                                    <p className="text-sm font-medium text-white">{timeStr}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Hash className="w-4 h-4 text-dark-500" />
                                <div>
                                    <p className="text-xs text-dark-400">Transaction ID</p>
                                    <p className="text-sm font-medium text-white">{txnId}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Pill className="w-4 h-4 text-dark-500" />
                                <div>
                                    <p className="text-xs text-dark-400">Total Items</p>
                                    <p className="text-sm font-medium text-white">{receiptItems.length} medicines</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-4 h-4 flex items-center justify-center text-dark-500 font-bold border rounded-full border-dark-500 text-[10px]">₹</span>
                                <div>
                                    <p className="text-xs text-dark-400">Total Amount</p>
                                    <p className="text-sm font-medium text-emerald-400">Rs. {totalAmount.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="space-y-2 mb-6 border-b border-dark-700/50 pb-6">
                            {receiptItems.length > 0 ? (
                                receiptItems.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-dark-800/30">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                            <span className="text-sm text-white">{item.name}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-white">Rs. {item.price.toFixed(2)}</div>
                                            <div className="text-xs text-dark-400">Qty: {item.qty}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-sm text-dark-400">
                                    No items dispensed
                                </div>
                            )}
                        </div>

                        {/* Grand Total Footer */}
                        <div className="flex justify-between items-center mb-6 px-2">
                            <span className="text-sm text-dark-400 font-medium">Grand Total</span>
                            <span className="text-xl font-bold text-emerald-400">Rs. {totalAmount.toFixed(2)}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button variant="emerald" icon={Download} onClick={handleDownloadReceipt} className="flex-1">
                                Download Receipt
                            </Button>
                            <Button variant="emerald" icon={Home} onClick={handleGoHome} className="flex-1">
                                Return to Dashboard
                            </Button>
                        </div>
                    </Card>
                </motion.div>

                {/* Particles */}
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="fixed w-2 h-2 rounded-full bg-emerald-400/40"
                        style={{ left: `${10 + Math.random() * 80}%`, top: `${10 + Math.random() * 30}%` }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: [0, -100] }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 2 }}
                    />
                ))}

                {/* Pop-up Notification */}
                {showNotification && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-dark-800 border border-emerald-500/30 px-4 py-3 rounded-lg shadow-lg shadow-emerald-500/10"
                    >
                        <div className="bg-emerald-500/20 p-1.5 rounded-full">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">Receipt Downloaded</p>
                            <p className="text-xs text-dark-400">Your PDF receipt has been saved successfully.</p>
                        </div>
                    </motion.div>
                )}
            </div>
        </AnimatedPage>
    )
}
