npx sequelize init
npx sequelize db:create
npx sequelize model:generate --name Components --atributes name:string,description:string
npx sequelize model:generate --name ComponentSupplier --attributes supplier_id:integer,component_id:integer
npx sequelize model:generate --name Supplier --attributes name:string,address:string
npx sequelize db:migrate
