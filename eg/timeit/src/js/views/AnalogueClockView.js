if (timeit.isCanvasSupported()) {

    maria.ElementView.subclass(timeit, 'AnalogueClockView', {
        properties: {
            buildData: function() {
                var time = this.getModel().getTime();
                var ctx = this.find('canvas.time').getContext('2d');

                // From https://developer.mozilla.org/en/Canvas_tutorial/Basic_animations

                ctx.save();
                ctx.clearRect(0,0,150,150);
                ctx.translate(75,75);
                ctx.scale(0.4,0.4);
                ctx.rotate(-Math.PI/2);
                ctx.strokeStyle = "black";
                ctx.fillStyle = "white";
                ctx.lineWidth = 8;
                ctx.lineCap = "round";

                // hour marks
                ctx.save();
                for (var i=0;i<12;i++){
                  ctx.beginPath();
                  ctx.rotate(Math.PI/6);
                  ctx.moveTo(100,0);
                  ctx.lineTo(120,0);
                  ctx.stroke();
                }
                ctx.restore();

                // minute marks
                ctx.save();
                ctx.lineWidth = 5;
                for (i=0;i<60;i++){
                  if (i%5!=0) {
                    ctx.beginPath();
                    ctx.moveTo(117,0);
                    ctx.lineTo(120,0);
                    ctx.stroke();
                  }
                  ctx.rotate(Math.PI/30);
                }
                ctx.restore();

                var sec = time.second;
                var min = time.minute;
                var hr  = time.hour;
                hr = hr>=12 ? hr-12 : hr;

                ctx.fillStyle = "black";

                // write hours
                ctx.save();
                ctx.rotate( hr*(Math.PI/6) + (Math.PI/360)*min + (Math.PI/21600)*sec )
                ctx.lineWidth = 14;
                ctx.beginPath();
                ctx.moveTo(-20,0);
                ctx.lineTo(80,0);
                ctx.stroke();
                ctx.restore();

                // write minutes
                ctx.save();
                ctx.rotate( (Math.PI/30)*min + (Math.PI/1800)*sec )
                ctx.lineWidth = 10;
                ctx.beginPath();
                ctx.moveTo(-28,0);
                ctx.lineTo(112,0);
                ctx.stroke();
                ctx.restore();

                // write seconds
                ctx.save();
                ctx.rotate(sec * Math.PI/30);
                ctx.strokeStyle = "#D40000";
                ctx.fillStyle = "#D40000";
                ctx.lineWidth = 6;
                ctx.beginPath();
                ctx.moveTo(-30,0);
                ctx.lineTo(83,0);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(0,0,10,0,Math.PI*2,true);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(95,0,10,0,Math.PI*2,true);
                ctx.stroke();
                ctx.fillStyle = "#555";
                ctx.arc(0,0,3,0,Math.PI*2,true);
                ctx.fill();
                ctx.restore();

                ctx.beginPath();
                ctx.lineWidth = 14;
                ctx.strokeStyle = '#325FA2';
                ctx.arc(0,0,142,0,Math.PI*2,true);
                ctx.stroke();

                ctx.restore();
            },
            update: function() {
                this.buildData();
            }
        }
    });

}
