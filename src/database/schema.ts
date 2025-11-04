import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const linkTable = pgTable('links', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    shortURL: varchar('short_url', {length: 12}).unique(),
    longURL: text('long_url'),
    createAt: timestamp('created_at').defaultNow(),
    clickCount: integer('click_count').default(0)
})

type SelectLinks = InferSelectModel<typeof linkTable>
type InsertLinks = InferInsertModel<typeof linkTable>