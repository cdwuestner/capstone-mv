// Skeleton Entity
game.SkeletonEntity = me.Entity.extend({
    // Constructor
    init : function(x, y, settings){
        // Call super (Entity) constructor
        this._super(me.Entity, "init", [x, y, {
            image: "skeleton",
            width: 25.6,
            height: 31.3
        }]);
        // Layer
        this.z = 5;
        // Update even outside viewport
        this.alwaysUpdate = true;
        // Set movement speed
        this.body.setVelocity(.5, .5);
        // Set collision type
        this.body.collisionType = me.collision.types.ENEMY_OBJECT;

        this.inBattle = false;
        this.attackCastle = false;
        this.defendCastle = false;
        this.goToBaseOne = false;
        this.goToBaseTwo = false;
        this.goToBaseThree = false;
        // Add all animations and set at "idle"
        this.addAnimations();
        this.renderable.setCurrentAnimation("idle");
        // Set some starting stats
        this.xp = 0;
        this.level = 1;
        this.maxHealth = 105;
        this.curHealth = 105;
        this.attack = 50;
    },

    update : function(dt){
        if(this.inBattle){
            this.body.vel.x = 0;
            this.body.vel.y = 0;
        }else{
            if(this.attackCastle){
                if(this.pos.x > 75){
                    this.body.vel.x -= this.body.accel.x * me.timer.tick;
                }else{
                    this.body.vel.x = 0;
                }
                if(this.pos.y > 240){
                    this.body.vel.y -= this.body.accel.y * me.timer.tick;
                }else if(this.pos.y < 200){
                    this.body.vel.y += this.body.accel.y * me.timer.tick;
                }else{
                    this.body.vel.y = 0;
                }
            }else if(this.defendCastle){
                if(this.pos.x < 510){
                    this.body.vel.x += this.body.accel.x * me.timer.tick;
                }else{
                    this.body.vel.x = 0;
                }
                if(this.pos.y > 240){
                    this.body.vel.y -= this.body.accel.y * me.timer.tick;
                }else if(this.pos.y < 200){
                    this.body.vel.y += this.body.accel.y * me.timer.tick;
                }else{
                    this.body.vel.y = 0;
                }
            }else if(this.goToBaseOne || this.goToBaseTwo || this.goToBaseThree){
                if(this.pos.x > 310){
                    this.body.vel.x -= this.body.accel.x * me.timer.tick;
                }else if(this.pos.x < 310){
                    this.body.vel.x += this.body.accel.x * me.timer.tick;
                }else{
                    this.body.vel.x = 0;
                }
                if(this.goToBaseOne){
                    if(this.pos.y > 30){
                        this.body.vel.y -= this.body.accel.y * me.timer.tick;
                    }else if(this.pos.y < 30){
                        this.body.vel.y += this.body.accel.y * me.timer.tick;
                    }else{
                        this.body.vel.y = 0;
                    }
                }else if(this.goToBaseTwo){
                    if(this.pos.y > 225){
                        this.body.vel.y -= this.body.accel.y * me.timer.tick;
                    }else if(this.pos.y < 225){
                        this.body.vel.y += this.body.accel.y * me.timer.tick;
                    }else{
                        this.body.vel.y = 0;
                    }
                }else if(this.goToBaseThree){
                    if(this.pos.y > 410){
                        this.body.vel.y -= this.body.accel.y * me.timer.tick;
                    }else if(this.pos.y < 410){
                        this.body.vel.y += this.body.accel.y * me.timer.tick;
                    }else{
                        this.body.vel.y = 0;
                    }
                }
            }
        }
        // Display correct animations
        this.animate();
        // Apply physics
        this.body.update(dt);
        // Handle any collisions
        me.collision.check(this);
        // Only update position if entity has moved
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x != 0 || 
                this.body.vel.y != 0);
    },

    addAnimations : function(){
        this.renderable.addAnimation("idle", [65]);
        this.renderable.addAnimation("walk", [39, 40, 41, 42, 43, 44, 45, 46],
                300);
        this.renderable.addAnimation("up", [26, 27, 28, 29, 30, 31, 32, 33], 
                300);
        this.renderable.addAnimation("down", [13, 14, 15, 16, 17, 18, 19, 20], 
                300);
    },

    animate : function(){
        if(this.body.vel.x > 0){
            this.renderable.flipX(true);
            if(!this.renderable.isCurrentAnimation("walk")){
                this.renderable.setCurrentAnimation("walk");
            }
        }else if(this.body.vel.x < 0){
            this.renderable.flipX(false);
            if(!this.renderable.isCurrentAnimation("walk")){
                this.renderable.setCurrentAnimation("walk");
            }
        }else if(this.body.vel.y < 0){
            if(!this.renderable.isCurrentAnimation("up")){
                this.renderable.setCurrentAnimation("up");
            }
        }else if(this.body.vel.y > 0){
            if(!this.renderable.isCurrentAnimation("down")){
                this.renderable.setCurrentAnimation("down");
            }
        }else{
            if(!this.renderable.isCurrentAnimation("idle")){
                this.renderable.setCurrentAnimation("idle");
            }
        }
    },

    levelUp : function(){
        this.level++;
        this.updateStats(this.level);
        this.xp = 0;
    },

    updateStats : function(level){
        this.maxHealth = level * 105;
        this.curHealth = this.maxHealth;
        this.attack = level * 50;
    },

    onCollision : function(response, other){
        if(other.body.collisionType === me.collision.types.PLAYER_OBJECT){
            // Filter collision detection with enemies
            this.body.setCollisionMask(me.collision.types.PLAYER_OBJECT);
            // Battle
            this.inBattle = true;
            // Random damage based on attack of other
            this.curHealth -= Math.floor(Math.random() * other.attack);
            if(this.curHealth <= 0){
                this.alive = false;
                me.game.world.removeChild(this);
            }
            console.log("skeleton curHealth:" + this.curHealth);
            this.xp += 25;
            if(this.xp % 100 == 0){
                this.levelUp();
            }
            this.y = this.pos.y;
            // Move the skeleton back a bit so that the battle ends
            this.pos.x = this.pos.x + 10;
            this.x = this.pos.x;
            this.inBattle = false;
            // Disable collision filter
            this.body.setCollisionMask(me.collision.types.ALL_OBJECT);
        }
        return false;
    }
});