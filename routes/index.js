const router = require('../node_modules/express').Router();
const Idea = require('../db').Idea;
const User = require('../db').User;
const Participant = require('../db').Participant;
const Comment = require('../db').Comment;
const passport = require('../node_modules/passport/lib');
const isLoggedIn = require('../controllers/auth-controller').isLoggedIn;
const isAdmin = require('../controllers/auth-controller').isAdmin;

//Home
router.get('/', async (req, res) => {
    let ideas = await Idea.findAll();
    res.render('home', { ideas });
});

//Detail page
router.get('/detail/:id', async (req, res) => {
    let id = req.params.id;
    let idea = await Idea.findByPk(req.params.id, {
        include: [
            {
                model: Participant,
                model: Comment,
            },
        ],
    });

    res.render('detail', { idea, id });
});

//Comment page
router.get('/comment/:id', async (req, res) => {
    let ideaId = req.params.id;
    let idea = await Idea.findByPk(req.params.id, {
        include: [
            {
                model: Participant,
                model: Comment,
            },
        ],
    });
    res.render('comment', { idea, ideaId });
});

router.post('/comment/:id', async (req, res) => {
    let { id, comment } = req.body;
    let ideaId = req.params.id;
    try {
        if (id) {
            comment = await Comment.findByPk(id);
            comment.comment = comment;
            await participant.save();
        } else {
            comment = await Comment.create(req.body);
            comment.ideaId = ideaId;
            await comment.save();
        }
    } catch (e) {
        console.log(e);
    }

    res.redirect('/detail');
});

//Counter
let counter = 0;
router.get('/api/increment', (req, res) => {
    counter++;
    res.json({ counter });
});

//Howto page
router.get('/howto', (req, res) => {
    res.render('howto');
});

//Login page
router.get('/login', (req, res) => {
    res.render('login', { flashes: req.flash('error') });
});

router.post(
    '/login',
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: 'Your username or password is incorrect',
    }),
    (req, res) => {
        res.redirect('/myaccount');
    }
);

router.get('/loginGithub', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
    '/auth/callback',
    passport.authenticate('github', {
        failureRedirect: '/login',
        failureFlash: 'Failed to login',
    }),
    (req, res) => {
        res.redirect('/myaccount');
    }
);

//register
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
    let { username, password } = req.body;
    User.register(username, password, (err, registerdUser) => {
        if (err) {
            res.status(500).send();
        }
        res.redirect('/register2');
    });
});

router.get('/register2', (req, res) => {
    res.render('register2');
});

/*
//for admin page
router.use(isAdmin);

router.get('/admin', (req, res) =>{
    let ideas = Idea.findAll
    
    res.render('admin', { ideas });
});

router.get('/idea', (req, res) => {
    res.render('idea');
});
*/

router.use(isLoggedIn);

//Join page
router.get('/join/:id', async (req, res) => {
    let idea = await Idea.findByPk(req.params.id);
    let ideaId = req.params.id;
    let summary = idea.summary;
    res.render('join', { ideaId, summary });
});

router.post('/join/:id', async (req, res) => {
    let { id, name, email, position, reason } = req.body;
    let ideaId = req.params.id;

    let participant;
    try {
        if (id) {
            participant = await Participant.findByPk(id);
            participant.name = name;
            participant.email = email;
            participant.position = position;
            participant.reason = reason;

            await participant.save();
        } else {
            participant = await Participant.create(req.body);
            participant.ideaId = ideaId;
            await participant.save();
        }
    } catch (e) {
        console.log(e);
    }

    res.redirect('/myaccount');
});

//MyAccount page
router.get('/myaccount', async (req, res) => {
    let ideas = await Idea.findAll({
        where: {
            userId: req.user.id,
        },
    });
    /*
    let paticipants = await Participant.findAll({
        where:{
            ideaId: req.idea.id
        }
    })
    */
    res.render('myaccount', { ideas });
});

//Calculator
router.get('/calculator', (req, res) => {
    res.render('calculator');
});

router.post('/calculator', async (req, res) => {
    let total1 = req.body.hourlyIncome * req.body.count1 * 2080;
    let total2 = req.body.amount * req.body.count2;
    let totalAmount = total1 + total2;
    res.redirect('/calculator', { totalAmount });
});

// Creating an idea
router.get('/idea', (req, res) => {
    res.render('idea');
});

router.post('/idea', async (req, res) => {
    let {
        id,
        summary,
        description,
        initialCost,
        runningCost,
        goalYears,
        numberOfParticipant,
    } = req.body;

    let idea;
    try {
        if (id) {
            idea = await Idea.findByPk(id);
            idea.summary = summary;
            idea.description = description;
            idea.initialCost = Number.parseInt(initialCost);
            idea.runningCost = Number.parseInt(runningCost);
            idea.goalYears = Number.parseInt(goalYears);
            idea.numberOfParticipant = Number.parseInt(numberOfParticipant);

            await idea.save();
        } else {
            idea = await Idea.create(req.body);
            idea.userId = req.user.id;
            await idea.save();
        }
    } catch (e) {
        console.log(e);
    }

    res.redirect('/idea2');
});

router.get('/idea2', (req, res) => {
    res.render('idea2');
});

//Edit ideas
router.get('/edit/:id', async (req, res) => {
    let idea = await Idea.findByPk(req.params.id);
    res.render('edit', { idea });
});

router.post('/edit/:id', async (req, res) => {
    let {
        id,
        summary,
        description,
        initialCost,
        runningCost,
        goalYears,
        numberOfParticipant,
    } = req.body;
    let idea;

    idea = await Idea.findByPk(id);
    idea.summary = summary;
    idea.description = description;
    idea.initialCost = Number.parseInt(initialCost);
    idea.runningCost = Number.parseInt(runningCost);
    idea.goalYears = Number.parseInt(goalYears);
    idea.numberOfParticipant = Number.parseInt(numberOfParticipant);

    await idea.save();

    res.redirect('/myaccount');
});

//Delete ideas
router.get('/delete/:id', async (req, res) => {
    await Idea.destroy({
        where: {
            id: req.params.id,
        },
    });
    res.redirect('/myaccount');
});

//Analysis
router.get('/analysis/:id', async (req, res) => {
    let idea = await Idea.findByPk(req.params.id);
    let ideaId = req.params.id;
    let summary = idea.summary;

    try {
        if (ideaId) {
            let initial = idea.initialCost;
            let running = idea.runningCost;
            let TRunning = running * 12;
            let TEx = initial + TRunning;
            let goalMonth = idea.goalYears;
            let GMEx = initial + running * goalMonth;
            let T1 = initial + running;
            let F3Income = 0;
            let income = GMEx / (goalMonth - 3);
            let TIncome = income * 9;
            let M1Noi = F3Income - T1;
            let M23Noi = F3Income - running;
            let MrestNoi = income - running;
            let totalMNoi = M1Noi + (MrestNoi + MrestNoi) + MrestNoi * 9;
            let T2Noi = M1Noi + M23Noi;
            let T3Noi = T2Noi + M23Noi;
            let T4Noi = T3Noi + MrestNoi;
            let T5Noi = T4Noi + MrestNoi;
            let T6Noi = T5Noi + MrestNoi;
            let T7Noi = T6Noi + MrestNoi;
            let T8Noi = T7Noi + MrestNoi;
            let T9Noi = T8Noi + MrestNoi;
            let T10Noi = T9Noi + MrestNoi;
            let T11Noi = T10Noi + MrestNoi;
            let T12Noi = T11Noi + MrestNoi;

            let TNoi = [];
            for (i = 0; i < 12; i++) {
                let F2TNoi = M23Noi;
            }

            let TFyearNoi =
                totalMNoi +
                T2Noi +
                T3Noi +
                T4Noi +
                T5Noi +
                T6Noi +
                T7Noi +
                T8Noi +
                T9Noi +
                T10Noi +
                T11Noi +
                T12Noi;

            /*
            let chart = [];
            for (i = 0; i < 12; i++) {
                let MonthlyNoi = income[i] - running[i]
                let TotalNoi = MonthlyNoi[i].reduce((prev, curr) => prev + curr);
                chart.push(totalNoi)
            }
        */
            res.render('analysis', {
                idea,
                summary,
                ideaId,
                TEx,
                goalMonth,
                GMEx,
                initial,
                running,
                F3Income,
                income,
                TRunning,
                T1,
                TIncome,
                M1Noi,
                M23Noi,
                MrestNoi,
                totalMNoi,
                T2Noi,
                T3Noi,
                T4Noi,
                T5Noi,
                T6Noi,
                T7Noi,
                T8Noi,
                T9Noi,
                T10Noi,
                T11Noi,
                T12Noi,
                TFyearNoi,
            });
        }
    } catch (e) {
        console.log(e);
    }
});

//logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
