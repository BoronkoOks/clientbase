import { HydrateClient } from "~/trpc/server"
import SigninForm from "../_components/signin/signinForm"
// import { redirect } from 'next/navigation'


export default async function Home() {
  const divField = "flex align-middle"
  const inputClassStyle = "input input-bordered"
  const updateButtonStyle = "btn bg-blue-400 border-2 border-sky-700 mt-3 hover:text-gray-50 hover:bg-sky-700"

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
