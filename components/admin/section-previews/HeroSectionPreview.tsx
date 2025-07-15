interface HeroSectionPreviewProps {
    props: any
}

export function HeroSectionPreview({ props }: HeroSectionPreviewProps) {
    const backgroundStyle = props.backgroundImage
        ? { backgroundImage: `url(${props.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : {}

    return (
        <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-6 rounded-lg"
            style={backgroundStyle}
        >
            <div className={`text-${props.textAlign || 'center'}`}>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    {props.title || 'Welcome to Your Website'}
                </h1>
                {props.subtitle && (
                    <p className="text-lg md:text-xl mb-6 text-blue-100">
                        {props.subtitle}
                    </p>
                )}
                {props.buttonText && (
                    <button className="inline-block bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                        {props.buttonText}
                    </button>
                )}
            </div>
        </div>
    )
}