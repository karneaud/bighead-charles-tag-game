const $charless = document.querySelectorAll('.charles');
const touchClick = ('ontouchstart' in window) ? 'touchstart' : 'click';

export default {
    start() {
        $charless.forEach($s => {
            let closing = false;
            let clicked = false;
            let intvl;
        
            $s.addEventListener(touchClick, () => {
            console.log('closing', closing, 'clicked', clicked);
        
            if (!clicked && !closing) {
                closing = true;
                clicked = true;
                clearTimeout(intvl);
                $s.classList.add('click');
                $s.dispatchEvent(new Event('close:item'));
                $scoreText.innerHTML = ++score;
            }
        
            return false;
            });
        
            $s.addEventListener('open:item', () => {
            $s.classList.add('open');
            intvl = setTimeout(() => {
                $s.dispatchEvent(new Event('close:item'));
            }, Math.random() * 2500);
            });
        
            $s.addEventListener('close:item', () => {
            closing = true;
            clearInterval(intvl);
            $s.classList.remove('open');
            $s.classList.add('close');
            $s.addEventListener('transitionend', onTransitionEnd);
            });
        
            const onTransitionEnd = () => {
            $s.removeEventListener('transitionend', onTransitionEnd);
            if (!closing) return false;
            else if (intvl) clearInterval(intvl);
        
            closing = false;
            clicked = false;
            $s.classList.remove('close', clicked ? 'click' : '');
            intvl = setTimeout(() => {
                $s.dispatchEvent(new Event('open:item'));
            }, Math.random() * 2500);
            };
        
                $s.addEventListener('clear:intvl', () => {
                clearInterval(intvl);
                closing = true;
                clicked = false;
                $s.classList.remove('open', 'click');
                $s.classList.add('close');
                });
                
        });
    },
    pause(){

    }
}