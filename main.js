import kaboom from "kaboom";

kaboom({
  width: 1280,
  height: 720,
  scale: 0.7,
  debug: false,
});


loadSprite("background", "/background/background_layer_1.png");
loadSprite("trees", "/background/background_layer_2.png");
loadSpriteAtlas( "/public/oak_woods_tileset.png", {
  "ground-golden": {
    x: 16,
    y: 0,
    width: 16,
    height: 16,
  },
  "deep-ground": {
    x: 16,
    y: 32,
    width: 16,
    height: 16,
  },
  "ground-silver": {
    x: 150,
    y: 0,
    width: 16,
    height: 16,
  },
});

loadSprite("shop", "/public/shop_anim.png", {
  sliceX: 6,
  sliceY: 1,
  anims: {
    default: {
      from: 0,
      to: 5,
      speed: 12,
      loop: true,
    },
  },
});

loadSprite("fence", "/fence_1.png");
loadSprite("sign", "/sign.png");

loadSprite("idle-player1", "/idle-player1.png", {
  sliceX: 8,
  sliceY: 1,
  anims: { idle: { from: 0, to: 7, speed: 12, loop: true } },
});
loadSprite("run-player1", "/run-player1.png", {
  sliceX: 8,
  sliceY: 1,
  anims: { run: { from: 0, to: 7, speed: 18 } },
});

loadSprite("jump-player1", "/jump-player1.png", {
  sliceX: 2,
  sliceY: 1,
  anims: { jump: { from: 0, to: 1, speed: 2, loop: true } },
});
loadSprite("attack-player1", "/attack-player1.png", {
  sliceX: 6,
  sliceY: 1,
  anims: { attack: { from: 1, to: 5, speed: 18 } },
});

loadSprite("death-player1", "/death-player1.png", {
  sliceX: 6,
  sliceY: 1,
  anims: { death: { from: 0, to: 5, speed: 10 } },
});


// player 2 sprites

loadSprite("idle-player2", "/idle-player2.png", {
  sliceX: 4,
  sliceY: 1,
  anims: { idle: { from: 0, to: 3, speed: 8, loop: true } },
});
loadSprite("jump-player2", "/jump-player2.png", {
  sliceX: 2,
  sliceY: 1,
  anims: { jump: { from: 0, to: 1, speed: 2, loop: true } },
});
loadSprite("attack-player2", "/attack-player2.png", {
  sliceX: 4,
  sliceY: 1,
  anims: { attack: { from: 0, to: 3, speed: 18 } },
});
loadSprite("run-player2", "/run-player2.png", {
  sliceX: 8,
  sliceY: 1,
  anims: { run: { from: 0, to: 7, speed: 18 } },
});
loadSprite("death-player2", "/death-player2.png", {
  sliceX: 7,
  sliceY: 1,
  anims: { death: { from: 0, to: 6, speed: 10 } },
});
// make scene here
scene ("fight", () => {
  const background = add([sprite("background"), scale(4)]);
  background.add([sprite("trees")]);
  const groundTiles = addLevel(
    [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "------#######-----------",
      "dddddddddddddddddddddddd",
      "dddddddddddddddddddddddd",
    ],
    {
      tileWidth: 16,
      tileHeight: 16,
      tiles: {
        "#": () => [sprite("ground-golden"), area(), body({ isStatic: true })],
        "-": () => [sprite("ground-silver"), area(), body({ isStatic: true })],
        d: () => [sprite("deep-ground"), area(), body({ isStatic: true })],
      },
    }
  );
  groundTiles.use(scale(4));

  const shop = background.add([sprite("shop"), pos(170, 15)]);

  shop.play("default");
  background.add([sprite("fence"), pos(85, 125)]);

  background.add([sprite("fence"), pos(10, 125)]);

  background.add([sprite("sign"), pos(290, 115)]);

  // for invisible walls ( prevent not run outside scene)
  add([rect(16, 720), area(), body({ isStatic: true }), pos(-20, 0)]);
  add([rect(16, 720), area(), body({ isStatic: true }), pos(1280, 0)]);

  function makePlayer(posX, posY, width, height, scaleFactor, id) {
    return add([
      pos(posX, posY),
      scale(scaleFactor),
      area({ shape: new Rect(vec2(0), width, height) }),
      anchor("center"),
      body({ stickToPlatform: true }),
      {
        isCurrentlyJumping: false,
        health: 500,
        sprites: {
          run: "run-" + id,
          idle: "idle-" + id,
          jump: "jump-" + id,
          attack: "attack-" + id,
          death: "death-" + id,
        },
      },
    ]);
  }

  setGravity(1200);

  const player1 = makePlayer(200, 100, 16, 42, 4, "player1");
  player1.use(sprite(player1.sprites.idle));
  player1.play("idle");
  function run(player, speed, flipPlayer) {
    if (player.health === 0) {
      return;
    }

    if (player.curAnim() !== "run" && !player.isCurrentlyJumping) {
      player.use(sprite(player.sprites.run));
      player.play("run");
    }
    player.move(speed, 0);
    player.flipX = flipPlayer;
  }
  function resetPlayerToIdle(player) {
    player.use(sprite(player.sprites.idle));
    player.play("idle");
  }
  onKeyDown("d", () => {
    run(player1, 500, false);
  });
  onKeyRelease("d", () => {
    if (player1.health !== 0) {
      resetPlayerToIdle(player1);
      player1.flipX = false;
    }
  });

  onKeyDown("a", () => {
    run(player1, -500, true);
  });
  onKeyRelease("a", () => {
    if (player1.health !== 0) {
      resetPlayerToIdle(player1);
      player1.flipX = true;
    }
  });
   function makeJump(player) {
     if (player.health === 0) {
       return;
     }

     if (player.isGrounded()) {
       const currentFlip = player.flipX;
       player.jump();
       player.use(sprite(player.sprites.jump));
       player.flipX = currentFlip;
       player.play("jump");
       player.isCurrentlyJumping = true;
     }
   }

   function resetAfterJump(player) {
     if (player.isGrounded() && player.isCurrentlyJumping) {
       player.isCurrentlyJumping = false;
       if (player.curAnim() !== "idle") {
         resetPlayerToIdle(player);
       }
     }
   }
   onKeyDown("w", () => {
     makeJump(player1);
   });

   player1.onUpdate(() => resetAfterJump(player1));
    function attack(player, excludedKeys) {
      if (player.health === 0) {
        return;
      }

      for (const key of excludedKeys) {
        if (isKeyDown(key)) {
          return;
        }
      }

      const currentFlip = player.flipX;
      if (player.curAnim() !== "attack") {
        player.use(sprite(player.sprites.attack));
        player.flipX = currentFlip;
        const slashX = player.pos.x + 30;
        const slashXFlipped = player.pos.x - 350;
        const slashY = player.pos.y - 200;

        add([
          rect(300, 300),
          area(),
          pos(currentFlip ? slashXFlipped : slashX, slashY),
          opacity(0),
          player.id + "attackHitbox",
        ]);

        player.play("attack", {
          onEnd: () => {
            resetPlayerToIdle(player);
            player.flipX = currentFlip;
          },
        });
      }
    }
    // SPACE TO ATTACK
     onKeyPress("space", () => {
       attack(player1, ["a", "d", "w"]);
     });

     onKeyRelease("space", () => {
       destroyAll(player1.id + "attackHitbox");
     });
     // init player 2
     const player2 = makePlayer(1000, 200, 16, 52, 4, "player2");
     player2.use(sprite(player2.sprites.idle));
     player2.play("idle");
     player2.flipX = true;

     onKeyDown("right", () => {
       run(player2, 500, false);
     });
     onKeyRelease("right", () => {
       if (player2.health !== 0) {
         resetPlayerToIdle(player2);
         player2.flipX = false;
       }
     });
     onKeyDown("left", () => {
       run(player2, -500, true);
     });
     onKeyRelease("left", () => {
       if (player2.health !== 0) {
         resetPlayerToIdle(player2);
         player2.flipX = true;
       }
     });

     onKeyDown("up", () => {
       makeJump(player2);
     });

     player2.onUpdate(() => resetAfterJump(player2));

     onKeyPress("down", () => {
       attack(player2, ["left", "right", "up"]);
     });

     onKeyRelease("down", () => {
       destroyAll(player2.id + "attackHitbox");
     });

     const counter = add([
       rect(100, 100),
       pos(center().x, center().y - 300),
       color(10, 10, 10),
       area(),
       anchor("center"),
     ]);

     const count = counter.add([
       text("60"),
       area(),
       anchor("center"),
       {
         timeLeft: 60,
       },
     ]);

      const winningText = add([
        text(""),
        area(),
        anchor("center"),
        pos(center()),
      ]);

      let gameOver = false;
      onKeyDown("enter", () => (gameOver ? go("fight") : null));

       function declareWinner(winningText, player1, player2) {
         if (
           (player1.health > 0 && player2.health > 0) ||
           (player1.health === 0 && player2.health === 0)
         ) {
           winningText.text = "Tie!";
         } else if (player1.health > 0 && player2.health === 0) {
           winningText.text = "Player 1 won!";
           player2.use(sprite(player2.sprites.death));
           player2.play("death");
         } else {
           winningText.text = "Player 2 won!";
           player1.use(sprite(player1.sprites.death));
           player1.play("death");
         }
       }

       const countInterval = setInterval(() => {
         if (count.timeLeft === 0) {
           clearInterval(countInterval);
           declareWinner(winningText, player1, player2);
           gameOver = true;

           return;
         }
         count.timeLeft--;
         count.text = count.timeLeft;
       }, 1000);




     // health bar for player 1 and 2
      const player1HealthContainer = add([
        rect(500, 70),
        area(),
        outline(5),
        pos(90, 20),
        color(200, 0, 0),
      ]);

      const player1HealthBar = player1HealthContainer.add([
        rect(498, 65),
        color(0, 180, 0),
        pos(498, 70 - 2.5),
        rotate(180),
      ]);

      player1.onCollide(player2.id + "attackHitbox", () => {
        if (gameOver) {
          return;
        }

        if (player1.health !== 0) {
          player1.health -= 50;
          tween(
            player1HealthBar.width,
            player1.health,
            1,
            (val) => {
              player1HealthBar.width = val;
            },
            easings.easeOutSine
          );
        }

        if (player1.health === 0) {
          clearInterval(countInterval);
          declareWinner(winningText, player1, player2);
          gameOver = true;
        }
      });

      const player2HealthContainer = add([
        rect(500, 70),
        area(),
        outline(5),
        pos(690, 20),
        color(200, 0, 0),
      ]);

      const player2HealthBar = player2HealthContainer.add([
        rect(498, 65),
        color(0, 180, 0),
        pos(2.5, 2.5),
      ]);

      player2.onCollide(player1.id + "attackHitbox", () => {
        if (gameOver) {
          return;
        }

        if (player2.health !== 0) {
          player2.health -= 50;
          tween(
            player2HealthBar.width,
            player2.health,
            1,
            (val) => {
              player2HealthBar.width = val;
            },
            easings.easeOutSine
          );
        }

        if (player2.health === 0) {
          clearInterval(countInterval);
          declareWinner(winningText, player1, player2);
          gameOver = true;
        }
      });

})

go ("fight")




// electron set up 


// import { app, BrowserWindow } from "electron";
// import path from "path";

// Create the main window
// function createWindow() {
//   const mainWindow = new BrowserWindow({
//     width: 1280,
//     height: 720,
//     webPreferences: {
//       preload: path.join(__dirname, "preload.js"), // optional, if you need a preload script
//     },
//   });
//   win.loadURL("https://www.google.com");
//   win.loadFile(path.join(__dirname, "index.html"));

//   // Load your HTML file or game
//   // mainWindow.loadFile(path.join(__dirname, "index.html")); // Adjust this if you have a different entry point
// }

// // When Electron is ready, create the window
// app.whenReady().then(() => {
//   createWindow();

//   // Quit the app when all windows are closed
//   app.on("window-all-closed", () => {
//     if (process.platform !== "darwin") {
//       app.quit();
//     }
//   });

//   // Re-create the window on macOS when clicking the app icon in the dock
//   app.on("activate", () => {
//     if (BrowserWindow.getAllWindows().length === 0) {
//       createWindow();
//     }
//   });
// });

// // Quit the app if it is closed in the background
// app.on("before-quit", () => {
//   app.quit();
// });
