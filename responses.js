let responses = {
    duplicate_vote : (from) => `😕, ${from} you are not allowed to vote more than once!`,
    valid_vote : (from) => ` Thank you, ${from}, your vote has been taken ✔️`,
    chooseValidCandidate: (from) => `😕, ${from}, please choose a valid candidate`,
    no_candidate:  '😕 There are no candidates now',
    no_votes: '😕 No votes cast so far',
    deleted_candidates: ` 👍 All Candidates have been removed`,
    deleted_votes: ` 👍 All Votes have been removed`,
    list_of_candidate: (showCandidates) => {
        let respo = showCandidates()
        respo+= `\n 0 - Cancel`
        return respo
    },
    confirm_delete_of_candidates:  () => {
        let respo = `
        Are you sure you want to remove all candidates?

        1 - to continue
        
        \n Any key - Cancel`
        
        return respo
    },
    confirm_delete_of_votes:  () => {
        let respo = `
        Are you sure you want to remove all votes so far?

        1 - to continue
        
        \n Any key - Cancel`
        
        return respo
    },
    cancelVote: '👍 Voting has been cancelled',
    cancelDeleteCandidates:  '👍 Deletion of Candidates has been cancelled',
    cancelDeleteVotes: '👍 Deletion of Votes has been cancelled',
    showResult: (res) => {
        return res.candidate.map(e => 
            `${e.name} - ${e.percentage}% of votes cast - ${e.total} votes accumulated`
        ).join('\n')
    }
}
 module.exports  = responses