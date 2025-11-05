import { Elysia, redirect, status, t } from "elysia"
import { LinkModel } from './model'
import { createLink, redirectLink } from "./service"

export const link = new Elysia()
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
    .get('/:short_url',
        async({params: {short_url}})=>{
            console.log(short_url)
           const formattedString = short_url.trim()
            if(!formattedString) throw status(400, "Bad Request")

            const FoundURL = await redirectLink({short_url})
            return redirect(FoundURL)
        } 
    )

