'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface TextBlockSectionProps {
    content?: string
    textAlign?: 'left' | 'center' | 'right'
    maxWidth?: string
}

interface TextBlockSectionEditorProps extends TextBlockSectionProps {
    props: TextBlockSectionProps
    onSave: (props: TextBlockSectionProps) => void
    onCancel: () => void
}

// Preview Component
export function TextBlockSectionPreview({
    content = '<p>Add your content here...</p>',
    textAlign = 'left',
    maxWidth = '800px'
}: TextBlockSectionProps) {
    return (
        <div className="py-16 px-4">
            <div className="mx-auto" style={{ maxWidth, textAlign }}>
                <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </div>
    )
}

// Editor Component
export function TextBlockSectionEditor({ props, onSave, onCancel }: TextBlockSectionEditorProps) {
    const [formData, setFormData] = useState<TextBlockSectionProps>({
        content: props.content || '<p>Add your content here...</p>',
        textAlign: props.textAlign || 'left',
        maxWidth: props.maxWidth || '800px'
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSave = () => {
        onSave(formData)
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Text Alignment
                    </label>
                    <select
                        name="textAlign"
                        value={formData.textAlign}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Width
                    </label>
                    <select
                        name="maxWidth"
                        value={formData.maxWidth}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="600px">600px (Narrow)</option>
                        <option value="800px">800px (Medium)</option>
                        <option value="1000px">1000px (Wide)</option>
                        <option value="100%">100% (Full Width)</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                </label>
                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder="Enter your content (HTML supported)"
                />
                <p className="text-xs text-gray-500 mt-1">
                    You can use HTML tags like &lt;p&gt;, &lt;h1&gt;-&lt;h6&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;a&gt;, etc.
                </p>
            </div>

            {/* Preview */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview
                </label>
                <div className="border rounded-lg overflow-hidden bg-white">
                    <TextBlockSectionPreview {...formData} />
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
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

// Main component that handles both modes
export default function TextBlockSection(props: TextBlockSectionProps | TextBlockSectionEditorProps) {
    if ('onSave' in props) {
        return <TextBlockSectionEditor {...props} />
    }
    return <TextBlockSectionPreview {...props} />
}