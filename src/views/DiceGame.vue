<template>
    <div class="hero min-h-screen bg-base-200">
        <div class="hero-content text-center" v-if="state == 'home'">
          <form>
            <div class="space-y-12">              
              <div class="pb-12">
                <h2 class="text-base font-semibold leading-7 text-gray-900">DiceGame</h2>
                <p class="mt-1 text-sm leading-6 text-gray-600">a Simple Dice Game for Multiple Player</p>
                <div class="mt-10">
                  <label for="players" class="block text-sm font-medium leading-6 text-gray-900">Number of Player</label>
                  <div class="mt-2">
                    <input type="number" min="2" max="5" v-model="numPlayers" placeholder="4" class="input input-bordered w-full max-w-xs mb-1" required />
                    <input type="range" v-model="numPlayers" min="1" max="5" class="range range-primary" step="1" />
                    <div class="w-full flex justify-between text-xs px-2">
                      <span>|</span>
                      <span>|</span>
                      <span>|</span>
                      <span>|</span>
                      <span>|</span>
                    </div>
                  </div>
                </div>
                <div class="mt-10">
                  <label for="dices" class="block text-sm font-medium leading-6 text-gray-900">Number of Dice</label>
                  <div class="mt-2">
                    <input type="number" min="2" max="5" v-model="numDices" placeholder="4" class="input input-bordered w-full max-w-xs mb-1" required />
                    <input type="range" v-model="numDices" min="1" max="5" class="range range-secondary" step="1" />
                    <div class="w-full flex justify-between text-xs px-2">
                      <span>|</span>
                      <span>|</span>
                      <span>|</span>
                      <span>|</span>
                      <span>|</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="text-center">
              <button class="btn btn-primary" @click="start()">START</button>
            </div>
          </form>
        </div>
        <div class="hero-content text-center" v-if="state == 'start'">
          <div class="columns-1">
            <h1 class="bg-black-500">PHASE {{ phase }} </h1>
            <div class="my-4 stats stats-vertical lg:stats-horizontal shadow">
              <div class="stat" v-for="(points, key) in playerPoints" :class="colors[key]">
                <div class="stat-title font-bold">Player {{ key }}
                </div>
                <div class="stat-desc my-1">
                  <span class="badge" v-if="turn == key">Turn</span>
                  <span class="badge" v-if="playerDices[key].length == 0">Done</span>
                  <span class="badge badge-success" v-if="winner == key">Winner</span>
                </div>
                <div class="stat-desc my-1">
                  <span class="badge" v-for="dice in playerDices[key]">{{ dice }}</span>
                </div>
                <div class="stat-desc my-1">
                  Points:
                  <span class="badge" v-for="point in points">{{ point }}</span>
                </div>
              </div>
            </div>
            <div class="text-center">
              <button class="btn btn-primary" @click="roll()" v-if="step == 'roll'">Player {{ turn }} Roll Dice</button>
              <button class="btn btn-secondary" @click="evaluate()" v-if="step == 'evaluate'">Evaluate</button>
              <button class="btn btn-info" @click="nextPhase()" v-if="step == 'next'">Next Phase</button>
              <button class="btn btn-success" @click="restart()" v-if="step == 'done'">Restart</button>
            </div>
          </div>
        </div>
    </div>

</template>

<script>
    export default {
      name: "DiceGame",
      data() {
        return {
          colors: {
              "1": "bg-blue-400",
              "2": "bg-teal-500",
              "3": "bg-red-400",
              "4": "bg-green-500",
              "5": "bg-pink-500",
              "6": "bg-black-500",
          },
          deferredPrompt: null,
          showInstall: false,
          state: "home",
          numDices: 3,
          numPlayers: 3,
          playerDices: {},
          playerPoints: {},
          playerDone: [],
          phase: 0,
          turn: 0,
          step: "",
          winner: null,
          winnerScore: 0,
        };
      },
      created() {
        window.addEventListener("beforeinstallprompt", (e) => {
          e.preventDefault();
          // Stash the event so it can be triggered later.
          this.deferredPrompt = e;
          this.showInstall = true;
          console.log('can install');
        });
      },
      methods: {
        async install() {
          this.deferredPrompt.prompt();
        },
        start() {
            this.state = 'start'
            this.nextPhase()
        },
        nextPhase() {
          if (this.phase == 0) {
              this.phase = 1
              this.genDices()
          } else {
            this.phase += 1
            this.resetDices()
          }
          this.nextTurn(true)
          this.step = "roll"
        },
        genDices() {
          var numDices = parseInt(this.numDices)
          for (var i = 1; i <= this.numPlayers; i++) {
              this.playerDices[i] = new Array(numDices).fill(null)
              this.playerPoints[i] = new Array()
              console.log(this.playerDices)
          }
        },
        resetDices() {
          for (var i = 1; i <= this.numPlayers; i++) {
            var numDices = this.playerDices[i].length
            this.playerDices[i] = new Array(numDices).fill(null)
          }
        },
        roll() {
          var key = this.turn
          console.log("turn:", this.turn)
          for (var i = 0; i < this.playerDices[key].length ; i++) {
            if (this.playerDices[key][i] == null) {
              this.playerDices[key][i] = this.randomDice()
              if (i+1 == this.playerDices[key].length) {
                var nextPlayer = this.nextPlayer(key)
                if (nextPlayer < key) {
                  this.toEvaluate()
                } else {
                  this.nextTurn()
                }
              }
              break
            }
          }
        },
        toEvaluate() {
          this.step = 'evaluate'
          this.turn = 0
        },
        nextTurn(reset = false) {
          if (reset) this.turn = 1
          else this.turn += 1
          
          if (this.playerDone.includes(this.turn)) {
            this.nextTurn()
          }
        },
        nextPlayer(player) {
          try {
            var nextPlayer = player == this.numPlayers ? 1 : player+1
            console.log("nextPlayer:", nextPlayer)
            console.log("Done:", this.playerDone)
            if (this.playerDone.includes(nextPlayer) == true) {
              return this.nextPlayer(nextPlayer)
            } else {
              return nextPlayer
            }
          } catch (e) {
            console.error(e)
          }
        },
        randomDice() {
          var max = 6
          var min = 1
          return parseInt(Math.floor(Math.random() * (max - min + 1)) + min);
        },
        evaluate() {
          var toPush = {}
          for (var h = this.numPlayers; h >= 1; h--) {
            var dice = null
            var toSplice = []
            // toPush[h] = []
            for (var i = 0; i < this.playerDices[h].length; i++) {
              dice = this.playerDices[h][i]
              if (dice == 6) {
                this.playerPoints[h].push(dice)
                toSplice.push(i)
              } else if (dice == 1) {
                var nextPlayer = this.nextPlayer(h)
                // this.playerDices[nextPlayer].push(dice)
                if (toPush[nextPlayer] == undefined) toPush[nextPlayer] = []
                toPush[nextPlayer].push(dice)
                toSplice.push(i)
              }
            }
            for (var i = toSplice.length - 1; i >= 0; i--) {
              this.playerDices[h].splice(toSplice[i], 1)
            }
          }
          for (var h = 1; h <= this.numPlayers; h++) {
            if (toPush[h]) {
              this.playerDices[h].push(...toPush[h])
            }
          }
          this.checkDone()
        },
        checkDone() {
          for (var h = 1; h <= this.numPlayers; h++) {
            if (this.playerDices[h].length == 0) {
              if (this.playerDone.includes(h) == false) {
                this.playerDone.push(h)
              } 
            }
          }
          if (this.playerDone.length + 1 == this.numPlayers) {
            console.log("Done: ",this.playerDone)
            this.step = 'done'
            this.getWinner()
            return true
          }
          this.step = 'next'
          return false
        },
        isDone(player) {
          return this.playerDone.includes(player)
        },
        getWinner() {
          var winner = null
          var winnerScore = 0
          for (var h = 1; h <= this.numPlayers; h++) {
            var score = this.playerPoints[h].length
            if (score > winnerScore) {
              winner = h
              winnerScore = score
            }
          }
          this.winner = winner
          this.winnerScore = winnerScore
        },
        restart() {
          this.state = 'home'
          this.turn = 0
          this.phase = 0
          this.winner = null
          this.winnerScore = 0
          this.playerDices = {}
          this.playerPoints = {}
          this.playerDone = []
          this.step = ""
          this.nextPhase()
        }
      }
    };
</script>