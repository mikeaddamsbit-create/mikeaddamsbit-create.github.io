$(function () {

    $('#st1 .answer_clicked').on('click', function () {
        $('#st1').hide();
        $('#st2').fadeIn(500);
    });

    $('#st2 .answer_clicked').on('click', function () {
        $('#st2').hide();
        $('#st3').fadeIn(500);
    });

    $('#st3 .answer_clicked').on('click', function () {
        $('#st3').hide();
        $('#st4').fadeIn(500);
    });

    $('#st4 .answer_clicked').on('click', function () {
    $('#st4').hide();
    $('#st_loading').fadeIn(500);

    var progress = 0;

    var steps = [
        "Checking eligibility...",
        "Finding nearby women...",
        "Almost done..."
    ];

    var stepIndex = 0;

    var interval = setInterval(function () {
        progress += 10;
        $('#progressBar').css('width', progress + '%');

        if (progress === 30) {
            $('#loadingText').text(steps[1]);
        }
        if (progress === 70) {
            $('#loadingText').text(steps[2]);
        }

        if (progress >= 100) {
            clearInterval(interval);
            $('#st_loading').hide();
            $('#st5').fadeIn(500);
        }
    }, 300);
});

    $('.previous_question_button').on('click', function () {
        var current = $(this).closest('.question_wrapper');
        var prev = current.prevAll('.question_wrapper:first');

        current.hide();
        prev.fadeIn(500);
    });

    // GLOBAL TIMER (does not reset)
    if (!window.timerStarted) {
        window.timerStarted = true;

        var timeLeft = 267;

        function updateTimer() {
            var minutes = Math.floor(timeLeft / 60);
            var seconds = timeLeft % 60;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            $('.countdownTimer').text("OFFER EXPIRES IN: " + minutes + ":" + seconds);
        }

        updateTimer();

        setInterval(function () {
            timeLeft--;
            updateTimer();

            if (timeLeft < 0) {
                $('.countdownTimer').text("Offer expired!");
            }
        }, 1000);
    }

});