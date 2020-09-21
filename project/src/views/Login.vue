<template>
  <div id="login">
    <div class="landscape"></div>
    <div class="filter"></div>
    <canvas id="canvas"></canvas>
    <div class="main">
      <div class="login">
        <div class="log-con">
          <span>登录</span>
          <input type="text" class="name" placeholder="请输入用户名" />
          <input type="text" class="password" placeholder="请输入密码" />
          <!-- <input type="text" class="code" placeholder="请输入验证码"/>
          <input type="button" id="code" onclick="change();"/>-->
          <a>立即登录</a>
        </div>
      </div>
    </div>
    <div class="copyright">
      <a></a>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  props: {
    msg: String
  },
  created() {},
  mounted() {
    this.drawCanvas();
  },
  methods: {
    drawCanvas() {
      function Star(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.r = Math.floor(Math.random() * 2) + 1;
        var alpha = (Math.floor(Math.random() * 10) + 1) / 10 / 2;
        this.color = "rgba(255,255,255," + alpha + ")";
      }

      Star.prototype.draw = function() {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.r * 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
      };

      Star.prototype.move = function() {
        this.y -= 0.15;
        if (this.y <= -10) this.y = HEIGHT + 10;
        this.draw();
      };

      Star.prototype.die = function() {
        stars[this.id] = null;
        delete stars[this.id];
      };

      function Dot(id, x, y, r) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.r = Math.floor(Math.random() * 5) + 1;
        this.maxLinks = 2;
        this.speed = 0.5;
        this.a = 0.5;
        this.aReduction = 0.005;
        this.color = "rgba(255,255,255," + this.a + ")";
        this.linkColor = "rgba(255,255,255," + this.a / 4 + ")";

        this.dir = Math.floor(Math.random() * 140) + 200;
      }

      Dot.prototype.draw = function() {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.r * 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
      };

      Dot.prototype.link = function() {
        if (this.id == 0) return;
        var previousDot1 = getPreviousDot(this.id, 1);
        var previousDot2 = getPreviousDot(this.id, 2);
        var previousDot3 = getPreviousDot(this.id, 3);
        if (!previousDot1) return;
        ctx.strokeStyle = this.linkColor;
        ctx.moveTo(previousDot1.x, previousDot1.y);
        ctx.beginPath();
        ctx.lineTo(this.x, this.y);
        if (previousDot2 != false) ctx.lineTo(previousDot2.x, previousDot2.y);
        if (previousDot3 != false) ctx.lineTo(previousDot3.x, previousDot3.y);
        ctx.stroke();
        ctx.closePath();
      };

      function getPreviousDot(id, stepback) {
        if (id == 0 || id - stepback < 0) return false;
        if (typeof dots[id - stepback] != "undefined")
          return dots[id - stepback];
        else return false; //getPreviousDot(id - stepback);
      }

      Dot.prototype.move = function() {
        this.a -= this.aReduction;
        if (this.a <= 0) {
          this.die();
          return;
        }
        this.color = "rgba(255,255,255," + this.a + ")";
        this.linkColor = "rgba(255,255,255," + this.a / 4 + ")";
        (this.x = this.x + Math.cos(degToRad(this.dir)) * this.speed),
          (this.y = this.y + Math.sin(degToRad(this.dir)) * this.speed);

        this.draw();
        this.link();
      };

      Dot.prototype.die = function() {
        dots[this.id] = null;
        delete dots[this.id];
      };

      var canvas = document.getElementById("canvas"),
        ctx = canvas.getContext("2d"),
        WIDTH,
        HEIGHT,
        mouseMoving = false,
        mouseMoveChecker,
        mouseX,
        mouseY,
        stars = [],
        initStarsPopulation = 80,
        dots = [],
        dotsMinDist = 2,
        maxDistFromCursor = 50;

      setCanvasSize();
      init();

      function setCanvasSize() {
        (WIDTH = document.documentElement.clientWidth),
          (HEIGHT = document.documentElement.clientHeight);

        canvas.setAttribute("width", WIDTH);
        canvas.setAttribute("height", HEIGHT-100);
      }

      function init() {
        ctx.strokeStyle = "white";
        ctx.shadowColor = "white";
        for (var i = 0; i < initStarsPopulation; i++) {
          stars[i] = new Star(
            i,
            Math.floor(Math.random() * WIDTH),
            Math.floor(Math.random() * HEIGHT)
          );
          //stars[i].draw();
        }
        ctx.shadowBlur = 0;
        animate();
      }

      function animate() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        for (var i in stars) {
          stars[i].move();
        }
        for (var i in dots) {
          dots[i].move();
        }
        drawIfMouseMoving();
        requestAnimationFrame(animate);
      }

      window.onmousemove = function(e) {
        mouseMoving = true;
        mouseX = e.clientX;
        mouseY = e.clientY;
        clearInterval(mouseMoveChecker);
        mouseMoveChecker = setTimeout(function() {
          mouseMoving = false;
        }, 100);
      };
      function drawIfMouseMoving() {
        if (!mouseMoving) return;

        if (dots.length == 0) {
          dots[0] = new Dot(0, mouseX, mouseY);
          dots[0].draw();
          return;
        }

        var previousDot = getPreviousDot(dots.length, 1);
        var prevX = previousDot.x;
        var prevY = previousDot.y;

        var diffX = Math.abs(prevX - mouseX);
        var diffY = Math.abs(prevY - mouseY);

        if (diffX < dotsMinDist || diffY < dotsMinDist) return;

        var xVariation = Math.random() > 0.5 ? -1 : 1;
        xVariation =
          xVariation * Math.floor(Math.random() * maxDistFromCursor) + 1;
        var yVariation = Math.random() > 0.5 ? -1 : 1;
        yVariation =
          yVariation * Math.floor(Math.random() * maxDistFromCursor) + 1;
        dots[dots.length] = new Dot(
          dots.length,
          mouseX + xVariation,
          mouseY + yVariation
        );
        dots[dots.length - 1].draw();
        dots[dots.length - 1].link();
      }
      //setInterval(drawIfMouseMoving, 17);

      function degToRad(deg) {
        return deg * (Math.PI / 180);
      }
    }
  }
};
</script>


<style scoped lang="stylus">
body {
  margin: 0;
  overflow: hidden;
  background: linear-gradient(to bottom, #19778c, #095f88);
  background-size: 1400% 300%;
  animation: dynamics 6s ease infinite;
  -webkit-animation: dynamics 6s ease infinite;
  -moz-animation: dynamics 6s ease infinite;
  font-size: 14px;
  color: #ffffff;
  min-height: 700px;
}

/* 登录样式 */
.main {
  position: fixed;
  text-align: center;
  top: 182px;
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
}

.login {
  width: 470px;
  height: 470px;
  background: linear-gradient(to bottom, #19778c, #095f88);
  animation: dynamics 6s ease infinite;
  -webkit-animation: dynamics 6s ease infinite;
  -moz-animation: dynamics 6s ease infinite;
  opacity: 0.9;
  border: solid 1px #13a1fc;
  background-size: 1400% 300%;
}

@keyframes dynamics {
  0% {
    background-position: 0% 0%;
  }

  50% {
    background-position: 50% 100%;
  }

  100% {
    background-position: 100% 0%;
  }
}

.log-con {
  background: linear-gradient(#13a1fc, #13a1fc) left top, linear-gradient(#13a1fc, #13a1fc) left top, linear-gradient(#13a1fc, #13a1fc) right top, linear-gradient(#13a1fc, #13a1fc) right top, linear-gradient(#13a1fc, #13a1fc) left bottom, linear-gradient(#13a1fc, #13a1fc) left bottom, linear-gradient(#13a1fc, #13a1fc) right bottom, linear-gradient(#13a1fc, #13a1fc) right bottom;
  background-repeat: no-repeat;
  background-size: 3px 20px, 20px 3px;
  height: 100%;
  margin: -2px;
  padding: 3px 1px 1px 0;
  border-radius: 3px;
}

.log-con >span {
  font-size: 30px;
  font-weight: bold;
  line-height: 24px;
  letter-spacing: 2px;
  display: block;
  margin: 20px 0 44px 0;
}

.log-con >span::after {
  display: block;
  content: '';
  width: 57px;
  height: 3px;
  background: #ffffff;
  margin-top: 16px;
  justify-content: center;
  position: relative;
  left: 206px;
}

.log-con>input {
  display: block;
  margin: 10px 0 32px 70px;
  width: 330px;
  height: 42px;
  background-color: #ffffff;
  border-radius: 4px;
  opacity: 0.9;
  border: 0;
  font-size: 16px;
  outline: none;
  padding-left: 10px;
  color: #000000;
}

.log-con>a {
  width: 340px;
  height: 44px;
  background-color: #0090ff;
  border-radius: 4px;
  display: block;
  margin: 10px 0 0 70px;
  text-align: center;
  line-height: 44px;
  cursor: pointer;
  opacity: 1;
}

input::-webkit-input-placeholder {
  color: #000000;
  font-size: 16px;
}

.log-con>.code {
  width: 216px;
  display: inline-block;
  margin-left: 6px;
}

.log-con>#code {
  width: 94px;
  display: inline-block;
  margin-left: 14px;
  cursor: pointer;
}

/* logo */
.logo {
  width: 168px;
  height: 75px;
  position: fixed;
  left: 150px;
  top: 26px;
}

.logo>img {
  max-width: 100%;
  max-height: 100%;
}

/* 版权样式 */
.copyright {
  position: fixed;
  bottom: 10px;
  font-size: 16px;
  display: block;
  width: 100%;
  text-align: center;
}

html, body {
  margin: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
  cursor: none;
  background: black;
  background: linear-gradient(to bottom, #000000 0%, #5788fe 100%);
}

.filter {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: #fe5757;
  animation: colorChange 30s ease-in-out infinite;
  animation-fill-mode: both;
  mix-blend-mode: overlay;
}

@keyframes colorChange {
  0%, 100% {
    opacity: 0;
  }

  50% {
    opacity: 0.9;
  }
}

.landscape {
  position: absolute;
  bottom: 0px;
  left: 0;
  width: 100%;
  height: 100%;
  /* background-image:url(https://openclipart.org/image/2400px/svg_to_png/250847/Trees-Landscape-Silhouette.png);
   */
  background-image: url('../assets/xkbg.png');
  background-size: 1000px 250px;
  background-repeat: repeat-x;
  background-position: center bottom;
}
</style>
