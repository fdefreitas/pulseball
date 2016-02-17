/* global $ */

var PULSEBALL = (function(){
    var rankings = {};
    var localStorage = window.localStorage;
    var KEY_RANKINGS = 'rankings';
    
    loadPersistedRankings();
    
    return {
        init: init,
        getRankings: getRankings,
        addMatch: addMatch
    };
    
    /** 
     * Initializes internal rankings 
     * @param {object} rankingsParam - rankings object to store inside application
     */
    function init(rankingsParam){
        rankings = rankingsParam;
        localStorage[KEY_RANKINGS] = JSON.stringify(rankings);
        console.log('rankings:', rankings);
        return rankings;
    }
    
    /** 
     * Getter. Returns the ranking array 
     */
    function getRankings(){
        return rankings;
    }
    
    /** 
     * Checks match status and updates rankings 
     * @param {object} matchParam - match object to process
     */
    function addMatch(matchParam){
        switch(matchParam.status.toUpperCase()){
            case 'U':
                console.warning("This match has not started yet. Current Status: (U) Upcoming");
                break;
            case 'L':
                console.warning("This match has not ended yet. Current Status: (L) Live");
                break;
            case 'C':
                updateRankingForMatch(matchParam);
                break;
            default:
                console.error("Invalid match status");
                break;
        }
        
        return matchParam;
       
        /** 
         * Updates rankings from match 
         * @param {object} match - match object to process
         */ 
        function updateRankingForMatch(match){
            var team1Id = match.teams[0].id;
            var team2Id = match.teams[1].id;
            var team1;
            var team2;
            var modifier;
            
            rankings.forEach(findTeamsIndex);
            
            var rankingDiff = getRankingDiff(team1, team2);
                
            switch (match.outcome.toUpperCase()){                
                case "A":
                    modifier = 1 - (rankingDiff / 10);
                    team1.pts = team1.pts + modifier;
                    team2.pts = team2.pts - modifier;
                    break;
                case "B":
                    modifier = 1 + (rankingDiff / 10);
                    team1.pts = team1.pts - modifier;
                    team2.pts = team2.pts + modifier;
                    break;
                case "D":
                    modifier = rankingDiff / 10;
                    team1.pts = team1.pts - modifier;
                    team2.pts = team2.pts - modifier;
                    break;
                case "N":
                    return;
                default:
                    console.error("Invalid match outcome");
                    return;
            }
            
            team1.pts = +team1.pts.toFixed(2);
            team2.pts = +team2.pts.toFixed(2);
            
            sortRankings(); 
            
            return match;
            
            function findTeamsIndex(elem, index, array){
                if (elem.team.id === team1Id){
                    team1 = elem;
                }
                if (elem.team.id === team2Id){
                    team2 = elem;
                }
            }
            
            function getRankingDiff(){
                var result = team1.pts + 3 - team2.pts;
                if(result > 10){ result = 10; } 
                if(result < -10){ result = -10; }
                return result;
            }            
        }
    }
    
    /** 
     * Internal method, sorts the rankings array
     */
    function sortRankings(){
        var counter = 0;
        rankings = rankings.sort(sortCompare);
        rankings = rankings.map(positionMapper);
        updateTable();
        
        function sortCompare(a, b){
            counter = counter + 1;
            if (a.pts > b.pts) { return -1; }
            if (a.pts < b.pts) { return 1; }
            return 0;
        }
        
        function positionMapper(elem, index){
            elem.pos = index + 1;
            return elem;
        }   
    }
    
    function updateTable(){
        localStorage[KEY_RANKINGS] = JSON.stringify(rankings);
        $(function() {
            $('#rankings-table tr').remove();
            $.each(rankings, function(i, item) {
                var tr= $('<tr>').append(
                    $('<td>').text(item.pos),
                    $('<td>').text(item.team.name),
                    $('<td>').text(item.pts)
                );
                if(i < 3){ tr.addClass('success'); }
                tr.appendTo('#rankings-table');
            });
        });
    }
    
    /** 
     * Internal loading method
     * @description Tries to load persisted rankings 
     * to avoid showing and empty table
     */
    function loadPersistedRankings(){
        if(localStorage.hasOwnProperty(KEY_RANKINGS)){
            rankings = JSON.parse(localStorage[KEY_RANKINGS]);
            updateTable();
        }
    }
})();

// Test rankings
var rankTest = [
{ "team": { 
         "name": "Australia", 
         "id": 32 
    }, 
    "pos": 1, 
    "pts": 54.23 
},
{ "team": { 
        "name": "New Zealand", 
        "id": 62 
    }, 
    "pos": 2, 
    "pts": 54.00 
},
{ "team": { 
        "name": "France", 
        "id": 2
    }, 
    "pos": 3, 
    "pts": 52.95 
},
{ "team": { 
        "name": "England", 
        "id": 1 
    }, 
    "pos": 4, 
    "pts": 52.32 
    },
{ "team": { 
        "name": "Romania", 
        "id": 24 
    }, 
    "pos": 5, 
    "pts": 43.50 
}
];

// Test match
var matchTest = {
 "matchId": 2524,
 "description": "Match 2",
 "venue": {
    "id": 900,
    "name": "Stadium",
    "city": "Paris",
    "country": "France"
 },
 "teams": [
    {
        "id": 2,
        "name": "France",
        "abbreviation": "FRA"
    },
    {
        "id": 1,
        "name": "England",
        "abbreviation": "ENG"
    }
 ],
 "scores": [ 19, 23 ],
 "status": "C",
 "outcome": "B"
}
