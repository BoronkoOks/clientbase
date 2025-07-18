import GroupDiv from "~/app/ui/groupDiv"


export default function DropDown (
    {headerElements, hiddenElements}:
    {headerElements: React.JSX.Element, hiddenElements: React.JSX.Element}
)
{
    return (
        <GroupDiv className="w-max">
            <details className = "collapse" tabIndex={0}>
                <summary className = "collapse-title">
                    <div className = "flex -ml-2">
                        {headerElements}
                    </div>
                </summary>
                <div className = "mb-2 mx-2 overscroll-x-contain">
                    {hiddenElements}
                </div>
            </details>
        </GroupDiv>
    )
}