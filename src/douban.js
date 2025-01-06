import axios from 'axios';
import * as cheerio from 'cheerio';

const DOUBAN_BOOK_URL_PATTERN =
  /^https:\/\/book\.douban\.com\/subject\/\d+\/?$/;

export async function searchAndFetchBookInfo(input) {
  let bookUrl;

  if (DOUBAN_BOOK_URL_PATTERN.test(input)) {
    bookUrl = input;
  } else {
    bookUrl = await searchBook(input);
  }

  return await fetchBookInfo(bookUrl);
}

const axiosHeader = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  Accept: 'application/json, text/plain, */*',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  Referer: 'https://search.douban.com/',
};

async function searchBook(keyword) {
  try {
    const searchUrl = `https://www.douban.com/j/search_suggest?q=${encodeURIComponent(
      keyword,
    )}&cat=1001`;
    const response = await axios.get(searchUrl, {
      headers: axiosHeader,
    });

    console.log(response.data);

    if (
      !response.data ||
      !response.data.cards ||
      response.data.cards.length === 0
    ) {
      throw new Error('No books found for the given keyword');
    }

    // 获取第一个搜索结果
    const firstResult = response.data.cards[0];
    if (!firstResult.url || !firstResult.title) {
      throw new Error('Invalid search result format');
    }

    const bookUrl = firstResult.url;
    console.log(`Found book: "${firstResult.title}"`);

    // 验证 URL 格式
    if (!DOUBAN_BOOK_URL_PATTERN.test(bookUrl)) {
      throw new Error('Invalid book URL format');
    }

    return bookUrl;
  } catch (error) {
    if (error.response && error.response.status === 403) {
      throw new Error('Access denied by Douban. Please try again later.');
    }
    throw new Error(`Failed to search book: ${error.message}`);
  }
}

export async function fetchBookInfo(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        ...axiosHeader,
        Referer: 'https://book.douban.com/',
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
    if (error.response && error.response.status === 403) {
      throw new Error('Access denied by Douban. Please try again later.');
    }
    throw new Error(`Failed to fetch book info: ${error.message}`);
  }
}

function extractInfo(info, key) {
  const regex = new RegExp(`${key}:\\s*([^\\n]+)`);
  const match = info.match(regex);
  return match ? match[1].trim() : null;
}
