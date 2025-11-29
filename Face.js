/**
 * Class representing a face (triangle) in the graph
 */
class Face {

  /**
   * Creates a new face
   * @param {Object} layer - Layer object
   * @param {CanvasRenderingContext2D} layer.ctx - Canvas context for rendering
   * @param {Edge} a - First edge
   * @param {Edge} b - Second edge
   * @param {Edge} c - Third edge
   */
  constructor( { ctx }, a, b, c ) {

    this.ctx = ctx
    this.a = a
    this.b = b
    this.c = c

    this.hue = 30
    this.alpha = 0

  }

  /**
   * Updates face transparency and hue based on edges transparency
   * @param {Object} [options=this] - Options for update
   * @param {Edge} options.a - First edge
   * @param {Edge} options.b - Second edge
   * @param {Edge} options.c - Third edge
   */
  update( { a, b, c } = this ) {

    this.hue = ( a.hue + b.hue + c.hue ) / 3

    if ( a.alpha > 0 && b.alpha > 0 && c.alpha > 0 ) {
      return this.alpha = ( a.alpha + b.alpha + c.alpha ) / 30
    }

    this.alpha = 0

  }

  /**
   * Renders the face on canvas
   * @param {Object} [options=this] - Options for rendering
   * @param {CanvasRenderingContext2D} options.ctx - Canvas context
   * @param {Edge} options.a - First edge
   * @param {Edge} options.b - Second edge
   * @param {number} options.alpha - Face transparency
   * @param {number} options.hue - Face hue
   */
  render( { ctx, a, b, alpha, hue } = this ) {

    if ( alpha <= 0 )  return

    ctx.fillStyle = `hsla( ${ hue + 120 }, 100%, 50%, ${ alpha } )`

    ctx.beginPath()
    ctx.moveTo( a.a.x, a.a.y )
    ctx.lineTo( a.b.x, a.b.y )
    ctx.lineTo( b.b.x, b.b.y )
    ctx.closePath()
    ctx.fill()

  }

}
