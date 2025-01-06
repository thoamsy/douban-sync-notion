#!/usr/bin/env node

import { program } from 'commander';
import { readFileSync, existsSync } from 'fs';
import TOML from '@iarna/toml';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import inquirer from 'inquirer';
import { searchAndFetchBookInfo } from './douban.js';
import { NotionClient } from './notion.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 检查配置文件
const configPath = join(__dirname, '../config/config.toml');
if (!existsSync(configPath)) {
  console.error('\n错误: 找不到配置文件！');
  console.error('请按照以下步骤设置：');
  console.error('1. 复制 config/default.toml 到 config/config.toml');
  console.error(
    '2. 在 config/config.toml 中填入你的 Notion token 和 database ID\n',
  );
  process.exit(1);
}

// 加载配置
let config;
try {
  config = TOML.parse(readFileSync(configPath, 'utf-8'));
} catch (error) {
  console.error('\n错误: 配置文件格式不正确！');
  console.error('请确保 config/config.toml 是有效的 TOML 格式\n');
  process.exit(1);
}

// 验证必要的配置项
if (!config.notion?.token || config.notion.token === 'your-notion-token') {
  console.error('\n错误: 未设置 Notion token！');
  console.error('请在 config/config.toml 中设置有效的 Notion token\n');
  process.exit(1);
}

if (
  !config.notion?.database_id ||
  config.notion.database_id === 'your-database-id'
) {
  console.error('\n错误: 未设置 Notion database ID！');
  console.error('请在 config/config.toml 中设置有效的 database ID\n');
  process.exit(1);
}

program
  .name('notion-sync-douban')
  .description('Sync Douban book information to Notion database')
  .version('1.0.0')
  .argument('<input>', 'Douban book URL or book name')
  .option('-c, --confirm', 'Enable confirmation before updating Notion', false)
  .action(async (input, options) => {
    try {
      // 1. 搜索并获取豆瓣图书信息
      console.log('Fetching book information...');
      const bookInfo = await searchAndFetchBookInfo(input);

      // 2. 如果启用确认模式，显示信息并等待确认
      if (options.confirm) {
        console.log('\nBook Information:');
        console.log(JSON.stringify(bookInfo, null, 2));

        const { confirmed } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirmed',
            message: 'Do you want to add this book to Notion?',
            default: true,
          },
        ]);

        if (!confirmed) {
          console.log('Operation cancelled');
          process.exit(0);
        }
      }

      // 3. 添加到 Notion
      console.log('Adding to Notion...');
      const notionClient = new NotionClient(
        config.notion.token,
        config.notion.database_id,
        config.notion.properties,
      );

      await notionClient.addBookToDatabase(bookInfo);
      console.log('Successfully added to Notion!');
    } catch (error) {
      console.error('\nError:', error.message);
      process.exit(1);
    }
  });

program.parse();
