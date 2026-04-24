import { useState, useEffect } from 'react'
import api from '../../services/api'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import StatusBadge from '../../components/ui/StatusBadge'
import AnimatedPage from '../../components/shared/AnimatedPage'
import {
    Search, Plus, Edit, Trash2, Package, AlertTriangle,
    XCircle, Filter, ChevronLeft, ChevronRight, Pill, Inbox, Grid, ShieldAlert
} from 'lucide-react'

// Heatmap Grid Component
function StockHeatmap({ inventory, onSquareClick }) {
    // Determine color based on status
    const getColor = (status, stock) => {
        if (stock === 0) return 'bg-rose-500 border-rose-600 shadow-[0_0_8px_rgba(244,63,94,0.5)]'
        if (status === 'low-stock' || stock < 20) return 'bg-amber-500 border-amber-600 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
        if (stock < 50) return 'bg-emerald-400 border-emerald-500' // medium
        return 'bg-emerald-600 border-emerald-700' // full
    }

    return (
        <div className="bg-dark-900/60 border border-dark-700/50 rounded-2xl p-5 mb-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Grid className="w-4 h-4 text-primary-400" /> Stock Level Heatmap
                </h3>
                <div className="flex items-center gap-3 text-xs text-dark-400">
                    <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-emerald-600" /> Healthy</div>
                    <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-amber-500" /> Low</div>
                    <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-rose-500" /> Empty</div>
                </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
                {inventory.map((item, i) => (
                    <motion.div
                        key={item.id}
                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.01 }}
                        whileHover={{ scale: 1.2, zIndex: 10 }}
                        onClick={() => onSquareClick(item.name)}
                        className={`w-6 h-6 rounded border cursor-pointer relative group transition-colors ${getColor(item.status, item.stock)}`}
                    >
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max max-w-[150px] z-50">
                            <div className="bg-dark-800 border border-dark-700 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-xl">
                                <p className="font-bold truncate">{item.name}</p>
                                <p className="text-dark-300">Stock: {item.stock}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
                {inventory.length === 0 && (
                    <div className="w-full text-center text-xs text-dark-500 py-2">No inventory data to display heatmap</div>
                )}
            </div>
        </div>
    )
}

export default function Inventory() {
    const [inventory, setInventory] = useState([])
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('all')
    const [showModal, setShowModal] = useState(false)
    const [editItem, setEditItem] = useState(null)
    const [page, setPage] = useState(1)
    const perPage = 6

    const [loading, setLoading] = useState(true)

    // Form state for add/edit
    const [formData, setFormData] = useState({ name: '', dosage: '', price: '', stock: '', threshold: '', expiry: '' })

    useEffect(() => {
        fetchInventory()
    }, [])

    const fetchInventory = async () => {
        try {
            setLoading(true)
            const res = await api.get('/admin/inventory')
            const data = res.data.map(m => ({
                id: m.id,
                name: m.name,
                dosage: m.dosage,
                stock: m.stock_quantity,
                threshold: m.min_threshold,
                price: m.unit_price,
                expiry: m.expiry_date,
                status: m.stock_quantity === 0 ? 'out-of-stock' : m.stock_quantity <= m.min_threshold ? 'low-stock' : 'in-stock'
            }))
            // sort out of stock/low stock first for heatmap visibility
            data.sort((a, b) => a.stock - b.stock) 
            setInventory(data)
        } catch (error) {
            console.error('Failed to fetch inventory:', error)
        } finally {
            setLoading(false)
        }
    }

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
        { label: 'Low Stock Alerts', value: inventory.filter(i => i.status === 'low-stock').length, icon: ShieldAlert, color: 'text-amber-400' },
        { label: 'Out of Stock', value: inventory.filter(i => i.status === 'out-of-stock').length, icon: XCircle, color: 'text-rose-400' },
    ]

    const handleDelete = async (id) => {
        try {
            await api.delete(`/admin/inventory/${id}`)
            fetchInventory()
        } catch (error) {
            console.error('Failed to delete medicine:', error)
        }
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

    const handleSave = async () => {
        const payload = {
            name: formData.name || 'New Medicine',
            stock_quantity: parseInt(formData.stock) || 0,
            min_threshold: parseInt(formData.threshold) || 0,
            unit_price: parseFloat(formData.price) || 0,
            expiry_date: formData.expiry || null,
        }

        try {
            if (editItem) {
                await api.put(`/admin/inventory/${editItem.id}/update`, payload)
            } else {
                payload.dosage = formData.dosage || ''
                await api.post('/admin/inventory/add', payload)
            }
            setShowModal(false)
            fetchInventory()
        } catch (error) {
            console.error('Failed to save medicine:', error)
            alert(`Error: ${error.response?.data?.detail || error.message}`)
        }
    }

    return (
        <AnimatedPage>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Inventory Management</h1>
                    <p className="text-dark-400">Monitor supplies, visual heatmap, and add stock</p>
                </div>
                <Button icon={Plus} onClick={openAddModal}>
                    Add Medicine
                </Button>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {summaryStats.map((stat) => (
                    <Card key={stat.label} variant="glass" hover={false} className="!p-5 border-l-4" style={{ 
                        borderLeftColor: stat.label === 'Total Items' ? '#3B82F6' : 
                                         stat.label === 'Low Stock Alerts' ? '#F59E0B' : '#F43F5E'
                    }}>
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl bg-dark-800/50 flex items-center justify-center flex-shrink-0`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white leading-tight">{stat.value}</p>
                                <p className="text-xs font-medium text-dark-400 uppercase tracking-wider mt-0.5">{stat.label}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Visual Heatmap */}
            {!loading && <StockHeatmap inventory={inventory} onSquareClick={(name) => { setSearch(name); setPage(1); }} />}

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-dark-900/40 p-2 rounded-xl border border-dark-700/50">
                <div className="flex-1">
                    <Input icon={Search} placeholder="Search medicines..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
                </div>
                <div className="flex gap-2">
                    {['all', 'in-stock', 'low'].map(f => (
                        <button
                            key={f}
                            onClick={() => { setFilter(f); setPage(1) }}
                            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${filter === f ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'bg-transparent text-dark-400 hover:bg-dark-800 hover:text-white'}`}
                        >
                            {f === 'all' ? 'All Items' : f === 'in-stock' ? 'In Stock' : 'Low / Empty'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <Card variant="default" hover={false} className="!p-0 overflow-hidden border-dark-700/50 shadow-2xl">
                {paged.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-dark-700/50 bg-dark-800/30">
                                    <th className="text-left text-xs font-semibold text-dark-400 uppercase tracking-wider px-6 py-4">Medicine</th>
                                    <th className="text-left text-xs font-semibold text-dark-400 uppercase tracking-wider px-6 py-4">Stock Level</th>
                                    <th className="text-left text-xs font-semibold text-dark-400 uppercase tracking-wider px-6 py-4 hidden md:table-cell">Details</th>
                                    <th className="text-left text-xs font-semibold text-dark-400 uppercase tracking-wider px-6 py-4">Status</th>
                                    <th className="text-right text-xs font-semibold text-dark-400 uppercase tracking-wider px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence mode="popLayout">
                                {paged.map((item, i) => (
                                    <motion.tr
                                        layout
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="border-b border-dark-700/30 hover:bg-dark-800/40 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                                    <Pill className="w-4 h-4 text-primary-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-white group-hover:text-primary-400 transition-colors">{item.name}</p>
                                                    <p className="text-xs text-dark-400">{item.dosage}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 w-48">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className={`text-sm font-bold ${item.stock === 0 ? 'text-rose-400' : item.stock <= item.threshold ? 'text-amber-400' : 'text-emerald-400'}`}>
                                                    {item.stock} <span className="text-[10px] text-dark-500 font-normal">units</span>
                                                </span>
                                            </div>
                                            {/* Mini inline bar */}
                                            <div className="h-1.5 rounded-full bg-dark-800 overflow-hidden flex">
                                                <div 
                                                    className={`h-full rounded-full ${item.stock === 0 ? 'bg-rose-500' : item.stock <= item.threshold ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                                                    style={{ width: `${Math.min((item.stock / Math.max(item.threshold * 3, 100)) * 100, 100)}%` }} 
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell text-sm">
                                            <p className="text-dark-300">₹{item.price}</p>
                                            <p className="text-[10px] text-dark-500 uppercase tracking-widest mt-0.5">Exp: {item.expiry || 'N/A'}</p>
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
                                                    className="p-2 rounded-lg bg-dark-800 border border-dark-700 hover:border-dark-500 text-dark-400 hover:text-white transition-all shadow-sm"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 rounded-lg bg-dark-800 border border-dark-700 hover:border-rose-500/50 hover:bg-rose-500/10 text-dark-400 hover:text-rose-400 transition-all shadow-sm"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-dark-900/30">
                        <Inbox className="w-12 h-12 text-dark-600 mx-auto mb-3" />
                        <p className="text-dark-300 font-medium text-lg">No medicines found</p>
                        <p className="text-sm text-dark-500 mt-1">Adjust filters or click "Add Medicine" to track inventory.</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-dark-700/50 bg-dark-900/80">
                        <p className="text-sm text-dark-400 font-medium">
                            Showing <span className="text-white">{(page - 1) * perPage + 1}</span> to <span className="text-white">{Math.min(page * perPage, filtered.length)}</span> of <span className="text-white">{filtered.length}</span>
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
                <div className="space-y-5 mt-2">
                    <Input label="Medicine Name" placeholder="e.g. Amoxicillin" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Dosage" placeholder="e.g. 500mg" value={formData.dosage} onChange={e => setFormData(p => ({ ...p, dosage: e.target.value }))} />
                        <Input label="Price (₹)" type="number" placeholder="0.00" value={formData.price} onChange={e => setFormData(p => ({ ...p, price: e.target.value }))} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Initial Stock" type="number" placeholder="0" value={formData.stock} onChange={e => setFormData(p => ({ ...p, stock: e.target.value }))} />
                        <Input label="Alert Threshold" type="number" placeholder="Minimum stock alert level" value={formData.threshold} onChange={e => setFormData(p => ({ ...p, threshold: e.target.value }))} />
                    </div>
                    <Input label="Expiry Date" type="date" value={formData.expiry} onChange={e => setFormData(p => ({ ...p, expiry: e.target.value }))} />
                    <div className="flex gap-3 pt-4 border-t border-dark-700/50 mt-4">
                        <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1 border-dark-600">Cancel</Button>
                        <Button onClick={handleSave} className="flex-1 shadow-lg shadow-primary-500/20">{editItem ? 'Update Database' : 'Add to Inventory'}</Button>
                    </div>
                </div>
            </Modal>
        </AnimatedPage>
    )
}
