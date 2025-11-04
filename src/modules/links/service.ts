import { status } from 'elysia'
import type { LinkModel } from './model'
import { nanoid } from 'nanoid'
import { db } from '../../database'
import { linkTable } from '../../database/schema'
export async function createLink({ long_url }: LinkModel.createLinkBody)
{
    try {

        const validURl = await fetch(long_url, {
            method: 'GET'
        })

        if (!validURl.ok) {
            throw status(
                404,
                "Invalid url" satisfies LinkModel.createLinkInvalid
            )
        }

        const shortedURL = nanoid(12)

        const [row] = await db.insert(linkTable).values({ shortURL: shortedURL, longURL: long_url }).returning({ shortedURL: linkTable.shortURL, longURL: linkTable.longURL, createdAt: linkTable.createAt })

        if(!row) throw status(500, "Internal Server Error")

        return {
            long_url: row?.longURL,
            short_url: row?.shortedURL,
            created_at: String(row?.createdAt)
        }
    } catch (err) {
        if (err instanceof Error && 'status' in err) throw err


        throw status(500, 'Internal server error')
    }
}