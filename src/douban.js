import axios from 'axios';
import * as cheerio from 'cheerio';

export async function fetchBookInfo(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      },
    });

    const $ = cheerio.load(response.data);

    // 获取基本信息
    const title = $('h1 span').first().text().trim();
    const cover = $('#mainpic img').attr('src');
    const rating = $('[property="v:average"]').text();
    const summary = $('.intro > p').text().trim();

    // 获取作者、译者和页数信息
    const info = $('#info').text();
    const author = extractInfo(info, '作者');
    const translator = extractInfo(info, '译者');
    const pages = extractInfo(info, '页数')?.replace(/[^0-9]/g, '');

    const bookInfo = {
      title,
      author,
      translator,
      cover,
      rating: rating ? parseFloat(rating) : null,
      summary,
      pages: pages ? parseInt(pages, 10) : null,
      douban_url: url,
    };

    return bookInfo;
  } catch (error) {
    throw new Error(`Failed to fetch book info: ${error.message}`);
  }
}

function extractInfo(info, key) {
  const regex = new RegExp(`${key}:\\s*([^\\n]+)`);
  const match = info.match(regex);
  return match ? match[1].trim() : null;
}
