# Notion Sync Douban

A CLI tool to sync Douban book information to your Notion database.


https://github.com/user-attachments/assets/cb58e818-00dd-4e07-a64b-b16c33f85d7b



## Requirements

- Node.js >= 18.0.0

## Setup

1. Copy `config/default.toml` and rename it to `config/config.toml`
2. Update the configuration with your Notion token and database ID
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

## Configuration

Update `config/config.toml` with your settings:

- `notion.token`: Your Notion integration token
- `notion.database_id`: Your Notion database ID
- `notion.properties`: Map of Notion database property names

### Troubleshooting

如果碰到了某个 property 提示不存在，请确保你这个 property 在 notion 中没有多余的空格。

```json
" 豆瓣评分": {
    "id": "fFYD",
    "type": "number",
    "number": null
  },
```
