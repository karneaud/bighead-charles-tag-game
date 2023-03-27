import Preload from 'preload-it';
import Countdown from "./scripts/countdown";
import Singleton from "./scripts/game";
import tinyModal from "tiny-modal";

if(process.env.NODE_ENV != "production") {
    (require('eruda')).init()
}


(($) => {

    const  
        $score = $.document.querySelector('#points'),
        countdown = new Countdown('#countdown'),
        Game = new Singleton(), toggleMsgs = (msg) => {
            $currentMsg.classList.remove('show')
            if($currentMsg = elem.querySelector(`#${msg}-message`)) $currentMsg.classList.add('show')
        },
        elem = $.document.querySelector('.modal'), 
        opts = {
            hideSelector: '.modal-hide',
            onHide: (target, modal) => {
                switch (Game.state)
                {
                    case 'paused':
                        Game.resume(); break;
                    case 'finished':
                    case false:
                        countdown.start(30);
                        Game.start(); break;
                    default: break; 
                }
                
                return false
            },
            scrollTop: true
        }, setScore = (s) => {
            s = s === false ? -1 : parseInt($score.textContent)
            $score.textContent = s + 1
        }, preload = Preload(), preloader = document.querySelector('.progress-container');
        
        preload.onprogress = event => {
          preloader.setAttribute('style', `--preloader-progress:${event.progress}%`);
        };

        preload.oncomplete = event => toggleMsgs('start')       
        
    // Register event listeners for the various events.
    countdown.element.addEventListener('paused', event => Game.pause );
    countdown.element.addEventListener('ended', event => {
        Game.finish()
    } ); 

    var $currentMsg = $.document.querySelector('.show.message');
    $.tinyModal = new tinyModal(elem, opts);
    $.document.addEventListener('charles:clicked',(e) => {
       setScore(1);
    })
    $.document.addEventListener('gameStateChange',(e) => {
        switch (e.detail.currentState)
        {
            case 'finished':
            case 'paused':
                toggleMsgs(e.detail.currentState);
                setScore(false);
                $.tinyModal.show(); break;
            case 'resume':
                countdown.start(countdown.secondsRemaining); break;
            default: if($.tinyModal.isShown) $.tinyModal.hide(); break; 
        }
    });
   $.tinyModal.show();
   preload.fetch(['./assets/logo.png', './assets/background.png','./assets/bush2.png','./assets/bush3.png','./assets/ch1.png','./assets/ch3.png','./assets/ch4.png']
        );
})(window)