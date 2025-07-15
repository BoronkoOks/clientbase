import { PrismaClient, Role } from "@prisma/client"
import {hashPassword} from "~/server/api/pass"

const prisma = new PrismaClient()

const sections = [
    {
        name: "Техподдержка"
    },
    {
        name: "Отдел кадров"
    },
    {
        name: "Отдел продаж"
    }
]

const users = [
    {
        email: "saveljev@yandex.ru",
        password: "1234",
        phone: "8-800-555-35-35",
        surname: "Савельев",
        name: "Михаил",
        fathername: "Андреевич",
        role: "ADMIN",
        section: "Техподдержка"
    },
    {
        email: "chernisheva@yandex.ru",
        password: "1234",
        phone: "8-111-111-11-11",
        surname: "Чернышева",
        name: "Виктория",
        fathername: "Сергеевна",
        role: "SOTR",
        section: "Техподдержка"
    },
    {
        email: "koroleva@yandex.ru",
        password: "1234",
        phone: "8-111-111-11-12",
        surname: "Королева",
        name: "Ольга",
        fathername: "Артёмовна",
        role: "SOTR",
        section: "Техподдержка"
    },
    {
        email: "nazarov@yandex.ru",
        password: "1234",
        phone: "8-111-111-11-13",
        surname: "Назаров",
        name: "Константин",
        fathername: "Львович",
        role: "SOTR",
        section: "Техподдержка"
    },
    {
        email: "ananjev@yandex.ru",
        password: "1234",
        phone: "8-111-111-11-14",
        surname: "Ананьев",
        name: "Роман",
        fathername: "Никитич",
        role: "SOTR",
        section: "Отдел кадров"
    },
    {
        email: "nesterov@yandex.ru",
        password: "1234",
        phone: "8-111-111-11-15",
        surname: "Нестеров",
        name: "Михаил",
        fathername: "Павлович",
        role: "SOTR",
        section: "Отдел кадров"
    },
    {
        email: "michailov@yandex.ru",
        password: "1234",
        phone: "8-111-111-11-16",
        surname: "Михайлов",
        name: "Никита",
        fathername: "Тимурович",
        role: "SOTR",
        section: "Отдел кадров"
    },
    {
        email: "denisova@yandex.ru",
        password: "1234",
        phone: "8-111-111-11-17",
        surname: "Денисова",
        name: "Ольга",
        fathername: "Александровна",
        role: "SOTR",
        section: "Отдел продаж"
    },
    {
        email: "visotskaja@yandex.ru",
        password: "1234",
        phone: "8-111-111-11-18",
        surname: "Высоцкая",
        name: "Олеся",
        fathername: "Тихоновна",
        role: "SOTR",
        section: "Отдел продаж"
    },
    {
        email: "solovjeva@yandex.ru",
        password: null,
        phone: "8-111-111-11-19",
        surname: "Соловьева",
        name: "Мелания",
        fathername: "Егоровна",
        role: "SOTR",
        section: "Отдел продаж"
    }
]

const clients = [
    {
        email: "andreevaam@yandex.ru",
        phone: "8-222-222-22-22",
        surname: "Андреева",
        name: "Арина",
        fathername: "Максимовна",
        companyname: "ИП Андреева А.М."
    },
    {
        email: "zhykovamm@yandex.ru",
        phone: "8-222-222-22-23",
        surname: "Жукова",
        name: "Мария",
        fathername: "Матвеевна",
        companyname: "ИП Жукова М.М."
    },
    {
        email: "spiridonovakt@yandex.ru",
        phone: "8-222-222-22-24",
        surname: "Спиридонова",
        name: "Камила",
        fathername: "Тимофеевна",
        companyname: "ИП Спиридонова К.Т."
    },
    {
        email: "davidovivan@yandex.ru",
        phone: "8-222-222-22-25",
        surname: "Давыдов",
        name: "Иван",
        fathername: "Кириллович",
        companyname: null
    },
    {
        email: "gromovaamina@yandex.ru",
        phone: "8-222-222-22-26",
        surname: "Громова",
        name: "Амина",
        fathername: "Максимовна",
        companyname: null
    },
    {
        email: "prokofjevasofi@yandex.ru",
        phone: "8-222-222-22-27",
        surname: "Прокофьева",
        name: "София",
        fathername: "Максимовна",
        companyname: null
    },
    {
        email: "iljincorp@yandex.ru",
        phone: "8-222-222-22-28",
        surname: "Ильин",
        name: "Арсений",
        fathername: "Кириллович",
        companyname: "ООО Iljin Corporation"
    },
    {
        email: "greencompany@yandex.ru",
        phone: "8-222-222-22-29",
        surname: "Зеленина",
        name: "Полина",
        fathername: "Дмитриевна",
        companyname: "ООО Сибирские леса"
    },
    {
        email: "watersource@yandex.ru",
        phone: "8-222-222-22-30",
        surname: "Сухарева",
        name: "Алина",
        fathername: "Елисеевна",
        companyname: "ООО Чистая вода"
    },
    {
        email: "lolkekcheburek@yandex.ru",
        phone: "8-222-222-22-31",
        surname: "Николаева",
        name: "Ольга",
        fathername: "Родионовна",
        companyname: "ООО Чебурек"
    },
]


async function main() {
    await prisma.session.deleteMany()
    await prisma.user.deleteMany()
    await prisma.section.deleteMany()
    await prisma.client.deleteMany()

    await Promise.all(
        sections.map(async (section) => {
            await prisma.section.create({
                data: section
            })
        })
    )

    await Promise.all(
        users.map(async (user) => {
            const section = await prisma.section.findFirstOrThrow({
                where: {
                    name: user.section
                },
                select: { id: true }
            })

            const hashedPassword = await hashPassword(user.password ?? "")

            await prisma.user.create({
                data: {
                    email: user.email,
                    password: hashedPassword,
                    phone: user.phone,
                    surname: user.surname,
                    name: user.name,
                    fathername: user.fathername,
                    role: user.role as Role,
                    sectionId: section.id
                }
            })
        })
    )

    await Promise.all(
        clients.map(async (client) => {
            await prisma.client.create({
                data: client
            })
        })
    )
}


main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
