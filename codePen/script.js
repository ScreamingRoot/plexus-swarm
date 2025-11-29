class Layer {
  constructor( container = document.body ) {
    this.cnv = document.createElement( 'canvas' )
    this.ctx = this.cnv.getContext( '2d' )
    container.appendChild( this.cnv )
    this.resize()
    addEventListener( 'resize', () => this.resize() )
  }

  resize() {
    this.w = this.cnv.width  = this.cnv.offsetWidth
    this.h = this.cnv.height = this.cnv.offsetHeight
  }

  clear( { ctx, w, h } = this ) {
    ctx.clearRect( 0, 0, w, h )
  }
}

class Loop {
  constructor(updateCallback = (deltaTime) => {}) {
    this.updateCallback = updateCallback;
    this.maxDeltaMs = 50;
    this.deltaTime = 0;
    this.lastTime = 0;
    requestAnimationFrame(this.loop);
  }

  loop = (timestamp = 0) => {
    this.deltaTime = Math.min(timestamp - this.lastTime, this.maxDeltaMs);
    this.lastTime = timestamp;
    this.updateCallback(this.deltaTime);
    requestAnimationFrame(this.loop);
  }
}

class Vert {
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
  }
}

class Edge {
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

  update( { a, b, maxLength } = this ) {
    const sdx = ( a.x - b.x ) ** 2
    const sdy = ( a.y - b.y ) ** 2
    this.hue = ( a.hue + b.hue ) / 2
    this.alpha = ( a.alpha + b.alpha ) / 2 - ( sdx + sdy ) / maxLength

    if ( this.alpha > 0 ) return
    this.alpha = 0
  }

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

class Face {
  constructor( { ctx }, a, b, c ) {
    this.ctx = ctx
    this.a = a
    this.b = b
    this.c = c
    this.hue = 30
    this.alpha = 0
  }

  update( { a, b, c } = this ) {
    this.hue = ( a.hue + b.hue + c.hue ) / 3

    if ( a.alpha > 0 && b.alpha > 0 && c.alpha > 0 ) {
      return this.alpha = ( a.alpha + b.alpha + c.alpha ) / 30
    }

    this.alpha = 0
  }

  render( { ctx, a, b, alpha, hue } = this ) {
    if ( alpha <= 0 )  return

    ctx.fillStyle = `hsla( ${ hue +120 }, 100%, 50%, ${ alpha } )`

    ctx.beginPath()
    ctx.moveTo( a.a.x, a.a.y )
    ctx.lineTo( a.b.x, a.b.y )
    ctx.lineTo( b.b.x, b.b.y )
    ctx.closePath()
    ctx.fill()
  }
}

class Plexus {
  constructor( container ) {
    this.layer = new Layer( container )
    this.loop = new Loop( this.animate )
    this.resizeTimer = null
    addEventListener( 'resize', () => {
      clearTimeout( this.resizeTimer )
      this.resizeTimer = setTimeout( () => this.setup(), 500 )
    } )
    this.setup()
  }

  setup( { w, h } = this.layer ) {
    this.count = Math.floor( w * h  / 7000 * ( Math.hypot( w, h ) / ( w + h ) ))
    if ( this.count > 100 ) this.count = 100
    if ( this.count < 30  ) this.count = 30

    this.init()
  }

  init() {
    this.createVerts()
    this.createEdges()
    this.createFaces()
  }

  update(deltaTime) {
    for ( let e of this.verts ) e.update(deltaTime)
    for ( let e of this.edges ) e.update()
    for ( let e of this.faces ) e.update()
  }

  render() {
    this.layer.clear()
    for ( let e of this.edges ) e.render()
    for ( let e of this.verts ) e.render()
    for ( let e of this.faces ) e.render()
  }

  animate = (deltaTime) => {
    this.update(deltaTime)
    this.render()
  }

  createVerts( {w, h} = this.layer ) {
    this.verts = []
    for ( let i = 0 ; i < this.count ; ++i ) {
      const vert = new Vert( this.layer )
      this.verts.push( vert )
    }
  }

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

onload = () => new Plexus( document.body )
