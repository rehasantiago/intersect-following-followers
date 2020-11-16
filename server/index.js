const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 5000;

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());// DB Config
app.use(cors());

app.use(function (req, res, next) {
    console.log(req.body);
    next();
});

const intersection = (list1, list2) =>
    list1.filter(
        (set => a => set.has(a.id))(new Set(list2.map(b => b.id)))
    );

app.post("/user", async (req, res) => {
    let isUser = await axios.get(`https://api.github.com/users/${req.body.user}`).catch((err) => {
        return res.json({
            success: false,
            message: "User not found"
        })
    });
    if (isUser && isUser.data) {
        isUser = isUser.data;

        return res.json({
            success: true,
            message: ""
        })
    }

})

app.post("/get-users", async (req, res) => {
    let user1 = req.body.user1;
    let user2 = req.body.user2;
    let following = await axios.get(`https://api.github.com/users/${user1}/following`).catch((err) => {
        return res.json({
            success: false,
            message: "Github API rate limit"
        })
    });
    let followers = await axios.get(`https://api.github.com/users/${user2}/followers`).catch((err) => {
        return res.json({
            success: false,
            message: "Github API rate limit"
        })
    });

    if(following && following.data && followers && followers.data){
        following = following.data;
        followers = followers.data;
        let usersIntersect = intersection(following, followers);
        if (usersIntersect.length) {
            return res.json({
                success: true,
                users: usersIntersect
            })
        } else {
            return res.json({
                success: false,
                message: "no intersection found"
            })
        }
    }

})

app.listen(port, function () {
    console.log('running at localhost: ' + port);
});