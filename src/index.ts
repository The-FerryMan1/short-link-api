import { Elysia, t } from "elysia";
import { openapi, fromTypes } from '@elysiajs/openapi'
import { link } from "./modules/links";

const app = new Elysia({prefix: '/api'})

app.use(openapi({
  references: fromTypes()
}))



app.use(link)

app.get('/me/:id', ({ params: { id } }) => {
  return { message: id }
})

app.listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
