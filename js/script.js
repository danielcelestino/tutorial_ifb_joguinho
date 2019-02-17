(function(){
	var game = new Phaser.Game(340,620,Phaser.AUTO,null,{preload:preload,create:create,update:update});
	var platforms, player, keys, stars,globSndStar,txtScore,score = 0;
	
	function preload(){
		game.load.image('sky','assets/images/sky.png');		
		game.load.image('platform','assets/images/platform.png');	
		game.load.spritesheet('dude','assets/images/dude.png',32,48);
		game.load.image('star','assets/images/star.png');
		
		game.load.image('arrowButton', 'assets/images/arrowButton.png');    
		game.load.image('actionButton', 'assets/images/actionButton.png');

		game.load.audio('sndStar','assets/audio/foom_0.wav');
	}
	
	function create(){
		globSndStar = game.add.audio('sndStar');

		keys = game.input.keyboard.createCursorKeys();
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.add.sprite(0,0,'sky');

		platforms = game.add.group();
		platforms.enableBody = true;

		var platform = platforms.create(0,game.world.height - 60,'platform');
		platform.scale.setTo(2,2);
		platform.body.immovable = true;

		platform = platforms.create(-180,200,'platform');
		platform.body.immovable = true;

		platform = platforms.create(200,400,'platform');
		platform.body.immovable = true;

		stars = game.add.group();
		stars.enableBody = true;

		var star;
		for(var i = 0; i < 12; i++){
			star = stars.create(i*70,0,'star');
			star.body.gravity.y = 300;
			star.body.bounce.y = 0.7 + (Math.random()*0.2);
		}

		player = game.add.sprite(50, game.world.height - 300, 'dude');
		player.frame = 4;
		player.customParams = {};
		
		game.physics.arcade.enable(player);
		player.body.gravity.y = 300;
		player.body.collideWorldBounds = true;
		player.body.bounce.y = 0.2;
		player.animations.add('left',[0,1,2,3],10,true);
		player.animations.add('right',[5,6,7,8],10,true);
		txtScore = game.add.text(16,16,'SCORE: 0',{fontSize:'32px',fill:'#fff'});
		
		leftArrow = game.add.button(20, 565, 'arrowButton');
		rightArrow = game.add.button(110, 565, 'arrowButton');
		actionButton = game.add.button(280, 565, 'actionButton');
		
		actionButton.events.onInputDown.add(function(){
		  player.customParams.mustJump = true;
		}, this);

		actionButton.events.onInputUp.add(function(){
		  player.customParams.mustJump = false;
		}, this);
		
		
		leftArrow.events.onInputDown.add(function(){
		  player.customParams.isMovingLeft = true;
		}, this);

		leftArrow.events.onInputUp.add(function(){
		  player.customParams.isMovingLeft = false;
		}, this);

		leftArrow.events.onInputOver.add(function(){
		  player.customParams.isMovingLeft = true;
		}, this);

		leftArrow.events.onInputOut.add(function(){
		  player.customParams.isMovingLeft = false;
		}, this);
		
		
		 //right
		rightArrow.events.onInputDown.add(function(){
		  player.customParams.isMovingRight = true;
		}, this);

		rightArrow.events.onInputUp.add(function(){
		  player.customParams.isMovingRight = false;
		}, this);

		rightArrow.events.onInputOver.add(function(){
		  player.customParams.isMovingRight = true;
		}, this);

		rightArrow.events.onInputOut.add(function(){
		  player.customParams.isMovingRight = false;
		}, this);
	}
	
	function update(){
        game.physics.arcade.collide(player,platforms);
        game.physics.arcade.collide(stars,platforms);
        game.physics.arcade.overlap(player,stars,collectStar);
        
                
        if(keys.left.isDown || player.customParams.isMovingLeft){
			  player.body.velocity.x = -150;  
			  player.animations.play('left');     
		}else if(keys.right.isDown || player.customParams.isMovingRight){
			  player.body.velocity.x = 150;
			  player.animations.play('right');
		}else{
			   player.body.velocity.x = 0;
			   player.animations.stop();
			   player.frame = 4;
		}
		
		if((keys.up.isDown || player.customParams.mustJump) && player.body.touching.down){
			  player.body.velocity.y = -350;
		}


        
    }


	function collectStar(player,star){
		globSndStar.play();
		star.kill();		 
		score += 10;
		txtScore.text = 'SCORE: ' + score;	
	}


	
	
}());