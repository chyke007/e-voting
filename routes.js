const express = require('express')
const router = express.Router()
const { MessagingResponse } = require('twilio').twiml;

let votes =  []
let candidates = [
    {
        id: 1, name:"Donald Trump & Pence"
    },
    {
        id: 2, name:"Joe Biden & Kamala"
    },
]
let state = { key: null, level:null}
let responses = {
    duplicate_vote : (from) => `Oops!, ${from} You are not allowed to vote more than once!`,
    valid_vote : (from) => ` Thank you, ${from}, your vote has been taken`,
    list_of_candidate: () => {
        let respo = showCandidates()
        respo+= `\n 0 - Cancel`
        return respo
    },
    cancelVote: () => {
        state.key = null
        return 'Voting has been cancelled'
    }
}

const checkValid = (arr,needle,key) => {
    return arr.find(x => x[key] === needle);
}

const addVote = (from,val) => {
    votes.push({ candidate: val, user: from})
    console.log(votes)
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
   Welcome to E-Voter
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
    return `
    List of Candidates:
    \n`
    +candidates.map((e,i) => {
        return `\n ${i+1} - ${e.name}`
    })
}

//Show Result
const showResult = () => {
    return `
    ---- General Statistics -----
    Total Votes cast: ${votes.length}
    Result breakdown:
    \n

    Donald Trump and Pence - 65% of Votes cast


    -----  Winner  ------
    Donald Trump

    Created with love by Chibuike(chibuikenwa.com)
    `
}

const showHelp = () => {
    return `
    Welcome to E-Voter
         --- All ---
        1 - Vote : Allows user to vote, simply
        2 - See Candidates: See all particpating candidate
        3 - See results : See the breakdown of results

        --- Admin --- 
        4 - Add Candidate: Add more candiate, 
                a comma sepearted list to add in bulk
                e.g joshua,Gbenga,kdkd
        5 - Delete Candidate - Delete a candiate and their votes,

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
        console.log(state)
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
            result = clearVotes(q,voter)
            break;
            case 5:
            result = clearCandidates(q,voter)
            break;
            case 6:
            result = addCandidate(q,voter)
            break;
            case 7:
            result = addCandidate(q,voter)
            break;
            case 8:
            result = showHelp()
            break;
            default:
            result = showDefaultMessage()
                
        }    
        
    }
    twiml.message(result);
    return res.status(200).send(twiml.toString())
    
} catch (error) {
      return next(error);
    }
      
});

module.exports = router;
