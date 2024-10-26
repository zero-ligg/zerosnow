interface Jin10Item {
  id: string
  time: string
  type: number
  data: {
    pic?: string
    title?: string
    source?: string
    content?: string
    source_link?: string
    vip_title?: string
    lock?: boolean
    vip_level?: number
    vip_desc?: string
  }
  important: number
  tags: string[]
  channel: number[]
  remark: any[]
}

export default defineSource(async () => {
  const timestamp = Date.now()
  const url = `https://www.jin10.com/flash_newest.js?t=${timestamp}`

  const rawData = await $fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    },
  })

  // 更严谨地处理字符串，确保移除所有非 JSON 内容
  const jsonStr = (rawData as string)
    .replace(/^var\s+newest\s*=\s*/, "") // 移除开头的变量声明
    .replace(/;*$/, "") // 移除末尾可能存在的分号
    .trim() // 移除首尾空白字符
  const data: Jin10Item[] = JSON.parse(jsonStr)

  return data.map(item => ({
    id: item.id,
    title: item.data.content || item.data.vip_title || "", // 使用 content 作为标题，因为示例中 title 都是空的
    url: `https://flash.jin10.com/detail/${item.id}`,
    extra: {
      date: item.time,
      important: item.important,
    },
  }))
})
