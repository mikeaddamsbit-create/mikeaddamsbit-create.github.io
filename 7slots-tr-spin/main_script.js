function clickMe(hide, show) {
    $(hide + " .yesno").click(function() {
        $(hide).hide();
        $(show).show();
    });
}

function countdown(time) {
    $("#timer").html(time + " seconds");
    var interval = setInterval(function() {
        if (time < 4) {
            $("#timer").html("few seconds");
            clearInterval(interval);
        } else {
            $("#timer").html(time + " seconds");
            time--;
        }
    }, 1000);
}
   
$(document).ready(function() {
    $("#stop, #spin2, #stop2, #stop3, #spin3, .miss, .question, #q2, #q3, .loading, .finaldiv, .comments").hide();

    setInterval(function() {
        $(".blink").fadeOut(500).fadeIn(500);
    });
    
    $("#spin").click(function() {
        $("#spin, .info").hide();
        $("#stop").show();
        $("#slot-start").hide();
        $("#slot-spin").show();
        $("#slot-spin-audio").get(0).play();
        $("#numleft").html("2");
        $("#stop").click(function() {
            $(this).hide();
            $("#slot-spin").hide();
            $("#slot-result-1").show();
            $("#spin2").show();  
            $(".miss").fadeIn(1000, function() {
                setTimeout(function() {
                    $(".miss").fadeOut(1000);
                    $("#number").html("1");
                }, 1500);
            });
        });
       
        var time = 4000;

        if (window.timeclear){
            clearTimeout(window.timeclear);
        }
        window.timeclear = setTimeout(function(){
            $("#stop").click();
        }, time);
    });

    $("#spin2").click(function() {
        $("#spin2, .miss").hide();
        $("#stop2").show();
        $("#slot-result-1").hide();
        $("#slot-spin").show();   
        $("#slot-spin-audio").get(0).play();
        $("#numleft").html("1");
        $("#stop2").click(function() {    
            $(this).hide();
            $("#slot-spin").hide();
            $("#slot-result-2").show();
            $("#spin3").show();  
            $(".miss").fadeIn(1000, function() {
                setTimeout(function() {
                    $(".miss").fadeOut(1000);
                    $("#number").html("1");
                }, 1500);
            });    
        });
   
        var time = 4000;

        if (window.timeclear){
            clearTimeout(window.timeclear);
        }

        window.timeclear = setTimeout(function(){
            $("#stop2").click();
        }, time);
    });

    $("#spin3").click(function() {
        $("#spin3, .miss").hide();
        $("#stop3").show();
        $("#slot-result-2").hide();
        $("#slot-spin").show();
        $("#slot-spin-audio").get(0).play();
        $(".received").html("TEBRİKLER!");
        $(".receivedbot").html("17.500 ₺ kazandınız!!");
        $("#stop3").click(function() {
            $("#slot-spin").hide();
            $("#slot-win").show();
            $("#slot-win-audio").get(0).play();
            $(this).hide();
            $(".miss").fadeIn(1000, function() {
                setTimeout(function() {
                    $(".roll").hide();
                    $(".question").show();
                }, 1500);
            });
        });
      
        var time = 4000;

        if (window.timeclear){
            clearTimeout(window.timeclear);
        }

        window.timeclear = setTimeout(function(){
            $("#stop3").click();
        }, time);
    });

    clickMe("#q1", "#q2");
    clickMe("#q2", "#q3");
    $("#q3 .yesno").click(function() {
        $("#q3, .threeq").hide();
        $(".loading").show();
        $(".active").animate({"width": "100%"}, 3500, function() {
            setTimeout(function() {
                $(".question, .everyday").hide();
                $(".finaldiv, .comments").show();
                countdown(60);
                setInterval(function() {
                     $(".blinkfinal").fadeOut(250).fadeIn(250);
                });
            });
        });
    });
});
   
setInterval(function() {
    value = document.getElementById('jackpot').innerHTML;
    value = value.replace(/,/g, '');
    value = parseFloat(value) + 0.02;
    document.getElementById('jackpot').innerHTML = value.formatMoney();
}, 2000);

Number.prototype.formatMoney = function(decPlaces, thouSeparator, decSeparator) {
    var n = this,
        decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
        decSeparator = decSeparator == undefined ? "." : decSeparator,
        thouSeparator = thouSeparator == undefined ? "," : thouSeparator,
        sign = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return sign + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(d{3})(?=d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
};

momentOfTime = new Date();
myTimeSpan = 5.2*60*1000;
momentOfTime.setTime(momentOfTime.getTime() + myTimeSpan);
var x = setInterval(function() {
    var now = new Date();
    var distance = momentOfTime - now;
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    var ms = Math.floor((distance % (1000 * 60))/100 );
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    document.getElementById("cdtime").innerHTML = "00:" + minutes + ":" + seconds + ":" + ms;
    if (distance < 0) {
        clearInterval(x);
        document.getElementById("cdtime").innerHTML = "EXPIRED";
    }
}, 5);
