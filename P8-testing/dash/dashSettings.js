//settings face
face[0] = {
  offms: 5000,
  g:w.gfx,
  init: function(){
    this.g.setColor(1,col("gray"));
    this.g.fillRect(0,0,115,75); //left up
    this.g.fillRect(0,80,115,155); //left mid
    this.g.fillRect(0,160,115,239); //left dn
    this.g.fillRect(120,0,239,239); //right-riding mode      
    this.g.setColor(0,col("black"));
    this.g.setFont("Vector",24);
	this.g.drawString("RING",58-(this.g.stringWidth("RING")/2),9); 
	this.g.drawString("LIGHT",58-(this.g.stringWidth("LIGHT")/2),41); 
//    this.g.drawString("AUTO",58-(this.g.stringWidth("AUTO")/2),90);
//    this.g.drawString("LOCK",58-(this.g.stringWidth("LOCK")/2),122);
	this.g.drawString("TRIP",58-(this.g.stringWidth("TRIP")/2),170); 
	this.g.drawString("RESET",58-(this.g.stringWidth("RESET")/2),202); 
	//rdmd
 	this.g.drawString("IS",180-(this.g.stringWidth("IS")/2),105);
    this.g.setFont("Vector",35);
    this.g.drawString("EUC",180-(this.g.stringWidth("EUC")/2),60); 
	this.g.drawString("OFF",180-(this.g.stringWidth("OFF")/2),140);
	//this.g.setFont("Vector",80);
    //this.g.drawString(euc.rdmd,180-(this.g.stringWidth(euc.rdmd)/2),80); //fixed bat
	this.g.flip();
    this.rdmd=-1;
    this.alck=-1;
	this.run=true;
  },
  show : function(){
    if (!this.run) return; 
//autolock
    if (euc.alck != this.alck) {
	  this.alck=euc.alck;
      if (this.alck==1) this.g.setColor(1,col("blue"));
      else this.g.setColor(1,col("gray"));
      this.g.fillRect(0,80,115,155); //left mid
      this.g.setColor(0,col("black"));
 	  this.g.setFont("Vector",24);
      this.g.drawString("AUTO",58-(this.g.stringWidth("AUTO")/2),90);
      this.g.drawString("LOCK",58-(this.g.stringWidth("LOCK")/2),122);
      this.g.flip();
    }
//ride mode    
    if (euc.conn=="READY") {  
	if (euc.rdmd != this.rdmd) {
	  this.rdmd=euc.rdmd;	
      this.g.setColor(1,col("lblue"));
      this.g.fillRect(120,0,239,239); //right-riding mode     
      this.g.setColor(0,col("black"));
      this.g.setFont("Vector",88);
      this.g.drawString(euc.rdmd,180-(this.g.stringWidth(euc.rdmd)/2),73);  
      this.g.setFont("Vector",35);
      if (9>euc.rdmd) {
      this.g.drawString(euc.rdmd+1,180-(this.g.stringWidth(euc.rdmd+1)/2),32);  
      }
      if (euc.rdmd>0) {
      this.g.drawString(euc.rdmd-1,180-(this.g.stringWidth(euc.rdmd-1)/2),166); 
      }
      this.g.setFont("Vector",20);
      if (8>euc.rdmd) {
      this.g.drawString(euc.rdmd+2,180-(this.g.stringWidth(euc.rdmd+2)/2),7); 
      }
      if (euc.rdmd>1) {
      this.g.drawString(euc.rdmd-2,180-(this.g.stringWidth(euc.rdmd-2)/2),208); 
      }
      this.g.flip();
    }
    }
//loop
    this.tid=setTimeout(function(t,o){
      t.tid=-1;
      t.show();
    },100,this);
  },
  tid:-1,
  run:false,
  clear : function(){
    this.g.clear();
    this.run=false;
    if (this.tid>=0) clearTimeout(this.tid);
    this.tid=-1;
    return true;
  },
  off: function(){
    this.g.off();
    this.clear();
  }
};

//loop face
face[1] = {
  offms:1000,
  init: function(){
  return true;
  },
  show : function(){
   face.go(set.dash[set.def.dash],0);
    return true;
  },
  clear: function(){
  return true;
  },
};	


//settings face
touchHandler[0]=function(e,x,y){    
    if (e==5){ 
	  digitalPulse(D16,1,40);
    }else if  (e==1){
      if  (x>=120) {
        euc.rdmd++;
        if (euc.rdmd >9) {euc.rdmd=9; digitalPulse(D16,1,40);}
      }else digitalPulse(D16,1,40);
    }else if  (e==2){
      if  (x>=120) {
        euc.rdmd--;
        if (euc.rdmd <0) {euc.rdmd=0; digitalPulse(D16,1,40);}
      }else digitalPulse(D16,1,40);
    }else if  (e==3){
      digitalPulse(D16,1,40);
    }else if  (e==4){
	  face.go(set.dash[set.def.dash],0);return;
    }else if  (e==12){
	  if (x<120&&y<80){
	 	digitalPulse(D16,1,[30,50,30]);
		face.go('w_scan',0,'ffe0');
		return;
      //ride mode
	  }else if  (x>120) { 
        euc.tmp.count=euc.rdmd+24;
      //reset mileage
      }else if (x<115 && y>145) {
        digitalPulse(D16,1,300);  
        euc.trpL="0.0";
	  //toggle EUC auto lock
	  }else if (x<115 && (80<y&&y<145)) {
        //if (set.def.cli) console.log("toggle alock");
        digitalPulse(D16,1,300);  
        euc.alck=1-euc.alck;
      }else digitalPulse(D16,1,40);
    }
    this.timeout();
};