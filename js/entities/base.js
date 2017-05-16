game.BaseSprite = me.Entity.extend({
	init:function(x,y, settings) {

		//call sprite constructor
		this._super(me.Entity, "init", [x,y, {
			image: "enemyBase.png", 
			width: 16,
			height: 16,
			framewidth: 128,
			frameheight: 128
		}]);

		this.renderable.scale(.3, .3);

    // handle collisions against other shapes
    me.collision.check(this);




    //set collision type
    this.body.collisionType = me.collision.types.WORLD_SHAPE;
    this.inBattle = false;

//	this.renderable = game.texture.createAnimationFromName([
    
  //  	"base/walk/0001"
//	]);

	    this.alwaysUpdate = true;

  },
update : function (dt) {

    // call the parent function
    this._super(me.Entity, "update", [dt]);

    return true;
},
  /**
   * colision handler
   * (called when colliding with other objects)
   */
  onCollision : function (response, other) {
        if(other.body.collisionType === me.collision.types.ENEMY_OBJECT){
            // Filter collision detection with enemies
            this.body.setCollisionMask(me.collision.types.ENEMY_OBJECT);
            // Battle
            this.inBattle = true;

//            this.renderable.setCurrentAnimation("enemy");
            }  	

    // Make all other objects solid
    return true; 
  } 
});
