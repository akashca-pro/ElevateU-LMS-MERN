import User from '../../model/user.js'

// create user

export const addUser = async (req,res) => {
    
    try {
        const {email, password , firstName, lastName, phone, profileImage, enrolledCourses,
             bio, socialLinks, isVerified, isActive, isBlocked} = req.body;

        const emailExist = await User.findOne({email})
        if(emailExist) return res.status(409).json({message : 'user already exist'})    

        const user = new User({
            email, password , firstName, lastName, phone, profileImage, enrolledCourses,
             bio, socialLinks,
             isVerified : isVerified === 'true',
             isActive : isActive === 'true' ,
             isBlocked : isBlocked === 'true'
        })

        await user.save()

        return res.status(200).json({message : 'user added successfully'})

    } catch (error) {
        console.log('Error adding user profile',error);
        res.status(500).json({ message: 'Error adding user profile', error: error.message });
    }

}

// view users details

export const loadUsers = async (req,res) => {
    
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5
        const skip = (page-1) * limit
        const search = req.query.search

        const searchQuery = {
            $or : [
                {firstName : {$regex : search, $options : 'i'} },
                {lastName : {$regex : search, $options : 'i'} },
                {email : {$regex : search, $options : 'i'} }
            ]
        }

        const userData = await User.find(search ? searchQuery : {})
        .select('email firstName lastName profileImage isVerified isActive isBlocked enrolledCourses')
        .skip(skip)
        .limit(limit)

        if(!userData || userData.length === 0) return res.status(404).json({message : 'user not found'})

        return res.status(200).json(userData) 
        
    } catch (error) {
        console.log('Error viewing users profiles',error);
        res.status(500).json({ message: 'Error viewing users profiles', error: error.message });
    }

}

// view specific user details

export const loadUserDetails = async (req,res) => {
    
    try {
        const user_ID = req.params.id
        const user = await User.findById(user_ID)
        .select('email firstName lastName profileImage isVerified isActive isBlocked enrolledCourses')

        if(!user) return res.status(404).json({message : 'user not found'})
            
        return res.status(200).json(user)

    } catch (error) {
        console.log('Error viewing user profile',error);
        res.status(500).json({ message: 'Error viewing user profile', error: error.message });
    }

} 

// update user details

export const updateUserDetails = async (req,res) => {
    
    try {
        
        const user_ID = req.params.id;
        const userData = await User.findById(user_ID);
        if(!userData) return res.status(404).json({message : 'user not found'});

        const {firstName, lastName, profileImage, enrolledCourses,
             isVerified, isActive, isBlocked } = req.body

        const updatedFields = {
            firstName , lastName , profileImage , enrolledCourses
        }

        if(isVerified !== undefined) updatedFields.isVerified = isVerified === 'true'

        if(isActive !== undefined) updatedFields.isActive = isActive === 'true'

        if(isBlocked !== undefined) updatedFields.isBlocked = isBlocked === 'true' 

        const updatedData = await User.findByIdAndUpdate(
            user_ID, 
            updatedFields ,
            {new : true})
            .select(['firstName', 'lastName', 'profileImage', 'enrolledCourses', 'isVerified',
             'isActive', 'isBlocked','bio', 'socialLinks'])
             
        return res.status(200).json(updatedData)

    } catch (error) {
        console.log('Error updating user profile',error);
        res.status(500).json({ message: 'Error updating user profile', error: error.message });
    }

}

// delete user

export const deleteUser = async (req,res) => {
    
    try {
        
        const user_ID = req.params.id

        const user = await User.findById(user_ID)
        if(!user) return res.status(404).json({message : 'user not found'})
        
        await User.findByIdAndDelete(user_ID)

        return res.status(200).json({message : 'user deleted successfully'})

    } catch (error) {
        console.log('Error deleting user profile',error);
        res.status(500).json({ message: 'Error deleting user profile', error: error.message });
    }

}