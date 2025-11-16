/**
 * Class for managing mouse input
 */
class Mouse {

  /**
   * Creates a new mouse handler
   * @param {HTMLElement} [container=document.body] - Container element for mouse tracking
   */
  constructor( container = document.body ) {

    this.container = container
    this.isPressed = false
    this.isDown = false
    this.isUp = false
    this.x = 0
    this.y = 0

    this.delay = 60
    this.timer = this.delay
    this.isMove = false
    this.isEmpty = true

    container.addEventListener( `mouseleave`, event => this.changeState( event ) )
    container.addEventListener( `mouseenter`, event => this.changeState( event ) )
    container.addEventListener( `mousemove`,  event => this.changeState( event ) )
    container.addEventListener( `mousedown`,  event => this.changeState( event ) )
    container.addEventListener( `mouseup`,    event => this.changeState( event ) )

  }

  /**
   * Changes mouse state based on event
   * @param {MouseEvent} event - Mouse event
   */
  changeState( event ) {

    const rect = this.container.getBoundingClientRect()

    this.x = event.x - rect.left
    this.y = event.y - rect.top

    if ( event.type === 'mousemove' ) {
      this.timer = this.delay
      this.isMove = true
    }

    if ( event.type === 'mousedown' ) {
      this.isPressed = true
      this.isDown = true
      this.isUp = false

    } else if ( event.type === 'mouseup' || event.type === `mouseleave` ) {
      this.isPressed = false
      this.isDown = false
      this.isUp = true

    }

  }

  /**
   * Updates mouse state
   */
  update() {

    if ( this.timer <= 0 ) {
      this.isEmpty = true
      this.isMove = false

    } else {
      this.timer--

    }

    this.isDown = false
    this.isUp = false

  }

}
