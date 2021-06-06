# GraphQL Prisma Schematic
Generate your GraphQL schema from your Prisma schema.

#### Why?
Maintaining a GraphQL schema is tedious and quite frankly pretty annoying. Generating full CRUD APIs isn't 
my speed as I feel they significantly muddy the schema. It's pretty clear that Prisma's schema syntax is 
inspired by GraphQL - why not parse that schema and create a basic GraphQL types next to it? So that's what this is, parse
the schema.prisma and create schema.graphql

#### Install as a dev dep.
```
yarn add --dev @rsbear/gp-schematic
```

#### Add this script to your `package.json` (please note the input and output flags and manage accordingly)
```
 "generate:schema": "node node_modules/@rsbear/gp-schematic/dist/index.js --input=prisma/schema.prisma --output=graphql/schema.graphql"
```

#### Run it.
```
yarn generate:schema
```

#### What about the schema being incomplete?
Use graphql-tools and concat the rest of everything you need.. I'll put up an example later


