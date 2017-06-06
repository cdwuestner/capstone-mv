game.BaseSprite = me.Entity.extend({
	init:function(x,y, capture, settings) {

		//call sprite constructor
		this._super(me.Entity, "init", [x,y, {
			image: "bases", 
			width: 32,
			height: 32,
			framewidth: 128,
			frameheight: 128
		}]);

    this.z = 5;

        this.renderable = game.texture.createAnimationFromName([
            "baseDefault", "enemyBase", "playerBase"
        ]);



		this.renderable.scale(.3, .3);

    this.alwaysUpdate = true;

    // define a standing animation (using the first frame)
    this.renderable.addAnimation("baseDefault",  [0]);

    //enemy captured base
    this.renderable.addAnimation("enemy", [1]);

    //player captured base
    this.renderable.addAnimation("player", [2]);


    // set the standing animation as default and the capture flag


    this.capture = capture;



    if(this.capture == "player"){
          this.renderable.setCurrentAnimation("player");
    } else if (this.capture == "enemy") {
      this.renderable.setCurrentAnimation("enemy");
    } else {
      this.renderable.setCurrentAnimation("baseDefault");
    }


    this.body.collisionType = me.collision.types.WORLD_SHAPE;





  },
update : function (dt) {


        // Apply physics
        this.body.update(dt);
        

    // call the parent function
 // this._super(me.Entity, "update", [dt]);
    // handle collisions against other shapes
   me.collision.check(this);
    return true;
 
},
  /**
   * colision handler
   * (called when colliding with other objects)
   */
  onCollision : function (response, other) {

  if(other.body.collisionType === me.collision.types.ENEMY_OBJECT){
                
    this.renderable.setCurrentAnimation("enemy");
    this.capture = "enemy"
    return false;    

           
  } else if(other.body.collisionType === me.collision.types.PLAYER_OBJECT){
        
        this.renderable.setCurrentAnimation("player");
        this.capture = "player";
        return false;

 

  
  }
  return false;
}

   

});
