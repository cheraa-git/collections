import { MeiliSearch } from "meilisearch"


export class SearchClient extends MeiliSearch {
  constructor() {
    super({
      host: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
      apiKey: process.env.MEILISEARCH_API_KEY,
    })
  }
}
