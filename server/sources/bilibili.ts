interface PCRes {
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

interface WapRes {
  code: number
  exp_str: string
  list: {
    hot_id: number
    keyword: string
    show_name: string
    score: number
    word_type: number
    goto_type: number
    goto_value: string
    icon: string
    live_id: any[]
    call_reason: number
    heat_layer: string
    pos: number
    id: number
    status: string
    name_type: string
    resource_id: number
    set_gray: number
    card_values: any[]
    heat_score: number
    stat_datas: {
      etime: string
      stime: string
      is_commercial: string
    }
  }[]
  top_list: any[]
  hotword_egg_info: string
  seid: string
  timestamp: number
  total_count: number
}

/**
 * 将 latin1 编码的字符串转换为 utf-8
 */
function decodeLatin1(str: string): string {
  try {
    return decodeURIComponent(escape(str))
  } catch (e) {
    logger.error("Failed to decode Latin1 string:", e)
    return str
  }
}

/**
 * 获取哔哩哔哩热搜，PC端
 */
async function fetchPCApi() {
  const url = "https://api.bilibili.com/x/web-interface/wbi/search/square?limit=15"

  const res: PCRes = await $fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    },
  })

  return res.data.trending.list.map(k => ({
    id: k.keyword,
    title: k.show_name,
    url: `https://search.bilibili.com/all?keyword=${encodeURIComponent(k.keyword)}`,
    extra: {
      icon: k.icon && `/api/proxy?img=${encodeURIComponent(k.icon)}`,
    },
  }))
}

/**
 * 获取哔哩哔哩热搜，WAP端
 */
async function fetchWAPApi() {
  const url = "https://s.search.bilibili.com/main/hotword"
  const res: WapRes = await $fetch(url)

  return res.list.map(k => ({
    id: decodeLatin1(k.keyword),
    title: decodeLatin1(k.show_name),
    url: `https://search.bilibili.com/all?keyword=${encodeURIComponent(k.keyword)}`,
    extra: {
      icon: k.icon && `/api/proxy?img=${encodeURIComponent(k.icon)}`,
    },
  }))
}

const hotSearch = defineSource(async () => {
  try {
    return await fetchPCApi()
  } catch (error) {
    logger.error(error)
    return await fetchWAPApi()
  }
})

export default defineSource({
  "bilibili": hotSearch,
  "bilibili-hot-search": hotSearch,
})
