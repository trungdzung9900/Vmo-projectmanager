const {LoginValidation,RegisterValidation} = require ('../validation/adminValidation');
const  Admin  = require ('../model/admin');
const jwt = require ( 'jsonwebtoken');
const bcrypt = require ('bcryptjs');
const registerUsr = async(req,res)=>{
    //Validation
    const { error } = RegisterValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    //Check if email already on the database
    const userExit = await Admin.findOne({userName:req.body.userName})
    if (userExit) return res.status(400).send('User is already exist') 

    //Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password,salt);
    //create new admin
    const Admin = new Admin({
        userName : req.body.userName,
        password: hashPassword,
    });
    try{
    const savedAdmin = await Admin.save();
    res.send(savedAdmin);
    }catch(err){
        res.status(400).send(err);
    }
   }
const loginUsr = async(req,res)=>{
    //Validation
    try{
    const { error } = LoginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
     //Check if email already on the database
        const userExist = await Admin.findOne({userName:req.body.userName})
        if (!userExist) return res.status(400).send('User is not already exist') 
        //Password is correct or not
        const validPassword = await bcrypt.compare(req.body.password , userExist.password)
        if(!validPassword) return res.status(400).send("Wrong Password")
    
    // Create and assign a token
    const token = jwt.sign({_id:emailExist._id},process.env.TOKEN_SECRET);
    res.header('auth-token',token).send(token)
}catch(err){
    res.status(400).send(err);
}
}
module.exports.loginUsr = loginUsr
module.exports.registerUsr = registerUsr 