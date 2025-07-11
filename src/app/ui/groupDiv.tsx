export default function GroupDiv (
    {children} : Readonly<{children: React.ReactNode}>
)
{
    const divBox = "border-blue-300 border-2 py-2 px-4 rounded-lg"

    return (
        <div className = {divBox}>
            {children}
        </div>
    )
}