import { useState } from 'react'
import { motion } from 'framer-motion'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import StatusBadge from '../../components/ui/StatusBadge'
import AnimatedPage from '../../components/shared/AnimatedPage'
import {
    Search, Plus, Edit, Trash2, Package, AlertTriangle,
    XCircle, Filter, ChevronLeft, ChevronRight, Pill
} from 'lucide-react'

const initialInventory = [
    { id: 1, name: 'Amoxicillin', dosage: '500mg', stock: 245, threshold: 20, expiry: '2027-03-15', price: 5.50, status: 'in-stock' },
    { id: 2, name: 'Paracetamol', dosage: '650mg', stock: 520, threshold: 50, expiry: '2027-06-20', price: 2.00, status: 'in-stock' },
    { id: 3, name: 'Omeprazole', dosage: '20mg', stock: 180, threshold: 25, expiry: '2027-01-10', price: 8.00, status: 'in-stock' },
    { id: 4, name: 'Cetirizine', dosage: '10mg', stock: 0, threshold: 15, expiry: '2027-04-05', price: 3.50, status: 'out-of-stock' },
    { id: 5, name: 'Metformin', dosage: '500mg', stock: 8, threshold: 25, expiry: '2027-08-12', price: 4.00, status: 'low-stock' },
    { id: 6, name: 'Atorvastatin', dosage: '10mg', stock: 320, threshold: 30, expiry: '2027-11-25', price: 12.00, status: 'in-stock' },
    { id: 7, name: 'Azithromycin', dosage: '250mg', stock: 5, threshold: 20, expiry: '2026-12-30', price: 15.00, status: 'low-stock' },
    { id: 8, name: 'Ibuprofen', dosage: '400mg', stock: 400, threshold: 40, expiry: '2027-09-18', price: 3.00, status: 'in-stock' },
]

export default function Inventory() {
    const [inventory, setInventory] = useState(initialInventory)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('all')
    const [showModal, setShowModal] = useState(false)
    const [editItem, setEditItem] = useState(null)
    const [page, setPage] = useState(1)
    const perPage = 6

    const filtered = inventory.filter(item => {
        const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
        const matchFilter = filter === 'all' ||
            (filter === 'low' && (item.status === 'low-stock' || item.status === 'out-of-stock')) ||
            (filter === 'in-stock' && item.status === 'in-stock')
        return matchSearch && matchFilter
    })

    const totalPages = Math.ceil(filtered.length / perPage)
    const paged = filtered.slice((page - 1) * perPage, page * perPage)

    const summaryStats = [
        { label: 'Total Items', value: inventory.length, icon: Package, color: 'text-primary-400' },
        { label: 'Low Stock', value: inventory.filter(i => i.status === 'low-stock').length, icon: AlertTriangle, color: 'text-amber-400' },
        { label: 'Out of Stock', value: inventory.filter(i => i.status === 'out-of-stock').length, icon: XCircle, color: 'text-rose-400' },
    ]

    const handleDelete = (id) => {
        setInventory(prev => prev.filter(i => i.id !== id))
    }

    return (
        <AnimatedPage>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Inventory Management</h1>
                    <p className="text-dark-400">Manage medicine stock and availability</p>
                </div>
                <Button icon={Plus} onClick={() => { setEditItem(null); setShowModal(true) }}>
                    Add Medicine
                </Button>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {summaryStats.map((stat, i) => (
                    <Card key={stat.label} variant="glass" hover={false} className="!p-4">
                        <div className="flex items-center gap-3">
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            <div>
                                <p className="text-xl font-bold text-white">{stat.value}</p>
                                <p className="text-xs text-dark-400">{stat.label}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="flex-1">
                    <Input icon={Search} placeholder="Search medicines..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
                </div>
                <div className="flex gap-2">
                    {['all', 'in-stock', 'low'].map(f => (
                        <button
                            key={f}
                            onClick={() => { setFilter(f); setPage(1) }}
                            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${filter === f ? 'bg-primary-500/10 border-primary-500/30 text-primary-400' : 'bg-dark-900 border-dark-700 text-dark-400 hover:text-white'
                                }`}
                        >
                            {f === 'all' ? 'All' : f === 'in-stock' ? 'In Stock' : 'Low / Out'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <Card variant="default" hover={false} className="!p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-dark-700/50">
                                <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider px-6 py-4">Medicine</th>
                                <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider px-6 py-4">Stock</th>
                                <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider px-6 py-4 hidden md:table-cell">Expiry</th>
                                <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider px-6 py-4">Status</th>
                                <th className="text-right text-xs font-medium text-dark-400 uppercase tracking-wider px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paged.map((item, i) => (
                                <motion.tr
                                    key={item.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="border-b border-dark-700/30 hover:bg-dark-800/30 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
                                                <Pill className="w-4 h-4 text-primary-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">{item.name}</p>
                                                <p className="text-xs text-dark-400">{item.dosage} · ₹{item.price}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className={`text-sm font-semibold ${item.stock === 0 ? 'text-rose-400' : item.stock < item.threshold ? 'text-amber-400' : 'text-white'}`}>
                                            {item.stock}
                                        </p>
                                        <p className="text-xs text-dark-500">Min: {item.threshold}</p>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        <p className="text-sm text-dark-300">{item.expiry}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge
                                            status={item.status === 'in-stock' ? 'success' : item.status === 'low-stock' ? 'warning' : 'error'}
                                            label={item.status.replace('-', ' ')}
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => { setEditItem(item); setShowModal(true) }}
                                                className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-white transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 rounded-lg hover:bg-rose-500/10 text-dark-400 hover:text-rose-400 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-dark-700/50">
                        <p className="text-sm text-dark-400">
                            Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
                        </p>
                        <div className="flex gap-2">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg bg-dark-800 border border-dark-700 text-dark-400 hover:text-white disabled:opacity-30 transition-colors">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg bg-dark-800 border border-dark-700 text-dark-400 hover:text-white disabled:opacity-30 transition-colors">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Add/Edit Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Edit Medicine' : 'Add Medicine'}>
                <div className="space-y-4">
                    <Input label="Medicine Name" placeholder="e.g. Amoxicillin" defaultValue={editItem?.name} />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Dosage" placeholder="e.g. 500mg" defaultValue={editItem?.dosage} />
                        <Input label="Price (₹)" type="number" placeholder="0.00" defaultValue={editItem?.price} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Stock Quantity" type="number" placeholder="0" defaultValue={editItem?.stock} />
                        <Input label="Min Threshold" type="number" placeholder="0" defaultValue={editItem?.threshold} />
                    </div>
                    <Input label="Expiry Date" type="date" defaultValue={editItem?.expiry} />
                    <div className="flex gap-3 pt-2">
                        <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
                        <Button onClick={() => setShowModal(false)} className="flex-1">{editItem ? 'Update' : 'Add Medicine'}</Button>
                    </div>
                </div>
            </Modal>
        </AnimatedPage>
    )
}
