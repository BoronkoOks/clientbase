export default function DeleteButton (
    {onClick, className = ""} : {onClick?: () => void, className?: string}
)
{
    const deleteButtonStyle = "btn bg-red-500 border-2 border-red-800 hover:text-gray-50 hover:bg-red-700"

    return (
        <button className = {deleteButtonStyle + " " + className} onClick={onClick}>
            Удалить
        </button>
    )
}