import { ArrowLongDownIcon } from "@heroicons/react/24/outline";
import SearchInput from "~/app/ui/searchInput";
import SectionUserTable from "./sectionUserTable";

export default function SectionUsersDropdown ({sectionId}: {sectionId: string}) {
    return (
        <div className = "border-2 border-gray-500 rounded-lg pl-2">
            <details className = "collapse" tabIndex={0}>
                <summary className = "collapse-title">
                    <div className = "flex">
                        <p>Сотрудники</p>
                        <ArrowLongDownIcon className = "w-6" />
                    </div>
                </summary>
                <div className = "mb-4 mx-4">
                    <SearchInput placeholder = "Поиск по фамилии, email или телефону" />
                    <SectionUserTable sectionId = {sectionId} />
                </div>
            </details> 
        </div>
    )
}