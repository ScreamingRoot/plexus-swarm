/**
 * Class representing a vertex in the graph
 */
class Vert {

  /**
   * Creates a new vertex
   * @param {Object} layer - Layer object
   * @param {CanvasRenderingContext2D} layer.ctx - Canvas context for rendering
   * @param {number} layer.w - Canvas width
   * @param {number} layer.h - Canvas height
   */
  constructor( { ctx, w, h } ) {

    this.ctx = ctx
    this.w = w
    this.h = h

    this.x = Math.random() * this.w
    this.y = Math.random() * this.h

    this.angle = Math.random() * Math.PI * 2
    this.alphay = Math.random() * Math.PI * 2
    this.velx = 0
    this.vely = 0

    this.radius = 1 + Math.random() * 2
    this.hue = 35

  }

  /**
   * Updates the vertex position and properties
   * @param {number} deltaTime - Time elapsed since the last frame in milliseconds
   * @param {Object} [options=this] - Options for update
   * @param {number} options.w - Canvas width
   * @param {number} options.h - Canvas height
   * @param {number} options.angle - Current angle
   * @param {number} options.x - Current x position
   * @param {number} options.y - Current y position
   */
  update( deltaTime, { w, h, angle, x, y } = this ) {

    if ( x > w) { this.velx = ( this.velx - .1 ) % 3 }
    if ( x < 0) { this.velx = ( this.velx + .1 ) % 3 }

    if ( y > h) { this.vely = ( this.vely - .1 ) % 3 }
    if ( y < 0) { this.vely = ( this.vely + .1 ) % 3 }

    deltaTime *= .2
    this.x += ( this.velx * .7 + Math.cos( angle ) ) * deltaTime
    this.y += ( this.vely * .7 + Math.sin( angle ) ) * deltaTime

    this.angle += ( Math.random() - .5 ) * .5 * deltaTime

    this.alphay += Math.random() * .01 * deltaTime
    this.alpha = Math.abs( Math.sin( this.alphay ) )

  }

  /**
   * Renders the vertex on canvas
   * @param {Object} [options=this] - Options for rendering
   * @param {CanvasRenderingContext2D} options.ctx - Canvas context
   * @param {number} options.x - X coordinate
   * @param {number} options.y - Y coordinate
   * @param {number} options.radius - Vertex radius
   * @param {number} options.hue - Vertex hue
   */
  render( { ctx, x, y, radius, hue } = this ) {

    ctx.fillStyle = `hsla( ${ hue - this.alpha * 10 }, 100%, 50%, ${ this.alpha } )`
    ctx.beginPath()
    ctx.arc( x, y, radius * 1.7 + 1, 0, 7 )
    ctx.fill()

    ctx.fillStyle = `hsla( ${ hue + this.alpha * 10 }, 100%, 50%, ${ this.alpha } )`
    ctx.strokeStyle = `hsla( ${ hue + this.alpha * 10 }, 100%, 50%, ${ this.alpha } )`
    ctx.lineWidth = 1.5

    ctx.beginPath()
    ctx.arc( x, y, radius * this.alpha + 1, 0, 7 )
    ctx.fill()


    // ctx.beginPath()
    // ctx.arc( x, y, radius * 2 + 1, 0 + this.alphay, this.alphay + 7 * this.alpha )
    // ctx.stroke()

  }

}
