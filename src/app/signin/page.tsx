import { HydrateClient } from "~/trpc/server"
import SigninForm from "~/app/_components/signin/signinForm"


export default async function Home() {
  return (
    <HydrateClient>
      <main>
        <table>
          <tbody>
            <tr>
              <td className = "align-top pl-6 pb-6">
                <h2 className = "ml-2 mb-4 font-bold">
                    Авторизация
                </h2>
              </td>
            </tr>
            <tr>
              <td className = "align-top pl-6 pb-6">
                <SigninForm />
              </td>
            </tr>
        </tbody>
        </table>
      </main>
    </HydrateClient>
  )
}
