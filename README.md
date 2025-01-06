# Notion Sync Douban

A CLI tool to sync Douban book information to your Notion database.

## Setup

1. Copy `config/default.toml` and rename it to `config/config.toml`
2. Update the configuration with your Notion token and database ID
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

You can use either a Douban book URL or a book name:

```bash
# Using book URL
node src/index.js https://book.douban.com/subject/xxxxx

# Using book name
node src/index.js "三体"

# With confirmation mode
node src/index.js "三体" --confirm
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
