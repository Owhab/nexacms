import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { SiteConfigProvider } from '@/contexts/site-config-context'
import { LayoutRenderer } from '@/components/layout/LayoutRenderer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Our Website',
    description: 'Built with NexaCMS',
}

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <SiteConfigProvider>
                    <LayoutRenderer>
                        {children}
                    </LayoutRenderer>
                </SiteConfigProvider>
            </body>
        </html>
    )
}