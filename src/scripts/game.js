class Singleton {
    constructor() {
      if (!Singleton.instance) {
        this._state = false;
        this._score = 0
        Singleton.instance = this;
      }
  
      return Singleton.instance;
    }

    get score() {
        return this._score;
    }
  
    set score(value) {
        this._score = value;
    }

    get state() {
      return this._state;
    }
  
    set state(value) {
      this._state = value;
    }
  
    start() {
        $charless.forEach((e,i) => {
            setTimeout(() => e.dispatchEvent(new Event('open:item')), Math.random() * 1000)    
        })
        this.resetScore();
        this.setState('started');
    }
  
    stop() {
        this.setState('stopped');
    }
  
    pause(timeRemaining) {
        this.setState('paused');
    }

    resume() {
        this.setState('started');
    }

    finish() {
        this.setState('finished');
        $charless.forEach((e) => {
            e.dispatchEvent(new Event('clear:intvl'))
        })
    }

    setState(value) {
        let s = this.state;
      this.state = value;
      const event = new CustomEvent('gameStateChange', {
        detail: {
          currentState: this.state,
          previousState: s
        }
      });
  
      window.document.dispatchEvent(event);
    }

    setScore(point = 1) {
        this.score += point;
        const event = new CustomEvent('gameScoreChange', {
            detail: {
              currentScore: this.score,
            }
          });
      
        window.document.dispatchEvent(event);
    }

    getScore(){
        return this.score;
    }

    getState() {
        return this.state;
    }

    resetScore() {
        this.setScore(0 - this.score);
    }
}

const touchClick = ('ontouchstart' in window) ? 'touchstart' : 'click', $charless = document.querySelectorAll('.charles');

$charless.forEach($s => {
    let closing = false;
    let clicked = false;
    let intvl1, intvl2;
    let clickTime = Date.now();
    $s.addEventListener(touchClick, (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (!clicked && !closing && ((Date.now() - clickTime) > 4350)) {
            clearTimeout(intvl2);
            closing = true;
            clicked = true;
            //document.dispatchEvent(new Event('charles:clicked'))
            Game.setScore();
            $s.dispatchEvent(new Event('close:item'));
            clickTime = Date.now()
        }

        return false;
    });

    $s.addEventListener('open:item', () => {
        let $bh = $s.querySelector('.bighead');
        $bh.classList.add('up');
        intvl1 = setTimeout(() => {
            $s.dispatchEvent(new Event('close:item'));
           // clearTimeout(intvl1);
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
            // clearTimeout(intvl2)
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

const Game = new Singleton
export default Game;
