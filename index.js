let canvas = document.getElementById("vector-canvas")
let ecg_canvas = document.getElementById("ecg-canvas")
var ctx = canvas.getContext("2d");
var ecg_ctx = ecg_canvas.getContext("2d");

let cells = document.getElementsByTagName('circle')
let DX=100;
let DY=100;
let last_DX=0;
let last_DY=0;
let point_x=0
let points = []
setInterval(() => {
    let actives = [...document.getElementsByClassName('active')]; //get all active cells
    
    
   
   let point_y = 240- angleBetween({x:200,y:200},{x:DX,y:DY}) * (vector_length({x:100,y:100},{x:DX,y:DY})||1)
   points.push({x:point_x,y:point_y})
    drawPolygon(ecg_ctx, points, "red")

    for (let i=0;i<actives.length;i++){
        let neighbors = getNeighbors(actives[i])
        let length = neighbors.length
        let delay = 150;
        if(actives[i].id.startsWith("WAY3") || actives[i].id.startsWith("WAY1")  || actives[i].id.startsWith("WAY-5")||actives[i].id.startsWith("WAY-6")){
            delay=1
        }
        else if (actives[i].id.startsWith("WAY2")){
            delay=70
        
        }else if(actives[i].id.startsWith("AV")){
            delay=1200
        }
        setTimeout(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i=0;i<length;i++){
                if(!neighbors[i].classList.contains("deactivated")){
                    
                    neighbors[i].classList.add("active")
                    
                }   
          } 
        //canvas    draw line  between x and y coordinates
        ecg_ctx.beginPath();
        ecg_ctx.moveTo(0, 100);
        ecg_ctx.lineTo(200, 100);
        ecg_ctx.stroke();


        

    
          
   
       
          drawCircle(ctx,200,200,1,"red")
                    drawCircle(ctx,100,100,100,"transparent")
                    drawArrow(ctx, 100, 100, DX, DY, 2, 'red');
                 
        },delay)
     
      actives[i].classList.add("deactivated")
      actives[i].classList.remove("active")
    } 

}, 1);  

setInterval(() => {
    point_x+=0.15

}, 0);













function getNeighbors(element) {

     let neighbors = []
   for (let cell of cells){
   if (cell == element)continue;
   let _dx = cell.getAttribute("cx")*1 - element.getAttribute("cx")*1
   let _dy = cell.getAttribute("cy")*1 - element.getAttribute("cy")*1
    if( Math.abs(_dx) <4 && Math.abs(_dy) <4){ //top
      
        if(element.id.startsWith("LV")){

            DX+=_dx/2;
            DY+=_dy/2;
        }else if(element.id.startsWith("RV")){
            DX+=last_DX+_dx;
            DY+=_dy;
        }
        else if (element.id.startsWith("RA") || element.id.startsWith("LA") ||element.id.startsWith("WAY1") ){
            DX+=_dx/6;
            DY+=_dy/6;
        }
        else if(element.id.startsWith("AV")){
            DX=100;
            DY=100
        } else{
            
                DX+=_dx;
                DY+=_dy;

            
        }
        neighbors.push(cell)
    }
   }
 
   return neighbors
}

function drawArrow(ctx, fromx, fromy, tox, toy, arrowWidth, color){
    //variables to be used when creating the arrow
    tox = Math.min(Math.max(tox, 0), 200);
    toy = Math.min(Math.max(toy, 0), 200);
    var headlen = 10;
    var angle = Math.atan2(toy-fromy,tox-fromx);
 
    ctx.save();
    ctx.strokeStyle = color;
 
    //starting path of the arrow from the start square to the end square
    //and drawing the stroke
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.lineWidth = arrowWidth;
    ctx.stroke();
 
    //starting a new path from the head of the arrow to one of the sides of
    //the point
    ctx.beginPath();
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
               toy-headlen*Math.sin(angle-Math.PI/7));
 
    //path from the side point of the arrow, to the other side point
    ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),
               toy-headlen*Math.sin(angle+Math.PI/7));
 
    //path from the side point back to the tip of the arrow, and then
    //again to the opposite side point
    ctx.lineTo(tox, toy);
    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
               toy-headlen*Math.sin(angle-Math.PI/7));
 
    //draws the paths created above
    ctx.stroke();
    ctx.restore();
}


//  canvas draw circle with dagreess written outside
function drawCircle(ctx, x, y, radius,color) {
    ctx.beginPath();
    ctx.fill=color
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
}

// calculate angle between vectors in dagrees and map between 0 and 200

function angleBetween(v1, v2) {

    let angle = Math.atan2(v2.y, v2.x) - Math.atan2(v1.y, v1.x);
   
    // map(-1,1,2,1, Math.cos(angle))
    return  Math.cos(angle)
}

// canvas draw polygon
function drawPolygon(ctx, points, color) {
    ctx.beginPath();
    ctx.clearRect(0, 0, ecg_canvas.width, ecg_canvas.height);
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    ctx.stroke();
}
function map(old_bottom,old_top,new_bottom,new_top,value){
return (value - old_bottom) / (old_top - old_bottom) * (new_top - new_bottom) + new_bottom;
}
// calculate vector length
function vector_length(p1,p2) {
    return Math.sqrt(p1.x * p2.x + p1.y * p2.y);
}