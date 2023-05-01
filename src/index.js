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
  const saveScore = () => {
    if (!playerInfo) return toggleMsg("profile")

    $.galaxy.ClientAPI.ReportScore({
      leaderboard_id: '90dd7707-9a0e-4944-9f1f-f432e685b8f4',
      score: 11 //Game.getScore()
    }, (r, e) => {
      console.log('score', r, e)
    })
  }, saveProfile = () => {
    var name = $playerNameInpt.value, age = $playerAgeInpt.value
    if (!name || !age) return toggleMsg('profile');

    $.galaxy.ClientAPI.UpdatePlayerProfile(
      {
        "Nickname": name
      }, (r, e) => {
        console.log('player', r)
        r.data.player_profile.state = { age }
        $.localStorage.setItem('player', JSON.stringify(r.data.player_profile))
        playerInfo = r.data.player_profile
        toggleMsgs('finished')
      })
    playerInfo = { nickname: name, state: { age } }
    $.galaxy.ClientAPI.SaveState({
      state:  { Age: 11 }
    },(r,e) => console.log('state',r,e))
    saveScore()
  }, minInterval = 1000, // Minimum interval in milliseconds
    maxInterval = 3750, // Maximum interval in milliseconds
    minSeconds = 10, // Minimum remaining seconds for maximum speedup
    maxSeconds = 15, // Maximum remaining seconds for minimum speedup
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
    playerInfo = $.localStorage.getItem('player') || false;
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
    $formBtn.textContent = "Sending.."
    saveProfile()
  })
  $.tinyModal.show();
  $.toggleMsg = toggleMsgs;
  $.showLeaderboard = () => {
    $.galaxy.ShowLeaderboard({
      leaderboard_id: '90dd7707-9a0e-4944-9f1f-f432e685b8f4'
    })
  }
  $playerNameInpt.value = playerInfo ? playerInfo.nickname : ''
  $playerAgeInpt.value = playerInfo ? playerInfo.state.age : ''
  $.galaxy.InitSDK({
    publishableKey: 'c952f485-e38d-4406-8e2a-8ff42d0f80e9',
  }, (result) => {
    console.log('init', result)
  }, (error) => {
    console.error('not ok', error)
  });

  setTimeout(() => saveScore(), 6000);
  preload.fetch(['./assets/logo.png', './assets/background.png', './assets/bush2.png', './assets/bush3.png', './assets/ch1.png', './assets/ch3.png', './assets/ch4.png']
  );
})(window)