export function Err_403 () {
    return (
        <div className="m-4">
            <h1 className = "mb-4 font-bold">403 Forbidden</h1>
            <p>Доступ запрещён.</p>
        </div>
    )
}

export function Err_404 ({message}: {message: string}) {
    return (
        <div className="m-4">
            <h1 className = "mb-4 font-bold">404 Not Found</h1>
            <p>{message}</p>
        </div>
    )
}

export function Err_418 () {
    return (
        <div className="m-4">
            <h1 className = "mb-4 font-bold">418 I’m a teapot</h1>
        </div>
    )
}
