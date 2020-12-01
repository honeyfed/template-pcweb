<template>
    <div class="authorize_empty"></div>
</template>

<script>
export default {
  created () {
    const search = window.location.search
    let data = search.match(/data=(.+)/)
    data = data && data[1]
    this.$axios.post('/hc/weixin/getAuthUrl', { data })
      .then(res => {
        window.location.href = res.data.data.authUrl
      })
  }
}
</script>
