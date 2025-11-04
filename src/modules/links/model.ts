import { t } from 'elysia'

export namespace LinkModel {
    export const createLinkBody = t.Object({
        long_url: t.String(),
    })

    export type createLinkBody = typeof createLinkBody.static

    export const createLinkResponse = t.Object({
        short_url: t.Nullable(t.String({maxLength: 12})),
        long_url: t.Nullable(t.String()),
        created_at: t.Nullable(t.String())
    })

     export type createLinkResponse = typeof createLinkResponse. static

    export const createLinkInvalid = t.Literal("Invalid url")
    export type createLinkInvalid = typeof createLinkInvalid.static
}   