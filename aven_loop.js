/**
 * Aquí está el bucle del juego.
**/
let pos = 0;
;(function() {
    let last = 0;
    function main(tFrame) {
        window.stopGame = window.requestAnimationFrame(main);

        //Call your update method. In our case, we give it rAF's timestamp.
        updateGame(tFrame - last);
        last = tFrame;
        renderGame();
    }
    initGame();
    main(); // Start the cycle
})();

function initGame() {

}

/**
 * Actualiza la información del juego.
 * @param {number} ms El tiempo transcurrido en ms.
 */
function updateGame(ms) {
    // update keys
    Keyboard.updateKeys();
    let timeperc = ms / 1000;
    let moveSpd = Control.DEF_MOVE_SPEED * timeperc;

    // update camera first
    mainCamera.rotate(Mouse.deltaX * Control.MOUSE_SENSIBILITY, -Mouse.deltaY * Control.MOUSE_SENSIBILITY);
    mainCamera.updateCamera();

    // checa las teclas
    if(Keyboard.isPressed(Control.KEY_MOVE_FORWARDS)) {
        // mueve hacia adelante
        mainCamera.move(0, 0, -moveSpd);
    }
    if(Keyboard.isPressed(Control.KEY_MOVE_BACKWARDS)) {
        // mueve hacia atrás
        mainCamera.move(0, 0, moveSpd);
    }
    if(Keyboard.isPressed(Control.KEY_MOVE_LEFT)) {
        // mueve hacia la izq
        mainCamera.move(moveSpd, 0, 0);
    }
    if(Keyboard.isPressed(Control.KEY_MOVE_RIGHT)) {
        // mueve hacia la derecha
        mainCamera.move(-moveSpd, 0, 0);
    }

    // control del mouse
    if(Keyboard.isPressedNow(77)) {
        Mouse.lockMouse();
    }

    Mouse.clearDeltas();
}

function renderGame() {
    testDraw();
}