/**
 * CONTROL - Teclado y Mouse
**/

class Keyboard {

    static keys = new Uint8Array(300);
    static PRESSED = 0x1;
    static OLD = 0x2;
    static NEW = 0x4;

    /**
     * Se llama cuando el usuario presiona una tecla.
     * @param {KeyboardEvent} e El evento
     */
    static onKeyDown(e) {
        this.keys[e.which] |= this.PRESSED;
    }

    /**
     * Se llama cuando el usuario levanta una tecla.
     * @param {KeyboardEvent} e El evento.
     */
    static onKeyUp(e) {
        this.keys[e.which] &= ~this.PRESSED;
        /*
        switch(e.which) {
            case 87: { // W
                mainCamera.move(0, 0, -1);
                break;
            }
            case 83: { // S
                mainCamera.move(0, 0, 1);
                break;
            }
            case 65: { // A
                mainCamera.move(1, 0, 0);
                break;
            }
            case 68: { // D
                mainCamera.move(-1, 0, 0);
                break;
            }
        } /* */
        // ok
        //mainCamera.updateCamera();
        //testDraw();
    }

    static updateKeys() {
        for(let i = 0; i < this.keys.length; i++) {
            // check if pressed
            if(((this.keys[i] & this.PRESSED) === 0) && ((this.keys[i] & this.OLD) !== 0)) {
                // key is not down, but old is still there
                this.keys[i] &= ~this.OLD;
            } else if((this.keys[i] & this.NEW) !== 0) {
                // new kew is pressed after the time.
                this.keys[i] &= ~this.NEW;
            }

            // check if the key is pressed and it's not set as new key
            if(((this.keys[i] & this.PRESSED) !== 0) && ((this.keys[i] & this.OLD) === 0)) {
                // key is down, but old key is not set
                this.keys[i] |= this.OLD;
                this.keys[i] |= this.NEW;
            }
        }
    }

    static isPressed(key) {
        return (this.keys[key] & this.PRESSED) !== 0;
    }

    static isPressedNow(key) {
        return (this.keys[key] & this.NEW) !== 0;
    }

}

/**
 * Representa al mouse.
 */
class Mouse {

    static deltaX = 0;
    static deltaY = 0;

    static blockingMouse = false;

    /**
     * Verifica que el explorador permite bloquear el mouse.
     * @returns {boolean} Si el explorador soporta bloquear mouse.
     */
    static lockingMouseAllowed() {
        return 'pointerLockElement' in document
        || 'mozPointerLockElement' in document
        || 'webkitPointerLockElement' in document;
    }

    static mouseLockChanged() {
        if(Mouse.getLockedElement() === canvas) {
            // on
            if(Mouse.blockingMouse) return;
            Mouse.blockingMouse = true;
            document.onmousemove = Mouse.onMouseMove;
            console.log('mouse bloqueado');
        } else {
            // off
            document.onmousemove = undefined;
            Mouse.blockingMouse = false;
            console.log('mouse desbloqueado');
        }
    }

    /**
     * Regresa el elemento bloqueado. (puede ser nulo!)
     * @returns The locked element.
     */
    static getLockedElement() {
        return document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement;
    }

    /**
     * Le dice al explorador que bloquee el mouse y empieza
     * a recibir los eventos de movimiento.
     */
    static lockMouse() {
        // get the method (browser dependant)
        canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
        canvas.requestPointerLock();
    }

    /**
     * Le dice al explorador que desbloquee el mouse y deja
     * de recibir los eventos de movimiento.
     */
    static unlockMouse() {
        // same, but backwards
        document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
        document.exitPointerLock();
    }

    /**
     * Escucha a los eventos de movimiento del mouse.
     * @param {MouseEvent} e El evento.
     */
    static onMouseMove(e) {
        Mouse.deltaX += e.movementX;
        Mouse.deltaY += e.movementY;
    }

    /**
     * Escucha a los eventos de botones del mouse.
     * Se llama cuando se presiona un botón.
     * @param {MouseEvent} e El evento.
     */
    static onMouseDown(e) {
        
    }

    /**
     * Escucha a los eventos de botones del mouse.
     * Se llama cuando se levanta un botón.
     * @param {MouseEvent} e El evento.
     */
    static onMouseUp(e) {

    }

    static updateMouse() {

    }

    /**
     * Limpia las deltas de la posición del mouse.
     */
    static clearDeltas() {
        this.deltaX = 0;
        this.deltaY = 0;
    }

}

/**
 * Este es el mapa de teclas y variables para el control
 * que tenemos en AVEN.
 */
class Control {

    static DEF_MOVE_SPEED = 1.5;

    static KEY_MOVE_FORWARDS = 87; // W
    static KEY_MOVE_BACKWARDS = 83; // S
    static KEY_MOVE_LEFT = 65; // A
    static KEY_MOVE_RIGHT = 68; // D

    static KEY_JUMP = 32; // espacio
    static KEY_DUCK = 70; // F

    static MOUSE_SENSIBILITY = 0.1;

}

// registra eventos del teclado
document.onkeydown = (e) => { Keyboard.onKeyDown(e); }
document.onkeyup = (e) => { Keyboard.onKeyUp(e); }

// registra eventos del mouse
document.addEventListener('pointerlockchange', Mouse.mouseLockChanged, false);
document.addEventListener('mozpointerlockchange', Mouse.mouseLockChanged, false);
document.addEventListener('webkitpointerlockchange', Mouse.mouseLockChanged, false);
if(!Mouse.lockingMouseAllowed()) alert('Tu explorador no permite bloquear el mouse.');