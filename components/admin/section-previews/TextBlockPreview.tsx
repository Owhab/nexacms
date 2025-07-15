interface TextBlockPreviewProps {
    props: any
}

export function TextBlockPreview({ props }: TextBlockPreviewProps) {
    return (
        <div className="py-8 px-6 bg-white rounded-lg border">
            <div
                className={`text-${props.textAlign || 'left'} prose max-w-none`}
                style={{ maxWidth: props.maxWidth || '800px', margin: props.textAlign === 'center' ? '0 auto' : '0' }}
                dangerouslySetInnerHTML={{ __html: props.content || '<p>Add your content here...</p>' }}
            />
        </div>
    )
}