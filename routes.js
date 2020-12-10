const express = require('express')
const router = express.Router()
const { MessagingResponse } = require('twilio').twiml;

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
let state = { key: null, level:null}
let responses = {
    duplicate_vote : (from) => `😕, ${from} you are not allowed to vote more than once!`,
    valid_vote : (from) => ` Thank you, ${from}, your vote has been taken ✔️`,
    chooseValidCandidate: (from) => `😕, ${from}, please choose a valid candidate`,
    no_candidate:  '😕 There are no candidates now',
    no_votes: '😕 No votes cast so far',
    list_of_candidate: () => {
        let respo = showCandidates()
        if(respo){

            respo+= `\n 0 - Cancel`
        }else{
            respo= `\n😕 There are no candidates now \n 0 - Cancel`
        }
        return respo
    },
    cancelVote: () => {
        state.key = null
        return '👍 Voting has been cancelled'
    },
    showResult: (res) => {
        return res.candidate.map(e => 
            `${e.name} - ${e.percentage}% of votes cast - ${e.total} votes accumulated`
        ).join('\n')
    }
}

const checkValid = (arr,needle,key) => {
    return arr.find(x => x[key] === needle);
}

const addVote = (from,val) => {
    if (!checkValid(candidates,val,'id')){
            state.key = 1;
            return responses.chooseValidCandidate(from) + '\n' +responses.list_of_candidate()
        }
    votes.push({ candidate: val, user: from})
    return responses.valid_vote(from)
}

const castVote = (from,val) => { 
   if (checkValid(votes,from,'user')) return responses.duplicate_vote(from)
   if(state.key === 1){
        state.key = null
        return addVote(from,val)
   }else{
        state.key = 1
        return responses.list_of_candidate()
   }
}

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

const showCandidates = () => {
    if(candidates.length === 0) return responses.no_candidate
    return `
    List of Candidates:
    \n`
    +candidates.map((e,i) => {
        return `\n ${i+1} - ${e.name}`
    })
}

//Result section
//
const groupBy = (objectArray, property) => {
   return objectArray.reduce((acc, obj) => {
      const key = obj[property];
      if (!acc[key]) {
         acc[key] = [];
      }
      // Add object to list for given key's value
      acc[key].push(obj);
      return acc;
   }, {});
}

const addKeys = (res) => {
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
const showResult = () => {
    if(votes.length === 0) return responses.no_votes
    if(candidates.length === 0) return responses.no_candidate
    
    let result = groupBy(votes,'candidate');
    result = addKeys(result)
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
const footer = `

  Created With ❤️ Chibuike 🔥 (chibuikenwa.com)

`

const showHelp = () => {
    return `
    💥 💥 Welcome to E-Voter 💥 💥
         --- All ---
        1 - Vote : Allows user to vote, simply
        2 - See Candidates: See all particpating candidate
        3 - See results : See the breakdown of results

        --- Admin --- 
        4 - Add Candidate: Add more candidate, 
                a comma sepearted list to add in bulk
                e.g joshua,Gbenga,kdkd
        5 - Delete Candidate - Delete a candidate and their votes,

        6 - Clear Candidates
        7 - Clear Votes
        8 - Help
    `
}
router.post('/', function(req, res, next) {
    const twiml = new MessagingResponse();
    let result = null
    const q = Number(req.body.Body);
    let voter = req.body.From.split(":")[1]
    try {
    
        if(state.key){
        
          switch(state.key){
            case 1:
                result = q === 0 ? responses.cancelVote() :castVote(voter,q);
                break;
            default:
                result = showHelp()
                break;
        }
    }else{
        switch(q){
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
            result = deleteCandidates()
            break;
            case 6:
            result = clearCandidate()
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
