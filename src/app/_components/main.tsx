import {HydrateClient} from "~/trpc/server"
import {Navbar} from "./navbar"

export async function MyApp ({
    children
}: Readonly<{children: React.ReactNode}>) {

    return (
        <HydrateClient>
            <header>
                <Navbar />
            </header>
            <main className="bg-gray-100">
                {children}
            </main>
        </HydrateClient>
    )
}