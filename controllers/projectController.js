const asyncHandler = require('express-async-handler')

const Project = require('../models/projectModel')
const Group = require('../models/groupModel')

// @desc    Get projects
// @route   GET /api/project
const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ group: req.body.groupId })
  console.log("groupdId"+req.body.groupId)
//findbyid
  res.status(200).json(projects)
})

// @desc    create project
// @route   POST /api/project
const createproject = asyncHandler(async (req, res) => {
  if (!req.body.gitlink) {
    res.status(400)
    throw new Error('Please add a gitlink for your  project')
  }
 
  const project = await Project.create({
    name:req.body.name,
    gitlink: req.body.gitlink,
    text:req.body.text,
    group: req.body.groupId,
    deadline: req.body.deadline
  })
  
  const customProject = {
    //"name":project.group.name,
    //"year":project.group.year,
    "Groupid":project.group,
    "nameproject":project.name,
    "gitlink":project.gitlink,
    "text":project.text,
    
}
  res.status(200).json(customProject)
 // res.status(200).json(project)
})

// @desc    Update project
// @route   PUT /api/project/:id
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)

  if (!project) {
    res.status(400)
    throw new Error('Project not found')
  }

  // Check for user
  if (!req.group) {
    res.status(401)
    throw new Error('Group not found')
  }

  // Make sure the logged in user matches the group user
  if (project.group.toString() !== req.group.id) {
    res.status(401)
    throw new Error('Group not authorized')
  }

  const updatedGroup = await Group.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  res.status(200).json(updatedGroup)
})

// @desc    Delete project
// @route   DELETE /api/groups/:id
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Group.findById(req.params.id)

  if (!project) {
    res.status(400)
    throw new Error('Group not found')
  }

  // Check for group
  if (!req.group) {
    res.status(401)
    throw new Error('Group not found')
  }

  // Make sure the logged in group matches the  project group
  if (project.group.toString() !== req.group.id) {
    res.status(401)
    throw new Error('group not authorized')
  }

  await project.remove()

  res.status(200).json({ id: req.params.id })
})

module.exports = {
  getProjects,
    createproject,
    updateProject,
  deleteProject,
  
}
