export default function Table (
    {headers, children} : {headers: string[], children: React.ReactNode}
)
{
    const tableStyle = "box-border my-4 border-collapse border-1 border-black"
    const tdStyle = "px-2 border border-black border-solid"


    return (
        <table>
            <thead>
                <th className = {tdStyle}>№</th>
                {
                    headers.map(h => <th className = {tdStyle}>{h}</th>)
                }
            </thead>
            <tbody>
                {children}
            </tbody>
        </table>
    )
}