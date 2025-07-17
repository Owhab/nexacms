export interface MediaItem {
    id: string
    url: string
    altText?: string
    type: 'IMAGE' | 'VIDEO' | 'DOCUMENT'
    fileName: string
    fileSize: number
    mimeType: string
    category?: string
    createdAt?: string
    uploader?: {
        email: string
    }
}