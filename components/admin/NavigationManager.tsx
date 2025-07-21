'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
    PlusIcon,
    EditIcon,
    TrashIcon,
    GripVerticalIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    ExternalLinkIcon,
    EyeOffIcon
} from 'lucide-react'

interface NavigationMenu {
    id: string
    name: string
    location: string
    isActive: boolean
    items: NavigationItem[]
    createdAt: string
    updatedAt: string
}

interface NavigationItem {
    id: string
    title: string
    url?: string
    pageId?: string
    parentId?: string
    target: 'SELF' | 'BLANK'
    order: number
    isVisible: boolean
    cssClass?: string
    icon?: string
    children?: NavigationItem[]
    page?: {
        id: string
        title: string
        slug: string
    }
}

interface Page {
    id: string
    title: string
    slug: string
}

const MENU_LOCATIONS = [
    { value: 'HEADER_PRIMARY', label: 'Header Primary' },
    { value: 'HEADER_SECONDARY', label: 'Header Secondary' },
    { value: 'FOOTER_PRIMARY', label: 'Footer Primary' },
    { value: 'FOOTER_SECONDARY', label: 'Footer Secondary' },
    { value: 'SIDEBAR', label: 'Sidebar' }
]

export function NavigationManager() {
    const [menus, setMenus] = useState<NavigationMenu[]>([])
    const [pages, setPages] = useState<Page[]>([])
    const [selectedMenu, setSelectedMenu] = useState<NavigationMenu | null>(null)
    const [loading, setLoading] = useState(true)
    const [showCreateMenu, setShowCreateMenu] = useState(false)
    const [showCreateItem, setShowCreateItem] = useState(false)
    const [editingItem, setEditingItem] = useState<NavigationItem | null>(null)
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

    const [menuForm, setMenuForm] = useState({
        name: '',
        location: 'HEADER_PRIMARY',
        isActive: true
    })

    const [itemForm, setItemForm] = useState({
        title: '',
        url: '',
        pageId: '',
        parentId: '',
        target: 'SELF' as 'SELF' | 'BLANK',
        isVisible: true,
        cssClass: '',
        icon: ''
    })

    useEffect(() => {
        fetchMenus()
        fetchPages()
    }, [])

    const fetchMenus = async () => {
        try {
            const response = await fetch('/api/admin/navigation')
            if (response.ok) {
                const data = await response.json()
                setMenus(data.menus)
                if (data.menus.length > 0 && !selectedMenu) {
                    setSelectedMenu(data.menus[0])
                }
            }
        } catch (error) {
            console.error('Error fetching menus:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchPages = async () => {
        try {
            const response = await fetch('/api/pages')
            if (response.ok) {
                const data = await response.json()
                setPages(data.pages || [])
            }
        } catch (error) {
            console.error('Error fetching pages:', error)
        }
    }

    const handleCreateMenu = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch('/api/admin/navigation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(menuForm)
            })

            if (response.ok) {
                const data = await response.json()
                setMenus(prev => [...prev, data.menu])
                setSelectedMenu(data.menu)
                setShowCreateMenu(false)
                setMenuForm({ name: '', location: 'HEADER_PRIMARY', isActive: true })
            } else {
                const error = await response.json()
                alert(error.message || 'Failed to create menu')
            }
        } catch (error) {
            console.error('Error creating menu:', error)
            alert('Failed to create menu')
        }
    }

    const handleDeleteMenu = async (menuId: string) => {
        if (!confirm('Are you sure you want to delete this menu? All navigation items will be removed.')) {
            return
        }

        try {
            const response = await fetch(`/api/admin/navigation/${menuId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                setMenus(prev => prev.filter(m => m.id !== menuId))
                if (selectedMenu?.id === menuId) {
                    setSelectedMenu(menus.find(m => m.id !== menuId) || null)
                }
            } else {
                const error = await response.json()
                alert(error.message || 'Failed to delete menu')
            }
        } catch (error) {
            console.error('Error deleting menu:', error)
            alert('Failed to delete menu')
        }
    }

    const handleCreateItem = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedMenu) return

        try {
            const payload = {
                ...itemForm,
                url: itemForm.url || null,
                pageId: itemForm.pageId || null,
                parentId: itemForm.parentId || null,
                cssClass: itemForm.cssClass || null,
                icon: itemForm.icon || null
            }

            const response = await fetch(`/api/admin/navigation/${selectedMenu.id}/items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (response.ok) {
                await fetchMenus()
                setShowCreateItem(false)
                setItemForm({
                    title: '',
                    url: '',
                    pageId: '',
                    parentId: '',
                    target: 'SELF',
                    isVisible: true,
                    cssClass: '',
                    icon: ''
                })
            } else {
                const error = await response.json()
                alert(error.message || 'Failed to create navigation item')
            }
        } catch (error) {
            console.error('Error creating navigation item:', error)
            alert('Failed to create navigation item')
        }
    }

    const handleUpdateItem = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedMenu || !editingItem) return

        try {
            const payload = {
                ...itemForm,
                url: itemForm.url || null,
                pageId: itemForm.pageId || null,
                parentId: itemForm.parentId || null,
                cssClass: itemForm.cssClass || null,
                icon: itemForm.icon || null
            }

            const response = await fetch(`/api/admin/navigation/${selectedMenu.id}/items/${editingItem.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (response.ok) {
                await fetchMenus()
                setEditingItem(null)
                setItemForm({
                    title: '',
                    url: '',
                    pageId: '',
                    parentId: '',
                    target: 'SELF',
                    isVisible: true,
                    cssClass: '',
                    icon: ''
                })
            } else {
                const error = await response.json()
                alert(error.message || 'Failed to update navigation item')
            }
        } catch (error) {
            console.error('Error updating navigation item:', error)
            alert('Failed to update navigation item')
        }
    }

    const handleDeleteItem = async (itemId: string) => {
        if (!selectedMenu) return
        if (!confirm('Are you sure you want to delete this navigation item?')) return

        try {
            const response = await fetch(`/api/admin/navigation/${selectedMenu.id}/items/${itemId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                await fetchMenus()
            } else {
                const error = await response.json()
                alert(error.message || 'Failed to delete navigation item')
            }
        } catch (error) {
            console.error('Error deleting navigation item:', error)
            alert('Failed to delete navigation item')
        }
    }

    const startEditItem = (item: NavigationItem) => {
        setEditingItem(item)
        setItemForm({
            title: item.title,
            url: item.url || '',
            pageId: item.pageId || '',
            parentId: item.parentId || '',
            target: item.target,
            isVisible: item.isVisible,
            cssClass: item.cssClass || '',
            icon: item.icon || ''
        })
    }

    const toggleExpanded = (itemId: string) => {
        setExpandedItems(prev => {
            const newSet = new Set(prev)
            if (newSet.has(itemId)) {
                newSet.delete(itemId)
            } else {
                newSet.add(itemId)
            }
            return newSet
        })
    }

    const handleReorderItems = async (items: NavigationItem[]) => {
        if (!selectedMenu) return

        try {
            const reorderData = items.map((item, index) => ({
                id: item.id,
                order: index + 1,
                parentId: item.parentId || null
            }))

            const response = await fetch(`/api/admin/navigation/${selectedMenu.id}/items/reorder`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: reorderData })
            })

            if (response.ok) {
                await fetchMenus()
            } else {
                const error = await response.json()
                alert(error.message || 'Failed to reorder items')
            }
        } catch (error) {
            console.error('Error reordering items:', error)
            alert('Failed to reorder items')
        }
    }

    const moveItem = (itemId: string, direction: 'up' | 'down') => {
        if (!selectedMenu) return

        const topLevelItems = selectedMenu.items
            .filter(item => !item.parentId)
            .sort((a, b) => a.order - b.order)

        const currentIndex = topLevelItems.findIndex(item => item.id === itemId)
        if (currentIndex === -1) return

        const newItems = [...topLevelItems]
        if (direction === 'up' && currentIndex > 0) {
            [newItems[currentIndex], newItems[currentIndex - 1]] = [newItems[currentIndex - 1], newItems[currentIndex]]
        } else if (direction === 'down' && currentIndex < newItems.length - 1) {
            [newItems[currentIndex], newItems[currentIndex + 1]] = [newItems[currentIndex + 1], newItems[currentIndex]]
        } else {
            return // No change needed
        }

        handleReorderItems(newItems)
    }

    const renderNavigationItem = (item: NavigationItem, level = 0, index = 0, totalItems = 0) => {
        const hasChildren = item.children && item.children.length > 0
        const isExpanded = expandedItems.has(item.id)

        return (
            <div key={item.id} className="border border-gray-200 rounded-lg mb-2">
                <div
                    className="flex items-center p-3 bg-white hover:bg-gray-50"
                    style={{ paddingLeft: `${12 + level * 20}px` }}
                >
                    <div className="flex items-center flex-1 min-w-0">
                        {hasChildren && (
                            <button
                                onClick={() => toggleExpanded(item.id)}
                                className="mr-2 p-1 hover:bg-gray-200 rounded"
                            >
                                {isExpanded ? (
                                    <ChevronDownIcon className="h-4 w-4" />
                                ) : (
                                    <ChevronRightIcon className="h-4 w-4" />
                                )}
                            </button>
                        )}

                        <GripVerticalIcon className="h-4 w-4 text-gray-400 mr-2" />

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900 truncate">
                                    {item.title}
                                </span>
                                {!item.isVisible && (
                                    <EyeOffIcon className="h-4 w-4 text-gray-400" />
                                )}
                                {item.target === 'BLANK' && (
                                    <ExternalLinkIcon className="h-4 w-4 text-gray-400" />
                                )}
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                                {item.page ? (
                                    <span>Page: {item.page.title}</span>
                                ) : item.url ? (
                                    <span>URL: {item.url}</span>
                                ) : (
                                    <span>No link</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        {level === 0 && (
                            <>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => moveItem(item.id, 'up')}
                                    disabled={index === 0}
                                    title="Move up"
                                >
                                    ↑
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => moveItem(item.id, 'down')}
                                    disabled={index === totalItems - 1}
                                    title="Move down"
                                >
                                    ↓
                                </Button>
                            </>
                        )}
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEditItem(item)}
                        >
                            <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteItem(item.id)}
                        >
                            <TrashIcon className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {hasChildren && isExpanded && (
                    <div className="border-t border-gray-200">
                        {item.children!.map(child => renderNavigationItem(child, level + 1))}
                    </div>
                )}
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Navigation Management</h2>
                <p className="text-gray-600 mb-6">
                    Create and manage navigation menus for different locations on your website.
                </p>

                {/* Menu Selection */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <select
                            value={selectedMenu?.id || ''}
                            onChange={(e) => {
                                const menu = menus.find(m => m.id === e.target.value)
                                setSelectedMenu(menu || null)
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select a menu</option>
                            {menus.map(menu => (
                                <option key={menu.id} value={menu.id}>
                                    {menu.name} ({MENU_LOCATIONS.find(l => l.value === menu.location)?.label})
                                </option>
                            ))}
                        </select>

                        {selectedMenu && (
                            <Button
                                variant="outline"
                                onClick={() => handleDeleteMenu(selectedMenu.id)}
                            >
                                <TrashIcon className="h-4 w-4 mr-2" />
                                Delete Menu
                            </Button>
                        )}
                    </div>

                    <Button onClick={() => setShowCreateMenu(true)}>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Create Menu
                    </Button>
                </div>

                {/* Create Menu Modal */}
                {showCreateMenu && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-lg font-semibold mb-4">Create Navigation Menu</h3>
                            <form onSubmit={handleCreateMenu} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Menu Name
                                    </label>
                                    <input
                                        type="text"
                                        value={menuForm.name}
                                        onChange={(e) => setMenuForm(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Location
                                    </label>
                                    <select
                                        value={menuForm.location}
                                        onChange={(e) => setMenuForm(prev => ({ ...prev, location: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {MENU_LOCATIONS.map(location => (
                                            <option key={location.value} value={location.value}>
                                                {location.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={menuForm.isActive}
                                        onChange={(e) => setMenuForm(prev => ({ ...prev, isActive: e.target.checked }))}
                                        className="mr-2"
                                    />
                                    <label htmlFor="isActive" className="text-sm text-gray-700">
                                        Active
                                    </label>
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowCreateMenu(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        Create Menu
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Navigation Items */}
                {selectedMenu && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-md font-medium text-gray-900">
                                Navigation Items - {selectedMenu.name}
                            </h3>
                            <Button onClick={() => setShowCreateItem(true)}>
                                <PlusIcon className="h-4 w-4 mr-2" />
                                Add Item
                            </Button>
                        </div>

                        {selectedMenu.items.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No navigation items yet. Click "Add Item" to get started.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {selectedMenu.items
                                    .filter(item => !item.parentId)
                                    .sort((a, b) => a.order - b.order)
                                    .map((item, index, array) => renderNavigationItem(item, 0, index, array.length))}
                            </div>
                        )}
                    </div>
                )}

                {/* Create/Edit Item Modal */}
                {(showCreateItem || editingItem) && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                            <h3 className="text-lg font-semibold mb-4">
                                {editingItem ? 'Edit Navigation Item' : 'Create Navigation Item'}
                            </h3>
                            <form onSubmit={editingItem ? handleUpdateItem : handleCreateItem} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={itemForm.title}
                                        onChange={(e) => setItemForm(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            URL
                                        </label>
                                        <input
                                            type="url"
                                            value={itemForm.url}
                                            onChange={(e) => setItemForm(prev => ({ ...prev, url: e.target.value, pageId: '' }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="https://example.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Or Select Page
                                        </label>
                                        <select
                                            value={itemForm.pageId}
                                            onChange={(e) => setItemForm(prev => ({ ...prev, pageId: e.target.value, url: '' }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select a page</option>
                                            {pages.map(page => (
                                                <option key={page.id} value={page.id}>
                                                    {page.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Parent Item
                                        </label>
                                        <select
                                            value={itemForm.parentId}
                                            onChange={(e) => setItemForm(prev => ({ ...prev, parentId: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Top Level</option>
                                            {selectedMenu?.items
                                                .filter(item => item.id !== editingItem?.id)
                                                .map(item => (
                                                    <option key={item.id} value={item.id}>
                                                        {item.title}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Target
                                        </label>
                                        <select
                                            value={itemForm.target}
                                            onChange={(e) => setItemForm(prev => ({ ...prev, target: e.target.value as 'SELF' | 'BLANK' }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="SELF">Same Window</option>
                                            <option value="BLANK">New Window</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            CSS Class
                                        </label>
                                        <input
                                            type="text"
                                            value={itemForm.cssClass}
                                            onChange={(e) => setItemForm(prev => ({ ...prev, cssClass: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="custom-class"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Icon
                                        </label>
                                        <input
                                            type="text"
                                            value={itemForm.icon}
                                            onChange={(e) => setItemForm(prev => ({ ...prev, icon: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="icon-name"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="isVisible"
                                        checked={itemForm.isVisible}
                                        onChange={(e) => setItemForm(prev => ({ ...prev, isVisible: e.target.checked }))}
                                        className="mr-2"
                                    />
                                    <label htmlFor="isVisible" className="text-sm text-gray-700">
                                        Visible
                                    </label>
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowCreateItem(false)
                                            setEditingItem(null)
                                            setItemForm({
                                                title: '',
                                                url: '',
                                                pageId: '',
                                                parentId: '',
                                                target: 'SELF',
                                                isVisible: true,
                                                cssClass: '',
                                                icon: ''
                                            })
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        {editingItem ? 'Update Item' : 'Create Item'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}