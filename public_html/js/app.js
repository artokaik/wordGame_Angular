var app = angular.module('wordGame',[]);
var game;

app.controller('GameController',function(){
    this.teams=[];
    this.removePlayer=function(team,player){
        for(var i = 0; i<team.players.length; i++){
            if(team.players[i]==player){
                team.players.splice(i,1);              
            }
        }
    }
    this.startGame=function(){
        var gameSetup = new GameSetup();
        for(var i = 0; i<this.teams.length;i++){
            var team = this.teams[i];
            var newTeam = new Team(team.name);
            for(var j = 0; j<team.players.length;j++){
                var player =team.players[j]; 
                newTeam.addPlayer(player.name);                
                gameSetup.addWords(player.words);
                
            }
            gameSetup.addTeam(newTeam);
        }
        game = new GameLogic(settings, gameSetup)
        game.start();
    }
});

app.controller('TeamController',function(){
    this.team={
        players:[]
    };
    this.addTeam=function(gameCtrl){
        gameCtrl.teams.push(this.team);
        this.team={
            players:[]
        };
    }

});

app.controller('PlayerController',function(){
    this.player={
        words:[]
    };
    this.addPlayer=function(team){
        team.players.push(this.player);
        this.player={
            words:[]
        }
    }
});



function Team(teamName){
    var name=teamName;
    var players=[];
    var turn=0;
    var points=0;
    var words=[];
    
    function playerInTurn(){
        return players[turn];       
    }
    function nextPlayer(){
        if(turn<players.length-1){
            turn++;
        } else {
            turn=0;
        }
        return players[turn];
    }
    function addPoints(x){
        points = points+x;
        return points;
    }
    function addPlayer(player){
        players.push(player);
    }
    function removePlayer(player){
        for(var i = 0; i<players.length;i++){
            if(players[i]==player){
                for(var j = i; j<players.length;j++){
                    players[j]=players[j+1];
                }
                return players;
            }
        }
    }
    function setName(newName){
        name=newName;
    }
        function getName(){
        return name;
    }
    function addWord(word,round){
        if(words[round]==undefined){
            words[round]=[]
        }
        words[round].push(word);
    }
    function getPoints(){
        return points;
    }
    return{
        playerInTurn:playerInTurn,
        nextPlayer:nextPlayer,
        addPoints:addPoints,
        addPlayer:addPlayer,
        removePlayer:removePlayer,
        setName:setName,
        getName:getName,
        addWord:addWord,
        getPoints:getPoints
    };    
}

var settings = {
    turnLength:10000,
    rounds:3
};

function GameSetup() {
    var round = 1;
    var teams=[];
    var turn=0;
    var wordList=[];
    var guessed=[];
    for (var i = 0; i<wordList.length;i++){
        guessed[i]=undefined;
    }
    var wordIndex=0;
    
    function nextWord(correct){
        if(correct){
            guessed[wordIndex]=teams[turn];
            teams[turn].addWord(wordList[wordIndex],round)
        }
        for(var i = 0; i<wordList.length;i++){
            if(wordIndex<wordList.length-1){
                wordIndex++;
            } else {
                wordIndex=0;
            }
            if(guessed[wordIndex]==undefined){
                return wordList[wordIndex]
            }
        }
        return "ENDOFROUND";

    }
    
    function teamInTurn(){
        return teams[turn];
    }
    
    function nextTeamInTurn(){
        console.log(turn)
        if(turn<teams.length-1){
            turn++;
        } else {
            turn=0;
        }
        return teams[turn];
    }
    function addTeam(team){
        teams.push(team);
        return teams;
        round++;
    }
    
    function removePlayer(team){
        for(var i = 0; i<teams.length;i++){
            if(teams[i].getName==team){
                for(var j = i; j<team.length;j++){
                    team[j]=team[j+1];
                }
                return teams;
            }
        }
    }
    function savePoints(x){
        return teams[turn].addPoints(x);
    }
    function nextRound(){
        guessed=[];
        
        wordList = shuffle(wordList);
        for (var i = 0; i<wordList.length;i++){
            guessed[i]=undefined;
        }
        round++;
        
    }
    
    function shuffle(o){ //v1.0
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    };
    function getRound(){
        return round;
    }
    function getTeams(){
        return teams;
    }
    
    function addWords(newWords){
        wordList=wordList.concat(newWords);
    }
    return{
        savePoints:savePoints,
        nextWord:nextWord,
        addTeam:addTeam,     
        teamInTurn:teamInTurn,
        nextTeamInTurn:nextTeamInTurn,
        nextRound:nextRound,
        getRound:getRound,
        getTeams:getTeams,
        addWords:addWords
    };
    
};


        
function GameLogic(settings, setup){
    var setup = setup;
    var pointCounter = 0;
    var time;
    var clock;
    
    function start(){
        $("#setup").hide();
        showStartScreen();
        
    }
    
    
    function startTurn(){ 
        $("#startTurn").hide();
        time = settings.turnLength/1000;
        $("#timer").text(time);
        showGuessingScreen();
        clock = setInterval(function(){timer();}, 1000);
        nextWord(false);
    }
    function endTurn(){
        pointCounter=0;
        setup.teamInTurn().nextPlayer();
        setup.nextTeamInTurn();
        window.clearInterval(clock);
    }
        
    function endRound(){
    }
    
    function timer()  {
        time = time-1;
        if(time>0){
            $("#timer").text(time);
        } else {      
            showTurnEndScreen();
            endTurn();
            window.clearInterval(clock);
        }
    }
     
    function correctAnswer(){
        pointCounter++;
        nextWord(true);
    }
            
    function passWord(){
        pointCounter--;
        nextWord(false);
    }
        
    function nextWord(correct){
        var word = setup.nextWord(correct);
        console.log(word)
        if(word=="ENDOFROUND"){          
            showTurnEndScreen("ENDOFROUND");
            endTurn();
            endRound();
        } else {
            $("#word").text(word); 
        }
    }
      
    function showStartScreen(){
        var team = setup.teamInTurn();
        $("#endTurn").hide();
        $("#showPoints").hide();
        $("#startTurn").show();
        $("#teamInTurn").text("Joukkue: "+team.getName());
        $("#playerInTurn").text("Pelaaja: "+team.playerInTurn());
        $("#instructions").text(instructions[setup.getRound()]);
    }
    
    function showGuessingScreen(){
        $("#startTurn").hide();
        $("#guessing").show();
    }
    
    function showTurnEndScreen(gameStatus){    
        $("#guessing").hide();       
        $("#showPoints").show();
        $("#team").text(setup.teamInTurn().getName());
        $("#points").text("Kierroksen pisteet: " + pointCounter);
        $("#totalPoints").text("Kokonaispisteet: " + setup.savePoints(pointCounter));
        if(gameStatus=="ENDOFROUND"){
            if(setup.getRound()<settings.rounds){
                $("#endRound").show();
            } else {
                $("#endGame").show();
            }
        } else {
            $("#endTurn").show();
        }
        
        
    }
    function showEndRoundScreen(){
        $("#guessing").hide(); 
        $("#endRound").show();
        $("#showPoints").show();
        $("#team").text(setup.teamInTurn().getName());
        $("#points").text("Kierroksen pisteet: " + pointCounter);
        $("#totalPoints").text("Kokonaispisteet: " + setup.savePoints(pointCounter)); 
    }
    
    function showEndGameScreen(){ 
        $("#endGame").hide();
        $("#showPoints").hide();
        $("#endGameScreen").show();
        var teams = setup.getTeams();
        for (var i = 0; i<teams.length;i++){
            $("#results").append("<tr><td>"+teams[i].getName()+"</td><td>" + teams[i].getPoints()+"</td></tr>");
        }
    }
    function nextRound(){
        setup.nextRound();
        showStartScreen();
        $("#endRound").hide();
    } 
    function addTeam(){
        var name = $("#newTeamName").value().toString();
        var name = $("#newTeamName").value("");
    }

    
    return{
        addTeam:addTeam,
        start:start,
        startTurn:startTurn,
        correct:correctAnswer,
        pass:passWord,
        showStartScreen:showStartScreen,
        nextRound:nextRound,
        showEndGameScreen:showEndGameScreen
    };
};



var instructions = [];
instructions[1] = "Saat puhua niin paljon kuin haluat, kunhan et käytä selitettäviä sanoja, jotka sisältyvät selitettävään sanaan/asiaan.";
instructions[2] = "Saat sanoa vain yhden sanan, joka ei saa sisältyä selitettävään sanaan/asiaan.";
instructions[3] = "Et saa sanoa mitään.";



