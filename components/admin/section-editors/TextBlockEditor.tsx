'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface TextBlockEditorProps {
    props: any
    onSave: (props: any) => void
    onCancel: () => void
}

export function TextBlockEditor({ props, onSave, onCancel }: TextBlockEditorProps) {
    const [formData, setFormData] = useState({
        content: props.content || '<p>Add your content here...</p>',
        textAlign: props.textAlign || 'left',
        maxWidth: props.maxWidth || '800px'
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSave = () => {
        onSave(formData)
    }

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                </label>
                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                    placeholder="Enter HTML content"
                />
                <p className="text-xs text-gray-500 mt-1">
                    You can use HTML tags like &lt;p&gt;, &lt;h1&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;a&gt;, etc.
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Text Alignment
                </label>
                <select
                    name="textAlign"
                    value={formData.textAlign}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                    <option value="justify">Justify</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Width
                </label>
                <input
                    type="text"
                    name="maxWidth"
                    value={formData.maxWidth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="800px, 100%, auto"
                />
                <p className="text-xs text-gray-500 mt-1">
                    CSS width value (e.g., 800px, 100%, auto)
                </p>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button onClick={handleSave}>
                    Save Changes
                </Button>
            </div>
        </div>
    )
}