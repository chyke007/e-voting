let responses = {
    duplicate_vote : (from) => `😕, ${from} you are not allowed to vote more than once!`,
    valid_vote : (from) => ` Thank you, ${from}, your vote has been taken ✔️`,
    chooseValidCandidate: (from) => `😕, ${from}, please choose a valid candidate`,
    no_candidate:  '😕 There are no candidates now',
    no_votes: '😕 No votes cast so far',
    list_of_candidate: (showCandidates) => {
        let respo = showCandidates()
        if(respo){

            respo+= `\n 0 - Cancel`
        }else{
            respo= `\n😕 There are no candidates now \n 0 - Cancel`
        }
        return respo
    },
    cancelVote: () => {
        return '👍 Voting has been cancelled'
    },
    showResult: (res) => {
        return res.candidate.map(e => 
            `${e.name} - ${e.percentage}% of votes cast - ${e.total} votes accumulated`
        ).join('\n')
    }
}
 module.exports  = responses