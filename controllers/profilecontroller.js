const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')
const nodemailer = require('nodemailer')


const JWT_SECRET='some super secret...';

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	  user: 'espritpi2223@gmail.com',
	  pass: 'tqsixkvtcxwquztx'
	}
  });


//generate a random code with 8 numbers (works)
function generateCode() 
{
	var length = 8,
		charset = "0123456789",
		retVal = "";
	for (var i = 0, n = charset.length; i < length; ++i) {
		retVal += charset.charAt(Math.floor(Math.random() * n));
	}
	return retVal;
}

// reset password 
 async function resetPassword (req, res) {
	const { email, password,} = req.body;
	const user = await User.findOne({ email });
	if (!user) {
		res.status(400).json({ error: "User don't exists" });
	} else {
		const token = generateCode();
		process.env.code=token;
		user.token = token;
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);
		await user.save();
		res.status(200).json({ message: "password changed" })
			};
			};

function forgot_password(req,res,next){
  
  User.findOne({ "email": req.body.email }).then(user=>{
    if(!user) {
      console.log('No account with that email address exists.')
    }else{
      const secret = JWT_SECRET + user.password;
      const payload = {username: user.username,email:user.email};
      const token = jwt.sign(payload,secret,{expiresIn: '5m'});
      console.log('req.headers.host'+ 'verification lien de host ');
      const link = `https://${req.headers.host}/api/userp/reset_password/${user.email}/${token}`
      console.log(link);
      res.status(200).json({msg:`password send to your email Mr./Mrs ${user.username}`});

      var mailOptions = {
        from: 'espritpi2223@gmail.com',
        to: req.body.email,
        subject: 'Password Reset Email ' ,
        text: `click the link to reset password ${link}`  ,
      }
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
        });
      

    }
  });
}
///reset_password_get/:email/:token
function reset_password_get(req,res,next){
  User.findOne({ "email": req.params.email }).then(user=>{
    if(!user) {
      res.send('No account with that email address exists.')
    }else {
      const secret = JWT_SECRET + user.password;
      try{
        const payload = jwt.verify(req.params.token, secret)
        res.render('reset-password',{email: user.email})
      } catch(error){
        console.log(error.message)
        res.send(error.message)
      }
    }
  });
}
async function reset_password_post(req,res){
  const {password,password2} = req.body
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt)
  User.findOne({ "email": req.params.email }).then(user=>{
    if(!user) {
      res.send('No account with that email address exists.')
    }else {
      const secret = JWT_SECRET + user.password;
      if(password === password2){
      try{

        const payload = jwt.verify(req.params.token, secret);
        user.password = hashedPassword;
        user.save();
        res.send("password reset successfully")
        
      } catch(error){
        console.log(error.message)
        res.send(error.message)
      }
    }else{res.send("password mismatch")}
    }
  });
}



//MODIFY PROFILE

async function editUser  (req, res) {
	const {email, name,} = req.body;
	const user = await User.findOne({ email });

       if (name === ''){ 
        res.json("username is empty")
        return "user is empty"
    }

    if ( name!= ''){ 
		if(user.email == email){
			user.name = name; 
			user.save();
		}
		else {
			res.json("email don't match")
		}
       
    }
    console.log("profile updated")
    return res.json({user})
};

module.exports = {

  editUser,resetPassword,forgot_password,reset_password_get,reset_password_post

}
