class Singleton {
    constructor() {
      if (!Singleton.instance) {
        this._state = false;
        Singleton.instance = this;
      }
  
      return Singleton.instance;
    }
  
    get state() {
      return this._state;
    }
  
    set state(newState) {
      let s = this._state;
      this._state = newState;
  
      const event = new CustomEvent('gameStateChange', {
        detail: {
          currentState: this._state,
          previousState: s
        }
      });
  
      window.document.dispatchEvent(event);
    }
  
    start() {
        $charless.forEach((e,i) => {
            setTimeout(() => e.dispatchEvent(new Event('open:item')), Math.random() * 1000)    
        })
        this.state = 'started';
    }
  
    stop() {
        this.state = 'stopped';
    }
  
    pause(timeRemaining) {
        this.state = 'paused';
    }

    resume() {
        this.state = 'started';
    }
  
    finish() {
        this.state = 'finished';
        $charless.forEach((e) => {
            e.dispatchEvent(new Event('clear:intvl'))
        })
    }
}

const touchClick = ('ontouchstart' in window) ? 'touchstart' : 'click', $charless = document.querySelectorAll('.charles');

$charless.forEach($s => {
    let closing = false;
    let clicked = false;
    let intvl1, intvl2;
    $s.addEventListener(touchClick, (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (!clicked && !closing) {
            clearTimeout();
            closing = true;
            clicked = true;
            document.dispatchEvent(new Event('charles:clicked'))
            $s.dispatchEvent(new Event('close:item'));
        }

        return false;
    });

    $s.addEventListener('open:item', () => {
        let $bh = $s.querySelector('.bighead');
        $bh.classList.add('up');
        intvl1 = setTimeout(() => {
            $s.dispatchEvent(new Event('close:item'));
            clearTimeout(intvl1);
        }, 300 + Math.random() * window.defaultInterval * 0.55);
    });

    $s.addEventListener('close:item', () => {
        let $bh = $s.querySelector('.bighead');
        $bh.classList.remove('up');       
        $bh.addEventListener('transitionend', onTransitionEnd);
        closing = true;
    });

    const onTransitionEnd = () => {
        let $bh = $s.querySelector('.bighead');
        intvl2 = setTimeout(() => {
            closing = clicked = false;
            $s.dispatchEvent(new Event('open:item'));
            clearTimeout(intvl2)
        }, 300 + Math.random() * window.defaultInterval);
        $bh.removeEventListener('transitionend', onTransitionEnd);
    };

    $s.addEventListener('clear:intvl', () => {
        let $bh = $s.querySelector('.bighead');
        clearTimeout(intvl1);
        clearTimeout(intvl2);
        closing = false;
        clicked = false;
        $bh.classList.remove('up', 'click');
    });
        
});

export default Singleton;