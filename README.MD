PRISMA
install prisma -D and @prisma/client
npx prisma init --datasourve-provider postgresql (or mysql,...)
setup model at prisma.schema
npx prisma migrate dev --name init (or orther name)