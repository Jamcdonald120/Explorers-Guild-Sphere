class WorldCord{
	constructor(){
		this.xOff=0; 
		this.yOff=0; 
		this.zoom=10;
	}
    mouseDragged(){
		//print(mouseX,pmouseX)
        this.xOff-=(mouseX-pmouseX)/this.zoom;
        this.yOff-=(mouseY-pmouseY)/this.zoom;
        
    }
    mouseWheel(event){
		print(event.delta)
		if(event.delta){
			this.xOff+=mouseX/this.zoom;
			this.yOff+=mouseY/this.zoom;
			this.zoom-=event.delta/abs(event.delta)*this.zoom/10;
			this.yOff-=mouseY/this.zoom;
			this.xOff-=mouseX/this.zoom;
		}
    }
    screenToWorld( x,  y){
        return this.screenToWorldV(createVector(x,y));   
    }
    screenToWorldV( inVec){
        inVec.x/=this.zoom;
        inVec.y/=this.zoom;
        inVec.x+=this.xOff;
        inVec.y+=this.yOff;
        return inVec;
    }
    worldToScreen( x,  y){
        return this.worldToScreenV(createVector(x,y));   
    }
    worldToScreenV( inVec){
        inVec.x-=this.xOff;
        inVec.y-=this.yOff;
        inVec.x*=this.zoom;
        inVec.y*=this.zoom;
        return inVec; 
    }
}