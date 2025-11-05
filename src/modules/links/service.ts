import { ElysiaCustomStatusResponse, redirect, status } from 'elysia'
import type { LinkModel } from './model'
import { nanoid } from 'nanoid'
import { db } from '../../database'
import { linkTable } from '../../database/schema'
import { eq, sql } from 'drizzle-orm'

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

         if(err instanceof ElysiaCustomStatusResponse){
            throw status(err.code, err.response)
        }

        throw status(500, 'Internal server error')
    }
}

export async function redirectLink({short_url}: LinkModel.redirectLinkBody) {
    try {
        const [foundURL] = await db.select({long_url:linkTable.longURL}).from(linkTable).where(eq(linkTable.shortURL, short_url))

        if(!foundURL || !foundURL.long_url) throw status(404, "Not Found" satisfies LinkModel.redirectURLNotFound)
        
        await db.update(linkTable).set(
            {clickCount: sql`${linkTable.clickCount} + 1`}
        ).where(eq(linkTable.shortURL, short_url))
        
        return foundURL.long_url
        
            
    } catch (error) {
        if (error instanceof Error && 'status' in error) throw error
        
        if(error instanceof ElysiaCustomStatusResponse){
            throw status(error.code, error.response)
        }
        throw status(500, 'Internal server error')
    }
}