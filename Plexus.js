/**
 * Main class for creating and managing graph animation
 */
class Plexus {

  /**
   * Creates a new Plexus instance
   * @param {HTMLElement} container - Container for canvas
   */
  constructor( container ) {

    this.layer = new Layer( container )
    this.mouse = new Mouse( container )
    this.loop = new Loop( this.animate )

    addEventListener( 'resize', () => this.setup() )
    this.setup()

  }

  /**
   * Calculates approximate distance using optimized algorithm
   * @param {number} dx - X distance
   * @param {number} dy - Y distance
   * @returns {number} Approximate distance
   */
  dist( dx, dy ) {

    dx = Math.abs( dx )
    dy = Math.abs( dy )

    return dx < dy ? ( 123 * dy + 51 * dx ) / 128 | 0  : ( 123 * dx + 51 * dy ) / 128 | 0

  }

  /**
   * Sets up the graph with calculated vertex count
   * @param {Object} [options=this.layer] - Layer options
   * @param {number} options.w - Canvas width
   * @param {number} options.h - Canvas height
   */
  setup( { w, h } = this.layer ) {

    // this.maxInterval = 40
    // this.lastUpdate = 0
    // this.deltaTime = 0

    this.count = Math.floor( w * h  / 7000 * ( Math.hypot( w, h ) / ( w + h ) ))
    if ( this.count > 100 ) this.count = 100
    if ( this.count < 30  ) this.count = 30

    console.log( `verts: ${ this.count }` )
    console.log( `edges: ${ this.count * ( this.count - 1 ) / 2 }` )
    console.log( `faces: ${ this.count * ( this.count - 1 ) * ( this.count - 2 ) / 6 }` )

    this.init()
  }

  /**
   * Initializes vertices, edges and faces
   */
  init() {


    this.createVerts()
    this.createEdges()
    this.createFaces()

  }

  /**
   * Updates all graph elements
   * @param {number} deltaTime - Time elapsed since the last frame in milliseconds
   */
  update(deltaTime) {

    for ( let e of this.verts ) e.update(deltaTime)
    for ( let e of this.edges ) e.update()
    for ( let e of this.faces ) e.update()

    // this.mouse.update()

  }

  /**
   * Renders all graph elements
   */
  render() {

    this.layer.clear()

    for ( let e of this.edges ) e.render()
    for ( let e of this.verts ) e.render()
    for ( let e of this.faces ) e.render()

  }

  /**
   * Main animation loop
   * @param {number} deltaTime - Time elapsed since the last frame in milliseconds
   */
  animate = (deltaTime) => {
    this.update(deltaTime)
    this.render()
  }

  /**
   * Creates vertices
   * @param {Object} [options=this.layer] - Layer options
   * @param {number} options.w - Canvas width
   * @param {number} options.h - Canvas height
   */
  createVerts( {w, h} = this.layer ) {

    this.verts = []

    for ( let i = 0 ; i < this.count ; ++i ) {
      const vert = new Vert( this.layer, this.mouse, this )
      this.verts.push( vert )

    }

  }

  /**
   * Creates edges between all vertices
   */
  createEdges() {

    this.edges = []

    for ( let i = 0 ; i < this.count ; ++i ) {
      const vertA = this.verts[ i ]

      for ( let j = i + 1 ; j < this.count ; ++j ) {
        const vertB = this.verts[ j ]

        const edge = new Edge( this.layer, vertA, vertB )
        this.edges.push( edge )

      }
    }

  }

  /**
   * Creates faces from edges
   */
  createFaces() {

    this.faces = []

    for ( let i = 0 ; i < this.count ; ++i ) {
      const vertA = this.verts[ i ]

      for ( let j = i + 1 ; j < this.count ; ++j ) {
        const vertB = this.verts[ j ]
        const edgeAB = this.edges.find( e => e.a == vertA && e.b == vertB )

        for ( let k = j + 1 ; k < this.count ; ++k ) {
          const vertC = this.verts[ k ]
          const edgeBC = this.edges.find( e => e.a == vertB && e.b == vertC )
          const edgeAC = this.edges.find( e => e.a == vertA && e.b == vertC )

          const face = new Face( this.layer, edgeAB, edgeBC, edgeAC )
          this.faces.push( face )

        }
      }
    }

  }
}

// onload = () => new Plexus(  )
onload = () => new Plexus( document.querySelector('div') )
