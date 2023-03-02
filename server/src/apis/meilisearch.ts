import { MeiliSearch } from "meilisearch"


export class SearchClient extends MeiliSearch {
  constructor() {
    super({
      host: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
      apiKey: process.env.MEILISEARCH_API_KEY,
    })
  }
}

export const meiliSearchSetup = async () => {
  const client = new SearchClient()
  try {
    // await client.deleteIndex('items')
    // await client.deleteIndex('collections')
    // await client.deleteIndex('comments')
    await client.createIndex('items', { primaryKey: 'id' })
    await client.createIndex('collections', { primaryKey: 'id' })
    await client.createIndex('comments', { primaryKey: 'id' })
    const itemsIndex = client.index('items')
    const commentsIndex = client.index('comments')
    const collectionsIndex = client.index('collections')
    await itemsIndex.updateSearchableAttributes(['name', 'str1', 'txt1', 'str2', 'txt2', 'str3', 'txt3'])
    await commentsIndex.updateSearchableAttributes(['text'])
    await collectionsIndex.updateSearchableAttributes(['title', 'description'])
    console.log('Setup MeiliSearch is complete')
  } catch (e) {
    console.log('Setup MeiliSearch ERROR', e)
  }
}
