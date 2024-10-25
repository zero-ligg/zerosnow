/**
 * 格式化热度分数
 * 将数字转换为带有"万"或"亿"单位的字符串
 * 例如: 1234567 -> "123.5万", 123456789 -> "1.2亿"
 *
 * @param heat_score - 需要格式化的热度分数
 * @returns 格式化后的字符串
 */
export function formatHeatScore(heat_score: number): string {
  if (heat_score >= 100000000) { // 1亿及以上
    return `${(heat_score / 100000000).toFixed(1)}亿`
  }
  if (heat_score >= 10000) { // 1万及以上
    return `${(heat_score / 10000).toFixed(1)}万`
  }
  return heat_score.toString()
}
