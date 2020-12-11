const express = require('express')
const router = express.Router()
const { MessagingResponse } = require('twilio').twiml;
const responses = require("./responses")
const { checkValid, groupBy} = require("./utility")


let state = { key: null, user: null}
let currentUser = null;
let votes =  [
    {candidate: 1, user: "+23400000000"},
    {candidate: 2, user: "+234494002233"},
    {candidate: 1, user: "+234224940033"},
    {candidate: 2, user: "+234494003003"},
    {candidate: 2, user: "+234494002203"},
    {candidate: 3, user: "+234224940030"},

]

let candidates = [
    {
        id: 1, name:"Donald Trump and Pence"
    },
    {
        id: 2, name:"Joe Biden and Kamala"
    },
    {
        id: 3, name:"Chi Chi and Badmus"
    },
]

//////////////////// Candidate Section ////////////////////

/**
 * Adds more candidates to the candidates pool
 * @return {String} Response message
 */
const addCandidate = (val) => {
    
    if(state.key === 4 && state.user == currentUser ){
        if(String(val).length === 0) return responses.no_candidate_supplied
        let pivot = candidates.length + 1;
        let newCand = String(val).split(',').map((e,i) => {
            return {id: pivot + i, name: e}
        })
        candidates = [...candidates,...newCand]
        return responses.added_candidates 
     }else{
         state.key = 4
         state.user = currentUser
         return responses.confirm_add_of_candidates()
    }

}

/**
 * Shows all available candidates
 * @return {String} Response message
 */
const showCandidates = () => {
    if(candidates.length === 0) return responses.no_candidate
    return `
    List of Candidates:
    \n`
    +candidates.map((e,i) => {
        return `\n ${i+1} - ${e.name}`
    })
}

/**
 * Deletes all available candidates
 * @return {String} Response message
 */
const clearCandidates = () => {
    if(candidates.length === 0) return responses.no_candidate

    if(state.key === 6 && state.user == currentUser ){
        candidates = []
        return responses.deleted_candidates 
     }else{
         state.key = 6
         state.user = currentUser
         return responses.confirm_delete_of_candidates()
    }

}

/////////////////// Candidate Section Ends /////////////////////


//////////////// Vote Section  /////////////////////////


/**
 * Adds a users vote
 * @param {String} from - Voters identity
 * @param {Number} val - Candidate Identity
 * @return {String} Response message
 */

const addVote = (from,val) => {
    //Checks if candidate supplied by voter is a valid candidate
    if (!checkValid(candidates,val,'id')){
            state.key = 1;
            state.user = currentUser;
            return responses.chooseValidCandidate(from) + '\n' +responses.list_of_candidate(showCandidates)
        }
    votes.push({ candidate: val, user: from})
    return responses.valid_vote(from)
}


/**
 * Used to cast users vote
 * @param {String} from - Voters identity
 * @param {Number} [val] - Candidate id
 * @return {String} Response message
 */
const castVote = (from,val) => { 

    
    //Checks if user has already casted vote
    if (checkValid(votes,from,'user')) return responses.duplicate_vote(from)
   if(state.key === 1 && state.user == currentUser ){
       state.key = null
       state.user = null
       if(candidates.length ===0) return responses.no_candidate;
       return addVote(from,val)
    }else{
        
        if(candidates.length ===0) return responses.no_candidate;
        state.key = 1
        state.user = currentUser
        return responses.list_of_candidate(showCandidates)
   }
}


/**
 * Deletes all available votes
 * @return {String} Response message
 */
const clearVotes = () => {
    if(votes.length === 0) return responses.no_votes

    if(state.key === 7 && state.user == currentUser ){
        votes = []
        return responses.deleted_votes 
     }else{
         state.key = 7
         state.currentUser
         return responses.confirm_delete_of_votes()
    }

}

/**
 * Used to format response
 * @param {Array} res - Array of votes grouped by candidates id
 * @return {Object} Response message
 */

const formatResult = (res) => {
    let candidate = []
    for(key in res){
        candidate.push({
            name: candidates.filter(e => e.id === Number(key))[0].name,
            percentage: Math.round((res[key].length / votes.length) * 100),
            total: res[key].length
        })
    }
    candidate.sort((a,b) => b.total - a.total )
    return {
        winner: candidate[0].total && candidate[1] && candidate[0].total === candidate[1].total ? "😇 We currently have a draw!" : `🌟 ${candidate[0].name} 🌟`,
        candidate
    }
}

/**
 * Shows results of votes cast
 * @return {String} Response message
 */

const showResult = () => {
    if(votes.length === 0) return responses.no_votes
    if(candidates.length === 0) return responses.no_candidate
    
    let result = groupBy(votes,'candidate');
    result = formatResult(result)
    return `
    ---- General Statistics -----
    Total Votes cast: ${votes.length}
    Result breakdown:
    \n
    ${ responses.showResult(result)}


    -----  Winner so far  ------
    ${result.winner}
    Time:    ${new Date()}
`
}

//////////////// Vote Section Ends  /////////////////////////


//////////////// Display Messages //////////////////////////

/**
 * Shows default message
 * @return {String} Response message
 */

const showDefaultMessage = () => {
    return `
    💥 💥 Welcome to E-Voter 💥 💥
         --- All ---
        1 - Vote
        2 - See Candidates
        3 - See results

        --- Admin --- 
        4 - Add Candidate
        5 - Delete Candidate
        6 - Clear Candidates
        7 - Clear Votes
        8 - Help
    `
}


/**
 * Used to show help to users
 * @return {String} Response message
 */
const showHelp = () => {
    return `
    💥 💥 Welcome to E-Voter 💥 💥
         --- All ---
        1 - Vote : Allows user to vote by entering candidate id
        2 - See Candidates: See all participating candidate
        3 - See results : See the breakdown of results

        --- Admin --- 
        4 - Add Candidate: Add more candidate, 
                a comma sepearted list to add in bulk
                e.g joshua,Gbenga,kdkd
        5 - Delete Candidate - Delete a candidate and their votes,

        6 - Clear Candidates - Removes all candidates from the application
        7 - Clear Votes - Removes all votes cast so far from the application
        8 - Help - Shows this help message
    `
}


const footer = `

  Created With ❤️ by Chibuike 🔥 (chibuikenwa.com)

`

/////////////// Display Messages Ends ///////////////////

router.post('/', function(req, res, next) {
    const twiml = new MessagingResponse();
    let result = null
    const q = req.body.Body;
    let voter = req.body.From.split(":")[1]
    currentUser = voter;
    try {
    
        if(state.key && state.user == currentUser ){
        
          switch(state.key){
            case 1:
                if(Number(q) === 0){
                    state.key = null;
                    state.user = null;
                    result =  responses.cancelVote
                }else{

                   result =  castVote(voter,Number(q));
                }
                break;
            case 4:
                q === 0 ? result =  responses.cancelAddCandidates : result =  addCandidate(q);
                state.key = null;
                state.user = null;
                break;
            case 6:
                Number(q) === 1 ? result = clearCandidates() : result =  responses.cancelDeleteCandidates;
                state.key = null;
                state.user = null;
                break;
            case 7:
                Number(q) === 1 ? result = clearVotes() : result =  responses.cancelDeleteVotes;
                state.key = null;
                state.user = null;
                break;
            default:
                result = showHelp()
                break;
        }
    }else{
        switch(Number(q)){
            case 1:
            result = castVote(voter)
            break;
            case 2:
            result = showCandidates()
            break;
            case 3:
            result = showResult()
            break;
            case 4:
            result = addCandidate()
            break;
            case 5:
            result = deleteCandidate()
            break;
            case 6:
            result = clearCandidates()
            break;
            case 7:
            result = clearVotes()
            break;
            case 8:
            result = showHelp()
            break;
            default:
            result = showDefaultMessage()
                
        }    
        
    }
    twiml.message(result+'\n'+footer);
    return res.status(200).send(twiml.toString())
    
} catch (error) {
      return next(error);
    }
      
});

module.exports = router;
