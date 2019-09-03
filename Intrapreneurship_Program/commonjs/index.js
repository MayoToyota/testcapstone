const jquery = fds;

function like(tweetId){
   let count = await axios.get("/like/" + tweetId);
   $("#like" + tweetId).value = count;
 
}

{ likeCount: 1}

"/like/:tweetId", (req, res) => {
    res.json({ likeCount: 1})
}