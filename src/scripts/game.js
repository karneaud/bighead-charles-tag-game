import Countdown from "./countdown";

const $charless = document.querySelectorAll('.charles');
const touchClick = ('ontouchstart' in window) ? 'touchstart' : 'click';
// Create a new Countdown object with an element selector.
const countdown = new Countdown('#countdown');

// Register event listeners for the various events.
countdown.element.addEventListener('started', event => console.log(`Countdown started with ${event.detail} seconds`));
countdown.element.addEventListener('paused', event => console.log(`Countdown paused with ${event.detail} seconds remaining`));
countdown.element.addEventListener('stopped', event => console.log(`Countdown stopped with ${event.detail} seconds total`));

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
            //$s.classList.add('clicked');
            $s.dispatchEvent(new Event('close:item'));
            console.log(`${$s.id} has beend clicked ${clicked} and is now closing ${closing}`);
        }

        return false;
    });

    $s.addEventListener('open:item', () => {
        let $bh = $s.querySelector('.bighead');
        $bh.classList.add('up');
        intvl1 = setTimeout(() => {
            $s.dispatchEvent(new Event('close:item'));
            clearTimeout(intvl1);
        }, Math.random() * 2500);
        console.log(`Hi its me ${$s.id}`)
    });

    $s.addEventListener('close:item', () => {
        closing = true;
        let $bh = $s.querySelector('.bighead');
        $bh.classList.remove('up');       
        $bh.addEventListener('transitionend', onTransitionEnd);
        // $s.classList.remove('clicked');
        //$bh.classList.add('down');
    });

    const onTransitionEnd = () => {
        let $bh = $s.querySelector('.bighead');
        closing = false;
        //$bh.classList.remove('down');
        intvl2 = setTimeout(() => {
            clicked = false;
            $s.dispatchEvent(new Event('open:item'));
            clearTimeout(intvl2)
        }, Math.random() * 2500);
        console.debug($s.id, 'transition end',' clicked ', clicked, ' closing: ', closing);
        $bh.removeEventListener('transitionend', onTransitionEnd);
    };

    $s.addEventListener('clear:intvl', () => {
        let $bh = $s.querySelector('.bighead');
        clearTimeout(intvl);
        closing = true;
        clicked = false;
        $bh.classList.remove('up', 'click', 'down');
        //$bh.classList.add('down');
    });
        
});

export default {
    start() {

        //$charless[1].dispatchEvent(new Event('open:item'));

        $charless.forEach((e,i) => {
            setTimeout(() => e.dispatchEvent(new Event('open:item')), Math.random() * 1000)
            countdown.element.addEventListener('ended', () => {
                // e.dispatchEvent(new Event('clear:intvl'))
            })    
        })

        countdown.start(90);
        
    },
    pause(){
        countdown.pause();
    }
}