import { formatHeatScore } from "../utils/format"

interface Res {
  code: number
  message: string
  ttl: number
  data: {
    trending: {
      title: string
      trackid: string
      list: {
        keyword: string
        show_name: string
        icon: string
        uri: string
        goto: string
        heat_score: number
      }[]
    }
  }
}

export default defineSource(async () => {
  const url = "https://api.bilibili.com/x/web-interface/wbi/search/square?limit=30"

  try {
    // 请求 Bilibili 热搜 API
    const res: Res = await $fetch(url, {
      headers: {
        // 示例：添加 User-Agent
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
        // 如果需要 Cookie，可以在此添加
        // "Cookie": "your_cookie_here"
      },
    })

    // 检查 API 返回码
    if (res.code !== 0) {
      throw new Error(`获取Bilibili热搜失败: ${res.message}`)
    }

    return res.data.trending.list.map(k => ({
      id: k.keyword, // 或者使用其他唯一标识，如 k.trackid
      title: k.show_name,
      url: `https://search.bilibili.com/all?keyword=${encodeURIComponent(k.keyword)}`,
      extra: {
        info: `${formatHeatScore(k.heat_score)}热度`,
      },
    }))
  } catch (error) {
    logger.error("获取B站热门搜索失败:", error)
    return []
  }
})
