'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAppDispatch, useAppSelector } from '@/store'
import { logout } from '@/store/authSlice'
import {
    HomeIcon,
    FileTextIcon,
    ImageIcon,
    UsersIcon,
    SettingsIcon,
    LogOutIcon,
    UserIcon,
    BookOpenIcon,
    ExternalLinkIcon,
    EyeIcon
} from 'lucide-react'

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon, roles: ['ADMIN', 'EDITOR', 'VIEWER'] },
    { name: 'Pages', href: '/admin/pages', icon: FileTextIcon, roles: ['ADMIN', 'EDITOR', 'VIEWER'] },
    { name: 'Blog', href: '/admin/blog', icon: BookOpenIcon, roles: ['ADMIN', 'EDITOR'] },
    { name: 'Media', href: '/admin/media', icon: ImageIcon, roles: ['ADMIN', 'EDITOR', 'VIEWER'] },
    { name: 'Users', href: '/admin/users', icon: UsersIcon, roles: ['ADMIN'] },
    { name: 'Settings', href: '/admin/settings', icon: SettingsIcon, roles: ['ADMIN'] },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { user } = useAppSelector((state) => state.auth)

    const handleLogout = async () => {
        await dispatch(logout())
        router.push('/login')
    }

    const filteredNavigation = navigation.filter(item =>
        user && item.roles.includes(user.role)
    )

    return (
        <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-900">NexaCMS</h1>
                <p className="text-sm text-gray-600">Admin Dashboard</p>
            </div>

            {user && (
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                            <UserIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user.email}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                                {user.role.toLowerCase()}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <nav className="flex-1 p-4 space-y-2">
                {filteredNavigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                                isActive
                                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            )}
                        >
                            <item.icon className="mr-3 h-5 w-5" />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-gray-200 space-y-2">
                {/* Preview Buttons */}
                <div className="space-y-2">
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center w-full px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                    >
                        <EyeIcon className="mr-3 h-5 w-5" />
                        Preview Site
                        <ExternalLinkIcon className="ml-auto h-4 w-4" />
                    </a>

                    <a
                        href="/blog"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center w-full px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
                    >
                        <BookOpenIcon className="mr-3 h-5 w-5" />
                        Preview Blog
                        <ExternalLinkIcon className="ml-auto h-4 w-4" />
                    </a>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                    <LogOutIcon className="mr-3 h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </div>
    )
}