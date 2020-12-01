
export default class SafeTimer {
  constructor (name, callback) {
    this.name = name
    this.callback = callback
    this.timeLeft = this._get()
    callback(this.timeLeft)
    if (this.timeLeft > 0) {
      this._startCount()
    }
  }

  _set (time) {
    sessionStorage.setItem(this.name + '-timestamp', Date.now())
    sessionStorage.setItem(this.name, time)
  }

  _get () {
    let time = sessionStorage.getItem(this.name) || '0'
    time = parseInt(time)
    if (!isFinite(time) || this._timeExpired()) {
      time = 0
    }
    return time
  }

  _startCount () {
    let timer = setInterval(() => {
      this.timeLeft--
      this._set(this.timeLeft)
      this.callback(this.timeLeft)
      if (this.timeLeft <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  }

  _timeExpired () {
    let now = Date.now()
    let lastTimestamp = parseInt(sessionStorage.getItem(this.name + '-timestamp') || '0')
    let time = sessionStorage.getItem(this.name) || '0'
    time = parseInt(time)

    return now >= lastTimestamp + time
  }

  setTimeLeft (timeLeft) {
    this.timeLeft = timeLeft
    this._set(this.timeLeft)
    this.callback(this.timeLeft)
    if (this.timeLeft > 0) {
      this._startCount()
    }
  }
}
