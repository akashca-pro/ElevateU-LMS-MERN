import User from '../../model/user.js'

// View Profile

export const loadProfile = async (req,res) => {
    
    try {
        const user_ID = req.params.id 
        const userData = await User.findById(user_ID,'email firstName lastName profileImage bio socialLinks phone enrolledCourses')

        if(!userData)return res.status(404).json({message : 'user not found'})

        return res.status(200).json(userData)

    } catch (error) {
        console.log('Error loading user profile');
        return res.status(500).json({ message: 'Error loading user profile', error: error.message });
    }

}

// Update profile

export const updateProfile = async (req,res) => {
    
    try {
        const user_ID = req.params.id;
        const user = await User.findById(user_ID)
        if(!user) return res.status(404).json({message : 'user not found'});

        const {firstName, lastName, profileImage, phone, bio, socialLinks } = req.body;

        const updatedData = await User.findByIdAndUpdate(user_ID , {
            firstName,
            lastName,
            profileImage,
            phone,
            bio,
            socialLinks
        } , {new : true })
        .select('firstName lastName profileImage phone bio socialLinks')

        return res.status(200).json(updatedData)

    } catch (error) {
        console.log('Error updating user profile');
        return res.status(500).json({ message: 'Error updating user profile', error: error.message });
    }

}

// delete account

export const deleteAccount = async (req,res) =>{

    try {
        const user_ID = req.params.id
        const user = await User.findById(user_ID)
        if(!user) return res.status(404).json({message : 'user not found'})

        await User.findByIdAndDelete(user_ID)

        return res.status(200).json({message : 'user deleted successfully'})

    } catch (error) {
        console.log('Error deleting user profile');
        return res.status(500).json({ message: 'Error deleting user profile', error: error.message });
    }

}