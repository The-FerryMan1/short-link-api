import { Elysia, status, t } from "elysia"
import { LinkModel } from './model'
import { createLink } from "./service"

export const link = new Elysia({ prefix: '/link' })

    .post(
        '/',
        async ({ body }) => {

            const isValid = /^https?:\/\//.test(body.long_url)
            if (!isValid) {
                // 3️⃣ Return an error with proper status
                return status(400, "Invalid url")
            }
            const res = await createLink(body)
            return {
                long_url: body.long_url,
                short_url: res?.short_url,
                created_at: res?.created_at
            }
        },
        {
            body: LinkModel.createLinkBody,
            response: {
                200: LinkModel.createLinkResponse,
                400: LinkModel.createLinkInvalid
            }
        }
    )
