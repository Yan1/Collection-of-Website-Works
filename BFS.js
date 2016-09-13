var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var img = new Image();
var startx = 0, starty = 0, endx = 0, endy = 0;

document.getElementById("uploadimage").addEventListener("change", draw, false);

Zoom();

canvas.addEventListener('mousemove', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    document.getElementById("coordinates").innerHTML = "x-coordinate: " + parseInt(mousePos.x) + ', y-coordinate: ' + parseInt(mousePos.y);
      }, false);

function draw(ev) {
  var f = document.getElementById("uploadimage").files[0],
  url = window.URL || window.webkitURL,
  src = url.createObjectURL(f);
  img.src = src;
  img.onload = function() {
      canvas.width = img.width*300/img.height;
      canvas.height = 300;
      ctx.drawImage(img,0,0, canvas.width, 300);
      img.width = canvas.width;
      img.height = canvas.height;
      threshold();
      url.revokeObjectURL(src);
  }
}

function threshold()
{
    var imageData = ctx.getImageData(0,0,img.width,img.height);
    var data = imageData.data;
    var thre = 210;
    for(i = 0; i < data.length; i += 4)
    {
        var r = data[i];
        var g = data[i+1];
        var b = data[i+2];
        var v = (0.2126*r + 0.7152*g + 0.0722*b >= thre) ? 255 : 0;
        data[i] = data[i+1] = data[i+2] = v
    }
    ctx.putImageData(imageData,0,0);
}

function Zoom()
{
    var zoomctx = document.getElementById('zoom').getContext('2d'); 
    var zoom = function(event) {
        var x = event.layerX;
        var y = event.layerY;
        zoomctx.drawImage(canvas,
        Math.abs(x - 5),
        Math.abs(y - 5),
        10, 10,
        0, 0,
        200, 200);
    };
    canvas.addEventListener('mousemove', zoom);
}

function find_sp()
{
  startx = parseInt(document.getElementById('sx').value);
  starty = parseInt(document.getElementById('sy').value);
  endx = parseInt(document.getElementById('dx').value);
  endy = parseInt(document.getElementById('dy').value);
  BFS(starty, startx, endy, endx);
}

function BFS(starty, startx, endy, endx)
{
  var queuei = [starty];
  var queuej = [startx];
  dic = {}
  dic[starty.toString()+','+startx.toString()] = [{i: starty, j: startx}]
  var imgData = ctx.getImageData(0, 0, img.width, img.height);
  var k = (starty * img.width + startx) * 4;
  imgData.data[k] = 255;
  imgData.data[k+1] = 153;
  imgData.data[k+2] = 255;
  while (queuei.length > 0)
  {
      var ii = queuei.shift();
      var jj = queuej.shift();
      if (ii == endy && jj == endx)
      {
          for(var key in dic[endy.toString()+','+endx.toString()])
          {
             var iii = dic[endy.toString()+','+endx.toString()][key].i;
             var jjj = dic[endy.toString()+','+endx.toString()][key].j;
             var kp = (iii*img.width+jjj)*4;
             imgData.data[kp] = 255;
             imgData.data[kp+1] = 0;
             imgData.data[kp+2] = 0;
          }
          ctx.putImageData(imgData, 0, 0);
          break;
      }
      var k1 = ((ii-1)*img.width+jj)*4;
      if (ii-1 >= 0 && imgData.data[k1] == 255 && imgData.data[k1+1] == 255 && imgData.data[k1+2] == 255)
      {
          imgData.data[k1] = 255;
          imgData.data[k1+1] = 153;
          imgData.data[k1+2] = 255;
          queuei.push(ii-1);
          queuej.push(jj);
          var t = dic[ii.toString()+','+jj.toString()].slice();
          t.push({i:ii-1, j: jj});
          dic[(ii-1).toString()+','+jj.toString()] = t;
      }
      k1 = ((ii+1)*img.width+jj)*4;
      if (ii+1 < img.height && imgData.data[k1] == 255 && imgData.data[k1+1] == 255 && imgData.data[k1+2] == 255)
      {
          imgData.data[k1] = 255;
          imgData.data[k1+1] = 153;
          imgData.data[k1+2] = 255;
          queuei.push(ii+1);
          queuej.push(jj);
          var t = dic[ii.toString()+','+jj.toString()].slice();
          t.push({i:ii+1, j: jj});
          dic[(ii+1).toString()+','+jj.toString()] = t;
      }
      k1 = (ii*img.width+jj-1)*4;
      if (jj-1 >= 0 && imgData.data[k1] == 255 && imgData.data[k1+1] == 255 && imgData.data[k1+2] == 255)
      {
          imgData.data[k1] = 255;
          imgData.data[k1+1] = 153;
          imgData.data[k1+2] = 255;
          queuei.push(ii);
          queuej.push(jj-1);
          var t = dic[ii.toString()+','+jj.toString()].slice();
          t.push({i:ii, j: jj-1});
          dic[(ii).toString()+','+(jj-1).toString()] = t;
      }
      k1 = (ii*img.width+jj+1)*4;
      if (jj+1 < img.width && imgData.data[k1] == 255 && imgData.data[k1+1] == 255 && imgData.data[k1+2] == 255)
      {
          imgData.data[k1] = 255;
          imgData.data[k1+1] = 153;
          imgData.data[k1+2] = 255;
          queuei.push(ii);
          queuej.push(jj+1);
          var t = dic[ii.toString()+','+jj.toString()].slice();
          t.push({i:ii, j: jj+1});
          dic[(ii).toString()+','+(jj+1).toString()] = t;
      }
      ctx.putImageData(imgData, 0, 0);
  }
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
