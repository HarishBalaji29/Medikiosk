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
    XCircle, Filter, ChevronLeft, ChevronRight, Pill, Inbox
} from 'lucide-react'

export default function Inventory() {
    const [inventory, setInventory] = useState([])
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('all')
    const [showModal, setShowModal] = useState(false)
    const [editItem, setEditItem] = useState(null)
    const [page, setPage] = useState(1)
    const perPage = 6

    // Form state for add/edit
    const [formData, setFormData] = useState({ name: '', dosage: '', price: '', stock: '', threshold: '', expiry: '' })

    const filtered = inventory.filter(item => {
        const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
        const matchFilter = filter === 'all' ||
            (filter === 'low' && (item.status === 'low-stock' || item.status === 'out-of-stock')) ||
            (filter === 'in-stock' && item.status === 'in-stock')
        return matchSearch && matchFilter
    })

    const totalPages = Math.ceil(filtered.length / perPage) || 1
    const paged = filtered.slice((page - 1) * perPage, page * perPage)

    const summaryStats = [
        { label: 'Total Items', value: inventory.length, icon: Package, color: 'text-primary-400' },
        { label: 'Low Stock', value: inventory.filter(i => i.status === 'low-stock').length, icon: AlertTriangle, color: 'text-amber-400' },
        { label: 'Out of Stock', value: inventory.filter(i => i.status === 'out-of-stock').length, icon: XCircle, color: 'text-rose-400' },
    ]

    const handleDelete = (id) => {
        setInventory(prev => prev.filter(i => i.id !== id))
    }

    const openAddModal = () => {
        setEditItem(null)
        setFormData({ name: '', dosage: '', price: '', stock: '', threshold: '', expiry: '' })
        setShowModal(true)
    }

    const openEditModal = (item) => {
        setEditItem(item)
        setFormData({ name: item.name, dosage: item.dosage, price: item.price, stock: item.stock, threshold: item.threshold, expiry: item.expiry })
        setShowModal(true)
    }

    const handleSave = () => {
        const stock = parseInt(formData.stock) || 0
        const threshold = parseInt(formData.threshold) || 0
        const status = stock === 0 ? 'out-of-stock' : stock < threshold ? 'low-stock' : 'in-stock'

        if (editItem) {
            setInventory(prev => prev.map(i => i.id === editItem.id ? { ...i, ...formData, stock, threshold, price: parseFloat(formData.price) || 0, status } : i))
        } else {
            const newItem = {
                id: Date.now(),
                name: formData.name || 'New Medicine',
                dosage: formData.dosage || '',
                stock,
                threshold,
                expiry: formData.expiry || '',
                price: parseFloat(formData.price) || 0,
                status,
            }
            setInventory(prev => [...prev, newItem])
        }
        setShowModal(false)
    }

    return (
        <AnimatedPage>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Inventory Management</h1>
                    <p className="text-dark-400">Manage medicine stock and availability</p>
                </div>
                <Button icon={Plus} onClick={openAddModal}>
                    Add Medicine
                </Button>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {summaryStats.map((stat) => (
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
                            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${filter === f ? 'bg-primary-500/10 border-primary-500/30 text-primary-400' : 'bg-dark-900 border-dark-700 text-dark-400 hover:text-white'}`}
                        >
                            {f === 'all' ? 'All' : f === 'in-stock' ? 'In Stock' : 'Low / Out'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <Card variant="default" hover={false} className="!p-0 overflow-hidden">
                {paged.length > 0 ? (
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
                                            <p className="text-sm text-dark-300">{item.expiry || '—'}</p>
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
                                                    onClick={() => openEditModal(item)}
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
                ) : (
                    <div className="text-center py-16">
                        <Inbox className="w-12 h-12 text-dark-600 mx-auto mb-3" />
                        <p className="text-dark-400 font-medium">No medicines in inventory</p>
                        <p className="text-xs text-dark-500 mt-1">Click "Add Medicine" to add your first item</p>
                    </div>
                )}

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
                    <Input label="Medicine Name" placeholder="e.g. Amoxicillin" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Dosage" placeholder="e.g. 500mg" value={formData.dosage} onChange={e => setFormData(p => ({ ...p, dosage: e.target.value }))} />
                        <Input label="Price (₹)" type="number" placeholder="0.00" value={formData.price} onChange={e => setFormData(p => ({ ...p, price: e.target.value }))} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Stock Quantity" type="number" placeholder="0" value={formData.stock} onChange={e => setFormData(p => ({ ...p, stock: e.target.value }))} />
                        <Input label="Min Threshold" type="number" placeholder="0" value={formData.threshold} onChange={e => setFormData(p => ({ ...p, threshold: e.target.value }))} />
                    </div>
                    <Input label="Expiry Date" type="date" value={formData.expiry} onChange={e => setFormData(p => ({ ...p, expiry: e.target.value }))} />
                    <div className="flex gap-3 pt-2">
                        <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
                        <Button onClick={handleSave} className="flex-1">{editItem ? 'Update' : 'Add Medicine'}</Button>
                    </div>
                </div>
            </Modal>
        </AnimatedPage>
    )
}
