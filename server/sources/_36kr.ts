import type { NewsItem } from "@shared/types"
import { load } from "cheerio"

const quick = defineSource(async () => {
  const baseURL = "https://www.36kr.com"
  const url = `${baseURL}/newsflashes`
  const response = await myFetch(url) as any
  const $ = load(response)
  const news: NewsItem[] = []
  const $items = $(".newsflash-item")
  $items.each((_, el) => {
    const $el = $(el)
    const $a = $el.find("a.item-title")
    const url = $a.attr("href")
    const title = $a.text()
    const relativeDate = $el.find(".time").text()
    if (url && title && relativeDate) {
      news.push({
        url: `${baseURL}${url}`,
        title,
        id: url,
        extra: {
          date: parseRelativeDate(relativeDate, "Asia/Shanghai").valueOf(),
        },
      })
    }
  })

  return news
})
const information = defineSource(async () => {
  const baseURL = "https://www.36kr.com"
  const url = `${baseURL}/information/web_news`
  const response = await myFetch(url) as any
  const $ = load(response)
  const news: NewsItem[] = []

  // 选择资讯页面的文章列表
  const $items = $(".information-flow-item")
  $items.each((_, el) => {
    const $el = $(el)
    const $a = $el.find(".article-item-title.weight-bold")
    const url = $a.attr("href")
    const title = $a.text().trim()
    const time = $el.find(".kr-flow-bar-time").text().trim()

    if (url && title && time) {
      news.push({
        url: url.startsWith("http") ? url : `${baseURL}${url}`,
        title,
        id: url,
        extra: {
          date: parseRelativeDate(time, "Asia/Shanghai").valueOf(),
          info: "36氪资讯", // 添加标识
        },
      })
    }
  })

  return news
})

export default defineSource({
  "36kr": quick,
  "36kr-quick": quick,
  "36kr-information": information,
})
