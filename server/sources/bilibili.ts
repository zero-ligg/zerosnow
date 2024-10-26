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

const hotSearch = defineSource(async () => {
  const url = "https://api.bilibili.com/x/web-interface/wbi/search/square?limit=30"
  // const cookie = (await $fetch.raw("https://www.bilibili.com/")).headers.getSetCookie()
  // console.log(cookie)
  const res: Res = await $fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
      "cookie": [
        "buvid3=3CDB9CD0-5C2C-708C-60D7-85C480E90C6856761infoc; path=/; expires=Sun, 26 Oct 2025 13:17:36 GMT; domain=.bilibili.com",
        "b_nut=1729948656; path=/; expires=Sun, 26 Oct 2025 13:17:36 GMT; domain=.bilibili.com",
      ].join(";"),
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
})

export default defineSource({
  "bilibili": hotSearch,
  "bilibili-hot-search": hotSearch,
})
