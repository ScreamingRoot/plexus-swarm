/**
 * Class representing an edge in the graph
 */
class Edge {

  /**
   * Creates a new edge
   * @param {Object} layer - Layer object
   * @param {CanvasRenderingContext2D} layer.ctx - Canvas context for rendering
   * @param {number} layer.w - Canvas width
   * @param {number} layer.h - Canvas height
   * @param {Vert} a - First vertex
   * @param {Vert} b - Second vertex
   */
  constructor( { ctx, w, h }, a, b ) {

    this.ctx = ctx
    this.a = a
    this.b = b

    this.hue = 0
    this.alpha = 0

    this.maxWidth = 4

    this.max = 200
    let fa = w/(w+h) * this.max
    let fb = h/(w+h) * this.max
    this.maxLength = (Math.max(fa, fb) * Math.random() + Math.min(fa, fb) ) ** 2

  }

  /**
   * Updates edge transparency and hue based on distance between vertices
   * @param {Object} [options=this] - Options for update
   * @param {Vert} options.a - First vertex
   * @param {Vert} options.b - Second vertex
   * @param {number} options.maxLength - Maximum edge length
   */
  update( { a, b, maxLength } = this ) {

    const sdx = ( a.x - b.x ) ** 2
    const sdy = ( a.y - b.y ) ** 2
    this.hue = ( a.hue + b.hue ) / 2
    this.alpha = ( a.alpha + b.alpha ) / 2 - ( sdx + sdy ) / maxLength

    if ( this.alpha > 0 ) return
    this.alpha = 0

  }

  /**
   * Renders the edge on canvas
   * @param {Object} [options=this] - Options for rendering
   * @param {CanvasRenderingContext2D} options.ctx - Canvas context
   * @param {Vert} options.a - First vertex
   * @param {Vert} options.b - Second vertex
   * @param {number} options.hue - Edge hue
   * @param {number} options.alpha - Edge transparency
   * @param {number} options.maxWidth - Maximum edge width
   */
  render( { ctx, a, b, hue, alpha, maxWidth } = this ) {

    if ( alpha <= 0 ) return

    ctx.lineWidth = alpha * maxWidth
    ctx.strokeStyle = `hsla( ${ hue + 10 }, 100%, 50%, ${ alpha } )`

    ctx.beginPath()
    ctx.moveTo( a.x, a.y )
    ctx.lineTo( b.x, b.y )
    ctx.stroke()

  }
}
