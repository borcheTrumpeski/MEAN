const express = require('express')
const authMiddleware = require('./jwt')
const { insertItem,
  getItems,
  updateQuantity,
  getFullName,
  getItemsAgeByName,
  getItemsByName,
  getItemsByGender,
  getActiveItems,
  getPersonsWithoutEmail,
  getUsersByRole,
  updateActive,
  getJobStatus,
  getPersonAndEmail,
  getFirstAndLastName,
  deleteById,
  updatePerson,
  login,
  checkEmail,
  signUp } = require('./db')

const router = express.Router()

router.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST,PUT, DELETE, OPTIONS"
  );
  next();
});


router.delete('/api/deletebyid/:id', async (req, res) => {
  const id = req.params.id;
  const del = await deleteById(id)

  res.status(200).json(del);
})


router.put("/api/updateperson/:id", async (req, res, next) => {
  const id = req.params.id;

  const name = req.body.firstName
  const lastname = req.body.lastName


  const resssss = await updatePerson(id, name, lastname)
  res.status(200).json("taman e");

});


router.get("/api/pesonas", async (req, res, next) => {

  const resssss = await getItems()
  res.status(200).json({
    message: "Posts fetched successfully!",
    personas: resssss
  });
});

router.post("/api/firstandlastname", authMiddleware, async (req, res, next) => {
  let user = req.body
  const resssss = await getFirstAndLastName(user)
  res.status(200).json(
    resssss
  );
});

router.get("/api/jobstatus", async (req, res, next) => {

  const resssss = await getJobStatus()
  res.status(200).json({
    personas: resssss
  });
});



router.get("/api/role", async (req, res, next) => {

  const resssss = await getUsersByRole()
  res.status(200).json({
    roles: resssss
  });
});


router.get("/api/email", async (req, res, next) => {

  const result = await getPersonsWithoutEmail()
  res.status(200).json({
    email: result
  });
});


router.get("/api/gender", async (req, res, next) => {

  const resssss = await getItemsByGender()
  res.status(200).json({
    message: "Posts fetched successfully!",
    gender: resssss
  });
});

router.get("/api/fullname", async (req, res, next) => {

  const rez = await getFullName()

  res.status(200).json(
    rez
  );
});


router.get("/api/active", async (req, res, next) => {
  const resssss = await getActiveItems()

  res.status(200).json({
    endDate: resssss
  });
});



router.get("/api/getage", async (req, res, next) => {
  const resssss = await getItemsAgeByName("Mexico")
  res.status(200).json(resssss);
});
router.get("/api/byName", async (req, res, next) => {
  const resssss = await getItemsByName("Mexico")
  res.status(200).json(resssss);
});



let todos = [

];
router.post("/api/todos", (req, res, next) => {
  const todo = req.body;
  todos.push(todo);
  res.status(201).json({
    message: 'Post added successfully'
  });
});

router.get("/api/todos", (req, res, next) => {
  res.status(200).json({
    message: "Posts fetched successfully!",
    todos: todos
  });
});
router.delete("/api/todos/:id", (req, res, next) => {
  const id = req.params.id;
  todos = todos.filter(post => post.id !== id);
  res.status(200).json({
    message: "Posts fetched successfully!",
    todos: todos
  });
});
router.put("/api/todos/:id", (req, res, next) => {

  const todo = req.body
  let index = todos.findIndex(x => x.id = todo.id)

  todos[index] = todo
  res.status(200).json({
    message: "Posts edited successfully!",
    todos: todos
  });
});

router.get("/api/updactive:name", async (req, res, next) => {
  const name = req.params.name
  const rez = await updateActive(name)


  res.status(200).json(rez);
});



router.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    let exist = await checkEmail(email)
    if (exist) {
      res.status(400).json("exists");
    }
    else {
      const rez = signUp(email, password)
      res.status(200).json(rez);
    }

  } catch (error) {
    res.status(400).json(error)
  }

});

router.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const rez = await login(email, password)
  if (rez.message === 'Login successful.') { return res.status(200).json({ token: rez.token }); }
  return res.status(500).json({ message: "server error" })
});


module.exports = router
