'use client'

interface LayoutRendererProps {
    children: React.ReactNode
}

export function LayoutRenderer({ children }: LayoutRendererProps) {
    return (
        <div className="min-h-screen">
            {children}
        </div>
    )
}