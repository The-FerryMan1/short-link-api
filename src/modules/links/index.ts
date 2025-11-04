import { Elysia, t } from "elysia"


export const link = new Elysia({ prefix: '/link' })
 
    .post(
        '/',
        async ({ body }) => {
            return { message: `${body.message}` }
        },
        {
            body: t.Object({
                message: t.String()
            })
        }
    )
