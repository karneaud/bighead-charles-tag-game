import Game from "./scripts/game";
if(process.env.NODE_ENV != "production") {
    (require('eruda')).init()
}

(($) => {
    Game.start()
})(window)