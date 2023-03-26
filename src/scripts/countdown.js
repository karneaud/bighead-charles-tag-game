class Countdown {
  constructor(selector) {
    this.element = window.document.querySelector(selector);
    this.totalSeconds = 0;
    this.secondsRemaining = 0;
    this.intervalId = null;
    this.startTime = null;
    this.pausedTime = null;

    this.emitEvent = (eventName, eventData) => {
      const event = new CustomEvent(eventName, { detail: eventData });
      this.element.dispatchEvent(event);
    };

    this.format = (unixTimestamp, formatPattern) => {
      const date = new Date(unixTimestamp * 1000);
      const seconds = date.getSeconds().toString().padStart(2, '0');
      const milliseconds = date.getMilliseconds().toString().substring(0,2).padStart(2, '0');
      const formattedString = formatPattern.replace(/##/, seconds).replace(/\*\*/, milliseconds);
      return formattedString;
    };
  }

  start(seconds) {
    this.totalSeconds = seconds;
    this.secondsRemaining = seconds;
    this.startTime = Date.now();
    this.emitEvent('started', this.totalSeconds);
    this.tick();

    const tickHandler = () => {
      this.tick();
      if (this.secondsRemaining === 0) {
        this.stop();
        this.emitEvent('ended');
        console.log('ended');
      } else this.intervalId = window.requestAnimationFrame(tickHandler);
    };
    
    this.intervalId = window.requestAnimationFrame(tickHandler);
  }

  pause() {
    if (this.intervalId) {
      window.cancelAnimationFrame(this.intervalId);
      this.intervalId = null;
      this.pausedTime = Date.now();
      this.emitEvent('paused', this.secondsRemaining);
    }
  }

  stop() {
    if (this.intervalId) {
      window.cancelAnimationFrame(this.intervalId);
      this.intervalId = null;
      this.secondsRemaining = 0;
      this.emitEvent('stopped', this.totalSeconds);
    }
  }

  tick() {
    const currentTime = Date.now();
    const elapsedTime = (currentTime - this.startTime) / 1000;
    const remainingSeconds = Math.max(0, this.totalSeconds - elapsedTime);
    if (remainingSeconds !== this.secondsRemaining) {
      this.secondsRemaining = remainingSeconds;
      this.emitEvent('tick', currentTime / 1000);
      const formattedTime = this.format(remainingSeconds, '##:**');
      this.element.textContent = formattedTime;
    }
  }
}


export default Countdown;
