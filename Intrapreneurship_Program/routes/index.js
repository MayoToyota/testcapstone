const router = require('../node_modules/express').Router();
const Idea = require('../db').Idea;
const User = require('../db').User;
const Participant = require('../db').Participant;
const Comment = require('../db').Comment
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

    let idea = await Idea.findByPk(req.params.id, {
        include: [
            {
                model: Participant,
                model: Comment
            }
        ]
    });

    res.render('detail', { idea })
});


//Comment page
router.get('/comment/:id', async (req, res) => {
    let idea = await Idea.findByPk(req.params.id, {
        include: [
            {
                model: Participant,
                model: Comment
            }
        ]
    });

    res.render('detail', { idea })

});

router.post('/comment/:id', async (req, res) => {
    let { id } = req.params;
    await Idea.upsert(req.body)

    let reflect = `/comment/${id}`
    res.redirect(reflect)
});


//Counter
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Counter', counter });
});

router.get('/api/increment', (req, res) => {
    counter++;
    res.json({ counter })
})


//Howto page
router.get('/howto', (req, res) => {
    res.render('howto');
});

//Login page
router.get('/login', (req, res) => {
    res.render('login', { flashes: req.flash('error') });
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: 'Your username or password is incorrect' }), (req, res) => {
    res.redirect('/myaccount');
});

router.get('/loginGithub', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/auth/callback',
    passport.authenticate('github', { failureRedirect: '/login', failureFlash: 'Failed to login' }),
    (req, res) => { res.redirect('/myaccount') }
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
    res.render('join')
});

router.post('/join/:id', async (req, res) => {
    let { id, name, email, position, reason } = req.body;

    let participant;
    try {
        if (id) {
            participant = await Participant.findByPk(id)
            participant.name = name
            participant.email = email
            participant.position = position
            participant.reason = reason

            await participant.save()
        }
        else {
            participant = await Participant.create(req.body);
            participant.ideaId = req.idea.id;
            await participant.save()
        }
    }
    catch (e) {
        console.log(e)
    }

    res.redirect('/myaccount')
});

//MyAccount page
router.get('/myaccount', async (req, res) => {
    let ideas = await Idea.findAll({
        where: {
            userId: req.user.id

        }
    });
    res.render('myaccount', { ideas });
});


//Calculator
router.get('/calculator', (req, res) => {
    res.render('calculator');
});

router.post('/calculator', async (req, res) => {
    let total1 = req.body.hourlyIncome * req.body.count1 * 2080
    let total2 = req.body.amount * req.body.count2
    let totalAmount = total1 + total2
    res.redirect('/calculator', { totalAmount });
})

// Creating an idea
router.get('/idea', (req, res) => {
    res.render('idea');
});

router.post('/idea', async (req, res) => {
    let { id, summary, description, initialCost, runningCost, goalYears, numberOfParticipant } = req.body;

    let idea;
    try {
        if (id) {
            idea = await Idea.findByPk(id);
            idea.summary = summary
            idea.description = description
            idea.initialCost = Number.parseInt(initialCost)
            idea.runningCost = Number.parseInt(runningCost)
            idea.goalYears = Number.parseInt(goalYears)
            idea.numberOfParticipant = Number.parseInt(numberOfParticipant)

            await idea.save();
        }
        else {
            idea = await Idea.create(req.body);
            idea.userId = req.user.id;
            await idea.save();
        }
    }
    catch (e) {
        console.log(e)
    }

    res.redirect('/idea2');
});

router.get('/idea2', (req, res) => {
    res.render('idea2');
});


//Edit ideas
router.get('/edit/:id', async (req, res) => {
    let idea = await Idea.findByPk(req.params.id)
    res.render('edit', { idea })
});


router.post('/edit/:id', async (req, res) => {
    let { id, summary, description, initialCost, runningCost, goalYears, numberOfParticipant } = req.body;
    let idea;

    idea = await Idea.findByPk(id);
    idea.summary = summary
    idea.description = description
    idea.initialCost = Number.parseInt(initialCost)
    idea.runningCost = Number.parseInt(runningCost)
    idea.goalYears = Number.parseInt(goalYears)
    idea.numberOfParticipant = Number.parseInt(numberOfParticipant)

    await idea.save();

    res.redirect('/myaccount');
})

//Delete ideas
router.get("/delete/:id", async (req, res) => {
    await Idea.destroy({
        where: {
            id: req.params.id
        }
    })
    res.redirect("/myaccount")

})

//analysis
router.get('/analysis/:id', (req, res) => {
        res.render('analysis');
});


//logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});


module.exports = router;