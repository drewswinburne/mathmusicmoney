$('document').ready(function(){

  navigator.getUserMedia = navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia;

var startRecord = $('#startRecorder')
var stopRecord = $('#stopRecorder')
var soundClips = $('#soundClips')

// Get user audio

if (navigator.getUserMedia) {
   console.log('getUserMedia supported.');
   navigator.getUserMedia (
      // constraints - only audio needed for this app
      {
         audio: true
      },

      // Success callback
      function(stream) {
        var mediaRecorder = new MediaRecorder(stream);
        var chunks = [];
        mediaRecorder.ondataavailable = function(e) {
          chunks.push(e.data);
        }

        startRecord.on('click', function() {
          console.log(mediaRecorder.state);
          console.log("recorder started");
          mediaRecorder.start();
          playAudio();
        })

        stopRecord.on('click', function(){
          console.log(mediaRecorder.state);
          console.log("recorder stopped");
          mediaRecorder.stop();
          stopAudio();
        })

        mediaRecorder.onstop = function(e) {
          console.log("recorder stopped");

          var voice = document.createElement('audio');
          voice.setAttribute('controls', '');

          var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
          chunks = [];
          var voiceURL = window.URL.createObjectURL(blob);
          voice.src = voiceURL;

          // var mySound = new buzz.sound('audio/08combo-drumbreak-bass-snare-hihat-synth-sample-kick-horn.mp3')

          var myGroup = new buzz.group([
            new buzz.sound(voice.src),
            new buzz.sound('audio/08combo-drumbreak-bass-snare-hihat-synth-sample-kick-horn.mp3')
          ]);

          playButton.hide()
          $('#playFinal').show()
          $('#playFinal').on('click', function () {
            myGroup.play();
            // mySound.play();
            myGroup.currentTime = 0;
          })
          stopButton.hide()
          $('#stopFinal').show()
          $('#stopFinal').on('click', function() {
            myGroup.stop();
            // mySound.stop();
            myGroup.currentTime = 0;
            progressCursor.css("width", 0)
          })

        }

      },

      // Error callback
      function(err) {
         console.log('The following gUM error occured: ' + err);
      }
   );
} else {
   console.log('getUserMedia not supported on your browser!');
}

// get user audio code end

var prodArea = $('.header')
var quizArea = $('#main')
var progressArea = $('.header')
var questionForm = $('.questions')
var playButton = $('#play')
var stopButton = $('#stop')
var progressCursor = $('#cursor')
var budget = 0;
var currentImg = -1
var currentAudio = '';


$('#bank').html(budget)
$('.start')
$('.next').hide()
$('#playFinal').hide()
$('#stopFinal').hide()
startRecord.hide()
stopRecord.hide()


function showLoop() {
  currentImg++
  if (currentImg === 7) {
    $('.next').hide()

    startRecord.show()
    stopRecord.show()
  }

    currentAudio = audios[currentImg]
    audioElement.setAttribute('src', currentAudio.url);

    prodArea.css('background-image', 'url(' + imgs[currentImg]+ ')')

};

function askQuestion(evt){
  currentQuestion++
  $('h2').remove()
  $('h4').remove()
  $('.selection').remove()

  if (currentQuestion < allQuestions.length){
    var answers = allQuestions[currentQuestion].answers
  quizArea.prepend('<h2>' + allQuestions[currentQuestion].question + '</h2>')
  quizArea.append('<h4>Answer value: $' + allQuestions[currentQuestion].value + '</h4>')

    for (var i=0; i<answers.length; i++){
    quizArea.append('<div class="selection"><input type="radio" class="option" name="answer" value="'+ (i+1)+'">' + answers[i] + '</input></div>')
    }
  } else {
    $('.next').hide()
  }
}

function answerQuestion(){
  if ($('input[name="answer"]:checked').val() == allQuestions[currentQuestion].correctAnswer){
    // console.log(allQuestions[currentQuestion].value);
    budget += parseInt(allQuestions[currentQuestion].value)
    $('#bank').html(budget)
    // console.log(budget);
    budgetCheck()
    // showLoop()
  }
    else {
      // console.log("wrong");
    }
  };
  var purchaseable = 0;

  function budgetCheck(){
    if (audios[currentImg+1].value <= budget) {
      purchaseable++;}
    if (purchaseable == 1) {
      quizArea.prepend("<div class='purchaseAlert'><h3>you can buy a new track!</h3><button type='button' name='button' id='buy'>buy a track</button></div>")
      $('#buy').on('click', buySomething)
    }

  }


  function buySomething(){
    // console.log(audios[currentImg]);
    // console.log("current img =" + currentImg);

    if (currentImg == 6){
      progressArea.css('height', '600px')
      // console.log("current img =" + currentImg);
    }
    purchaseable--
    if (purchaseable == 0){
    $('#buy').remove()
    $('h3').remove()}
    showLoop()
    budget -= audios[currentImg].value
    $('#bank').html(budget)

  }


var currentQuestion = -1

$('.start').on('click', function(evt){
  evt.preventDefault()
  $('.start').hide()
  $('.next').show()
  askQuestion()
}
)

questionForm.on('submit', function(evt){
  evt.preventDefault()
  answerQuestion()
  askQuestion()
})

playButton.on('click', playAudio)
stopButton.on('click', stopAudio)

function playAudio(){
    // console.log(audioElement);
    audioElement.play();
    audioElement.currentTime = 0;
}

function stopAudio(){
  audioElement.pause()
  audioElement.currentTime = 0;
  progressCursor.css("width", 0)
}

var audioElement = document.createElement('audio');
audioElement.setAttribute('src', currentAudio);
audioElement.addEventListener("canplay",function(){
      $("#length").text("Duration:" + audioElement.duration + " seconds");
      $("#source").text("Source:" + audioElement.src);
      $("#status").text("Status: Ready to play").css("color","green");
  });

var smoothGuy = setInterval(function(){
  progress = (audioElement.currentTime/audioElement.duration *100).toFixed(2) + '%'
  $("#currentTime").text("Current second:" +  progress );
  progressCursor.css("width", progress)
}, 70);

})
