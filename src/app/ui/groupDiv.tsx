export default function GroupDiv (
    {children, className = ""} : {children: React.ReactNode, className?: string}
)
{
    const divBox = "border-blue-300 border-2 py-3 px-4 rounded-lg"

    return (
        <div className = {divBox + " " + className}>
            {children}
        </div>
    )
}