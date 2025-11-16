/**
 * Class for managing canvas layer
 */
class Layer {

  /**
   * Creates a new canvas layer
   * @param {HTMLElement} [container=document.body] - Container for canvas
   */
  constructor( container = document.body ) {

    this.cnv = document.createElement( 'canvas' )
    this.ctx = this.cnv.getContext( '2d' )

    container.appendChild( this.cnv )

    this.resize()
    addEventListener( 'resize', () => this.resize() )

  }

  /**
   * Fits canvas size to container size
   */
  resize() {

    this.w = this.cnv.width  = this.cnv.offsetWidth
    this.h = this.cnv.height = this.cnv.offsetHeight

  }

  /**
   * Clears the canvas
   * @param {Object} [options=this] - Options for clearing
   * @param {CanvasRenderingContext2D} options.ctx - Canvas context
   * @param {number} options.w - Canvas width
   * @param {number} options.h - Canvas height
   */
  clear( { ctx, w, h } = this ) {

    ctx.clearRect( 0, 0, w, h )

  }

}
