# blogger 

Useful things...

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm init svelte@next

# create a new project in my-app
npm init svelte@next my-app
```

> Note: the `@next` is temporary

## Prisma 
To push prisma/schema.prisma changes to the DB
```
npx prisma db push
``` 

https://www.prisma.io/docs/concepts/components/prisma-schema


## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Adding More SMUI Packages 

Whenever you add a new SMUI package, run npm run prepare again to rebuild your CSS file with the new component’s styles included.