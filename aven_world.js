/**
 * AVEN WORLD - Representa el mundo en
 * el disco y en la memoria.
**/

/**
 * Representa un mundo. El mundo en el cliente es un
 * arreglo de chunks que se van sobreescribiendo
 * conforme el usuario va avanzando.
 */
class World {

    /**
     * Crea un mundo.
     * 
     * @param {number} width El ancho del búfer.
     * @param {number} height El alto del búfer.
     * @param {number} depth El largo del búfer.
     */
    constructor(width, height, depth) {
        // medidas
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.chunks = new Array(width * height * depth);

        // índices
        this.ix = new WrappedIndex(this.width); this.ix.mapIndices = (k,v) => { this.markUpdatePlaneX(k, v); };
        this.iy = new WrappedIndex(this.height); this.iy.mapIndices = (k,v) => { this.markUpdatePlaneY(k, v); };
        this.iz = new WrappedIndex(this.depth); this.iz.mapIndices = (k,v) => { this.markUpdatePlaneZ(k, v); };
    }

    markUpdatePlaneX(key, value) {

    }

    markUpdatePlaneY(key, value) {

    }

    markUpdatePlaneZ(key, value) {

    }

    /**
     * Agarra un chunk desde el arreglo interno, no
     * siguiendo coordenadas convencionales.
     * @param {number} i Índice x
     * @param {number} j Índice y
     * @param {number} k Índice z
     * @returns {Chunk} The chunk at that position.
     */
    getChunkSto(i, j, k) {
        return this.chunks[i + j * this.width + k * this.width * this.height];
    }

}

/**
 * Representa a un índice con un tamaño real finito, pero
 * con un tamaño teórico infinito.
 */
class WrappedIndex {

    /**
     * Crea un nuevo objecto de este tipo.
     * @param {number} w The width of the finite index.
     */
    constructor(w) {
        this.width = w;
        this.startOffset = Math.floor(this.width * 0.5);
        //this.updateOffset = Math.ceil(hw);
    }

    /**
     * Actualiza (indexa) los índices con una posición dada.
     * @param {number} pos La posición.
     */
    indexPosition(pos) {
        // update position and indices
        this.realPosition = pos;

        // map the indices
        let key0 = this.wrap(pos);
        let val0 = pos - this.startOffset;

        // go in the loop
        for(let n = 0; n < this.width; n++) {
            this.mapIndices(key0++ % this.width, val0++);
        }
        // end!
    }

    /**
     * Esta función la debe sobreescribir el código
     * que desee remapear los índices finitos con los
     * infinitos.
     * @param {number} key La llave (índice finito)
     * @param {number} value El valor (índice infinito)
     */
    mapIndices(key, value) {
        // override this
        console.log('finite key "' + key + '" mapped to infinite key "' + value + '"');
    }

    /**
     * Wraps the number to fit in the finite space.
     * @param {number} n The number.
     */
    wrap(n) {
        n %= this.width;
        if(n < 0) n += this.width;
        return n;
    }

}

/**
 * Representa a un chunk.
 */
class Chunk {

    /**
     * Inicializa un chunk.
     * @param {number} cx La coordenada del chunk en X.
     * @param {number} cy La coordenada del chunk en Y.
     * @param {number} cz La coordenada del chunk en Z.
     */
    constructor(cx, cy, cz) {
        this.cx = cx; // guarda las coordenadas
        this.cy = cy;
        this.cz = cz;
        this.blocks = new Uint16Array(16 * 16 * 16);
    }

    /**
     * Actualiza los contenidos de este chunk
     * según sus coordenadas.
     */
    update() {
        // ???
    }

    /**
     * Pone un bloque en el chunk.
     * @param {number} cx The x chunk coordinate (0-15).
     * @param {number} cy The y chunk coordinate (0-15).
     * @param {number} cz The z chunk coordinate (0-15).
     * @param {number} blockID The block ID.
     */
    setBlock(cx, cy, cz, blockID) {
        this.blocks[cx + 16 * cy + 256 * cz] = blockID;
    }

    /**
     * Obtiene un bloque.
     * @param {number} cx The x chunk coordinate (0-15).
     * @param {number} cy The y chunk coordinate (0-15).
     * @param {number} cz The z chunk coordinate (0-15).
     * @returns {number} The block ID.
     */
    getBlock(cx, cy, cz) {
        return this.blocks[cx + 16 * cy + 256 * cz];
    }

}