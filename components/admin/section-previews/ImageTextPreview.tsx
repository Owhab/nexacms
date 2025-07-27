import Image from "next/image"

interface ImageTextPreviewProps {
    props: any
}

export function ImageTextPreview({ props }: ImageTextPreviewProps) {
    return (
        <div className="py-8 px-6 bg-white rounded-lg border">
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 items-center ${props.layout === 'right' ? 'md:grid-flow-col-dense' : ''}`}>
                <div className={props.layout === 'right' ? 'md:col-start-2' : ''}>
                    {props.image ? (
                        <Image
                            src={props.image}
                            alt={props.imageAlt || ''}
                            className="w-full h-auto rounded-lg shadow-sm"
                            style={{ maxHeight: '300px', objectFit: 'cover' }}
                            width={600}
                            height={300}
                        />
                    ) : (
                        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500 text-sm">Image placeholder</span>
                        </div>
                    )}
                </div>
                <div className={props.layout === 'right' ? 'md:col-start-1' : ''}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        {props.title || 'Your Title Here'}
                    </h2>
                    <div
                        className="text-gray-600 prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: props.content || '<p>Your content here...</p>' }}
                    />
                </div>
            </div>
        </div>
    )
}