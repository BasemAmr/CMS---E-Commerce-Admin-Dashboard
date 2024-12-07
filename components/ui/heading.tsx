interface HeadingProps {
    title: string;
    description?: string;
}
const Heading: React.FC<HeadingProps> = ({ title, description }) => {
    return (
        <>
            <h1 className='text-2xl font-semibold'>
                {title}
            </h1>
            {description && (
                <p className='text-sm text-gray-500'>
                    {description}
                </p>
            )}
        </>
    )
}

export default Heading