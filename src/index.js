#!/usr/bin/env node

import { program } from 'commander';
import { readFileSync } from 'fs';
import TOML from '@iarna/toml';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import inquirer from 'inquirer';
import { fetchBookInfo } from './douban.js';
import { NotionClient } from './notion.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load configuration
const config = TOML.parse(
  readFileSync(join(__dirname, '../config/config.toml'), 'utf-8'),
);

program
  .name('notion-sync-douban')
  .description('Sync Douban book information to Notion database')
  .version('1.0.0')
  .argument('<url>', 'Douban book URL')
  .option('-c, --confirm', 'Enable confirmation before updating Notion', false)
  .action(async (url, options) => {
    try {
      // 1. 获取豆瓣图书信息
      console.log('Fetching book information...');
      const bookInfo = await fetchBookInfo(url);

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
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

program.parse();
