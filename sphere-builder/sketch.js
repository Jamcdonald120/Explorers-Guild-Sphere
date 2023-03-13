world = new WorldCord()
cx=0;
cy=0;
var controles=!document.cookie.includes("controles") ;
var mode =1;
document.cookie = "controles; expires="+(new Date(Date.now() + 86400e3)).toUTCString();
const  radius=384;
selected=126
function neighbors(arr,x,y,z){
	let count=0;
	if(x>0&&arr[x-1][y][z])count++;
    if(y>0&&arr[x][y-1][z])count++;
    if(z>0&&arr[x][y][z-1])count++;
    if(x<radius*2-1&&arr[x+1][y][z])count++;
    if(y<radius*2-1&&arr[x][y+1][z])count++;
    if(z<radius-1&&  arr[x][y][z+1])count++;
    return count;
}
function setup() {
	createCanvas(windowWidth, windowHeight);
	x=width/2;
	y=height/2;
}
function keyPressed(){
	if(key==' '){
		controles=true;
	}
}
function keyReleased(){
	if(key==' '){
		controles=false;
	}
}
function drawSquare(x,y,selectp){
	try{
		if(depths[x][y]!=-1){
			let drawAt=worldToScreen(x,y);
			noStroke();
			if(blocks[selected] && blocks[selected][x]&& blocks[selected][x][y]){
				fill(255,255,0);  
			}else if(selected>0&&blocks[selected-1] && blocks[selected-1][x]&&blocks[selected-1][x][y]){
				fill(255,128,0);
			}else if(depths[x][y]>=126){
				fill(0,128,255);
			}else{
				fill(0,0,255);   
			}
			rect(drawAt.x,drawAt.y,world.zoom,world.zoom);
			stroke(0);
			if(x>0&&(depths[x-1]&&depths[x-1][y]!=depths[x][y])){
				line(drawAt.x,drawAt.y,drawAt.x,drawAt.y+world.zoom);
			}
		
			if(x<2*radius-1&&(depths[x+1]&&depths[x+1][y]!=depths[x][y])){
				line(drawAt.x+world.zoom,drawAt.y,drawAt.x+world.zoom,drawAt.y+world.zoom);
			}
			if(y>0&&(depths[x][y-1]!=depths[x][y])){
				line(drawAt.x,drawAt.y,drawAt.x+world.zoom,drawAt.y);
			}
		
			if(y<2*radius-1&&(depths[x][y+1]!=depths[x][y])){
				line(drawAt.x,drawAt.y+world.zoom,drawAt.x+world.zoom,drawAt.y+world.zoom);
			}
			fill(255);
			let selx=floor(selectp.x);
			let sely=floor(selectp.y);
			if(x==selx||y==sely){
				textSize(world.zoom/3);
				text(depths[x][y]-64,drawAt.x+world.zoom/2-textWidth(""+(depths[x][y]-64))/2,drawAt.y+world.zoom/2+textAscent()/2);   
			}
		}
	}catch (error) {
		console.error(error);
	}
}
function draw() {
	cursor(ARROW);
	background(255);
	const screenOff=screenToWorld(0,0);
	const center=worldToScreen(radius,radius);
	const corner=screenToWorld(width,height);
    strokeWeight(2);
    const selectp=screenToWorld(mouseX,mouseY);   
	if(mode==1){
		for(let x=max(0,floor(screenOff.x));x<min(corner.x,radius*2);x++){
			for(let y=max(0,floor(screenOff.y));y<min(corner.y,radius*2);y++){
				drawSquare(x,y,selectp);
			}
		}
	}else if(mode==2){
		for(let x=max(0,floor(screenOff.x));x<min(corner.x,radius*2);x++){
			drawSquare(x,floor(selectp.y),selectp);
		}
		for(let y=max(0,floor(screenOff.y));y<min(corner.y,radius*2);y++){
			drawSquare(floor(selectp.x),y,selectp);
		}
		for(let i=0;i<2;i++){
			for(const x in blocks[selected-i]){
				if(x>=max(0,floor(screenOff.x))&&x<x<min(corner.x,radius*2)){
					for(const y in blocks[selected-i][x]){
						//print(x,y);
						if(y>-max(0,floor(screenOff.y))&&y<min(corner.y,radius*2)){
							drawSquare(x,y,selectp);
						}
					}	
				}
			}
		}
		
		
	}
	stroke(0);
    strokeWeight(.5);
    
    for(let i=(int(screenOff.x)-screenOff.x)*world.zoom;i<width;i+=world.zoom){
        line(i,0,i,height);
    }
    for(let i=(int(screenOff.y)-screenOff.y)*world.zoom;i<height;i+=world.zoom){
        line(0,i,width,i);
    }
	stroke(255,0,0);
    line(0,center.y,width,center.y);
    line(center.x,0,center.x,height);
    let x=int(selectp.x);
    let y=floor(selectp.y);
	let selected1=worldToScreen(x,y);
	noFill();
    strokeWeight(2);
    line(selected1.x,selected1.y,selected1.x+world.zoom,selected1.y+world.zoom);
    line(selected1.x+world.zoom,selected1.y,selected1.x,selected1.y+world.zoom);

    stroke(255,0,0);
    rect(selected1.x,selected1.y,world.zoom,world.zoom);
    textSize(20);
	let coords="";
	let coords2="";
	if(x>=0&&x<2*radius&&y>=0&&y<2*radius&&depths[x][y]!=-1){
    	coords=`(${x - radius},${depths[x][y] - 64},${y - radius})`
    }else{
        coords=`(${x - radius},X,${y - radius})`
    }
    fill(255);
    rect(15,20,textWidth(coords)+10,28);
    fill(0);
	noStroke();
    text(coords,20,40);
    
	let selected2=worldToScreen(cx,cy);
    noFill();
    strokeWeight(2);
    stroke(0,255,0);
    line(selected2.x,selected2.y,selected2.x+world.zoom,selected2.y+world.zoom);
    line(selected2.x+world.zoom,selected2.y,selected2.x,selected2.y+world.zoom);

    if(!(cx==0&&cy==0)){
		rect(selected2.x,selected2.y,world.zoom,world.zoom);
		textSize(20);
		if(cx>=0&&cx<2*radius&&cy>=0&&cy<2*radius&&depths[cx][cy]!=-1){
			coords2=`(${cx - radius},${depths[cx][cy] - 64},${cy - radius})`
		}else{
			coords2=`(${cx - radius},X,${cy - radius})`
		}
		
		fill(255);
		rect(15,50,textWidth(coords)+10,30);
		fill(0);
		noStroke();
		text(coords2,20,70);
    }
	fill(0);
	noStroke();
    rect(width-70,20,50,30);
    fill(255,255,0);
	noStroke();
    text("y="+(selected-64),width-70,40);
	
	
	if(controles){
		fill(255);
		rect(width/2-320,height/2-320,640,640);
		noStroke();
		fill(0);
		text("Controls\nclick and drag to move\nuse mouse wheel to scroll in or out\nred X shows current block moused\nthe coords of the moused-over block are shown in the upper left in red\nclick a block to mark it in green\nmarked block's coords are displayed upper left in green\nthe Y coordinate of both blocks is the HIGHEST Y coordinate with a block\nthe blocks in the same row or column as the moused-over block are marked with their Y coordinates\nuse + and - to move the \"selected\" Y elevation\nblocks in the selected Y are marked in yellow\nblocks on the layer below the selected layer are orange\nthe Y coord of the marked row is in the upper right\nthere are 2 colors of blue, lighter blue is above water\nPress L to go into limited mode. In limited mode, only the selected layer/row/column are rendered.  This can improve performance\n\nIf you are having bad lag, try zooming in\n\n\n\nhold space to open this window (tap space to close)", width/2-300,height/2-300,600,600);

	}
	if(deltaTime>200 ){
		stroke(255,0,0);
		fill(255);
		rect(width/2-210,0,420,50);
		noStroke();
		fill(0);
		text("If you are having lag, zooming in might help",width/2-200,10,400,50);
	}
	//print(deltaTime )//>150 is lag?
}
	
function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
function mouseDragged(){
	world.mouseDragged()
}
function keyTyped(){
	if(key=='+'||key=='='){
        selected+=1;
        selected=min(selected,radius-1);
    }
    if(key=='-'||key=='_'){
        selected-=1;
        selected=max(selected,0);
    }
	if(key=='l'||key=='L'){
		mode=3-mode;
	}
}
function mousePressed(event){
	
  if (event.button === 1) { // middle mouse button
    event.preventDefault(); // prevent default scrolling behavior
    // do something else instead
  }
}
function mouseClicked(){
	let selects=screenToWorld(mouseX,mouseY);
	
 	let x=int(selects.x);
    let y=floor(selects.y);
	//print(x,y);
	
    cx=x;
    cy=y;

	
}
function mouseWheel(event){
	world.mouseWheel(event);
}

function screenToWorld( x, y){
	return screenToWorldV( createVector(x,y));   
}
function screenToWorldV( inVec){
	return world.screenToWorldV(inVec);
}
function worldToScreen( x,  y){
	return worldToScreenV(createVector(x,y));   
}
function worldToScreenV( inVec){


	return world.worldToScreenV(inVec);
}