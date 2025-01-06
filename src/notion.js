import { Client } from '@notionhq/client';

export class NotionClient {
  constructor(token, databaseId, propertyMap) {
    this.client = new Client({ auth: token });
    this.databaseId = databaseId;
    this.propertyMap = propertyMap;
  }

  async addBookToDatabase(bookInfo) {
    const properties = {
      [this.propertyMap.title]: {
        title: [{ text: { content: bookInfo.title } }],
      },
      [this.propertyMap.author]: {
        rich_text: [{ text: { content: bookInfo.author || '' } }],
      },
      [this.propertyMap.translator]: {
        rich_text: [{ text: { content: bookInfo.translator || '' } }],
      },
      [this.propertyMap.rating]: {
        number: bookInfo.rating,
      },
      [this.propertyMap.summary]: {
        rich_text: [{ text: { content: bookInfo.summary || '' } }],
      },
      [this.propertyMap.pages]: {
        number: bookInfo.pages,
      },
      [this.propertyMap.douban_url]: {
        url: bookInfo.douban_url,
      },
    };

    try {
      const response = await this.client.pages.create({
        parent: { database_id: this.databaseId },
        cover: {
          type: 'external',
          external: { url: bookInfo.cover },
        },
        properties,
      });
      return response;
    } catch (error) {
      throw new Error(`Failed to add book to Notion: ${error.message}`);
    }
  }
}
