import { PrismaClient, Role } from "@prisma/client"
import {hashPassword} from "~/server/api/pass"

const prisma = new PrismaClient()

const sections = [
    {
        name: "Бухгалтерия"
    },
    {
        name: "Техподдержка"
    },
    {
        name: "Отдел кадров"
    },
    {
        name: "Отдел продаж"
    },
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
        phone: "8-800-111-11-11",
        surname: "Чернышева",
        name: "Виктория",
        fathername: "Сергеевна",
        role: "SOTR",
        section: "Техподдержка"
    },
    {
        email: "koroleva@yandex.ru",
        password: "1234",
        phone: "8-800-222-22-22",
        surname: "Королева",
        name: "Ольга",
        fathername: "Артёмовна",
        role: "SOTR",
        section: "Техподдержка"
    },
    {
        email: "nazarov@yandex.ru",
        password: "1234",
        phone: "8-800-333-33-33",
        surname: "Назаров",
        name: "Константин",
        fathername: "Львович",
        role: "SOTR",
        section: "Техподдержка"
    },
    {
        email: "ananjev@yandex.ru",
        password: "1234",
        phone: "8-800-444-44-44",
        surname: "Ананьев",
        name: "Роман",
        fathername: "Никитич",
        role: "SOTR",
        section: "Отдел кадров"
    },
    {
        email: "nesterov@yandex.ru",
        password: "1234",
        phone: "8-800-555-55-55",
        surname: "Нестеров",
        name: "Михаил",
        fathername: "Павлович",
        role: "SOTR",
        section: "Отдел кадров"
    },
    {
        email: "michailov@yandex.ru",
        password: "1234",
        phone: "8-800-666-66-66",
        surname: "Михайлов",
        name: "Никита",
        fathername: "Тимурович",
        role: "SOTR",
        section: "Отдел кадров"
    },
    {
        email: "denisova@yandex.ru",
        password: "1234",
        phone: "8-800-777-77-77",
        surname: "Денисова",
        name: "Ольга",
        fathername: "Александровна",
        role: "SOTR",
        section: "Отдел продаж"
    },
    {
        email: "visotskaja@yandex.ru",
        password: "1234",
        phone: "8-800-888-88-88",
        surname: "Высоцкая",
        name: "Олеся",
        fathername: "Тихоновна",
        role: "SOTR",
        section: "Отдел продаж"
    },
    {
        email: "solovjeva@yandex.ru",
        password: null,
        phone: "8-800-999-99-99",
        surname: "Соловьева",
        name: "Мелания",
        fathername: "Егоровна",
        role: "SOTR",
        section: "Отдел продаж"
    }
]

const companies = [
    {
        email: "andreevaam@yandex.ru",
        companyname: "ИП Андреева А.М.",
        TIN: "551211692822"
    },
    {
        email: "zhykovamm@yandex.ru",
        companyname: "ИП Жукова М.М.",
        TIN: "550637263549"
    },
    {
        email: "spiridonovakt@yandex.ru",
        companyname: "ИП Спиридонова К.Т.",
        TIN: "550536752271"
    },
    {
        email: "figvam@yandex.ru",
        companyname: "ООО Фигвам",
        TIN: "55030215623"
    },
    {
        email: "thunderlightning@yandex.ru",
        companyname: "ООО Гром и молнии",
        TIN: "550377550183"
    },
    {
        email: "prokofjevasofi@yandex.ru",
        companyname: "ИП Прокофьева С.М.",
        TIN: "55061091345"
    },
    {
        email: "iljincorp@yandex.ru",
        companyname: "ООО Iljin Corporation",
        TIN: "550455198621"
    },
    {
        email: "greencompany@yandex.ru",
        companyname: "ООО Сибирские леса",
        TIN: "550603662959"
    },
    {
        email: "watersource@yandex.ru",
        companyname: "ООО Чистая вода",
        TIN: "550383732530"
    },
    {
        email: "lolkekcheburek@yandex.ru",
        companyname: "ООО Чебурек",
        TIN: "551275717783"
    },
]

const contacts = [
    {
        surname: "Андреева",
        name: "Арина",
        fathername: "Максимовна",
        companyname: "ИП Андреева А.М.",
        phone: "8-111-111-11-11"
    },
    {
        surname: "Дмитриева",
        name: "Дарья",
        fathername: "Алексеевна",
        companyname: "ИП Андреева А.М.",
        phone: "8-111-111-11-22"
    },
    {
        surname: "Жукова",
        name: "Мария",
        fathername: "Матвеевна",
        companyname: "ИП Жукова М.М.",
        phone: "8-222-222-22-11"
    },
    {
        surname: "Глебов",
        name: "Артемий",
        fathername: "Тимофеевич",
        companyname: "ИП Жукова М.М.",
        phone: "8-222-222-22-22"
    },
    {
        surname: "Спиридонова",
        name: "Камила",
        fathername: "Тимофеевна",
        companyname: "ИП Спиридонова К.Т.",
        phone: "8-333-333-33-11"
    },
    {
        surname: "Кравцова",
        name: "Мария",
        fathername: "Марковна",
        companyname: "ИП Спиридонова К.Т.",
        phone: "8-333-333-33-22"
    },
    {
        surname: "Давыдов",
        name: "Иван",
        fathername: "Кириллович",
        companyname: "ООО Фигвам",
        phone: "8-444-444-44-11"
    },
    {
        surname: "Дмитриев",
        name: "Богдан",
        fathername: "Демьянович",
        companyname: "ООО Фигвам",
        phone: "8-444-444-44-22"
    },
    {
        surname: "Громова",
        name: "Амина",
        fathername: "Максимовна",
        companyname: "ООО Гром и молнии",
        phone: "8-666-666-66-11"
    },
    {
        surname: "Харитонов",
        name: "Матвей",
        fathername: "Даниэльевич",
        companyname: "ООО Гром и молнии",
        phone: "8-666-666-66-22"
    },
    {
        surname: "Прокофьева",
        name: "София",
        fathername: "Максимовна",
        companyname: "ИП Прокофьева С.М.",
        phone: "8-777-777-77-11"
    },
    {
        surname: "Смирнов",
        name: "Егор",
        fathername: "Никитич",
        companyname: "ИП Прокофьева С.М.",
        phone: "8-777-777-77-22"
    },
    {
        surname: "Ильин",
        name: "Арсений",
        fathername: "Кириллович",
        companyname: "ООО Iljin Corporation",
        phone: "8-888-888-88-11"
    },
    {
        surname: "Фомин",
        name: "Иван",
        fathername: "Егорович",
        companyname: "ООО Iljin Corporation",
        phone: "8-888-888-88-22"
    },
    {
        surname: "Зеленина",
        name: "Полина",
        fathername: "Дмитриевна",
        companyname: "ООО Сибирские леса",
        phone: "8-999-999-99-11"
    },
    {
        surname: "Никитин",
        name: "Богдан",
        fathername: "Викторович",
        companyname: "ООО Сибирские леса",
        phone: "8-999-999-99-22"
    },
    {
        surname: "Сухарева",
        name: "Алина",
        fathername: "Елисеевна",
        companyname: "ООО Чистая вода",
        phone: "8-000-000-00-11"
    },
    {
        surname: "Малинина",
        name: "Злата",
        fathername: "Арсентьевна",
        companyname: "ООО Чистая вода",
        phone: "8-000-000-00-22"
    },
    {
        surname: "Николаева",
        name: "Ольга",
        fathername: "Родионовна",
        companyname: "ООО Чебурек",
        phone: "8-555-555-55-11"
    },
    {
        surname: "Смирнов",
        name: "Григорий",
        fathername: "Даниилович",
        companyname: "ООО Чебурек",
        phone: "8-555-555-55-22"
    },
]


async function main() {
    await prisma.session.deleteMany()
    await prisma.user.deleteMany()
    await prisma.section.deleteMany()
    await prisma.contact.deleteMany()
    await prisma.company.deleteMany()

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
        companies.map(async (company) => {
            await prisma.company.create({
                data: company
            })
        })
    )

    await Promise.all(
        contacts.map(async (contact) => {
            const company = await prisma.company.findFirstOrThrow({
                where: {
                    companyname: contact.companyname
                }
            })
            
            await prisma.contact.create({
                data: {
                    surname: contact.surname,
                    name: contact.name,
                    fathername: contact.fathername,
                    phone: contact.phone,
                    companyID: company.id
                }
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
