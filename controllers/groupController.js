const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')


const Group = require('../models/groupModel')
const User = require('../models/userModel')

// @desc    Get groups
// @route   GET /api/groups
const getGroups = asyncHandler(async (req, res) => {
    const groupsFromGrp = await Group.find({user: req.userData._id})
    const newGroups = [];
    for(let grpId in req.userData.groups){
        const grp = await Group.findById(req.userData.groups[grpId]);
        newGroups.push(grp);
    }
    console.log("from user: "+newGroups);
    console.log("from grp: "+groupsFromGrp);
    //remove duplicates
    const groups = [...new Set([...newGroups, ...groupsFromGrp])];
    console.log("groups: "+groups);
    res.status(200).json(groups);
})

const getGroupbyid = asyncHandler(async (req, res) => {
    const groups = await Group.findById({user: req.user.id})
    //findbyid
    res.status(200).json(groups)
})


const updateEmail = async (req, res) => {
    const {groupId,emailToEdit, newEmail} = req.body;
    const grp = await Group.findById(groupId);
    const emails = grp.emails;
    const newemails = [];
    //if found, remove old email and add new email
    emails.forEach(email => {
        if (email === emailToEdit) {
            email = newEmail;
        }
        newemails.push(email);
    });
    try {
        const newGrp = await Group.findOneAndUpdate(
            {_id: req.params.id},
            {
                emails: newemails
            },
            {new: true}
        );
        await newGrp.save();
        res.status(200).json(newGrp);
    } catch (err) {
        res.status(400).json({"message": err.message});
    }
}


//Update Name Group
/*
const updateNameGroup = async (req, res) => {
  const { nameToEdit,newName } = req.body;
  const grp = await Group.findById(req.params.id);
  const name = grp.name;
  const newN="";
  //if found, remove old email and add new email
  
    if (name === nameToEdit ) {
      name=newName;
    }
    
  newN.push(name)
  try {
      const newGrp = await Group.findOneAndUpdate(
          {_id: req.params.id},
          {
              name: newN
          },
          {new: true}
      );
      await newGrp.save();
      res.status(200).json(newGrp);
  }catch (err) {
      res.status(400).json({"message": err.message});
  }
}
*/


// @desc    create group
// @route   POST /api/groups
const creategroup = asyncHandler(async (req, res) => {
    // console.log("***********" + req.userData);
    //console.log("+++++++++++++++++" + req.userData._id);


    /* if (!req.body.name) {
       res.status(400)
       throw new Error('Please add a name for your group project')
     }*/


    const group = await Group.create({
        name: req.body.name,
        year: req.body.year,
        classroom: req.body.classroom,
        emails: req.body.emails,
        user: req.userData._id,

    })

    const customGroup = {
        "name": group.user.name,
        "emails": group.user.emails,
        //"userid":group.userData._id,
        "groupName": group.name,
        "Year": group.year,
        "Calssrom": group.Calssrom,
        'groupId': group._id,
        grpToken: generateToken(group._id),
        userToken: req.headers['jwt']
    }


    const emails = req.body.emails;
    for (const email of emails) {
        const user
            = await
            User.findOneAndUpdate(
                {
                    email: email
                },
                {
                    $push: {
                        groups: group._id
                    }
                },
                {new: true}
            );
        if (!user) {
            console.log("not found")
        } else {
            user.save();
        }
    }

    res.status(200).json(customGroup)
    //res.status(200).json(group);
})


// Generate JWT
const generateToken = (id) => {
    return jwt.sign({id}, 'arGTRFD125L', {
        expiresIn: '30d',
    })
}
// @desc    Update group
// @route   PUT /api/groups/:id
/*const updateGroup = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id)

  if (!group) {
    res.status(400)
    throw new Error('Group not found')
  }*/
/*
  // Check for user
  if (req.userData=== undefined) {
    res.status(401)
    throw new Error('User not found')
  }*/

// Make sure the logged in user matches the group user
/*if (group.user.toString() !== req.user.id) {
  res.status(401)
  throw new Error('User not authorized')
}

const updatedGroup = await Group.findByIdAndUpdate(req.params.id, req.body, {
  new: true,
})

res.status(200).json(updatedGroup)
})
*/


// @desc    Delete group
// @route   DELETE /api/groups/:id
const deleteGroup = asyncHandler(async (req, res) => {
    const group = await Group.findById(req.params.id)

    if (!group) {
        res.status(400)
        throw new Error('Group not found')
    }

    // Check for user
    /* if (req.userData=== undefined) {
       res.status(401)
       throw new Error('Group not found')
     }*/

    // Make sure the logged in user matches the group user
    /* if (group.user.toString() !== req.user.id) {
       res.status(401)
       throw new Error('User not authorized')
     }*/

    await group.remove()

    res.status(200).json({id: req.params.id})
})

module.exports = {
    getGroups,
    creategroup,

    deleteGroup,
    updateEmail,
}
