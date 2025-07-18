export default function ErrLabel (
    {message, className = ""} : {message: string, className?: string}
) {
    const labelStyle = "mt-3 ml-4 inline-block align-middle text-red-700"

    return (
        <label className = {labelStyle + " " + className}>{message}</label>
    )
}