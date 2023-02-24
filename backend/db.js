const { MongoClient, ObjectId } = require('mongodb')
require('dotenv').config();
const moment = require('moment')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const auth = require('./jwt')
const connectionUrl = "mongodb+srv://db-testing:AiVfNLrbImo9hGRa@testingdb-insynctive.8wsmm93.mongodb.net"
const dbName = 'production'

let db

const init = () =>
  MongoClient.connect(connectionUrl).then((client) => {
    db = client.db(dbName)

  })

async function listDatabases() {
  const dbos = await db.db().admin().listDatabases();

  dbos.databases.forEach(dbv => {
  });
}

const insertItem = (item) => {
  const collection = db.collection('items')
  return collection.insertOne(item)
}

const getItems = async () => {
  const collection = db.collection('personal')
  const rez = await collection.find({}).map(el => {
    el._id = el._id.toString()
    return el
  })

  return rez
}

const getFullName = async () => {
  const collection = db.collection('personal')
  const rez = await collection.find({}, { projection: { firstName: 1, lastName: 1 } }).toArray()
  return rez
}

const getItemsAgeByName = async (firstName) => {
  const collection = db.collection('personal')
  const rez = await collection.find({ firstName: firstName },
    { projection: { birthDate: 1, fullName: 1 } }).toArray()

  let users = rez.map(person => {
    let years = moment().diff(person.birthDate, 'years', false);
    let nameWithYears = `${person.fullName}: ${years.toString()}`
    return nameWithYears
  })

  return users
}
const getItemsByName = async (firstName) => {
  const collection = db.collection('personal')
  const rez = await collection.find({ firstName: firstName }).toArray()
  return rez
}

const getItemsByGender = async () => {
  const collection = db.collection('personal')
  const rez = await collection.find({}, { projection: { gender: 1, } }).toArray()
  return rez
}

const getUsersByRole = async () => {
  const collection = db.collection('personal')
  const users = await collection.find({}).toArray()

  let roles = []

  users.map(res => {
    res.roles.map(rez => {
      roles.push(rez.type)
    })
  })
  roles = [...new Set(roles)]
  return roles
}

const getJobStatus = async () => {
  const collection = db.collection('personal')
  const users = await collection.find({}).toArray()

  let jobStats = []

  users.map(user => {
    user.jobs.map(job => {
      job.periods.map(period => {
        if (period.status == "Active") {
          jobStats.push(period.jobType)
        }

      })
    })
  })
  return jobStats

}


const getPersonsWithoutEmail = async () => {
  const collection = db.collection('personal')
  const users = await collection.find({}).toArray()
  let inactiveEmail = []

  users.map(user => {
    if (user.emails.lenght == 0) {
      inactiveEmail.push(user.fullName)
    }

  })

  return inactiveEmail
}


const getActiveItems = async () => {

  const collection = db.collection('personal')
  const people = await collection.find({}).toArray();
  const currDate = moment().format();
  let activePersons = []

  people.map(person => {
    const filteredPerson = {
      name: person.fullName,
      hasActive: false
    }
    person.productsElection.map(election => {

      election.coveredCategories.map(categorie => {

        let isAfter = moment(categorie.endDate.toString()).isAfter(currDate);

        if (isAfter) {
          filteredPerson.hasActive = isAfter

          activePersons.push(filteredPerson);
        }
      })
    })

  })

  return activePersons
}

const updateQuantity = (id, quantity) => {
  const collection = db.collection('items')
  return collection.updateOne({ _id: ObjectId(id) }, { $inc: { quantity } })
}
const updateActive = (name) => {
  const collection = db.collection('personal')
  collection.updateOne({ firstName: name }, { $set: { isActive: false } }, (error, result) => {

    return result

  });
  return null

}

const getPersonAndEmail = async () => {
  const collection = db.collection('personal')
  const user = await collection.find({}, { projection: { firstName: 1, lastName: 1 } }).toArray()

  let persons = []

  user.map(person => {
    const newPerson = {
      firstName: person.firstName,
      lastName: person.lastName,
      email: person.emails.map(e => {
        e.email
      })
    }
    persons.push(newPerson)
  })

  return persons
}


const getFirstAndLastName = async (user) => {
  db.collection('personal').insertOne(user, (err, result) => {
    if (err) return console.error(err);
  });
}

const deleteById = async (id) => {

  try {

    const entry = await db.collection('personal').deleteOne({ "_id": ObjectId(id) }).then(res => {
    });

  } catch (e) {

  }
}

const updatePerson = (id, name, surname) => {
  const collection = db.collection('personal')
  collection.updateOne({ "_id": ObjectId(id) }, { $set: { firstName: name, lastName: surname } }, (error, result) => {

    return result

  });
  return null

}

const signUp = async (email, password) => {
  const salt = await bcrypt.genSalt();
  const user = { email, password: bcrypt.hashSync(password, salt) };
  const collection = db.collection('personal')
  return collection.insertOne(user, (err) => {
    if (err) return { message: 'Email already in use.' };
    else {
      return "Sucessfuly created!"
    }
  });

}

const login = async (email, password) => {
  const collection = db.collection('personal');
  try {
    let result = await collection.findOne({ email })
    const isPasswordValid = bcrypt.compareSync(password, result.password);
    if (!isPasswordValid) return { message: 'Wrong password.' };

    const secretKey = process.env.JWT_SECRET
    const token = jwt.sign({ id: result._id }, secretKey, { expiresIn: 86400 });

    return { message: 'Login successful.', token }
  } catch (error) {
    return { message: 'error' }
  }
};

const checkEmail = async (email) => {
  const collection = db.collection('personal');
  try {
    let existingUser = await collection.findOne({ email });
    if (existingUser) {
      return true;
    }
    else {
      return false;
    }
  } catch (error) {
    return false;
  }
};


module.exports = {
  init,
  insertItem,
  getItems,
  getFullName,
  updateQuantity,
  listDatabases,
  getItemsAgeByName,
  getItemsByName,
  getItemsByGender,
  getActiveItems,
  getPersonsWithoutEmail,
  getUsersByRole,
  getJobStatus,
  updateActive,
  getPersonAndEmail,
  getFirstAndLastName,
  deleteById,
  updatePerson,
  signUp,
  login,
  checkEmail
}
