import Countdown from "./scripts/countdown";
import Singleton from "./scripts/game";
import tinyModal from "tiny-modal";

if(process.env.NODE_ENV != "production") {
    (require('eruda')).init()
}

(($) => {

    const  
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
                        countdown.start(10);
                        Game.start(); break;
                    default: break; 
                }
                
                return false
            },
            scrollTop: true
        };
        
    // Register event listeners for the various events.
    countdown.element.addEventListener('paused', event => Game.pause );
    countdown.element.addEventListener('ended', event => {
        console.log('end game')
        Game.finish()
    } ); 

    var $currentMsg = $.document.querySelector('.show.message');
    $.tinyModal = new tinyModal(elem, opts);
    $.document.addEventListener('gameStateChange',(e) => {
        console.log(e.detail.currentState, 'gameStateChange')
        switch (e.detail.currentState)
        {
            case 'finished':
            case 'paused':
                toggleMsgs(e.detail.currentState);
                $.tinyModal.show(); break;
            case 'resume':
                countdown.start(countdown.secondsRemaining); break;
            default: if($.tinyModal.isShown) $.tinyModal.hide(); break; 
        }
    });
    $.tinyModal.show();
})(window)