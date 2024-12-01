import type { NewsItem } from "@shared/types"
import { load } from "cheerio"

const quick24 = defineSource(async () => {
  const baseURL = "https://www.huxiu.com"
  const url = `${baseURL}/article` // or moment
  const response = await myFetch(url) as any
  const $ = load(response)
  const news: NewsItem[] = []
  const $items = $(".article-item-wrap")
  $items.each((_, el) => {
    // 文字类
    const $el = $(el)
    const $a = $el.find("a.content-wrap")
    const url = $a.attr("href")
    const title = $a.find(".two-lines").text()
    const relativeDate = $el.find(".bottom-line__time").text()
    if (url && title && relativeDate) {
      news.push({
        url: `${url}`,
        title,
        id: url,
        extra: {
          date: parseRelativeDate(relativeDate, "Asia/Shanghai").valueOf(),
        },
      })
    }
    // 图片类
    const c_title = $el.find(".channel-title").text().trim()
    const c_url = $el.find(".article-item-wrap a").first().attr("href")
    if (c_url && c_title && relativeDate) {
      news.push({
        url: `${c_url}`,
        title: c_title,
        id: c_url,
        extra: {
          date: parseRelativeDate(relativeDate, "Asia/Shanghai").valueOf(),
        },
      })
    }
  })

  return news
})

export default defineSource({
  "huxiu": quick24,
  "huxiu-quick": quick24,
})
