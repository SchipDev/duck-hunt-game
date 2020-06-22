class Duck {
    constructor() {
        this.x = 0
        this.y = 0
        this.velocityX = 1
        this.velocityY = 1
        this.collider = []
        this.health = 1
        this.isDead = false;
        this.spriteWidth = scale / 2
        this.spriteHeight = scale / 2
        this.numBounces = 0
        this.pickPositionStart()
        this.pickVelocity()
        this.allowedBounces = 7
        this.canDamage = true
        this.hasEscaped = false
    }

    /************Position and Direction****************/

    pickPositionStart = function () {
        this.x = Math.floor(Math.random() * columns)
        this.y = Math.floor(Math.random() * rows)
    }

    pickVelocity = function () {
        this.velocityX = Math.ceil(Math.random() * 2)
        this.velocityY = Math.ceil(Math.random() * 2)
    }
    /******************************************************/




    /************Movement and Collision****************/

    bounceOffEdge = function (axis) {
        if (this.hasEscaped == false) {
            if (axis === 'y') {
                this.velocityY = -this.velocityY
            }
            else if (axis === 'x') {
                this.velocityX = -this.velocityX
            }
            this.numBounces++
        }
    }

    move = function () {
        this.x += (this.velocityX)
        this.y += (this.velocityY)
        if (this.y + this.velocityY > 50 || this.y - Math.abs(this.velocityY) < 0) {
            this.bounceOffEdge('y')
        }
        if (this.x + this.velocityX > 100 || this.x - Math.abs(this.velocityX) < 0) {
            this.bounceOffEdge('x')
        }
    }

    colliderX = function () {
        return [this.x - this.spriteWidth, this.x + this.spriteWidth]
    }

    colliderY = function () {
        return [this.y - this.spriteHeight, this.y + this.spriteWidth]
    }

    die = function () {
        context.clearRect(this.x * scale, this.y * scale, scale * 9, scale * 9)
        ds1.pause()
        this.isDead = true
        score++
    }

    damage = function (d) {
        if (canDamage) {
            this.health -= d;
            (this.health <= 0) ? this.die() : console.log('not dead')
        }
    }

    escape = function () {
        this.canDamage = false;
        this.velocityX = 3
        this.velocityY = -3
        numLives--
        ds1.pause()
        this.hasEscaped = true

    }
    /***************************************************/





    /************Sprite Rendering and Animation****************/

    draw = function () {
        //context.save();
        //context.translate(canvas.width, 0);
        //context.scale(-1, 1);   
        //context.drawImage(spriteSheet, 0, 120, 36, 36, this.x * scale, this.y * scale, 80, 80)
        //context.restore();
        context.drawImage(spriteSheet, 0, 120, 36, 36, this.x * scale, this.y * scale, 80, 80)
        ds1.play()
    }

    clear = function () {
        context.clearRect(this.x * scale, this.y * scale, scale * 9, scale * 9)
    }

    /**********************************************************/




}