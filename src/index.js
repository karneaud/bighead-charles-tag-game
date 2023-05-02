import Preload from 'preload-it';
import Countdown from "./scripts/countdown";
import Game from "./scripts/game";
import tinyModal from "tiny-modal";

if (process.env.NODE_ENV != "production") {
  (require('eruda')).init()
}

if (process.env.NODE_ENV == "production") {
  navigator.serviceWorker.register(
    new URL('service-worker.js', import.meta.url),
    { type: 'module' }
  );
}


(($) => {
  // Define the power curve parameters
  const LEADERBOARD_ID = $.LEADERBOARD_ID || process.env.LEADERBOARD_ID,
    setPlayerName = (name) => 
    {
      name = name.substr(0,name.indexOf(' ') || name.length )
      $userName.forEach(e => {
        e.textContent = ` ${name}`
      })
    },saveScore = () => {
      if (!playerInfo) return toggleMsg("profile")
  
      $.galaxy.ClientAPI.ReportScore({
        leaderboard_id: LEADERBOARD_ID,
        score: Game.getScore()
      }, (r, e) => {
        toggleMsg('scores')
      })
    }, saveProfile = () => {
      var name = $playerNameInpt.value, age = $playerAgeInpt.value
      if (!name || !age) return ;
  
      $.galaxy.ClientAPI.UpdatePlayerProfile(
        {
          "Nickname": name
        }, (r, e) => 
          {
            $formBtn.textContent = 'Update'
            $formBtn.classList.remove('submitting')
            if(Game.getScore() > 0) saveScore() 

            if(e) return ;
            
            r.data.player_profile.state = { age }
            $.localStorage.setItem('player', JSON.stringify(r.data.player_profile))
            playerInfo = r.data.player_profile           
      })
      $.galaxy.ClientAPI.SaveState({
        state:  { age }
      },(r,e) => {
        
      })
      playerInfo = { nickname: name, state: { age } }
      setPlayerName(name)
  }, minInterval = 1000, // Minimum interval in milliseconds
    maxInterval = $.MAX_SPEED ? parseInt($.MAX_SPEED) : 3750, // Maximum interval in milliseconds
    minSeconds = 10, // Minimum remaining seconds for maximum speedup
    maxSeconds = $.MAX_TIMELIMIT ?parseInt($.MAX_TIMELIMIT) : 45, // Maximum remaining seconds for minimum speedup
    power = 2,
    $score = $.document.querySelector('#points'),
    $total = $.document.querySelector('#total'),
    countdown = new Countdown('#countdown'),
    toggleMsgs = (msg) => {
      $currentMsg.classList.remove('show')
      if ($currentMsg = elem.querySelector(`#${msg}-message`)) $currentMsg.classList.add('show')
    },
    elem = $.document.querySelector('.modal'),
    opts = {
      hideSelector: '.modal-hide',
      onHide: (target, modal) => {
        switch (Game.getState()) {
          case 'paused':
            Game.resume(); break;
          case 'finished': 
          case false:
            countdown.start(maxSeconds);
            Game.start();
            $.defaultInterval = maxInterval;
            break;
          default: break;
        }

        return false
      },
      scrollTop: true
    }, preload = Preload(), preloader = document.querySelector('.progress-container');
  preload.onprogress = event => {
    preloader.setAttribute('style', `--preloader-progress:${event.progress}%`);
  };
  preload.oncomplete = event => toggleMsgs('start')

  // Register event listeners for the various events.
  countdown.element.addEventListener('paused', event => Game.pause);
  countdown.element.addEventListener('ended', event => {
    Game.finish()
  });
  countdown.element.addEventListener('tick', (e) => {
    let speedupFactor = 1.5 - Math.pow((e.detail.remainingSeconds - minSeconds) / (maxSeconds - minSeconds), power);
    $.defaultInterval = Math.floor(Math.max(
      minInterval,
      $.defaultInterval - speedupFactor - 1
    ));
  });

  var $currentMsg = $.document.querySelector('.show.message'), $playerNameInpt = $.document.querySelector('input[name=player_name]'), $playerAgeInpt = $.document.querySelector('input[name=player_age]'),
    $formBtn = $.document.querySelector('form[name=profile-form] > button'),
    playerInfo = $.localStorage.getItem('player') || false, $userName = $.document.querySelectorAll('.user_name');
  playerInfo = playerInfo ? JSON.parse(playerInfo) : false;
  $.defaultInterval = 2000; // 1 second
  $.tinyModal = new tinyModal(elem, opts);
  $.saveProfile = saveProfile;
  $.submitScore = saveScore;
  $.document.addEventListener('gameScoreChange', (e) => {
    $total.textContent = $score.textContent = e.detail.currentScore;
  });
  $.document.addEventListener('gameStateChange', (e) => {
    switch (e.detail.currentState) {
      case 'finished':
        toggleMsgs(e.detail.currentState)
        $.tinyModal.show()
        break;
      case 'paused':
        toggleMsgs(e.detail.currentState);
        $.tinyModal.show(); break;
      case 'resume':
        countdown.start(countdown.secondsRemaining); break;
      default: if ($.tinyModal.isShown) $.tinyModal.hide(); break;
    }
  });
  $.document.querySelector('form[name=profile-form]').addEventListener("submit", e => {
    e.preventDefault()
    $formBtn.setAttribute('disabled', 'disabled')
    $formBtn.classList.add('submitting')
    $formBtn.textContent = "Sending..."
    saveProfile()
  })
  $.tinyModal.show();
  $.toggleMsg = toggleMsgs;
  $.showLeaderboard = () => {
    $.galaxy.ShowLeaderboard({
      leaderboard_id: LEADERBOARD_ID
    })
  }
  $.galaxy.InitSDK({
    publishableKey: process.env['PUBLIC_KEY'],
  }, (result) => {
    console.log('init', result)
  }, (error) => {
    console.error('not ok', error)
  });

  preload.fetch(['./assets/logo.png', './assets/background.png', './assets/bush2.png', './assets/bush3.png', './assets/ch1.png', './assets/ch3.png', './assets/ch4.png']
  );
  if(playerInfo) {
      setPlayerName(playerInfo.nickname )
      $formBtn.textContent = 'Update';
      $playerNameInpt.value = playerInfo.nickname
      $playerAgeInpt.value = playerInfo.state.age
        }
})(window)