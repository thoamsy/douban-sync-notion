# Notion Sync Douban

A CLI tool to sync Douban book information to your Notion database.

https://github.com/user-attachments/assets/cb58e818-00dd-4e07-a64b-b16c33f85d7b

## Requirements

- Node.js >= 18.0.0

## Notion Setup

Before using this tool, you need to set up a Notion integration and configure your database:

### 1. Create a Notion Integration

1. Visit [Notion's integration page](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Give it a name (e.g., "Douban Book Sync")
4. Select the workspace where your book database is located
5. Click "Submit" to create the integration
6. Copy the "Internal Integration Token" (it starts with `ntn_`)

### 2. Create or Prepare Your Database

Ensure your Notion database has the following properties:

- `书名` (Title type)
- `作者` (Text type)
- `译者` (Text type)
- `封面` (Files & media type)
- `豆瓣评分` (Number type)
- `简介` (Text type)
- `页数` (Number type)
- `豆瓣链接` (URL type)

### 3. Connect Integration to Database

1. Open your database in Notion
2. Click the "..." menu in the top-right corner
3. Click "Add connections"
4. Find and select your integration from the list
5. Click "Confirm" to give the integration access

### 4. Get Database ID

1. Open your database in Notion
2. Look at the URL in your browser:
   ```
   https://www.notion.so/workspace/[workspace-name]/<database_id>?v=...
   ```
   or
   ```
   https://www.notion.so/catfly/<database_id>?v=...&pvs=4
   ```
3. Copy the `database_id` (it's a 32-character string, may contain hyphens)

## Tool Setup

1. Copy `config/default.toml` and rename it to `config/config.toml`
2. Update the configuration with your Notion token and database ID:
   ```toml
   [notion]
   token = "secret_xxx..."        # Your Integration Token
   database_id = "xxx..."         # Your Database ID
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Make the CLI globally available (optional):
   ```bash
   npm link
   ```

## Usage

If you've made the CLI globally available:

```bash
# Using book URL
notion-sync-douban https://book.douban.com/subject/xxxxx

# Using book name
notion-sync-douban "三体"

# With confirmation mode
notion-sync-douban "三体" --confirm
```

Or run it directly:

```bash
# Using book URL
npm start https://book.douban.com/subject/xxxxx

# Using book name
npm start "三体"

# With confirmation mode
npm start "三体" --confirm
```

When using a book name, the tool will search on Douban and use the first result. The found book title will be displayed before proceeding.

## Troubleshooting

### Property Not Found Error

If you get a property not found error, check that:

1. All property names in your database exactly match those in `config.toml`
2. There are no extra spaces in property names
3. The integration has access to your database

Example of a property with extra space that would cause an error:

```json
" 豆瓣评分": {  // Extra space before the name!
    "id": "fFYD",
    "type": "number",
    "number": null
}
```

### Access Denied Error

If you get "Access Denied" errors:

```json
{"object":"error","status":404,"code":"object_not_found","message":"Could not find database with ID: xxxx. Make sure the relevant pages and databases are shared with your integration.","request_id":"xxxx"}%
```

1. Check that your integration token is correct
2. Verify that you've added the integration to your database
3. Try removing and re-adding the integration to your database
