export function download (blob) {
  var a = document.createElement('a')
  var url = window.URL.createObjectURL(blob)
  var filename = '模板.xlsx'
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}
